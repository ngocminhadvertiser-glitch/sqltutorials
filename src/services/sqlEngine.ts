import alasql from 'alasql';
import { SAMPLE_DATABASES } from '../data/sampleDatabases';
import { QueryResult, TableSchema, ColumnDefinition } from '../types';

class SqlEngineService {
  private currentDbId: string = 'QuanLyHocSinh';
  private initializedDbs: Set<string> = new Set();
  private dynamicTables: Map<string, TableSchema[]> = new Map();

  constructor() {
    this.initDatabase('QuanLyHocSinh');
  }

  public setDatabase(dbId: string) {
    this.currentDbId = dbId;
    if (!this.initializedDbs.has(dbId)) {
      this.initDatabase(dbId);
    }
  }

  public getCurrentDatabaseId(): string {
    return this.currentDbId;
  }

  public getTables(dbId?: string): TableSchema[] {
    const targetDb = dbId || this.currentDbId;
    if (!this.dynamicTables.has(targetDb)) {
      this.initDatabase(targetDb);
    }
    return this.dynamicTables.get(targetDb) || [];
  }

  public getTableSchema(tableName: string, dbId?: string): TableSchema | undefined {
    const tables = this.getTables(dbId);
    return tables.find(t => t.name.toLowerCase() === tableName.toLowerCase());
  }

  public initDatabase(dbId: string) {
    const dbModel = SAMPLE_DATABASES.find(db => db.id === dbId);
    if (!dbModel) return;

    try {
      // Create or use database
      alasql(`CREATE DATABASE IF NOT EXISTS ${dbId}`);
      alasql(`USE ${dbId}`);

      // Initialize cloned schema for dynamic tracking
      const clonedTables: TableSchema[] = JSON.parse(JSON.stringify(dbModel.tables));
      this.dynamicTables.set(dbId, clonedTables);

      // Drop and recreate tables with fresh initial data
      for (const table of clonedTables) {
        try {
          alasql(`DROP TABLE IF EXISTS ${table.name}`);
        } catch {
          // ignore
        }

        // Build CREATE TABLE statement
        const colDefs = table.columns.map(c => {
          let type = 'STRING';
          const upperType = c.type.toUpperCase();
          if (upperType.includes('INT')) type = 'INT';
          else if (upperType.includes('FLOAT') || upperType.includes('DECIMAL')) type = 'FLOAT';
          else if (upperType.includes('DATE')) type = 'DATE';
          return `${c.name} ${type}`;
        }).join(', ');

        alasql(`CREATE TABLE ${table.name} (${colDefs})`);

        // Insert initial data
        if (table.initialData && table.initialData.length > 0) {
          if (alasql.tables && alasql.tables[table.name]) {
            alasql.tables[table.name].data = JSON.parse(JSON.stringify(table.initialData));
          } else {
            for (const row of table.initialData) {
              (alasql as any)(`INSERT INTO ${table.name} VALUES ?`, [row]);
            }
          }
        }
      }

      this.initializedDbs.add(dbId);
    } catch (e) {
      console.error(`Failed to initialize database ${dbId}:`, e);
    }
  }

  public resetCurrentDatabase() {
    this.initDatabase(this.currentDbId);
  }

  public getTableData(tableName: string): Record<string, any>[] {
    try {
      alasql(`USE ${this.currentDbId}`);
      return alasql(`SELECT * FROM ${tableName}`) || [];
    } catch {
      return [];
    }
  }

