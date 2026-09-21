import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Copy, 
  Check, 
  Database,
  History,
  Code,
  Table as TableIcon,
  ArrowRight,
  PlusCircle,
  FileCode2,
  Wrench
} from 'lucide-react';
import { sqlEngine } from '../services/sqlEngine';
import { QueryResult } from '../types';

interface SqlPlaygroundProps {
  currentDbId: string;
  setCurrentDbId: (id: string) => void;
  initialSql?: string;
  onAskAiTutor: (sql: string, error?: string) => void;
}

export const SqlPlayground: React.FC<SqlPlaygroundProps> = ({
  currentDbId,
  setCurrentDbId,
  initialSql = 'SELECT * FROM HocSinh;',
  onAskAiTutor,
}) => {
  const [sql, setSql] = useState<string>(initialSql);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'result' | 'tables'>('result');
  const [selectedTableTab, setSelectedTableTab] = useState<string>('HocSinh');
  const [snippetCategory, setSnippetCategory] = useState<'all' | 'dml' | 'ddl' | 'dql'>('all');
  const [tablesTick, setTablesTick] = useState<number>(0);

  const availableTables = sqlEngine.getTables(currentDbId);

  useEffect(() => {
    if (initialSql) {
      setSql(initialSql);
    }
  }, [initialSql]);

  useEffect(() => {
    const tables = sqlEngine.getTables(currentDbId);
    if (tables.length > 0 && (!selectedTableTab || !tables.some(t => t.name === selectedTableTab))) {
      setSelectedTableTab(tables[0].name);
    }
  }, [currentDbId, tablesTick]);

  const handleExecute = () => {
    if (!sql.trim()) return;

    sqlEngine.setDatabase(currentDbId);
    const res = sqlEngine.execute(sql);
    setResult(res);
    setTablesTick(prev => prev + 1);

    // Save history without duplicates
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== sql);
      return [sql, ...filtered].slice(0, 10);
    });
  };

  const handleResetDb = () => {
    sqlEngine.resetCurrentDatabase();
    setTablesTick(prev => prev + 1);
    handleExecute();
  };

  const handleInsertSnippet = (snippet: string) => {
    setSql(snippet);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSql = () => {
    let formatted = sql.trim();
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 
      'ORDER BY', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
      'FULL OUTER JOIN', 'ON', 'INSERT INTO', 'VALUES', 
      'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE',
      'ALTER TABLE', 'ADD COLUMN', 'DROP COLUMN', 'ADD CONSTRAINT',
      'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'CHECK', 'UNIQUE',
      'DEFAULT', 'NOT NULL', 'IF EXISTS'
    ];
    keywords.forEach((kw) => {
      const reg = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(reg, kw);
    });
    setSql(formatted);
  };

  // Inspect affected table on 1-click
  const handleInspectTable = (tableName: string) => {
    setSelectedTableTab(tableName);
    setActiveView('tables');
  };

  // Detect mutated table from current sql
  const detectTargetTable = (): string | null => {
    const m = sql.match(/(?:INTO|UPDATE|FROM|TABLE)\s+(?:IF\s+EXISTS\s+)?([a-zA-Z0-9_]+)/i);
    return m ? m[1] : null;
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Database className="w-4 h-4 text-indigo-600" />
            <span className="text-slate-500 font-medium">CSDL:</span>
            <select
              id="playground-db-select"
              value={currentDbId}
              onChange={(e) => {
                setCurrentDbId(e.target.value);
                sqlEngine.setDatabase(e.target.value);
                setTablesTick(prev => prev + 1);
              }}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="QuanLyHocSinh">CSDL Quản lý Học sinh</option>
              <option value="QuanLyBanHang">CSDL Quản lý Bán hàng</option>
            </select>
          </div>

          <button
            id="btn-reset-db"
            onClick={handleResetDb}
            className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors flex items-center gap-1 border border-slate-200 cursor-pointer"
            title="Khôi phục dữ liệu ban đầu nếu đã lỡ INSERT/UPDATE/DELETE"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Khôi phục CSDL gốc</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-format-sql"
            onClick={formatSql}
            className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer"
            title="Chuẩn hóa từ khóa T-SQL hoa"
          >
            Định dạng
          </button>
          <button
            id="btn-copy-sql"
            onClick={handleCopySql}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer"
            title="Sao chép SQL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            id="btn-clear-sql"
            onClick={() => setSql('')}
            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 cursor-pointer"
            title="Xóa trắng khung soạn thảo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            id="btn-run-sql"
            onClick={handleExecute}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Chạy lệnh (F5)</span>
          </button>
        </div>
      </div>

      {/* Snippet Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1 text-[11px]">
          <Code className="w-3.5 h-3.5" /> Thư viện mẫu:
        </span>
        <button
          onClick={() => setSnippetCategory('all')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
            snippetCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setSnippetCategory('dml')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
            snippetCategory === 'dml' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          Thao tác DML (INSERT, UPDATE, DELETE)
        </button>
        <button
          onClick={() => setSnippetCategory('ddl')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
            snippetCategory === 'ddl' ? 'bg-amber-600 text-white' : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          Định nghĩa DDL (CREATE, ALTER, DROP, Ràng buộc)
        </button>
        <button
          onClick={() => setSnippetCategory('dql')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
            snippetCategory === 'dql' ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          Truy vấn (SELECT, JOIN)
        </button>
      </div>

      {/* SQL Snippets Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        {/* DQL Snippets */}
        {(snippetCategory === 'all' || snippetCategory === 'dql') && (
          <>
            <button
              onClick={() => handleInsertSnippet("SELECT * FROM HocSinh;")}
              className="px-2 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg shrink-0 font-mono text-[11px] cursor-pointer"
            >
              SELECT *
            </button>
            <button
              onClick={() => handleInsertSnippet("SELECT MaHS, HoTen, DiaChi FROM HocSinh WHERE GioiTinh = N'Nữ';")}
              className="px-2 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg shrink-0 font-mono text-[11px] cursor-pointer"
            >
              WHERE N'...'
            </button>
            <button
              onClick={() => handleInsertSnippet("SELECT hs.HoTen, lp.TenLop, lp.GVCN FROM HocSinh hs INNER JOIN LopHoc lp ON hs.MaLop = lp.MaLop;")}
              className="px-2 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg shrink-0 font-mono text-[11px] cursor-pointer"
            >
              INNER JOIN
            </button>
            <button
              onClick={() => handleInsertSnippet("SELECT MaLop, COUNT(*) AS SiSo FROM HocSinh GROUP BY MaLop HAVING COUNT(*) > 2;")}
              className="px-2 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg shrink-0 font-mono text-[11px] cursor-pointer"
            >
              GROUP BY ... HAVING
            </button>
          </>
        )}

        {/* DML Snippets */}
        {(snippetCategory === 'all' || snippetCategory === 'dml') && (
          <>
            <button
              onClick={() => handleInsertSnippet(`INSERT INTO HocSinh (MaHS, HoTen, GioiTinh, NgaySinh, DiaChi, MaLop)\nVALUES ('HS010', N'Nguyễn Hoàng Anh', N'Nam', '2008-05-10', N'Hà Nội', '12A1');`)}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg shrink-0 font-mono text-[11px] font-semibold cursor-pointer"
            >
              + INSERT INTO mẫu
            </button>
            <button
              onClick={() => handleInsertSnippet(`UPDATE HocSinh\nSET DiaChi = N'Đà Nẵng'\nWHERE MaHS = 'HS001';`)}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg shrink-0 font-mono text-[11px] font-semibold cursor-pointer"
            >
              ✎ UPDATE có WHERE
            </button>
            <button
              onClick={() => handleInsertSnippet(`DELETE FROM KetQua\nWHERE MaHS = 'HS007' AND MaMH = 'TIN';`)}
              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg shrink-0 font-mono text-[11px] font-semibold cursor-pointer"
            >
              ✕ DELETE có WHERE
            </button>
          </>
        )}

        {/* DDL Snippets */}
        {(snippetCategory === 'all' || snippetCategory === 'ddl') && (
          <>
            <button
              onClick={() => handleInsertSnippet(`CREATE TABLE GiaoVien (\n    MaGV VARCHAR(10) PRIMARY KEY,\n    HoTen NVARCHAR(50) NOT NULL,\n    SoDienThoai VARCHAR(15) UNIQUE,\n    Luong FLOAT CHECK (Luong >= 0)\n);`)}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg shrink-0 font-mono text-[11px] font-semibold cursor-pointer"
            >
              ⚡ CREATE TABLE (PK, CHECK)
            </button>
            <button
              onClick={() => handleInsertSnippet(`ALTER TABLE HocSinh ADD SoDienThoai VARCHAR(15);`)}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg shrink-0 font-mono text-[11px] font-semibold cursor-pointer"
            >
              ALTER ADD COLUMN
            </button>
            <button
              onClick={() => handleInsertSnippet(`ALTER TABLE HocSinh ADD CONSTRAINT CK_Diem CHECK (DiemTB >= 0 AND DiemTB <= 10);`)}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg shrink-0 font-mono text-[11px] font-semibold cursor-pointer"
            >
              ALTER ADD CONSTRAINT
            </button>
            <button
              onClick={() => handleInsertSnippet(`DROP TABLE IF EXISTS BangTam;`)}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg shrink-0 font-mono text-[11px] font-semibold cursor-pointer"
            >
              DROP TABLE
            </button>
          </>
        )}
      </div>

      {/* Editor & Work Area */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-sm">
        {/* Editor Tab Header */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
            <span className="font-mono text-slate-300 ml-2 font-semibold">T-SQL Query Editor (Transact-SQL)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="hidden sm:inline">Phím tắt:</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">F5</kbd>
            <span>hoặc</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Ctrl + Enter</kbd>
          </div>
        </div>

        {/* Textarea code editor */}
        <div className="relative">
          <textarea
            id="sql-playground-input"
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'F5' || (e.ctrlKey && e.key === 'Enter')) {
                e.preventDefault();
                handleExecute();
              }
            }}
            placeholder="-- Viết câu lệnh SQL Server (SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP) tại đây..."
            rows={7}
            className="w-full bg-slate-900 text-indigo-100 font-mono text-sm p-4 focus:outline-none resize-y selection:bg-indigo-600 selection:text-white leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Real-time Error Diagnostics Banner */}
      {result && !result.success && (
        <div
          id="sql-error-banner"
          className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-900 text-xs animate-in fade-in duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-800">
                  Phát hiện lỗi câu lệnh SQL Server
                </h4>
                <p className="mt-1 font-mono text-rose-700 bg-rose-100/70 p-2 rounded-lg border border-rose-200">
                  {result.error}
                </p>

                {result.suggestedFix && (
                  <div className="mt-2.5 bg-white/80 p-2.5 rounded-xl border border-rose-200 text-slate-700 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Gợi ý sửa lỗi của Giáo viên: </span>
                      <span>{result.suggestedFix}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => onAskAiTutor(sql, result.error)}
              className="shrink-0 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Hỏi Trợ lý AI
            </button>
          </div>
        </div>
      )}

      {/* Success Notification with 1-click inspect table */}
      {result && result.success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Câu lệnh thực thi thành công trong {result.executionTimeMs} ms. ({result.rowsAffected ?? result.data?.length ?? 0} bản ghi bị tác động)
            </span>
          </div>

          {detectTargetTable() && (
            <button
              onClick={() => handleInspectTable(detectTargetTable()!)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Xem dữ liệu bảng [{detectTargetTable()}] ngay</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Results & Live Data Viewer Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs Header */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              id="tab-view-results"
              onClick={() => setActiveView('result')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeView === 'result'
                  ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kết quả thực thi ({result?.data?.length || 0})
            </button>
            <button
              id="tab-view-tables"
              onClick={() => setActiveView('tables')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'tables'
                  ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Xem dữ liệu các Bảng ({availableTables.length})
            </button>
          </div>

          {result?.success && (
            <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {result.executionTimeMs} ms
              </span>
              <span>{result.rowsAffected ?? result.data?.length ?? 0} dòng</span>
            </div>
          )}
        </div>

        {/* Active View: Query Result */}
        {activeView === 'result' ? (
          <div className="p-4 overflow-x-auto min-h-[160px]">
            {result?.success && result.data && result.data.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 w-12 text-center text-slate-400 font-mono">#</th>
                      {result.columns?.map((col) => (
                        <th key={col} className="p-2.5 font-mono text-slate-800">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {result.data.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-indigo-50/40 transition-colors">
                        <td className="p-2.5 text-center text-slate-400 font-mono">{rIdx + 1}</td>
                        {result.columns?.map((col, cIdx) => (
                          <td key={cIdx} className="p-2.5 text-slate-800 whitespace-nowrap">
                            {row[col] === null || row[col] === undefined ? (
                              <span className="text-slate-400 italic">NULL</span>
                            ) : (
                              String(row[col])
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : result?.success ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Lệnh thực thi thành công nhưng không có dữ liệu trả về hoặc bảng rỗng.
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <Play className="w-8 h-8 text-slate-300 stroke-1" />
                <p>Nhập câu lệnh và nhấn <strong>Chạy lệnh (F5)</strong> để xem kết quả.</p>
              </div>
            )}
          </div>
        ) : (
          /* Active View: Live Database Table Viewer */
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {availableTables.map((tbl) => (
                <button
                  key={tbl.name}
                  onClick={() => setSelectedTableTab(tbl.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedTableTab === tbl.name
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>[{tbl.name}]</span>
                  {tbl.isUserCreated && (
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-sans font-bold px-1.5 py-0.2 rounded-sm">
                      DDL
                    </span>
                  )}
                </button>
              ))}
            </div>

            {selectedTableTab && (
              <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
                {(() => {
                  const data = sqlEngine.getTableData(selectedTableTab);
                  const schema = availableTables.find(t => t.name.toLowerCase() === selectedTableTab.toLowerCase());
                  if (data.length === 0) {
                    return (
                      <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                        <p className="font-semibold text-slate-600">Bảng [{selectedTableTab}] hiện đang rỗng (chưa có dòng dữ liệu nào).</p>
                        {schema && schema.columns.length > 0 && (
                          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
                            <span>Các cột đã định nghĩa:</span>
                            {schema.columns.map(c => (
                              <span key={c.name} className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {c.name} ({c.type})
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-slate-400">Em có thể dùng lệnh <code>INSERT INTO {selectedTableTab} VALUES (...)</code> để chèn dữ liệu vào bảng này!</p>
                      </div>
                    );
                  }
                  const cols = Object.keys(data[0]);
                  return (
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="p-2.5 w-10 text-center text-slate-400">#</th>
                          {cols.map((col) => (
                            <th key={col} className="p-2.5">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 text-center text-slate-400">{idx + 1}</td>
                            {cols.map((col) => (
                              <td key={col} className="p-2.5 text-slate-800">
                                {String(row[col] ?? 'NULL')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Query History Drawer / List */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
            <History className="w-4 h-4 text-indigo-600" />
            <span>Lịch sử câu lệnh vừa thực thi:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.slice(0, 4).map((hSql, idx) => (
              <button
                key={idx}
                onClick={() => setSql(hSql)}
                className="text-left font-mono text-[11px] bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg p-2 max-w-xs truncate transition-colors cursor-pointer"
                title={hSql}
              >
                {hSql}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