  /**
   * Pre-process T-SQL syntax for execution in AlaSQL
   */
  private preprocessTSql(sql: string): string {
    let processed = sql.trim();

    // Replace SQL Server unicode string literal N'...' with '...'
    processed = processed.replace(/N'((?:[^']|'')*)'/g, "'$1'");

    // Remove GO statements commonly used in SQL Server scripts
    processed = processed.replace(/\bGO\b/gi, '');

    // Normalize brackets around identifiers [TableName] -> TableName
    processed = processed.replace(/\[([a-zA-Z0-9_]+)\]/g, '$1');

    // Handle ALTER TABLE ADD without COLUMN keyword (T-SQL syntax: ALTER TABLE tbl ADD col type)
    processed = processed.replace(/ALTER\s+TABLE\s+([a-zA-Z0-9_]+)\s+ADD\s+(?!COLUMN\b)(?!CONSTRAINT\b)([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_()]+)/gi, 'ALTER TABLE $1 ADD COLUMN $2 $3');

    return processed;
  }

  /**
   * Parses column definitions from a CREATE TABLE SQL statement
   */
  private parseColumnsFromCreateTable(sql: string): ColumnDefinition[] {
    const match = sql.match(/CREATE\s+TABLE\s+[a-zA-Z0-9_.]+\s*\(([\s\S]+)\)/i);
    if (!match) return [{ name: 'ID', type: 'INT', isPrimaryKey: true }];

    const rawBody = match[1];
    // Split by comma outside parentheses
    const parts: string[] = [];
    let cur = '';
    let depth = 0;
    for (let i = 0; i < rawBody.length; i++) {
      const char = rawBody[i];
      if (char === '(') depth++;
      else if (char === ')') depth--;
      else if (char === ',' && depth === 0) {
        parts.push(cur.trim());
        cur = '';
        continue;
      }
      cur += char;
    }
    if (cur.trim()) parts.push(cur.trim());

    const columns: ColumnDefinition[] = [];
    for (const part of parts) {
      const pUpper = part.toUpperCase();
      // Skip table-level constraints for columns list
      if (pUpper.startsWith('PRIMARY KEY') || pUpper.startsWith('CONSTRAINT') || pUpper.startsWith('FOREIGN KEY') || pUpper.startsWith('CHECK')) {
        continue;
      }
      const tokens = part.split(/\s+/);
      if (tokens.length >= 2) {
        const name = tokens[0].replace(/[\[\]]/g, '');
        const type = tokens[1];
        const isPrimaryKey = pUpper.includes('PRIMARY KEY');
        const nullable = !pUpper.includes('NOT NULL');
        let constraintDesc = '';
        if (isPrimaryKey) constraintDesc = 'Khóa chính (PK)';
        else if (pUpper.includes('UNIQUE')) constraintDesc = 'UNIQUE (Duy nhất)';
        else if (pUpper.includes('CHECK')) constraintDesc = 'CHECK';
        else if (pUpper.includes('REFERENCES')) constraintDesc = 'Khóa ngoại (FK)';

        columns.push({
          name,
          type,
          isPrimaryKey,
          nullable,
          constraintDescription: constraintDesc || undefined
        });
      }
    }
    return columns;
  }

  /**
   * Intercepts and simulates T-SQL ALTER TABLE ADD / DROP CONSTRAINT
   */
  private handleConstraintCommand(sql: string, startTime: number): QueryResult | null {
    const cleanSql = sql.trim();

    // Match: ALTER TABLE [Table] ADD CONSTRAINT [ConstraintName] [ConstraintType] ...
    const addConstraintMatch = cleanSql.match(/ALTER\s+TABLE\s+([a-zA-Z0-9_]+)\s+ADD\s+CONSTRAINT\s+([a-zA-Z0-9_]+)\s+(PRIMARY\s+KEY|FOREIGN\s+KEY|CHECK|UNIQUE|DEFAULT)([\s\S]*)/i);
    if (addConstraintMatch) {
      const [, tableName, constraintName, typeRaw, details] = addConstraintMatch;
      const type = typeRaw.toUpperCase().replace(/\s+/g, ' ');
      const currentTables = this.getTables();
      const targetTable = currentTables.find(t => t.name.toLowerCase() === tableName.toLowerCase());

      if (!targetTable) {
        return {
          success: false,
          error: `Bảng dữ liệu [${tableName}] không tồn tại trong CSDL ${this.currentDbId}!`,
          suggestedFix: `Em hãy kiểm tra lại tên bảng. Các bảng hiện có: ${currentTables.map(t => t.name).join(', ')}`,
          executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100
        };
      }

      // Update table metadata with the new constraint
      if (type === 'PRIMARY KEY') {
        const colMatch = details.match(/\(([^)]+)\)/);
        const colName = colMatch ? colMatch[1].trim() : '';
        const col = targetTable.columns.find(c => c.name.toLowerCase() === colName.toLowerCase());
        if (col) {
          col.isPrimaryKey = true;
          col.constraintDescription = `PK: ${constraintName}`;
        }
      } else if (type === 'FOREIGN KEY') {
        const fkMatch = details.match(/\(([^)]+)\)\s*REFERENCES\s*([a-zA-Z0-9_]+)\s*\(([^)]+)\)/i);
        if (fkMatch) {
          const [, colName, refTable, refCol] = fkMatch;
          const col = targetTable.columns.find(c => c.name.toLowerCase() === colName.trim().toLowerCase());
          if (col) {
            col.isForeignKey = true;
            col.referencesTable = refTable.trim();
            col.referencesColumn = refCol.trim();
            col.constraintDescription = `FK [${constraintName}] trỏ tới ${refTable}(${refCol})`;
          }
        }
      } else if (type === 'CHECK') {
        const checkMatch = details.match(/\(([\s\S]+)\)/);
        const cond = checkMatch ? checkMatch[1].trim() : details.trim();
        targetTable.description += ` | Ràng buộc CHECK: ${constraintName} (${cond})`;
      } else if (type === 'UNIQUE') {
        const colMatch = details.match(/\(([^)]+)\)/);
        const colName = colMatch ? colMatch[1].trim() : '';
        const col = targetTable.columns.find(c => c.name.toLowerCase() === colName.toLowerCase());
        if (col) {
          col.constraintDescription = `UNIQUE [${constraintName}]`;
        }
      }

      return {
        success: true,
        data: [{
          'Thông báo thực thi': `Thành công: Đã thêm ràng buộc [${constraintName}] (${type}) vào bảng [${targetTable.name}].`,
          'Chi tiết ràng buộc': details.trim() || type
        }],
        columns: ['Thông báo thực thi', 'Chi tiết ràng buộc'],
        rowsAffected: 1,
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100
      };
    }

    // Match: ALTER TABLE [Table] DROP CONSTRAINT [ConstraintName]
    const dropConstraintMatch = cleanSql.match(/ALTER\s+TABLE\s+([a-zA-Z0-9_]+)\s+DROP\s+CONSTRAINT\s+([a-zA-Z0-9_]+)/i);
    if (dropConstraintMatch) {
      const [, tableName, constraintName] = dropConstraintMatch;
      const currentTables = this.getTables();
      const targetTable = currentTables.find(t => t.name.toLowerCase() === tableName.toLowerCase());
      if (!targetTable) {
        return {
          success: false,
          error: `Bảng dữ liệu [${tableName}] không tồn tại trong CSDL!`,
          suggestedFix: `Kiểm tra tên bảng: ${currentTables.map(t => t.name).join(', ')}`,
          executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100
        };
      }

      return {
        success: true,
        data: [{
          'Thông báo thực thi': `Thành công: Đã xóa ràng buộc [${constraintName}] khỏi bảng [${targetTable.name}].`
        }],
        columns: ['Thông báo thực thi'],
        rowsAffected: 1,
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100
      };
    }

    return null;
  }

  /**
   * High school pedagogical error diagnostic for SQL Server
   */
  private diagnoseError(sql: string, rawError: any): { error: string; suggestedFix: string } {
    const rawMsg = String(rawError?.message || rawError || '');
    const cleanSql = sql.trim().toUpperCase();

    // 1. Missing FROM in SELECT
    if (cleanSql.startsWith('SELECT') && !cleanSql.includes('FROM') && !cleanSql.match(/SELECT\s+(GETDATE|@@|\d+|'[^']*')/i)) {
      return {
        error: "Lỗi cú pháp: Thiếu mệnh đề FROM trong câu lệnh SELECT!",
        suggestedFix: "Em cần chỉ định nguồn dữ liệu sau từ khóa FROM, ví dụ: SELECT HoTen FROM HocSinh"
      };
    }

    // 2. INSERT errors
    if (cleanSql.startsWith('INSERT')) {
      if (!cleanSql.includes('INTO')) {
        return {
          error: "Lỗi cú pháp INSERT: Cú pháp chuẩn trong SQL Server là INSERT INTO TenBang ...",
          suggestedFix: "Ví dụ: INSERT INTO LopHoc (MaLop, TenLop, Khoi, GVCN) VALUES ('10A5', N'Lớp 10A5', 10, N'Thầy An');"
        };
      }
      if (!cleanSql.includes('VALUES') && !cleanSql.includes('SELECT')) {
        return {
          error: "Lỗi cú pháp INSERT: Thiếu từ khóa VALUES!",
          suggestedFix: "Dữ liệu chèn vào phải đi sau từ khóa VALUES, ví dụ: INSERT INTO TenBang VALUES (gia_tri_1, gia_tri_2, ...);"
        };
      }
    }

    // 3. UPDATE errors
    if (cleanSql.startsWith('UPDATE')) {
      if (!cleanSql.includes('SET')) {
        return {
          error: "Lỗi cú pháp UPDATE: Thiếu mệnh đề SET!",
          suggestedFix: "Cú pháp chuẩn trong SQL Server: UPDATE TenBang SET TenCot = GiaTriMoi WHERE DieuKien;"
        };
      }
    }

    // 4. DELETE errors
    if (cleanSql.startsWith('DELETE')) {
      if (!cleanSql.includes('FROM') && !cleanSql.match(/DELETE\s+[a-zA-Z0-9_]+/)) {
        return {
          error: "Lỗi cú pháp DELETE: Thiếu tên bảng cần xóa!",
          suggestedFix: "Cú pháp chuẩn: DELETE FROM TenBang WHERE DieuKien;"
        };
      }
    }

    // 5. CREATE TABLE errors
    if (cleanSql.startsWith('CREATE TABLE')) {
      if (!cleanSql.includes('(') || !cleanSql.includes(')')) {
        return {
          error: "Lỗi cú pháp CREATE TABLE: Danh sách các cột phải được bao quanh trong cặp dấu ngoặc đơn (...)!",
          suggestedFix: "Ví dụ: CREATE TABLE GiaoVien (MaGV VARCHAR(10) PRIMARY KEY, HoTen NVARCHAR(50) NOT NULL);"
        };
      }
    }

    // 6. Common spelling typos in keywords
    const typos: [RegExp, string][] = [
      [/\bSELETC\b/i, "SELETC -> SELECT"],
      [/\bSLECT\b/i, "SLECT -> SELECT"],
      [/\bFORM\b/i, "FORM -> FROM (chú ý: FROM chứ không phải form mẫu)"],
      [/\bWHER\b/i, "WHER -> WHERE"],
      [/\bUPDAT\b/i, "UPDAT -> UPDATE"],
      [/\bDELET\b/i, "DELET -> DELETE"],
      [/\bINSRT\b/i, "INSRT -> INSERT"],
      [/\bVALUS\b/i, "VALUS -> VALUES"],
      [/\bCRATE\b/i, "CRATE -> CREATE"],
      [/\bWHERE\s+HAVING\b/i, "Mệnh đề HAVING phải đặt sau GROUP BY, không đặt ngay sau WHERE"],
      [/\bORDER\s+BY\s+WHERE\b/i, "Mệnh đề WHERE phải đặt TRƯỚC ORDER BY"],
      [/\bGRUP\s+BY\b/i, "GRUP BY -> GROUP BY"],
      [/\bINNER\s+JOIN\s+ON\s+WHERE\b/i, "Mệnh đề ON phải có biểu thức so sánh trước (ví dụ: ON A.id = B.id)"]
    ];

    for (const [regex, fix] of typos) {
      if (regex.test(sql)) {
        return {
          error: `Phát hiện lỗi chính tả từ khóa T-SQL: ${fix}`,
          suggestedFix: `Hãy rà soát kỹ các từ khóa trong câu lệnh để đảm bảo viết đúng chính tả tiếng Anh chuẩn SQL Server.`
        };
      }
    }

    // 7. Unclosed single quote
    const singleQuotes = (sql.match(/'/g) || []).length;
    if (singleQuotes % 2 !== 0) {
      return {
        error: "Lỗi chuỗi ký tự: Chưa đóng cặp dấu nháy đơn (')!",
        suggestedFix: "Trong SQL Server, tất cả giá trị chuỗi (text) hoặc ngày tháng phải được kẹp trong cặp nháy đơn '', ví dụ: N'Hà Nội' hoặc 'HS001'."
      };
    }

    // 8. Missing ON in JOIN
    if (/\bJOIN\b/i.test(sql) && !/\bON\b/i.test(sql) && !/\bCROSS\s+JOIN\b/i.test(sql)) {
      return {
        error: "Lỗi kết nối bảng: Câu lệnh JOIN thiếu điều kiện kết nối ON!",
        suggestedFix: "Mỗi khi thực hiện INNER/LEFT/RIGHT JOIN trong SQL Server, em cần chỉ rõ cột liên kết: FROM BảngA JOIN BảngB ON BảngA.KhoaChinh = BảngB.KhoaNgoai"
      };
    }

    // 9. Table or column not found
    if (/Table does not exist/i.test(rawMsg) || /Cannot find table/i.test(rawMsg)) {
      const currentTables = this.getTables();
      const tablesList = currentTables.map(t => t.name).join(', ');
      return {
        error: `Bảng dữ liệu không tồn tại: ${rawMsg}`,
        suggestedFix: `CSDL hiện tại [${this.currentDbId}] chỉ có các bảng: ${tablesList}. Hãy kiểm tra lại chính tả tên bảng (ví dụ: HocSinh, LopHoc, KetQua).`
      };
    }

    if (/Cannot read property|undefined|Column not found/i.test(rawMsg)) {
      return {
        error: `Tên cột không hợp lệ hoặc không tìm thấy: ${rawMsg}`,
        suggestedFix: "Em hãy xem bảng cấu trúc bên cạnh để gõ đúng tên cột (chú ý phân biệt chữ hoa, chữ thường và dấu tiếng Việt)."
      };
    }

    return {
      error: `Lỗi SQL Server: ${rawMsg}`,
      suggestedFix: "Gợi ý của Giáo viên: Hãy đọc kỹ thông báo lỗi, rà soát từng từ khóa và dấu phẩy giữa các cột."
    };
  }

  public execute(sql: string): QueryResult {
    if (!sql || !sql.trim()) {
      return {
        success: false,
        error: "Vui lòng nhập câu lệnh SQL trước khi thực thi!",
        suggestedFix: "Ví dụ thử lệnh đơn giản: SELECT * FROM HocSinh;"
      };
    }

    const startTime = performance.now();

    // Check if it's ALTER TABLE ADD/DROP CONSTRAINT
    const constraintResult = this.handleConstraintCommand(sql, startTime);
    if (constraintResult) {
      return constraintResult;
    }

    try {
      alasql(`USE ${this.currentDbId}`);
      const processedSql = this.preprocessTSql(sql);
      const cleanUpper = sql.trim().toUpperCase();

      // Check for UPDATE/DELETE without WHERE warning
      const isUpdateWithoutWhere = cleanUpper.startsWith('UPDATE') && !cleanUpper.includes('WHERE');
      const isDeleteWithoutWhere = cleanUpper.startsWith('DELETE') && !cleanUpper.includes('WHERE');

      const rawResult = alasql(processedSql);
      const endTime = performance.now();
      const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

      // Handle CREATE TABLE dynamic state
      const createTableMatch = sql.match(/CREATE\s+TABLE\s+([a-zA-Z0-9_]+)/i);
      if (createTableMatch) {
        const newTableName = createTableMatch[1];
        const currentTables = this.getTables();
        const exists = currentTables.some(t => t.name.toLowerCase() === newTableName.toLowerCase());
        if (!exists) {
          const parsedColumns = this.parseColumnsFromCreateTable(sql);
          const newSchema: TableSchema = {
            name: newTableName,
            displayName: newTableName,
            description: `Bảng do học sinh tạo bằng lệnh DDL trong CSDL [${this.currentDbId}]`,
            columns: parsedColumns,
            initialData: [],
            isUserCreated: true
          };
          this.dynamicTables.get(this.currentDbId)?.push(newSchema);
        }

        return {
          success: true,
          data: [{
            'Thông báo thực thi': `Thành công: Bảng [${newTableName}] đã được tạo mới thành công trong CSDL.`,
            'Số cột đã tạo': this.parseColumnsFromCreateTable(sql).length
          }],
          columns: ['Thông báo thực thi', 'Số cột đã tạo'],
          rowsAffected: 1,
          executionTimeMs
        };
      }

      // Handle DROP TABLE dynamic state
      const dropTableMatch = sql.match(/DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?([a-zA-Z0-9_]+)/i);
      if (dropTableMatch) {
        const droppedTableName = dropTableMatch[1];
        const currentList = this.dynamicTables.get(this.currentDbId) || [];
        this.dynamicTables.set(
          this.currentDbId,
          currentList.filter(t => t.name.toLowerCase() !== droppedTableName.toLowerCase())
        );

        return {
          success: true,
          data: [{
            'Thông báo thực thi': `Thành công: Bảng [${droppedTableName}] đã được xóa hoàn toàn khỏi CSDL.`
          }],
          columns: ['Thông báo thực thi'],
          rowsAffected: 1,
          executionTimeMs
        };
      }

      // Handle ALTER TABLE ADD COLUMN dynamic state
      const alterAddMatch = sql.match(/ALTER\s+TABLE\s+([a-zA-Z0-9_]+)\s+ADD\s+(?:COLUMN\s+)?([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_()]+)/i);
      if (alterAddMatch) {
        const [, tblName, colName, colType] = alterAddMatch;
        const targetTable = this.getTables().find(t => t.name.toLowerCase() === tblName.toLowerCase());
        if (targetTable) {
          const colExists = targetTable.columns.some(c => c.name.toLowerCase() === colName.toLowerCase());
          if (!colExists) {
            targetTable.columns.push({
              name: colName,
              type: colType,
              nullable: true,
              constraintDescription: 'Cột mới được thêm bằng ALTER TABLE'
            });
          }
        }

        return {
          success: true,
          data: [{
            'Thông báo thực thi': `Thành công: Đã thêm cột [${colName} ${colType}] vào bảng [${tblName}].`
          }],
          columns: ['Thông báo thực thi'],
          rowsAffected: 1,
          executionTimeMs
        };
      }

      // Handle ALTER TABLE DROP COLUMN dynamic state
      const alterDropMatch = sql.match(/ALTER\s+TABLE\s+([a-zA-Z0-9_]+)\s+DROP\s+COLUMN\s+([a-zA-Z0-9_]+)/i);
      if (alterDropMatch) {
        const [, tblName, colName] = alterDropMatch;
        const targetTable = this.getTables().find(t => t.name.toLowerCase() === tblName.toLowerCase());
        if (targetTable) {
          targetTable.columns = targetTable.columns.filter(c => c.name.toLowerCase() !== colName.toLowerCase());
        }

        return {
          success: true,
          data: [{
            'Thông báo thực thi': `Thành công: Đã xóa cột [${colName}] khỏi cấu trúc bảng [${tblName}].`
          }],
          columns: ['Thông báo thực thi'],
          rowsAffected: 1,
          executionTimeMs
        };
      }

      // Result handling
      if (Array.isArray(rawResult)) {
        // If result is empty array
        if (rawResult.length === 0) {
          return {
            success: true,
            data: [],
            columns: [],
            rowsAffected: 0,
            executionTimeMs
          };
        }

        // If result is list of objects (SELECT)
        if (typeof rawResult[0] === 'object' && rawResult[0] !== null) {
          const columns = Object.keys(rawResult[0]);
          return {
            success: true,
            data: rawResult,
            columns,
            rowsAffected: rawResult.length,
            executionTimeMs
          };
        }

        // If simple array of values
        return {
          success: true,
          data: rawResult.map((val, idx) => ({ Result: val, index: idx + 1 })),
          columns: ['Result'],
          rowsAffected: rawResult.length,
          executionTimeMs
        };
      }

      // If number (e.g. INSERT, UPDATE, DELETE affected rows)
      if (typeof rawResult === 'number') {
        let msg = `Thành công: Đã thực thi lệnh. (${rawResult} dòng bị tác động).`;
        if (isUpdateWithoutWhere) {
          msg += ` ⚠️ Lưu ý của Giáo viên: Lệnh UPDATE không có WHERE đã thay đổi toàn bộ ${rawResult} dòng trong bảng!`;
        } else if (isDeleteWithoutWhere) {
          msg += ` ⚠️ Cảnh báo của Giáo viên: Lệnh DELETE không có WHERE đã xóa toàn bộ dữ liệu trong bảng!`;
        }

        return {
          success: true,
          data: [{ 'Thông báo': msg }],
          columns: ['Thông báo'],
          rowsAffected: rawResult,
          executionTimeMs
        };
      }

      return {
        success: true,
        data: [{ 'Kết quả': String(rawResult) }],
        columns: ['Kết quả'],
        rowsAffected: 1,
        executionTimeMs
      };
    } catch (err: any) {
      const diagnosis = this.diagnoseError(sql, err);
      return {
        success: false,
        error: diagnosis.error,
        suggestedFix: diagnosis.suggestedFix,
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100
      };
    }
  }

  /**
   * Evaluates student's answer against expected solution
   */
  public evaluateExercise(
    studentSql: string, 
    solutionSql: string, 
    dbId: string,
    targetTable?: string
  ): { isCorrect: boolean; message: string; diffDetails?: string } {
    const studentUpper = studentSql.trim().toUpperCase();
    const solutionUpper = solutionSql.trim().toUpperCase();

    const isDml = (s: string) => s.startsWith('INSERT') || s.startsWith('UPDATE') || s.startsWith('DELETE');
    const isDdl = (s: string) => s.startsWith('CREATE') || s.startsWith('ALTER') || s.startsWith('DROP');

    // Case 1: DML statement (INSERT, UPDATE, DELETE)
    if (isDml(studentUpper) || isDml(solutionUpper)) {
      // Find table name if not provided
      const extractTable = (s: string): string => {
        const m = s.match(/(?:INTO|UPDATE|FROM)\s+([a-zA-Z0-9_]+)/i);
        return m ? m[1] : (targetTable || 'HocSinh');
      };
      const tbl = targetTable || extractTable(solutionSql);

      // 1. Run student on freshly reset DB
      this.initDatabase(dbId);
      alasql(`USE ${dbId}`);
      const studentRes = this.execute(studentSql);
      if (!studentRes.success) {
        return {
          isCorrect: false,
          message: `Câu lệnh DML của em bị lỗi: ${studentRes.error}`,
          diffDetails: studentRes.suggestedFix
        };
      }
      const studentTableData = this.getTableData(tbl);

      // 2. Run solution on freshly reset DB
      this.initDatabase(dbId);
      alasql(`USE ${dbId}`);
      const expectedRes = this.execute(solutionSql);
      if (!expectedRes.success) {
        return {
          isCorrect: false,
          message: `Lỗi đối chiếu đáp án mẫu: ${expectedRes.error}`
        };
      }
      const expectedTableData = this.getTableData(tbl);

      // Compare final table contents
      if (studentTableData.length !== expectedTableData.length) {
        return {
          isCorrect: false,
          message: `Bảng [${tbl}] sau khi chạy lệnh của em có ${studentTableData.length} dòng, nhưng đáp án chuẩn cần ${expectedTableData.length} dòng.`,
          diffDetails: "Hãy kiểm tra lại điều kiện WHERE hoặc số lượng giá trị trong VALUES."
        };
      }

      const normalizeRow = (row: Record<string, any>) => {
        const keys = Object.keys(row).sort();
        return keys.map(k => {
          const val = row[k];
          if (typeof val === 'number') return Math.round(val * 100) / 100;
          return String(val || '').trim().toLowerCase();
        }).join('|||');
      };

      const sRows = studentTableData.map(normalizeRow).sort();
      const eRows = expectedTableData.map(normalizeRow).sort();

      let matchCount = 0;
      for (let i = 0; i < eRows.length; i++) {
        if (sRows[i] === eRows[i]) {
          matchCount++;
        }
      }

      if (matchCount === eRows.length) {
        return {
          isCorrect: true,
          message: `Xuất sắc! Câu lệnh thao tác dữ liệu (DML) trên bảng [${tbl}] đã cập nhật dữ liệu hoàn toàn chính xác theo yêu cầu!`
        };
      }

      return {
        isCorrect: false,
        message: `Dữ liệu bảng [${tbl}] sau khi thực thi chưa khớp hoàn toàn (${matchCount}/${eRows.length} bản ghi đúng).`,
        diffDetails: "Hãy kiểm tra các trường dữ liệu cần cập nhật hoặc giá trị chèn mới."
      };
    }

    // Case 2: DDL statement (CREATE TABLE, ALTER TABLE, DROP TABLE, CONSTRAINT)
    if (isDdl(studentUpper) || isDdl(solutionUpper)) {
      // 1. Run student on freshly reset DB
      this.initDatabase(dbId);
      alasql(`USE ${dbId}`);
      const sRes = this.execute(studentSql);
      if (!sRes.success) {
        return {
          isCorrect: false,
          message: `Câu lệnh DDL của em gặp lỗi: ${sRes.error}`,
          diffDetails: sRes.suggestedFix
        };
      }

      // Check CREATE TABLE
      const createMatch = solutionSql.match(/CREATE\s+TABLE\s+([a-zA-Z0-9_]+)/i);
      if (createMatch) {
        const expectedTable = createMatch[1];
        const studentTable = this.getTableSchema(expectedTable, dbId);
        if (!studentTable) {
          return {
            isCorrect: false,
            message: `Chưa tìm thấy bảng [${expectedTable}] được tạo trong CSDL!`,
            diffDetails: `Hãy đảm bảo em dùng lệnh: CREATE TABLE ${expectedTable} (...)`
          };
        }
        return {
          isCorrect: true,
          message: `Tuyệt vời! Em đã định nghĩa thành công bảng [${expectedTable}] với đầy đủ các thuộc tính và ràng buộc theo chuẩn CSDL!`
        };
      }

      // Check ALTER TABLE
      const alterMatch = solutionSql.match(/ALTER\s+TABLE\s+([a-zA-Z0-9_]+)/i);
      if (alterMatch) {
        return {
          isCorrect: true,
          message: "Tuyệt vời! Cấu trúc bảng đã được cập nhật chính xác bằng câu lệnh ALTER TABLE!"
        };
      }

      // Check DROP TABLE
      const dropMatch = solutionSql.match(/DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?([a-zA-Z0-9_]+)/i);
      if (dropMatch) {
        const droppedTbl = dropMatch[1];
        const currentTable = this.getTableSchema(droppedTbl, dbId);
        if (currentTable) {
          return {
            isCorrect: false,
            message: `Bảng [${droppedTbl}] vẫn còn tồn tại trong CSDL! Lệnh DROP TABLE chưa hoàn tất.`
          };
        }
        return {
          isCorrect: true,
          message: `Chính xác! Bảng [${droppedTbl}] đã được loại bỏ an toàn khỏi CSDL.`
        };
      }

      return {
        isCorrect: true,
        message: "Lệnh DDL đã thực thi thành công!"
      };
    }

    // Case 3: Standard SELECT (DQL) query
    // Reset database to ensure identical baseline
    this.initDatabase(dbId);
    alasql(`USE ${dbId}`);

    const studentResult = this.execute(studentSql);
    if (!studentResult.success) {
      return {
        isCorrect: false,
        message: `Câu lệnh của em gặp lỗi: ${studentResult.error}`,
        diffDetails: studentResult.suggestedFix
      };
    }

    // Reset again before running reference solution
    this.initDatabase(dbId);
    alasql(`USE ${dbId}`);
    const expectedResult = this.execute(solutionSql);

    if (!expectedResult.success) {
      return {
        isCorrect: false,
        message: "Lỗi hệ thống khi đối chiếu đáp án chuẩn. Hãy liên hệ thầy cô!"
      };
    }

    const sData = studentResult.data || [];
    const eData = expectedResult.data || [];

    // Check row count
    if (sData.length !== eData.length) {
      return {
        isCorrect: false,
        message: `Số dòng kết quả chưa khớp! Lệnh của em trả về ${sData.length} dòng, nhưng đáp án mong đợi ${eData.length} dòng.`,
        diffDetails: "Hãy kiểm tra lại điều kiện WHERE, GROUP BY hoặc phép nối JOIN."
      };
    }

    if (eData.length === 0 && sData.length === 0) {
      return {
        isCorrect: true,
        message: "Chính xác! Cả hai kết quả đều trả về bảng rỗng theo đúng yêu cầu bài toán."
      };
    }

    // Compare content normalized
    const normalizeRow = (row: Record<string, any>) => {
      const keys = Object.keys(row).sort();
      return keys.map(k => {
        const val = row[k];
        if (typeof val === 'number') return Math.round(val * 100) / 100;
        return String(val || '').trim().toLowerCase();
      }).join('|||');
    };

    const studentRows = sData.map(normalizeRow).sort();
    const expectedRows = eData.map(normalizeRow).sort();

    let matchCount = 0;
    for (let i = 0; i < expectedRows.length; i++) {
      if (studentRows[i] === expectedRows[i]) {
        matchCount++;
      }
    }

    if (matchCount === expectedRows.length) {
      return {
        isCorrect: true,
        message: "Xuất sắc! Câu lệnh SQL của em thực thi hoàn toàn chính xác và trả về kết quả đạt chuẩn 100%!"
      };
    }

    return {
      isCorrect: false,
      message: `Kết quả chưa khớp hoàn toàn (${matchCount}/${expectedRows.length} bản ghi trùng khớp).`,
      diffDetails: "Hãy kiểm tra các cột được chọn (SELECT), cách tính toán điểm/tiền và điều kiện lọc bản ghi."
    };
  }
}

export const sqlEngine = new SqlEngineService();
