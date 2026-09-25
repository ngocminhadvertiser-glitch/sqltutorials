import { Lesson } from '../types';
import { CHAPTER_5_LESSONS } from './chapter5Lessons';

export const CURRICULUM_LESSONS: Lesson[] = [
  // =========================================================================
  // CHƯƠNG 1: TỔNG QUAN VỀ CƠ SỞ DỮ LIỆU
  // =========================================================================
  {
    id: 'bai-1-tong-quan-csdl',
    chapterId: 'chuong-1',
    chapterTitle: 'Chương 1: Tổng quan về Cơ sở Dữ liệu',
    title: 'Bài 1: Khái niệm CSDL, Hệ Quản trị CSDL (DBMS) & Các Mô hình Dữ liệu',
    description: 'Nắm vững khái niệm dữ liệu, thông tin, cơ sở dữ liệu, vai trò của DBMS trong hệ thống thông tin và phân biệt CSDL quan hệ với các mô hình khác.',
    level: 'co-ban',
    competency: 'tong-quan-csdl',
    estimatedMinutes: 30,
    prerequisites: [
      'Tin học đại cương hoặc kỹ năng sử dụng máy tính căn bản',
      'Khái niệm cơ bản về lưu trữ tệp tin (File)'
    ],
    learningObjectives: [
      'Trình bày chính xác khái niệm dữ liệu (Data), thông tin (Information) và cơ sở dữ liệu (Database).',
      'Phân biệt rõ ràng giữa Cơ sở dữ liệu và Hệ quản trị cơ sở dữ liệu (DBMS).',
      'Giải thích vai trò của DBMS trong hệ thống thông tin quản lý của doanh nghiệp và trường học.',
      'Phân biệt CSDL quan hệ (RDBMS) với các mô hình khác (phân cấp, mạng, NoSQL).',
      'Nắm được tổng quan về ngôn ngữ SQL và các hệ quản trị phổ biến như SQL Server, MySQL, PostgreSQL.'
    ],
    relatedTable: 'HocSinh',
    suggestedPracticeSql: "SELECT MaHS, HoTen, GioiTinh, NgaySinh, DiaChi FROM HocSinh;",
    mermaidDiagram: `graph TD
      A[Thế giới thực: Đào tạo Cao đẳng] -->|Thu thập| B[Dữ liệu thô: 10, 'Nam', 2008-03-15]
      B -->|Xử lý & Có ngữ cảnh| C[Thông tin: Học sinh Nguyễn Quốc Anh, Điểm 10 Tin học]
      C -->|Tổ chức có cấu trúc| D[Cơ sở Dữ liệu Database]
      D <-->|Quản lý & Bảo vệ| E[Hệ Quản trị CSDL DBMS: SQL Server]
      E <-->|Giao tiếp qua SQL| F[Người dùng / Ứng dụng Quản lý Đào tạo]`,
    commonMistakes: [
      {
        mistake: 'Nhầm lẫn Cơ sở Dữ liệu (Database) là phần mềm SQL Server.',
        correction: 'CSDL là kho dữ liệu được lưu trữ. SQL Server là Hệ Quản trị CSDL (phần mềm công cụ) dùng để tạo, quản lý và bảo vệ kho dữ liệu đó.',
        why: 'Giống như nhà kho (Database) và người thủ kho thông minh (DBMS).'
      },
      {
        mistake: 'Nghĩ rằng dùng bảng tính Excel là đủ cho mọi hệ thống thông tin.',
        correction: 'Excel chỉ phù hợp cho cá nhân hoặc dữ liệu nhỏ. Với hàng nghìn sinh viên và nhiều người cùng sửa đổi, Excel dễ bị xung đột, trùng lặp và không có bảo mật phân quyền.',
        why: 'Excel thiếu cơ chế kiểm soát đồng thời (Concurrency Control) và toàn vẹn dữ liệu tự động.'
      }
    ],
    sections: [
      {
        id: 'sec-1-1',
        title: '1. Dữ liệu, Thông tin và Cơ sở Dữ liệu (Data vs. Information vs. Database)',
        content: `Trong kỷ nguyên số, dữ liệu được coi là tài sản quý giá nhất của mỗi tổ chức:
- **Dữ liệu (Data):** Là các sự kiện thô chưa qua xử lý (ví dụ: chuỗi ký tự "HS001", số 9.5, ngày "2008-03-15").
- **Thông tin (Information):** Là dữ liệu đã được gán ngữ cảnh và xử lý có ý nghĩa (ví dụ: "Học sinh Nguyễn Quốc Anh đạt điểm 9.5 môn Tin học kỳ 1").
- **Cơ sở Dữ liệu (Database - CSDL):** Là một tập hợp dữ liệu có cấu trúc, có liên quan logic với nhau, được lưu trữ an toàn trên thiết bị nhớ của máy tính nhằm phục vụ nhiều người dùng và nhiều ứng dụng đồng thời.

*Tại sao cần Cơ sở Dữ liệu thay cho lưu trữ file văn bản / bảng tính?*
1. **Tránh dư thừa dữ liệu (Data Redundancy):** Không phải gõ lại thông tin sinh viên ở mọi file điểm.
2. **Đảm bảo tính nhất quán (Consistency):** Khi học sinh đổi số điện thoại, chỉ cần cập nhật tại 1 nơi duy nhất.
3. **Bảo mật và Phân quyền (Security & Authorization):** Giảng viên chỉ được nhập điểm môn mình dạy; sinh viên chỉ được xem điểm của mình.
4. **Kiểm soát truy cập đồng thời (Concurrency Control):** Hàng nghìn người có thể đăng ký môn học cùng một giây mà không ghi đè mất dữ liệu.`,
        keyTakeaways: [
          'Dữ liệu + Ngữ cảnh = Thông tin hữu ích.',
          'CSDL giải quyết triệt để các nhược điểm: dư thừa, không nhất quán, mất an toàn của file rời rạc.'
        ],
        teacherNote: 'Thầy nhấn mạnh: Các em cần phân biệt rõ Dữ liệu thô và Thông tin. Trong bài thi tốt nghiệp hoặc phỏng vấn, câu hỏi phân biệt này rất hay xuất hiện!'
      },
      {
        id: 'sec-1-2',
        title: '2. Hệ Quản trị Cơ sở Dữ liệu (DBMS) & Vai trò trong Hệ thống Thông tin',
        content: `**Hệ Quản trị Cơ sở Dữ liệu (Database Management System - DBMS)** là phần mềm chuyên dụng cung cấp môi trường để:
1. **Định nghĩa dữ liệu (DDL):** Tạo cấu trúc bảng, kiểu dữ liệu, các ràng buộc.
2. **Thao tác dữ liệu (DML):** Thêm mới, chỉnh sửa, xóa và truy vấn dữ liệu.
3. **Bảo vệ và Quản trị:** Kiểm soát quyền truy cập, sao lưu phục hồi (Backup & Restore), quản lý giao dịch an toàn (Transaction).

*Các hệ quản trị CSDL quan hệ phổ biến hiện nay:*
- **Microsoft SQL Server:** Hệ quản trị mạnh mẽ của Microsoft, chuẩn công nghiệp cho doanh nghiệp và trường học, hỗ trợ ngôn ngữ T-SQL.
- **MySQL / MariaDB:** Hệ quản trị mã nguồn mở phổ biến nhất trên môi trường Web (PHP, Node.js).
- **PostgreSQL:** Hệ quản trị CSDL quan hệ đối tượng tiên tiến, độ tuân thủ chuẩn SQL rất cao.
- **Oracle Database:** Dành cho các hệ thống tài chính ngân hàng quy mô cực lớn.`,
        sqlExamples: [
          {
            title: 'Truy vấn thông tin cơ bản từ SQL Server',
            description: 'Dùng lệnh SELECT để xem dữ liệu học sinh/sinh viên',
            sql: "SELECT MaHS, HoTen, GioiTinh, NgaySinh, DiaChi FROM HocSinh;",
            explanation: 'DBMS nhận câu lệnh SQL, tối ưu hóa đường dẫn truy xuất (Query Optimizer) và trả về bảng kết quả mà không làm biến đổi dữ liệu lưu trữ.',
            expectedResult: 'Danh sách các dòng học sinh gồm mã, họ tên, giới tính, ngày sinh và địa chỉ.'
          }
        ],
        keyTakeaways: [
          'Người dùng không thao tác trực tiếp với file vật lý mà luôn giao tiếp thông qua DBMS.',
          'SQL là ngôn ngữ chuẩn quốc tế để giao tiếp với mọi hệ quản trị CSDL quan hệ.'
        ]
      },
      {
        id: 'sec-1-3',
        title: '3. Các Mô hình Cơ sở Dữ liệu: Từ Phân cấp, Mạng đến Quan hệ và NoSQL',
        content: `Lịch sử phát triển của công nghệ cơ sở dữ liệu đã trải qua nhiều giai đoạn:
1. **Mô hình Phân cấp (Hierarchical Model - thập niên 1960):** Dữ liệu tổ chức theo dạng cây (Tree) hình cha - con (1 Cha có nhiều Con, mỗi Con chỉ có 1 Cha). Nhược điểm: Rất khó biểu diễn quan hệ Nhiều - Nhiều.
2. **Mô hình Mạng (Network Model):** Dữ liệu tổ chức dạng đồ thị (Graph), 1 con có thể có nhiều cha. Nhược điểm: Cấu trúc con trỏ phức tạp, khó bảo trì khi CSDL phình to.
3. **Mô hình Quan hệ (Relational Model - Đề xuất bởi Edgar F. Codd, 1970):** Dữ liệu được tổ chức dưới dạng các bảng 2 chiều gồm dòng và cột. Đây là mô hình chuẩn mực thống trị toàn cầu hơn 50 năm qua nhờ tính đơn giản, toán học chặt chẽ (đại số quan hệ) và ngôn ngữ truy vấn SQL mạnh mẽ.
4. **Mô hình NoSQL (Not Only SQL - Thập niên 2000 đến nay):** Lưu trữ phi quan hệ (Document JSON như MongoDB, Key-Value như Redis, Column-family như Cassandra). Phù hợp cho dữ liệu phi cấu trúc, mạng xã hội và phân tán cực lớn.`,
        keyTakeaways: [
          'Mô hình CSDL quan hệ (RDBMS) là nền tảng cốt lõi của mọi lập trình viên và chuyên viên dữ liệu.',
          'NoSQL bổ trợ cho RDBMS ở các bài toán dữ liệu lớn và tốc độ đọc ghi phi cấu trúc.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Trình bày sự khác biệt giữa Data và Information. Kể tên 3 hệ quản trị CSDL quan hệ phổ biến.',
      level2: 'Phân tích vì sao một trường cao đẳng có 5.000 sinh viên không nên dùng sổ tay Excel để quản lý đăng ký môn học.',
      level3: 'So sánh ưu và nhược điểm giữa Mô hình CSDL Quan hệ (SQL Server) và Mô hình Lưu trữ Tài liệu NoSQL (MongoDB).'
    },
    endOfLessonReview: {
      summaryQuestion: 'Tại sao DBMS lại là thành phần trung tâm không thể thiếu trong mọi hệ thống thông tin hiện đại?',
      sqlChallenge: "SELECT MaHS, HoTen, DiaChi FROM HocSinh WHERE DiaChi = N'Hà Nội';",
      scenarioQuestion: 'Giả sử một bệnh viện quản lý bệnh án bằng các file Word lưu trên máy tính bác sĩ. Hãy chỉ ra 3 nguy cơ lớn nhất và đề xuất giải pháp.',
      teacherAnswerKey: '3 nguy cơ: (1) Mất dữ liệu khi ổ cứng hỏng do không có cơ chế backup tập trung; (2) Không thể tra cứu tiền sử bệnh nhân khi chuyển khoa; (3) Vi phạm bảo mật bí mật bệnh án. Giải pháp: Xây dựng CSDL quan hệ trên SQL Server có phân quyền bác sĩ/y tá.'
    }
  },

  // =========================================================================
  // CHƯƠNG 2: MÔ HÌNH DỮ LIỆU QUAN HỆ & KHÓA NỀN TẢNG (DÀNH CHO HỌC SINH CẤP 2)
  // =========================================================================
  {
    id: 'bai-2-mo-hinh-quan-he',
    chapterId: 'chuong-2',
    chapterTitle: 'Chương 2: Cấu trúc Bảng, Khóa Chính & Khóa Ngoại (Nền tảng THCS)',
    title: 'Bài 2.1: Cấu trúc Bảng & Khóa Chính (Primary Key) - Định danh Học sinh',
    description: 'Làm quen với cấu trúc bảng dữ liệu (Bảng, Cột, Dòng) và hiểu sâu sắc vai trò của Khóa chính (PRIMARY KEY) qua hình tượng chiếc Thẻ học sinh quen thuộc, không lý thuyết hàn lâm phức tạp.',
    level: 'co-ban',
    competency: 'csdl-quan-he',
    estimatedMinutes: 20,
    prerequisites: [
      'Bài 1: Khái niệm CSDL và vai trò của DBMS'
    ],
    learningObjectives: [
      'Hiểu cấu trúc của một bảng dữ liệu qua hình ảnh trực quan: Sổ điểm lớp học (gồm Tên bảng, Cột thông tin và Dòng dữ liệu của từng bạn).',
      'Nắm vững khái niệm Khóa chính (Primary Key - PK): "Mã định danh cá nhân" độc nhất vô nhị cho mỗi dòng trong bảng.',
      'Ghi nhớ 2 Quy tắc vàng của Khóa chính: Tuyệt đối không được trùng lặp và không bao giờ được để trống (NOT NULL).',
      'Hiểu lý do vì sao không nên dùng Họ tên hay Số điện thoại làm Khóa chính trong quản lý học sinh.',
      'Biết cách khai báo cột Khóa chính cơ bản trong lệnh SQL với từ khóa PRIMARY KEY.'
    ],
    relatedTable: 'HocSinh',
    suggestedPracticeSql: "SELECT MaHS, HoTen, GioiTinh, NgaySinh, DiaChi FROM HocSinh;",
    mermaidDiagram: `graph TD
      subgraph Bang_HocSinh [BẢNG HỌC SINH (HocSinh)]
        direction TB
        C1["⭐ Cột MaHS (KHÓA CHÍNH)"] --- D1["HS001 - Nguyễn Quốc Anh"]
        C1 --- D2["HS002 - Trần Mai Linh"]
        C1 --- D3["HS003 - Lê Hoàng Nam"]
      end
      subgraph Quy_Tac_Vang [2 Quy tắc vàng của Khóa chính]
        R1["1. DUY NHẤT (Unique): Không ai trùng mã với ai"]
        R2["2. KHÔNG ĐƯỢC RỖNG (NOT NULL): Ai cũng phải có mã"]
      end`,
    commonMistakes: [
      {
        mistake: 'Nghĩ rằng dùng Họ tên học sinh làm Khóa chính là đủ.',
        correction: 'Trong một trường học rất hay có các bạn cùng họ và tên (ví dụ: 2 bạn cùng tên "Nguyễn Văn An"). Nếu dùng họ tên làm khóa chính, máy tính sẽ chặn không cho lưu bạn thứ hai vì vi phạm tính duy nhất!',
        why: 'Khóa chính bắt buộc phải là một mã định danh riêng biệt (như Mã học sinh MaHS trên thẻ học sinh).'
      },
      {
        mistake: 'Bỏ trống ô Khóa chính khi nhập dữ liệu bạn học sinh mới.',
        correction: 'Khóa chính luôn tuân thủ quy tắc NOT NULL (không được rỗng). Bất kỳ bạn nào khi vào trường cũng phải được cấp mã số học sinh.',
        why: 'Nếu để trống, máy tính sẽ không biết bạn đó là ai để chấm điểm hoặc xếp lớp học.'
      },
      {
        mistake: 'Cố học thêm các khái niệm hàn lâm như Siêu khóa (Superkey) hay Khóa ứng viên (Candidate key).',
        correction: 'Ở cấp 2, các em chỉ cần làm chủ Khóa chính (Primary Key) và Khóa ngoại (Foreign Key). Các loại khóa lý thuyết khác không cần thiết và dễ gây quá tải.',
        why: 'Trong thực tế, chỉ cần Khóa chính và Khóa ngoại là đã xây dựng được 99% các phần mềm quản lý trường học hiện đại!'
      }
    ],
    sections: [
      {
        id: 'sec-2-1-bang-cot-dong',
        title: '1. Cấu trúc Bảng dữ liệu: Bảng, Cột và Dòng như Sổ điểm lớp',
        content: `Trong tin học, Cơ sở dữ liệu quan hệ tổ chức dữ liệu thành các **Bảng (Table)** rất giống với cuốn sổ điểm danh của thầy cô giáo:

- **Bảng (Table):** Là một tập hợp dữ liệu về một đối tượng cụ thể (ví dụ: Bảng [HocSinh], Bảng [LopHoc], Bảng [MonHoc]).
- **Cột (Column / Thuộc tính):** Đại diện cho một mục thông tin cần quản lý. Mỗi cột có tên riêng và một kiểu dữ liệu quy định:
  + Cột \`MaHS\`: Chứa chuỗi ký tự mã học sinh (như 'HS001').
  + Cột \`HoTen\`: Chứa họ và tên học sinh.
  + Cột \`NgaySinh\`: Chứa ngày tháng năm sinh.
- **Dòng (Row / Bản ghi):** Đại diện cho thông tin đầy đủ của **MỘT** đối tượng cụ thể. Ví dụ: một dòng lưu đầy đủ thông tin của bạn "Nguyễn Quốc Anh, Nam, sinh ngày 2011-03-15".
- **Ô dữ liệu (Cell):** Điểm giao nhau giữa dòng và cột, chứa một giá trị duy nhất (đơn trị).

*Ưu điểm lớn nhất:* Dữ liệu được sắp xếp ngay ngắn theo hàng theo lối, giúp máy tính có thể tìm kiếm, sắp xếp và tính điểm chỉ trong 1 phần nghìn giây!`,
        keyTakeaways: [
          'Bảng = Nhiều Cột (mục thông tin) + Nhiều Dòng (dữ liệu từng bạn học sinh).',
          'Thứ tự các dòng trong bảng không quan trọng, máy tính có thể sắp xếp lại bất cứ lúc nào.'
        ],
        teacherNote: 'Thầy lưu ý: Các em cứ hình dung Bảng dữ liệu giống hệt như một bảng Excel trong máy tính, nhưng CSDL thông minh và an toàn hơn rất nhiều!'
      },
      {
        id: 'sec-2-2-khoa-chinh',
        title: '2. Khóa chính (Primary Key - PK): Chiếc "Thẻ Học Sinh" độc nhất vô nhị',
        content: `**Tình huống thực tế:**
Trong một trường học có 1.000 học sinh, có đến 3 bạn đều tên là "Nguyễn Văn Nam". Khi thầy cô nhập điểm 10 vào máy tính, làm sao phần mềm biết điểm 10 đó là của bạn Nam lớp 8A hay bạn Nam lớp 8C?
-> **Giải pháp:** Nhà trường cấp cho mỗi bạn một **Mã học sinh (MaHS)** riêng biệt in trên Thẻ học sinh (ví dụ: HS001, HS002, HS003).

Trong CSDL, cột chứa mã định danh đó được gọi là **Khóa chính (PRIMARY KEY - viết tắt là PK)**.

**2 QUY TẮC VÀNG CỦA KHÓA CHÍNH (Học sinh cấp 2 cần ghi nhớ):**
1. **Tính Duy Nhất (Unique):** Giá trị khóa chính ở mỗi dòng không bao giờ được phép trùng nhau.
2. **Không được để trống (NOT NULL):** Bất cứ bạn học sinh nào đã được lưu vào bảng thì BẮT BUỘC phải có mã số, không được để trống ô này.

*Lưu ý sư phạm quan trọng:*
Ở bậc THCS, các em **hoàn toàn không cần học** các định nghĩa phức tạp như *Siêu khóa (Superkey)* hay *Khóa ứng viên (Candidate Key)*. Chỉ cần nắm vững Khóa chính là chiếc chìa khóa định danh duy nhất cho từng dòng dữ liệu!`,
        sqlExamples: [
          {
            title: 'Khai báo Khóa chính khi tạo Bảng Học sinh',
            description: 'Đặt cột MaHS làm Khóa chính với từ khóa PRIMARY KEY',
            sql: `CREATE TABLE HocSinh (
    MaHS VARCHAR(10) PRIMARY KEY, -- Khóa chính độc nhất
    HoTen NVARCHAR(100) NOT NULL,
    GioiTinh NVARCHAR(5),
    NgaySinh DATE
);`,
            explanation: 'Khi thêm từ khóa PRIMARY KEY vào sau cột MaHS, hệ thống SQL Server sẽ tự động bảo vệ cột này: cấm nhập trùng mã và cấm để trống!',
            expectedResult: 'Bảng HocSinh được tạo với cột MaHS là Khóa chính định danh duy nhất.'
          }
        ],
        keyTakeaways: [
          'Khóa chính (PK) là cột dùng để phân biệt duy nhất từng dòng trong bảng.',
          'Khóa chính luôn luôn DUY NHẤT và KHÔNG ĐƯỢC RỖNG (NOT NULL).'
        ]
      },
      {
        id: 'sec-2-3-vi-du-khoa-chinh',
        title: '3. Vì sao không dùng Họ Tên hay Số Điện Thoại làm Khóa chính?',
        content: `Rất nhiều bạn học sinh khi mới học CSDL thường thắc mắc: *"Tại sao không lấy luôn Tên bạn đó làm khóa chính cho dễ nhớ?"*

Hãy xem điều gì sẽ xảy ra:
1. **Họ tên rất dễ trùng nhau:** Nếu trường có 2 bạn tên "Trần Mai Linh", khi bạn thứ hai nhập học, máy tính sẽ báo lỗi: *"Violation of PRIMARY KEY"* và từ chối lưu bạn thứ hai!
2. **Họ tên và Số điện thoại có thể thay đổi:** Học sinh có thể đổi số điện thoại của bố mẹ, hoặc đổi sang số mới. Khóa chính thì nên ổn định suốt quá trình học tập.
3. **Mã số ngắn gọn, tra cứu siêu tốc:** Mã \`HS001\` ngắn hơn rất nhiều so với chuỗi \`Nguyễn Hoàng Khánh Chi\`, giúp máy tính tìm kiếm nhanh gấp hàng chục lần.

*Các ví dụ Khóa chính quen thuộc xung quanh chúng ta:*
- Mã học sinh (\`MaHS\`) trên thẻ học sinh.
- Số Căn cước công dân (\`CCCD\`) của công dân.
- Mã số sách (\`MaSach\`) dán mã vạch ở thư viện trường.
- Biển số xe máy, xe ô tô trên đường.`,
        keyTakeaways: [
          'Khóa chính tốt nhất là một mã định danh ngắn gọn, không trùng lặp và không thay đổi theo thời gian.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Hãy nhìn vào Thẻ học sinh của em. Mục thông tin nào trên thẻ có tính chất độc nhất vô nhị để làm Khóa chính?',
      level2: 'Giải thích vì sao trong phần mềm quản lý thư viện của trường, cô thủ thư không dùng "Tên cuốn sách" làm khóa chính mà lại dán mã vạch riêng lên từng cuốn.',
      level3: 'Hãy viết câu lệnh SQL SELECT để xem toàn bộ danh sách học sinh và chỉ ra cột nào đóng vai trò Khóa chính trong bảng HocSinh.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Khóa chính (PRIMARY KEY) là gì và nêu 2 quy tắc vàng bắt buộc của Khóa chính?',
      sqlChallenge: "SELECT MaHS, HoTen, GioiTinh FROM HocSinh WHERE GioiTinh = N'Nữ';",
      scenarioQuestion: 'Bạn An và bạn Bình cùng sinh ngày 20/11/2011 và cùng tên là Lê Quốc Bảo. Nhờ có thành phần nào trong bảng dữ liệu mà thầy cô không bao giờ bị ghi nhầm điểm thi giữa 2 bạn?',
      teacherAnswerKey: 'Nhờ có Khóa chính (cột MaHS). Dù 2 bạn trùng cả họ tên lẫn ngày sinh, mỗi bạn vẫn có một MaHS độc nhất (ví dụ HS001 và HS002) giúp phân biệt chính xác 100%!'
    }
  },

  {
    id: 'bai-2-2-khoa-ngoai-lien-ket-bang',
    chapterId: 'chuong-2',
    chapterTitle: 'Chương 2: Cấu trúc Bảng, Khóa Chính & Khóa Ngoại (Nền tảng THCS)',
    title: 'Bài 2.2: Khóa Ngoại (Foreign Key) & Mối Liên Kết Giữa Các Bảng',
    description: 'Tìm hiểu Khóa ngoại (FOREIGN KEY) - "sợi dây kết nối" thần kỳ giữa các bảng dữ liệu, mối quan hệ 1-N (1 lớp có nhiều học sinh), giúp ngăn chặn lỗi nhập lớp học không tồn tại.',
    level: 'co-ban',
    competency: 'csdl-quan-he',
    estimatedMinutes: 20,
    prerequisites: [
      'Bài 2.1: Cấu trúc Bảng & Khóa Chính (Primary Key) - Định danh Học sinh'
    ],
    learningObjectives: [
      'Hiểu vì sao nhà trường cần chia thành nhiều bảng (Bảng Lớp học riêng, Bảng Học sinh riêng) thay vì dồn tất cả vào một bảng khổng lồ.',
      'Nắm vững khái niệm Khóa ngoại (Foreign Key - FK): Cột đóng vai trò tham chiếu đến Khóa chính của bảng khác để tạo mối liên kết.',
      'Hiểu cơ chế bảo vệ của Khóa ngoại: Chặn ngay hành vi xếp học sinh vào một lớp học chưa từng tồn tại trong trường.',
      'Nhận biết mối quan hệ Một - Nhiều (1-N) gần gũi: 1 Lớp học có Nhiều học sinh; mỗi học sinh chỉ thuộc về 1 Lớp học.',
      'Biết cách khai báo Khóa ngoại trong SQL và thử nghiệm ghép 2 bảng đơn giản bằng từ khóa JOIN.'
    ],
    relatedTable: 'LopHoc',
    suggestedPracticeSql: "SELECT HocSinh.MaHS, HocSinh.HoTen, LopHoc.TenLop, LopHoc.GVCN FROM HocSinh INNER JOIN LopHoc ON HocSinh.MaLop = LopHoc.MaLop;",
    mermaidDiagram: `graph LR
      subgraph Bang_Cha [BẢNG LỚP HỌC (LopHoc - Bảng Cha)]
        PK["⭐ MaLop: '8A' (Khóa chính)"]
        TenLop["TenLop: 'Lớp 8A'"]
      end

      subgraph Bang_Con [BẢNG HỌC SINH (HocSinh - Bảng Con)]
        HS1["HS001 - An <br/>🔗 MaLop: '8A' (Khóa ngoại)"]
        HS2["HS002 - Bình <br/>🔗 MaLop: '8A' (Khóa ngoại)"]
      end

      PK -.->|"Tham chiếu / Kết nối"| HS1
      PK -.->|"1 Lớp có nhiều Học sinh (1-N)"| HS2`,
    commonMistakes: [
      {
        mistake: 'Gộp chung toàn bộ thông tin Tên lớp, Phòng học, Tên GVCN vào từng dòng của Bảng Học sinh.',
        correction: 'Nếu làm vậy, thông tin lớp 8A sẽ phải gõ lặp lại 40 lần cho 40 bạn học sinh. Khi đổi giáo viên chủ nhiệm, ta phải đi sửa cả 40 dòng! Bằng cách tách riêng bảng LopHoc và dùng Khóa ngoại liên kết, ta chỉ cần sửa đúng 1 dòng duy nhất trong bảng LopHoc.',
        why: 'Khóa ngoại giúp dữ liệu gọn gàng, không bị dư thừa và cập nhật cực kỳ nhanh chóng.'
      },
      {
        mistake: 'Nhập một Mã lớp không có thật trong trường vào thông tin của học sinh.',
        correction: 'Nếu trường chỉ có các lớp 8A, 8B, 8C, bạn nhập lớp 8Z thì hệ thống sẽ báo lỗi vi phạm Khóa ngoại (The INSERT statement conflicted with the FOREIGN KEY constraint) và từ chối lưu.',
        why: 'Khóa ngoại đảm bảo tính toàn vẹn tham chiếu: học sinh chỉ có thể thuộc về một lớp học đang thực sự tồn tại.'
      }
    ],
    sections: [
      {
        id: 'sec-2-2-1-tai-sao-can-nhieu-bang',
        title: '1. Tại sao cần nhiều Bảng và cần "Chiếc cầu nối"?',
        content: `Hãy tưởng tượng nếu nhà trường lưu toàn bộ dữ liệu vào **MỘT BẢNG DUY NHẤT**:
| MaHS | HoTen | MaLop | TenLop | PhongHoc | GVCN | MonHoc | DiemThi |
|---|---|---|---|---|---|---|---|
| HS001 | Nguyễn Quốc Anh | 8A | Lớp 8A | P.201 | Cô Mai | Tin học | 9.5 |
| HS002 | Trần Mai Linh | 8A | Lớp 8A | P.201 | Cô Mai | Tin học | 9.0 |

**Hậu quả tai hại:**
- Tên lớp "Lớp 8A", phòng "P.201", giáo viên "Cô Mai" bị gõ lặp đi lặp lại hàng trăm lần.
- Rất dễ gõ sai chính tả (bạn thì gõ "Lớp 8A", bạn thì gõ "lop 8a").
- Khi cô Mai chuyển công tác, người quản trị phải tìm và sửa hàng trăm dòng!

**Giải pháp thông minh của Cơ sở Dữ liệu Quan hệ:**
Chia làm 2 bảng chuyên biệt:
1. **Bảng [LopHoc] (Bảng Cha):** Chỉ lưu danh sách các lớp. Mỗi lớp lưu đúng 1 dòng duy nhất (\`MaLop\`, \`TenLop\`, \`GVCN\`).
2. **Bảng [HocSinh] (Bảng Con):** Mỗi bạn học sinh chỉ cần ghi ngắn gọn mã lớp của mình (\`MaLop = '8A'\`).`,
        keyTakeaways: [
          'Tách bảng giúp tránh dư thừa dữ liệu và tránh sai sót khi cập nhật thông tin.',
          'Khóa ngoại đóng vai trò chiếc cầu nối giữa 2 bảng.'
        ]
      },
      {
        id: 'sec-2-2-2-khoa-ngoai-la-gi',
        title: '2. Khóa ngoại (Foreign Key - FK) là gì?',
        content: `**Khóa ngoại (FOREIGN KEY - viết tắt là FK)** là một cột trong bảng này dùng để tham chiếu (trỏ) sang cột **Khóa chính** của một bảng khác.

- **Bảng Cha (Parent Table):** Bảng chứa Khóa chính được tham chiếu đến (ví dụ: Bảng \`LopHoc\` với khóa chính \`MaLop\`).
- **Bảng Con (Child Table):** Bảng chứa Khóa ngoại tham chiếu sang bảng cha (ví dụ: Bảng \`HocSinh\` với cột khóa ngoại \`MaLop\`).

**Ý nghĩa bảo vệ kỳ diệu của Khóa ngoại:**
Nếu một bạn học sinh mới chuyển đến và nhân viên vô tình gõ mã lớp là \`8Z\` (trong khi trường chỉ có lớp 8A, 8B, 8C), hệ thống SQL sẽ ngay lập tức "tu còi" chặn lại:
> *"Lỗi: Không tìm thấy lớp học 8Z trong bảng LopHoc!"*

Nhờ có Khóa ngoại, không bao giờ xảy ra trường hợp một bạn học sinh bị xếp vào một lớp học "ma" không có thật!`,
        sqlExamples: [
          {
            title: 'Khai báo Khóa ngoại liên kết giữa Bảng Học sinh và Lớp học',
            description: 'Tạo bảng HocSinh có cột MaLop tham chiếu đến bảng LopHoc',
            sql: `CREATE TABLE HocSinh (
    MaHS VARCHAR(10) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    MaLop VARCHAR(10),
    CONSTRAINT FK_HocSinh_LopHoc FOREIGN KEY (MaLop) REFERENCES LopHoc(MaLop)
);`,
            explanation: 'Dòng lệnh CONSTRAINT FK_HocSinh_LopHoc FOREIGN KEY (MaLop) REFERENCES LopHoc(MaLop) tạo sợi dây liên kết an toàn giữa 2 bảng.',
            expectedResult: 'Bảng HocSinh được liên kết chặt chẽ với bảng LopHoc.'
          }
        ],
        keyTakeaways: [
          'Khóa ngoại là cột trong bảng con trỏ sang Khóa chính của bảng cha.',
          'Khóa ngoại ngăn chặn nhập dữ liệu rác hoặc dữ liệu không tồn tại.'
        ]
      },
      {
        id: 'sec-2-2-3-moi-quan-he-1-n',
        title: '3. Mối quan hệ Một - Nhiều (1-N) và Ghép Bảng đơn giản',
        content: `Mối quan hệ phổ biến nhất giữa các bảng trong trường học là **Quan hệ Một - Nhiều (1-N)**:
- **1 Lớp học** có thể chứa **Nhiều học sinh** (Ví dụ: Lớp 8A có 40 bạn).
- Nhưng **mỗi học sinh** chỉ thuộc về **1 Lớp học** duy nhất tại một thời điểm.

**Làm sao để xem danh sách học sinh kèm tên lớp?**
Nhờ có Khóa ngoại, chúng ta dùng từ khóa \`JOIN\` trong SQL để ghép 2 bảng lại với nhau:

\`\`\`sql
SELECT HocSinh.MaHS, HocSinh.HoTen, LopHoc.TenLop, LopHoc.GVCN
FROM HocSinh
JOIN LopHoc ON HocSinh.MaLop = LopHoc.MaLop;
\`\`\`

Kết quả trả về sẽ hiển thị đầy đủ tên học sinh, cùng với tên lớp và tên giáo viên chủ nhiệm tương ứng!`,
        keyTakeaways: [
          'Quan hệ 1-N là mối quan hệ phổ biến nhất trong CSDL (1 Lớp có nhiều Học sinh).',
          'Từ khóa JOIN kết hợp với Khóa ngoại giúp ghép thông tin từ nhiều bảng thành một bảng kết quả dễ đọc.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Trong mô hình quản lý trường học gồm Bảng LopHoc và Bảng HocSinh, bảng nào là Bảng Cha, bảng nào là Bảng Con?',
      level2: 'Điều gì sẽ xảy ra nếu nhà trường xóa đi Lớp 8B trong khi vẫn còn 35 bạn học sinh đang thuộc lớp 8B?',
      level3: 'Hãy thực thi câu lệnh SQL ghép bảng (JOIN) giữa HocSinh và LopHoc để xem danh sách các bạn học sinh lớp 8A.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Khóa ngoại (FOREIGN KEY) là gì và mang lại lợi ích gì cho việc quản lý dữ liệu?',
      sqlChallenge: "SELECT HocSinh.MaHS, HocSinh.HoTen, LopHoc.TenLop, LopHoc.GVCN FROM HocSinh INNER JOIN LopHoc ON HocSinh.MaLop = LopHoc.MaLop WHERE LopHoc.TenLop = N'Lớp 8A';",
      scenarioQuestion: 'Nếu thầy giám thị cố tình xóa lớp học 8A khỏi bảng LopHoc trong khi vẫn còn học sinh đang học, hệ quản trị CSDL sẽ làm gì?',
      teacherAnswerKey: 'Hệ quản trị CSDL sẽ chặn ngay hành động xóa và báo lỗi vi phạm Khóa ngoại (Foreign Key constraint), để bảo vệ các bạn học sinh không bị rơi vào tình trạng "mất lớp học"!'
    }
  },

  // =========================================================================
  // CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ CƠ SỞ DỮ LIỆU
  // =========================================================================
  {
    id: 'bai-3-phan-tich-thiet-ke-erd-chuan-hoa',
    chapterId: 'chuong-3',
    chapterTitle: 'Chương 3: Phân tích & Thiết kế Cơ sở Dữ liệu (ERD & Chuẩn hóa)',
    title: 'Bài 3: Phân tích Nghiệp vụ, Mô hình ERD, Chuyển đổi sang Bảng & Chuẩn hóa 1NF, 2NF, 3NF',
    description: 'Nắm vững quy trình thiết kế CSDL từ phân tích thực tế: vẽ sơ đồ thực thể liên kết ERD, quy tắc chuyển đổi sang bảng quan hệ và kỹ thuật chuẩn hóa dữ liệu 1NF, 2NF, 3NF để triệt tiêu dị thường.',
    level: 'trung-binh',
    competency: 'thiet-ke-rang-buoc',
    estimatedMinutes: 45,
    prerequisites: [
      'Bài 2.1 & 2.2: Khóa chính và Khóa ngoại trong CSDL'
    ],
    learningObjectives: [
      'Biết cách thu thập và phân tích yêu cầu dữ liệu từ bài toán thực tế của doanh nghiệp/trường học.',
      'Xác định đúng Thực thể (Entity), Thuộc tính (Attribute) và Mối quan hệ (Relationship 1-1, 1-N, N-N).',
      'Xây dựng thành thạo Sơ đồ thực thể liên kết ERD (Entity Relationship Diagram).',
      'Áp dụng chính xác các quy tắc chuyển đổi từ sơ đồ ERD sang mô hình bảng quan hệ.',
      'Hiểu rõ 3 dạng dị thường dữ liệu: Thêm (Insert Anomaly), Sửa (Update Anomaly) và Xóa (Delete Anomaly).',
      'Nắm vững và thực hành chuẩn hóa dữ liệu qua các bước: Dạng chuẩn 1 (1NF), Dạng chuẩn 2 (2NF) và Dạng chuẩn 3 (3NF).'
    ],
    mermaidDiagram: `graph LR
      subgraph ERD_Sang_QuanHe [Quy trình Thiết kế CSDL]
        A[Phân tích bài toán thực tế] --> B[Xác định Thực thể & Thuộc tính]
        B --> C[Vẽ Sơ đồ ERD]
        C --> D[Chuyển ERD sang Bảng Quan hệ]
        D --> E[Chuẩn hóa 1NF -> 2NF -> 3NF]
        E --> F[Viết mã SQL DDL tạo CSDL]
      end`,
    normalizationCase: {
      title: 'Trường hợp điển hình: Chuẩn hóa Bảng Điểm Thi Sinh viên',
      scenario: 'Một cán bộ đào tạo lưu trữ toàn bộ thông tin sinh viên, lớp học, môn học và điểm thi vào một file bảng tính duy nhất. Hãy theo dõi các bước chuẩn hóa!',
      steps: [
        {
          form: 'Unnormalized',
          name: 'Bảng chưa chuẩn hóa (Chứa thuộc tính lặp / đa trị)',
          issueExplained: 'Cột [MonHoc_Diem] chứa nhiều môn học gom chung trong một ô cách nhau dấu phẩy. Cột [LopHoc, GVCN] lặp lại hàng trăm lần.',
          rule: 'Vi phạm nguyên tắc nguyên tử hóa dữ liệu; không thể dùng lệnh SQL để tính điểm trung bình từng môn hoặc lọc sinh viên qua môn dễ dàng.',
          tables: [
            {
              name: 'BangDiemChung_ChuaChuan',
              primaryKey: ['MaSV'],
              columns: ['MaSV', 'HoTen', 'MaLop', 'TenLop', 'GVCN', 'DanhSachMonVaDiem'],
              sampleData: [
                { MaSV: 'SV01', HoTen: 'Nguyễn Quốc Anh', MaLop: '12A1', TenLop: 'Chuyên Tin', GVCN: 'Thầy Nam', DanhSachMonVaDiem: 'TIN:9.5, TOAN:8.5' },
                { MaSV: 'SV02', HoTen: 'Trần Mai Linh', MaLop: '12A1', TenLop: 'Chuyên Tin', GVCN: 'Thầy Nam', DanhSachMonVaDiem: 'TIN:9.0, TOAN:9.5' }
              ]
            }
          ]
        },
        {
          form: '1NF',
          name: 'Dạng chuẩn 1 (1NF - First Normal Form)',
          issueExplained: 'Đã tách các giá trị đa trị thành các dòng riêng biệt; mỗi ô giao giữa dòng và cột là một giá trị nguyên tử (Atomic). Khóa chính hợp thành là (MaSV, MaMH).',
          rule: 'Điều kiện 1NF: Bảng có khóa chính xác định, mọi thuộc tính đều mang giá trị nguyên tử (không có danh sách, không có mảng lặp).',
          tables: [
            {
              name: 'Bang_1NF',
              primaryKey: ['MaSV', 'MaMH'],
              columns: ['MaSV', 'HoTen', 'MaLop', 'TenLop', 'GVCN', 'MaMH', 'TenMH', 'HeSo', 'DiemTB'],
              sampleData: [
                { MaSV: 'SV01', HoTen: 'Nguyễn Quốc Anh', MaLop: '12A1', TenLop: 'Chuyên Tin', GVCN: 'Thầy Nam', MaMH: 'TIN', TenMH: 'Tin học', HeSo: 2, DiemTB: 9.5 },
                { MaSV: 'SV01', HoTen: 'Nguyễn Quốc Anh', MaLop: '12A1', TenLop: 'Chuyên Tin', GVCN: 'Thầy Nam', MaMH: 'TOAN', TenMH: 'Toán học', HeSo: 2, DiemTB: 8.5 },
                { MaSV: 'SV02', HoTen: 'Trần Mai Linh', MaLop: '12A1', TenLop: 'Chuyên Tin', GVCN: 'Thầy Nam', MaMH: 'TIN', TenMH: 'Tin học', HeSo: 2, DiemTB: 9.0 }
              ]
            }
          ]
        },
        {
          form: '2NF',
          name: 'Dạng chuẩn 2 (2NF - Second Normal Form)',
          issueExplained: 'Loại bỏ Phụ thuộc hàm bộ phận (Partial Dependency). Trong bảng 1NF trên, thuộc tính HoTen, MaLop chỉ phụ thuộc vào MaSV (chỉ 1 phần của khóa chính kép), TenMH chỉ phụ thuộc vào MaMH.',
          rule: 'Điều kiện 2NF: Đã đạt 1NF VÀ mọi thuộc tính không khóa đều phải phụ thuộc hàm đầy đủ vào toàn bộ khóa chính.',
          tables: [
            {
              name: 'SinhVien (Tách từ 1NF)',
              primaryKey: ['MaSV'],
              columns: ['MaSV', 'HoTen', 'MaLop', 'TenLop', 'GVCN'],
              sampleData: [
                { MaSV: 'SV01', HoTen: 'Nguyễn Quốc Anh', MaLop: '12A1', TenLop: 'Chuyên Tin', GVCN: 'Thầy Nam' },
                { MaSV: 'SV02', HoTen: 'Trần Mai Linh', MaLop: '12A1', TenLop: 'Chuyên Tin', GVCN: 'Thầy Nam' }
              ]
            },
            {
              name: 'MonHoc (Tách từ 1NF)',
              primaryKey: ['MaMH'],
              columns: ['MaMH', 'TenMH', 'HeSo'],
              sampleData: [
                { MaMH: 'TIN', TenMH: 'Tin học', HeSo: 2 },
                { MaMH: 'TOAN', TenMH: 'Toán học', HeSo: 2 }
              ]
            },
            {
              name: 'KetQua (Chỉ giữ lại dữ liệu phụ thuộc cả 2 khóa)',
              primaryKey: ['MaSV', 'MaMH'],
              columns: ['MaSV', 'MaMH', 'DiemTB'],
              sampleData: [
                { MaSV: 'SV01', MaMH: 'TIN', DiemTB: 9.5 },
                { MaSV: 'SV01', MaMH: 'TOAN', DiemTB: 8.5 },
                { MaSV: 'SV02', MaMH: 'TIN', DiemTB: 9.0 }
              ]
            }
          ]
        },
        {
          form: '3NF',
          name: 'Dạng chuẩn 3 (3NF - Third Normal Form)',
          issueExplained: 'Loại bỏ Phụ thuộc hàm bắc cầu (Transitive Dependency). Ở bảng SinhVien trên: MaSV -> MaLop, mà MaLop -> TenLop, GVCN. Như vậy TenLop phụ thuộc bắc cầu vào MaSV thông qua MaLop!',
          rule: 'Điều kiện 3NF: Đã đạt 2NF VÀ không có thuộc tính không khóa nào phụ thuộc bắc cầu vào khóa chính (mọi thuộc tính không khóa chỉ phụ thuộc trực tiếp vào khóa chính).',
          tables: [
            {
              name: 'LopHoc (Tách riêng để chuẩn 3NF)',
              primaryKey: ['MaLop'],
              columns: ['MaLop', 'TenLop', 'GVCN'],
              sampleData: [
                { MaLop: '12A1', TenLop: 'Chuyên Tin', GVCN: 'Thầy Nam' }
              ]
            },
            {
              name: 'SinhVien (Chuẩn 3NF hoàn chỉnh)',
              primaryKey: ['MaSV'],
              columns: ['MaSV', 'HoTen', 'MaLop'],
              sampleData: [
                { MaSV: 'SV01', HoTen: 'Nguyễn Quốc Anh', MaLop: '12A1' },
                { MaSV: 'SV02', HoTen: 'Trần Mai Linh', MaLop: '12A1' }
              ]
            },
            {
              name: 'MonHoc (Chuẩn 3NF)',
              primaryKey: ['MaMH'],
              columns: ['MaMH', 'TenMH', 'HeSo'],
              sampleData: [
                { MaMH: 'TIN', TenMH: 'Tin học', HeSo: 2 },
                { MaMH: 'TOAN', TenMH: 'Toán học', HeSo: 2 }
              ]
            },
            {
              name: 'KetQua (Chuẩn 3NF)',
              primaryKey: ['MaSV', 'MaMH'],
              columns: ['MaSV', 'MaMH', 'DiemTB'],
              sampleData: [
                { MaSV: 'SV01', MaMH: 'TIN', DiemTB: 9.5 },
                { MaSV: 'SV01', MaMH: 'TOAN', DiemTB: 8.5 },
                { MaSV: 'SV02', MaMH: 'TIN', DiemTB: 9.0 }
              ]
            }
          ]
        }
      ]
    },
    commonMistakes: [
      {
        mistake: 'Cố tình gộp tất cả thông tin vào một bảng duy nhất để "tiết kiệm số lượng bảng".',
        correction: 'Gộp bảng dẫn đến dư thừa dữ liệu trầm trọng, phát sinh dị thường thêm/sửa/xóa và làm phình to dung lượng ổ đĩa.',
        why: 'Mục tiêu của thiết kế chuẩn hóa là mỗi sự kiện chỉ được lưu trữ đúng một lần duy nhất trong hệ thống.'
      },
      {
        mistake: 'Chuẩn hóa quá mức (Denormalization ngược) gây chậm hiệu năng truy vấn.',
        correction: 'Trong thực tế ứng dụng quản lý đào tạo, đạt chuẩn 3NF là tỷ lệ vàng tối ưu nhất giữa tính toàn vẹn và hiệu năng.',
        why: 'Chuẩn hóa vượt quá 3NF (như 4NF, 5NF) làm tăng số lượng bảng cần JOIN, gây áp lực lên tài nguyên tính toán của RDBMS.'
      }
    ],
    sections: [
      {
        id: 'sec-3-1',
        title: '1. Quy trình Phân tích Nghiệp vụ & Xác định Thực thể - Thuộc tính',
        content: `Mọi dự án phần mềm cơ sở dữ liệu đều bắt đầu bằng bước phân tích yêu cầu nghiệp vụ:
- **Bước 1: Khảo sát thực tế:** Gặp gỡ người dùng (cán bộ đào tạo, giảng viên, sinh viên), thu thập các biểu mẫu giấy tờ (Phiếu báo điểm, Đơn xin nhập học, Thời khóa biểu).
- **Bước 2: Xác định Thực thể (Entities):** Tìm kiếm các danh từ chỉ đối tượng có thông tin cần quản lý độc lập (ví dụ: SinhVien, LopHoc, MonHoc, GiangVien).
- **Bước 3: Xác định Thuộc tính (Attributes):** Tìm các đặc trưng của từng thực thể (ví dụ: Sinh viên có MaSV, HoTen, NgaySinh, QueQuan).
- **Bước 4: Xác định Mối quan hệ (Relationships):** Xem xét hành vi động giữa các thực thể (Sinh viên *thuộc về* Lớp học; Sinh viên *đăng ký* Môn học; Giảng viên *chủ nhiệm* Lớp học).`,
        keyTakeaways: [
          'Thực thể thường là Danh từ; Mối quan hệ thường là Động từ trong bản mô tả nghiệp vụ.',
          'Thuộc tính phải gắn liền với thực thể tương ứng, không được gán nhầm sang thực thể khác.'
        ]
      },
      {
        id: 'sec-3-2',
        title: '2. Xây dựng Sơ đồ ERD & Quy tắc Chuyển đổi sang Mô hình Quan hệ',
        content: `**Sơ đồ Thực thể - Liên kết (Entity-Relationship Diagram - ERD)** là công cụ trực quan biểu diễn mô hình dữ liệu ở mức quan niệm (Conceptual Level):
- Thực thể được biểu diễn bằng hình chữ nhật.
- Thuộc tính được biểu diễn bằng hình elip (hoặc danh sách bên trong hộp chữ nhật).
- Mối quan hệ được biểu diễn bằng hình thoi hoặc các đường nối có ký hiệu bản số (Cardinality: 1-1, 1-N, N-N).

*4 Quy tắc vàng chuyển đổi ERD sang Bảng quan hệ:*
1. **Thực thể -> Bảng:** Mỗi thực thể chuyển thành một bảng; thuộc tính khóa trở thành Khóa chính (PK).
2. **Quan hệ 1 - N:** Lấy Khóa chính của bên 1 đưa sang làm Khóa ngoại (FK) ở bên N. *(Ví dụ: Đưa MaLop từ LopHoc sang bảng SinhVien)*.
3. **Quan hệ N - N:** Tạo một **bảng liên kết trung gian mới**, Khóa chính của bảng này là tổ hợp các Khóa chính của 2 bảng tham gia. *(Ví dụ: Bảng KetQua có PK là MaSV + MaMH)*.
4. **Quan hệ 1 - 1:** Có thể gộp chung thành 1 bảng, hoặc lấy PK của bảng này làm FK của bảng kia và gán thêm ràng buộc UNIQUE.`,
        keyTakeaways: [
          'Quy tắc chuyển đổi chuyển hóa ý tưởng logic thành cấu trúc vật lý sẵn sàng cho SQL.',
          'Quan hệ N-N luôn sinh ra bảng trung gian.'
        ]
      },
      {
        id: 'sec-3-3',
        title: '3. Chuẩn hóa Dữ liệu: 1NF, 2NF, 3NF & Loại bỏ Dị thường (Anomalies)',
        content: `Nếu CSDL thiết kế tồi, hệ thống sẽ gặp 3 loại **Dị thường (Anomalies)** vô cùng nguy hiểm:
1. **Dị thường Thêm (Insertion Anomaly):** Không thể thêm một Môn học mới nếu chưa có sinh viên nào đăng ký môn đó.
2. **Dị thường Xóa (Deletion Anomaly):** Khi xóa sinh viên duy nhất của một lớp, thông tin về lớp học và phòng học đó cũng bị xóa sạch theo!
3. **Dị thường Cập nhật (Update Anomaly):** Muốn đổi tên giáo viên chủ nhiệm, phải tìm và sửa hàng trăm dòng sinh viên trong lớp, nếu sót một dòng sẽ dẫn đến dữ liệu mâu thuẫn bất nhất.

*3 Dạng chuẩn hóa kinh điển:*
- **1NF (First Normal Form):** Mỗi thuộc tính chỉ chứa giá trị nguyên tử (Atomic), không có cột đa trị (Multi-valued) hay nhóm lặp (Repeating groups).
- **2NF (Second Normal Form):** Đạt 1NF VÀ không có phụ thuộc hàm bộ phận vào khóa chính hợp thành (Mọi thuộc tính không khóa phải phụ thuộc vào toàn bộ PK).
- **3NF (Third Normal Form):** Đạt 2NF VÀ không có phụ thuộc bắc cầu (Thuộc tính không khóa không được phụ thuộc vào một thuộc tính không khóa khác).`,
        keyTakeaways: [
          'Chuẩn hóa giúp loại bỏ dị thường thêm, xóa, sửa và triệt tiêu dư thừa dữ liệu.',
          'Mục tiêu thiết kế thực tế luôn hướng tới Dạng chuẩn 3 (3NF).'
        ],
        teacherNote: 'Mẹo nhớ nhanh chuẩn hóa của William Kent: "Every non-key attribute must provide a fact about the key, the whole key, and nothing but the key, so help me Codd!" (Mọi thuộc tính phải phụ thuộc vào khóa, toàn bộ khóa, và không gì ngoài khóa!)'
      }
    ],
    practiceLevels: {
      level1: 'Nêu định nghĩa 1NF, 2NF và 3NF bằng lời văn của em.',
      level2: 'Cho bảng DonHang (MaHD, NgayLap, MaKH, TenKH, DiaChiKH, MaSP, TenSP, SoLuong, DonGia). Chỉ ra các dị thường và tiến hành chuẩn hóa về 3NF.',
      level3: 'Phân tích và vẽ sơ đồ ERD cho Hệ thống Quản lý Thư viện trường cao đẳng gồm các thực thể: DocGia, Sach, PhieuMuon, NhanVien.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Tại sao trong chuẩn 3NF, thông tin về Tên lớp và Phòng học lại không nên lưu trực tiếp trong bảng SinhVien?',
      sqlChallenge: `CREATE TABLE LopHoc (
    MaLop VARCHAR(10) PRIMARY KEY,
    TenLop NVARCHAR(50) NOT NULL,
    GVCN NVARCHAR(100) NOT NULL
);
CREATE TABLE SinhVien (
    MaSV VARCHAR(10) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    MaLop VARCHAR(10) REFERENCES LopHoc(MaLop)
);`,
      scenarioQuestion: 'Một bạn sinh viên tạo bảng HocPhanDangKy gồm các cột: MaSV, HoTen, MaMH, TenMH, NgayDK. Bảng này đã đạt 2NF chưa? Vì sao?',
      teacherAnswerKey: 'Bảng này chưa đạt 2NF vì Khóa chính là (MaSV, MaMH), nhưng HoTen chỉ phụ thuộc vào MaSV (một phần khóa), và TenMH chỉ phụ thuộc vào MaMH (một phần khóa). Cần tách thành 3 bảng: SinhVien, MonHoc và DangKy.'
    }
  },

  // =========================================================================
  // CHƯƠNG 4: NGÔN NGỮ SQL VÀ THAO TÁC DỮ LIỆU CƠ BẢN
  // =========================================================================
  {
    id: 'bai-4-ngon-ngu-sql-thao-tac-co-ban',
    chapterId: 'chuong-4',
    chapterTitle: 'Chương 4: Ngôn ngữ SQL & Thao tác Dữ liệu Cơ bản',
    title: 'Bài 4: Phân hệ SQL, DDL (CREATE/ALTER/DROP), Kiểu Dữ liệu, Ràng buộc & DML (INSERT/UPDATE/DELETE)',
    description: 'Làm chủ ngôn ngữ SQL chuẩn Microsoft SQL Server: Phân biệt DDL/DML/DQL/DCL/TCL, tạo cấu trúc CSDL với các ràng buộc PK, FK, UNIQUE, NOT NULL, CHECK, DEFAULT và thao tác thêm sửa xóa dữ liệu an toàn.',
    level: 'co-ban',
    competency: 'dinh-nghia-du-lieu-ddl',
    estimatedMinutes: 40,
    prerequisites: [
      'Bài 2: Mô hình dữ liệu quan hệ & Khóa',
      'Bài 3: Phân tích thiết kế bảng và ràng buộc'
    ],
    learningObjectives: [
      'Phân biệt rõ 5 phân hệ con của SQL: DDL, DML, DQL, DCL, TCL.',
      'Sử dụng thành thạo lệnh DDL: CREATE TABLE, ALTER TABLE, DROP TABLE.',
      'Khai báo chuẩn xác các kiểu dữ liệu trong SQL Server: INT, FLOAT, DECIMAL, VARCHAR, NVARCHAR, DATE, BIT.',
      'Thiết lập đầy đủ 6 loại ràng buộc: PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, CHECK, DEFAULT.',
      'Thực hiện các thao tác DML: INSERT INTO, UPDATE, DELETE FROM.',
      'Nhận thức sâu sắc sự nguy hiểm của lệnh UPDATE và DELETE khi thiếu mệnh đề WHERE.'
    ],
    relatedTable: 'HocSinh',
    suggestedPracticeSql: "INSERT INTO HocSinh (MaHS, HoTen, GioiTinh, NgaySinh, DiaChi, MaLop) VALUES ('HS099', N'Lê Minh Châu', N'Nữ', '2008-12-05', N'Hà Nội', '12A1');",
    commonMistakes: [
      {
        mistake: 'Chạy lệnh UPDATE hoặc DELETE mà quên viết mệnh đề WHERE.',
        correction: 'Tuyệt đối luôn viết mệnh đề WHERE trước, kiểm tra kỹ điều kiện bằng lệnh SELECT trước khi thực thi UPDATE hoặc DELETE!',
        why: 'Nếu không có WHERE, lệnh UPDATE sẽ đổi dữ liệu của TẤT CẢ các dòng trong bảng; lệnh DELETE sẽ xóa sạch toàn bộ dữ liệu của bảng!'
      },
      {
        mistake: 'Quên tiền tố N khi chèn chuỗi tiếng Việt Unicode có dấu (ví dụ viết \'Nguyễn Văn An\' thay vì N\'Nguyễn Văn An\').',
        correction: 'Trong Microsoft SQL Server, luôn thêm ký tự N đứng trước chuỗi tiếng Việt kiểu NVARCHAR (ví dụ: N\'Hà Nội\').',
        why: 'Nếu thiếu N, SQL Server sẽ lưu chuỗi dưới dạng mã ASCII và tiếng Việt có dấu sẽ bị biến thành dấu chấm hỏi (???).'
      }
    ],
    sections: [
      {
        id: 'sec-4-1',
        title: '1. Tổng quan Ngôn ngữ SQL & 5 Phân hệ Con (DDL, DML, DQL, DCL, TCL)',
        content: `**SQL (Structured Query Language)** là ngôn ngữ chuẩn quốc tế (ANSI/ISO) dùng để quản trị và thao tác dữ liệu. SQL được chia làm 5 nhóm phân hệ chức năng:
1. **DDL (Data Definition Language - Ngôn ngữ Định nghĩa Dữ liệu):** Dùng để định nghĩa hoặc thay đổi cấu trúc bảng.
   - Các lệnh chính: \`CREATE\`, \`ALTER\`, \`DROP\`, \`TRUNCATE\`.
2. **DML (Data Manipulation Language - Ngôn ngữ Thao tác Dữ liệu):** Dùng để thay đổi nội dung dữ liệu bên trong bảng.
   - Các lệnh chính: \`INSERT\`, \`UPDATE\`, \`DELETE\`.
3. **DQL (Data Query Language - Ngôn ngữ Truy vấn Dữ liệu):** Dùng để trích xuất và đọc thông tin từ các bảng.
   - Lệnh chính: \`SELECT\`.
4. **DCL (Data Control Language - Ngôn ngữ Kiểm soát Dữ liệu):** Dùng để cấp phát và thu hồi quyền truy cập bảo mật.
   - Các lệnh chính: \`GRANT\`, \`REVOKE\`, \`DENY\`.
5. **TCL (Transaction Control Language - Ngôn ngữ Điều khiển Giao dịch):** Quản trị tính toàn vẹn phiên làm việc.
   - Các lệnh chính: \`COMMIT\`, \`ROLLBACK\`, \`SAVEPOINT\`.`,
        keyTakeaways: [
          'DDL tác động vào cấu trúc (Structure/Schema); DML tác động vào nội dung dữ liệu (Data/Rows).',
          'DQL (SELECT) là nhóm lệnh được sử dụng nhiều nhất trong công việc hàng ngày.'
        ]
      },
      {
        id: 'sec-4-2',
        title: '2. Lệnh DDL: CREATE TABLE, Kiểu Dữ liệu & Hệ thống Ràng buộc',
        content: `Cú pháp khai báo bảng hoàn chỉnh trong Microsoft SQL Server:
\`\`\`sql
CREATE TABLE TenBang (
    TenCot KieuDuLieu [RangBuocCot],
    ...
    CONSTRAINT TenRangBuoc [RangBuocBang]
);
\`\`\`

*Các kiểu dữ liệu thông dụng trong SQL Server:*
- \`INT\`: Số nguyên 4 bytes (-2 tỷ đến +2 tỷ).
- \`FLOAT\`, \`DECIMAL(p, s)\`: Số thực có phần thập phân (thích hợp cho Điểm số, Tiền tệ).
- \`VARCHAR(n)\`: Chuỗi ký tự ASCII độ dài biến đổi (ví dụ: MaSV, Email, SoDT).
- \`NVARCHAR(n)\`: Chuỗi ký tự Unicode hỗ trợ tiếng Việt có dấu (ví dụ: HoTen, DiaChi).
- \`DATE\`: Ngày tháng định dạng chuẩn YYYY-MM-DD.
- \`BIT\`: Kiểu logic Boolean (0 hoặc 1, Đúng hoặc Sai).

*6 Ràng buộc toàn vẹn cốt lõi:*
1. \`PRIMARY KEY\`: Khóa chính định danh duy nhất.
2. \`NOT NULL\`: Bắt buộc nhập, không được để trống.
3. \`UNIQUE\`: Giá trị không được trùng lặp (ví dụ: Số điện thoại, CCCD).
4. \`DEFAULT\`: Gán giá trị mặc định nếu người dùng không nhập.
5. \`CHECK (DieuKien)\`: Kiểm tra điều kiện hợp lệ miền giá trị (ví dụ: \`CHECK (Diem >= 0 AND Diem <= 10)\`).
6. \`FOREIGN KEY ... REFERENCES\`: Khóa ngoại tham chiếu bảng cha.`,
        sqlExamples: [
          {
            title: 'Tạo bảng MonHoc với đầy đủ ràng buộc',
            description: 'Tạo bảng MonHoc có PK, UNIQUE và CHECK hệ số',
            sql: `CREATE TABLE MonHoc (
    MaMH VARCHAR(10) PRIMARY KEY,
    TenMH NVARCHAR(100) NOT NULL UNIQUE,
    SoTinChi INT NOT NULL DEFAULT 3,
    CONSTRAINT CHK_SoTinChi CHECK (SoTinChi BETWEEN 1 AND 10)
);`,
            explanation: 'Bảng MonHoc đảm bảo mã môn là khóa chính, tên môn không bao giờ bị nhập trùng lặp và số tín chỉ luôn nằm trong khoảng hợp lệ từ 1 đến 10.',
            expectedResult: 'Commands completed successfully.'
          }
        ],
        keyTakeaways: [
          'Luôn đặt tên ràng buộc rõ ràng (ví dụ PK_TenBang, FK_BangCon_BangCha, CHK_TenCot) để dễ bảo trì khi cần ALTER sau này.'
        ]
      },
      {
        id: 'sec-4-3',
        title: '3. Lệnh DML: INSERT, UPDATE, DELETE & Kỹ thuật An toàn',
        content: `Khi cấu trúc bảng đã sẵn sàng, chúng ta thao tác nạp và biến đổi dữ liệu bằng DML:
- **Lệnh INSERT INTO:** Thêm dòng mới.
  - Cú pháp chuẩn an toàn: \`INSERT INTO TenBang (Cot1, Cot2) VALUES (GiaTri1, GiaTri2);\`
  - Hỗ trợ chèn nhiều dòng cùng lúc: \`VALUES (...), (...), (...);\`
- **Lệnh UPDATE:** Sửa đổi dữ liệu hiện có.
  - Cú pháp: \`UPDATE TenBang SET Cot1 = GiaTriMoi WHERE DieuKien;\`
- **Lệnh DELETE:** Xóa dòng dữ liệu.
  - Cú pháp: \`DELETE FROM TenBang WHERE DieuKien;\`

*Cảnh báo nguyên tắc an toàn dữ liệu:*
- Luôn kiểm tra số dòng bị ảnh hưởng (*rows affected*) sau khi chạy lệnh.
- Nếu muốn xóa sạch toàn bộ dữ liệu trong bảng với tốc độ cao hơn và đặt lại chỉ số tự tăng, dùng lệnh \`TRUNCATE TABLE TenBang;\` (Lưu ý: TRUNCATE thuộc nhóm DDL).`,
        sqlExamples: [
          {
            title: 'Thêm mới sinh viên và cập nhật địa chỉ an toàn',
            description: 'Chèn học sinh mới với tiền tố Unicode N và cập nhật địa chỉ có WHERE',
            sql: `INSERT INTO HocSinh (MaHS, HoTen, GioiTinh, NgaySinh, DiaChi, MaLop)
VALUES ('HS010', N'Ngô Gia Bảo', N'Nam', '2008-04-12', N'Bắc Ninh', '12A1');

UPDATE HocSinh 
SET DiaChi = N'Hà Nội' 
WHERE MaHS = 'HS010';`,
            explanation: 'Lệnh INSERT nạp một bản ghi hoàn chỉnh. Lệnh UPDATE chỉ thay đổi địa chỉ của đúng học sinh có mã HS010 nhờ điều kiện WHERE chính xác.',
            expectedResult: '(1 row affected) cho mỗi câu lệnh.'
          }
        ],
        keyTakeaways: [
          'Luôn dùng tiền tố N trước chuỗi tiếng Việt có dấu trong SQL Server.',
          'UPDATE/DELETE bắt buộc phải có WHERE trừ khi có chủ đích làm mới toàn bộ bảng.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh tạo bảng Khoa (MaKhoa, TenKhoa, TruongKhoa) với MaKhoa là khóa chính.',
      level2: 'Viết câu lệnh INSERT 3 sinh viên mới vào lớp 12A1, sau đó tăng điểm thường xuyên (DiemTX) thêm 0.5 điểm cho học sinh có mã HS001.',
      level3: 'Viết câu lệnh xóa tất cả các kết quả thi có điểm tổng kết (DiemTB) dưới 3.5 điểm của môn Toán.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Sự khác biệt giữa DELETE FROM TenBang và DROP TABLE TenBang là gì?',
      sqlChallenge: `UPDATE KetQua 
SET DiemCK = 10.0, DiemTB = 9.8 
WHERE MaHS = 'HS002' AND MaMH = 'TIN';`,
      scenarioQuestion: 'Một lập trình viên sơ ý chạy lệnh: UPDATE HocSinh SET DiaChi = N\'Hà Nội\'. Hậu quả gì xảy ra và làm thế nào để khắc phục?',
      teacherAnswerKey: 'Hậu quả: Toàn bộ tất cả học sinh trong trường đều bị đổi địa chỉ thành Hà Nội vì câu lệnh thiếu mệnh đề WHERE. Khắc phục: Cần khôi phục lại dữ liệu từ bản sao lưu gần nhất (Backup Log/Database) hoặc Transaction Rollback nếu câu lệnh được bao bọc trong transaction.'
    }
  },

  // =========================================================================
  // CHƯƠNG 5: THAO TÁC & TRUY VẤN DỮ LIỆU SQL (11 BÀI HỌC TỪ CƠ BẢN ĐẾN PHỨC HỢP)
  // =========================================================================
  ...CHAPTER_5_LESSONS,

  // =========================================================================
  // CHƯƠNG 6: TRUY VẤN NÂNG CAO
  // =========================================================================
  {
    id: 'bai-6-truy-van-nang-cao',
    chapterId: 'chuong-6',
    chapterTitle: 'Chương 6: Truy vấn Nâng cao (Gom nhóm, Nối bảng, Subquery, CASE)',
    title: 'Bài 6: Hàm Tổng hợp, GROUP BY, HAVING, Phép Nối INNER/LEFT JOIN, Truy vấn Con (Subquery) & Mệnh đề CASE',
    description: 'Chinh phục các kỹ thuật phân tích dữ liệu chuyên nghiệp: thống kê tổng hợp với GROUP BY và HAVING, kết hợp nhiều bảng quan hệ bằng các loại JOIN, lồng ghép Subquery và rẽ nhánh điều kiện CASE WHEN.',
    level: 'nang-cao',
    competency: 'gom-nhom-thong-ke',
    estimatedMinutes: 45,
    prerequisites: [
      'Chương 5: Danh mục 11 bài học thao tác & truy vấn SQL (SELECT, WHERE, LIKE, GROUP BY, HAVING, ORDER BY, JOINS, DML)'
    ],
    learningObjectives: [
      'Sử dụng chính xác 5 hàm tổng hợp: COUNT, SUM, AVG, MIN, MAX và hiểu cách xử lý giá trị NULL.',
      'Hiểu rõ bản chất gom nhóm dữ liệu của GROUP BY và tuân thủ tuyệt đối quy tắc gom nhóm trong SQL.',
      'Phân biệt rạch ròi sự khác nhau giữa điều kiện lọc dòng WHERE và điều kiện lọc nhóm HAVING.',
      'Hiểu bản chất và vận dụng thành thạo các phép nối: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN.',
      'Thực hiện truy vấn kết hợp đồng thời 3 đến 4 bảng dữ liệu trong hệ thống quản lý đào tạo.',
      'Viết thành thạo các dạng truy vấn con (Subquery): đơn dòng, đa dòng kết hợp IN, EXISTS.',
      'Sử dụng mệnh đề CASE WHEN ... THEN ... ELSE ... END để phân loại học lực sinh viên.',
      'Làm quen với Biểu thức Bảng Thông thường (Common Table Expression - CTE).'
    ],
    relatedTable: 'KetQua',
    suggestedPracticeSql: `SELECT L.TenLop, COUNT(H.MaHS) AS SiSo, ROUND(AVG(K.DiemTB), 2) AS DiemTrungBinhLop
FROM LopHoc L
JOIN HocSinh H ON L.MaLop = H.MaLop
JOIN KetQua K ON H.MaHS = K.MaHS
GROUP BY L.TenLop
HAVING COUNT(H.MaHS) >= 1;`,
    commonMistakes: [
      {
        mistake: 'Chọn một cột không nằm trong hàm tổng hợp mà cũng không khai báo trong GROUP BY (Lỗi SQL 8120 kinh điển).',
        correction: 'Mọi cột xuất hiện trong danh sách SELECT bắt buộc phải: hoặc nằm bên trong một hàm tổng hợp (SUM, AVG...), hoặc phải được liệt kê trong mệnh đề GROUP BY!',
        why: 'Nếu không gom nhóm cột đó, SQL Server không thể biết chọn giá trị nào trong số nhiều dòng của nhóm để hiển thị.'
      },
      {
        mistake: 'Dùng mệnh đề WHERE để lọc điều kiện chứa hàm tổng hợp (ví dụ: WHERE AVG(DiemTB) >= 8.0).',
        correction: 'Hàm tổng hợp tính toán sau khi các dòng đã được gom nhóm, do đó điều kiện lọc trên hàm tổng hợp BẮT BUỘC phải đặt trong mệnh đề HAVING!',
        why: 'WHERE lọc từng dòng trước khi gom nhóm; HAVING lọc các nhóm sau khi đã gom nhóm xong.'
      }
    ],
    sections: [
      {
        id: 'sec-6-1',
        title: '1. Hàm Tổng hợp (Aggregate Functions), GROUP BY & Mệnh đề HAVING',
        content: `Để tạo báo cáo thống kê, chúng ta sử dụng các hàm tổng hợp trên từng tập dữ liệu:
- **5 Hàm tổng hợp cơ bản:**
  - \`COUNT(*)\`: Đếm tổng số dòng (kể cả dòng có chứa NULL).
  - \`COUNT(TenCot)\`: Đếm số dòng có giá trị khác NULL ở cột đó.
  - \`SUM(TenCot)\`: Tính tổng giá trị số.
  - \`AVG(TenCot)\`: Tính trung bình cộng các giá trị khác NULL.
  - \`MIN(TenCot)\` / \`MAX(TenCot)\`: Tìm giá trị nhỏ nhất / lớn nhất.

*Mệnh đề GROUP BY (Gom nhóm):*
Chia các dòng trong bảng thành các nhóm có cùng giá trị trên một hoặc nhiều cột để tính toán hàm tổng hợp cho từng nhóm riêng biệt.

*Mệnh đề HAVING (Lọc nhóm):*
Dùng để lọc các nhóm sau khi đã gom nhóm và tính toán hàm tổng hợp.
*Bảng so sánh WHERE vs. HAVING:*
| Đặc điểm | Mệnh đề WHERE | Mệnh đề HAVING |
| :--- | :--- | :--- |
| **Đối tượng lọc** | Từng dòng dữ liệu riêng lẻ | Cả nhóm dữ liệu |
| **Thời điểm thực thi** | Trước khi gom nhóm (Trước GROUP BY) | Sau khi gom nhóm (Sau GROUP BY) |
| **Dùng hàm tổng hợp?** | KHÔNG ĐƯỢC PHÉP | BẮT BUỘC / ĐƯỢC PHÉP |`,
        sqlExamples: [
          {
            title: 'Thống kê điểm trung bình từng lớp và chỉ lấy lớp có ĐTB >= 8.0',
            description: 'Kết hợp GROUP BY và HAVING với phép tính AVG',
            sql: `SELECT H.MaLop, COUNT(H.MaHS) AS SiSo, ROUND(AVG(K.DiemTB), 2) AS DiemTBLop
FROM HocSinh H
JOIN KetQua K ON H.MaHS = K.MaHS
GROUP BY H.MaLop
HAVING AVG(K.DiemTB) >= 8.0;`,
            explanation: 'SQL Server gom tất cả học sinh theo từng mã lớp, tính sĩ số và điểm trung bình, sau đó chỉ giữ lại những lớp có điểm trung bình từ 8.0 trở lên.',
            expectedResult: 'Danh sách các lớp có thành tích xuất sắc.'
          }
        ],
        keyTakeaways: [
          'WHERE lọc dòng trước; GROUP BY gom nhóm; HAVING lọc nhóm sau.',
          'Mọi cột không tổng hợp ở SELECT phải có mặt trong GROUP BY.'
        ]
      },
      {
        id: 'sec-6-2',
        title: '2. Kỹ thuật Nối Bảng: INNER JOIN, LEFT JOIN & Truy vấn Đa bảng',
        content: `Trong CSDL quan hệ chuẩn hóa 3NF, dữ liệu bị phân tách ra nhiều bảng. Các phép \`JOIN\` dùng để ghép các bảng lại với nhau dựa trên mối liên kết Khóa chính - Khóa ngoại:
1. **INNER JOIN (Nối trong / Giao):** Chỉ trả về những dòng có sự trùng khớp giá trị ở cả 2 bảng trên điều kiện \`ON\`. Những dòng không có liên kết ở 1 trong 2 bảng sẽ bị loại bỏ.
2. **LEFT JOIN / LEFT OUTER JOIN (Nối ngoài bên trái):** Giữ lại TOÀN BỘ các dòng của bảng bên trái; nếu bảng bên phải không có dòng khớp tương ứng thì các cột của bảng phải sẽ được điền giá trị \`NULL\`.
   - *Ứng dụng kinh điển:* Tìm những sinh viên chưa đăng ký môn học nào, hoặc tìm lớp học chưa có học sinh!
3. **RIGHT JOIN:** Tương tự LEFT JOIN nhưng ưu tiên giữ toàn bộ bảng bên phải.
4. **FULL OUTER JOIN:** Giữ toàn bộ dòng của cả 2 bảng; ô nào không khớp sẽ điền NULL.`,
        sqlExamples: [
          {
            title: 'Truy vấn 4 bảng: Xem đầy đủ bảng điểm chi tiết của sinh viên',
            description: 'Nối bảng HocSinh, LopHoc, KetQua và MonHoc',
            sql: `SELECT H.MaHS, H.HoTen, L.TenLop, M.TenMH, K.DiemTX, K.DiemGK, K.DiemCK, K.DiemTB
FROM HocSinh H
INNER JOIN LopHoc L ON H.MaLop = L.MaLop
INNER JOIN KetQua K ON H.MaHS = K.MaHS
INNER JOIN MonHoc M ON K.MaMH = M.MaMH
ORDER BY L.TenLop ASC, H.HoTen ASC;`,
            explanation: 'Từ mã lớp trong HocSinh liên kết sang LopHoc để lấy tên lớp; từ mã học sinh liên kết sang KetQua; từ mã môn học liên kết sang MonHoc để lấy tên môn.',
            expectedResult: 'Bảng điểm chi tiết rõ ràng tên người, tên lớp, tên môn.'
          }
        ],
        keyTakeaways: [
          'Dùng INNER JOIN khi chỉ muốn lấy dữ liệu khớp hoàn toàn.',
          'Dùng LEFT JOIN khi cần giữ toàn bộ danh mục gốc bất kể có dữ liệu phát sinh hay chưa.'
        ]
      },
      {
        id: 'sec-6-3',
        title: '3. Truy vấn Con (Subquery) & Mệnh đề Rẽ nhánh CASE WHEN',
        content: `Khi câu hỏi nghiệp vụ đòi hỏi tính toán qua nhiều bước:
- **Truy vấn Con (Subquery):** Là câu lệnh SELECT được lồng bên trong một câu lệnh SQL khác (nằm trong WHERE, HAVING, FROM hoặc SELECT).
  - *Subquery đơn dòng:* Trả về 1 giá trị duy nhất (kết hợp các toán tử \`=\`, \`>\`, \`<\`). Ví dụ: Tìm học sinh có điểm cao hơn điểm trung bình toàn trường!
  - *Subquery đa dòng:* Trả về một danh sách các giá trị (kết hợp các toán tử \`IN\`, \`NOT IN\`, \`EXISTS\`, \`ALL\`, \`ANY\`).
- **Mệnh đề CASE WHEN:** Cung cấp khả năng rẽ nhánh logic tương đương cấu trúc \`if - else\` trong ngôn ngữ lập trình.`,
        sqlExamples: [
          {
            title: 'Tìm học sinh có điểm cao hơn trung bình toàn trường & Xếp loại học lực',
            description: 'Lồng Subquery trong WHERE và dùng biểu thức CASE WHEN',
            sql: `SELECT H.MaHS, H.HoTen, K.DiemTB,
       CASE 
           WHEN K.DiemTB >= 9.0 THEN N'Xuất sắc'
           WHEN K.DiemTB >= 8.0 THEN N'Giỏi'
           WHEN K.DiemTB >= 6.5 THEN N'Khá'
           WHEN K.DiemTB >= 5.0 THEN N'Trung bình'
           ELSE N'Yếu'
       END AS XepLoai
FROM HocSinh H
JOIN KetQua K ON H.MaHS = K.MaHS
WHERE K.DiemTB > (SELECT AVG(DiemTB) FROM KetQua);`,
            explanation: 'Subquery (SELECT AVG(DiemTB) FROM KetQua) được tính trước, sau đó câu truy vấn ngoài so sánh điểm của từng bạn với kết quả trung bình đó và phân loại học lực bằng CASE WHEN.',
            expectedResult: 'Danh sách sinh viên có học lực vượt mức bình quân kèm danh hiệu xếp loại.'
          }
        ],
        keyTakeaways: [
          'Subquery giúp giải quyết bài toán phức tạp theo từng bước module nhỏ.',
          'CASE WHEN là giải pháp hoàn hảo để chuyển đổi số liệu thô thành thông tin phân loại nghiệp vụ.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh đếm số lượng học sinh của từng lớp học trong bảng HocSinh.',
      level2: 'Dùng LEFT JOIN để tìm ra những lớp học hiện tại chưa có học sinh nào theo học.',
      level3: 'Dùng Subquery tìm ra những sinh viên có điểm tổng kết môn Tin học cao nhất trong toàn trường.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Sự khác biệt căn bản giữa INNER JOIN và LEFT JOIN là gì khi lớp học chưa có sinh viên nào?',
      sqlChallenge: `SELECT L.TenLop, COUNT(H.MaHS) AS TongSoHS
FROM LopHoc L
LEFT JOIN HocSinh H ON L.MaLop = H.MaLop
GROUP BY L.TenLop;`,
      scenarioQuestion: 'Giám đốc đào tạo muốn có một báo cáo phân nhóm sinh viên theo 3 mức học bổng: Xuất sắc (>= 9.0: 3 triệu), Giỏi (>= 8.0: 2 triệu), Còn lại (0 đồng). Bạn thiết kế câu lệnh truy vấn như thế nào?',
      teacherAnswerKey: 'Sử dụng cấu trúc CASE WHEN trong SELECT: CASE WHEN DiemTB >= 9.0 THEN 3000000 WHEN DiemTB >= 8.0 THEN 2000000 ELSE 0 END AS TienHocBong.'
    }
  },

  // =========================================================================
  // CHƯƠNG 7: QUẢN TRỊ VÀ ĐẢM BẢO TOÀN VẸN DỮ LIỆU CƠ BẢN
  // =========================================================================
  {
    id: 'bai-7-quan-tri-toan-ven-an-toan',
    chapterId: 'chuong-7',
    chapterTitle: 'Chương 7: Quản trị & Đảm bảo Toàn vẹn Dữ liệu Cơ bản',
    title: 'Bài 7: Ràng buộc Toàn vẹn, Khung nhìn (View), Giao dịch (Transaction - ACID) & An toàn CSDL (Chống SQL Injection)',
    description: 'Nâng tầm kỹ năng quản trị CSDL chuyên nghiệp: cấu hình hành vi CASCADE, tạo khung nhìn VIEW bảo mật dữ liệu, quản trị giao dịch an toàn với 4 thuộc tính ACID và phòng chống lỗ hổng SQL Injection nguy hiểm.',
    level: 'nang-cao',
    competency: 'quan-tri-toan-ven',
    estimatedMinutes: 40,
    prerequisites: [
      'Bài 4: Lệnh DDL và DML',
      'Bài 6: Phép nối JOIN và truy vấn nâng cao'
    ],
    learningObjectives: [
      'Hiểu và cấu hình quy tắc hành vi toàn vẹn tham chiếu: ON DELETE CASCADE, ON UPDATE CASCADE.',
      'Định nghĩa Khung nhìn (VIEW), hiểu lợi ích bảo mật và tái sử dụng câu lệnh truy vấn phức tạp.',
      'Viết câu lệnh CREATE VIEW và truy vấn dữ liệu thông qua View.',
      'Trình bày bản chất Giao dịch (Transaction) và 4 thuộc tính sống còn ACID: Atomicity, Consistency, Isolation, Durability.',
      'Sử dụng thành thạo các lệnh TCL: BEGIN TRANSACTION, COMMIT, ROLLBACK.',
      'Hiểu nguyên lý tấn công SQL Injection vào ứng dụng web và biện pháp phòng vệ bằng Parameterized Queries.'
    ],
    relatedTable: 'HocSinh',
    suggestedPracticeSql: `CREATE VIEW vw_BangDiemChiTiet AS
SELECT H.MaHS, H.HoTen, L.TenLop, M.TenMH, K.DiemTB
FROM HocSinh H
JOIN LopHoc L ON H.MaLop = L.MaLop
JOIN KetQua K ON H.MaHS = K.MaHS
JOIN MonHoc M ON K.MaMH = M.MaMH;`,
    commonMistakes: [
      {
        mistake: 'Lạm dụng ON DELETE CASCADE mà không cân nhắc quy định bảo vệ dữ liệu lịch sử.',
        correction: 'Với các dữ liệu quan trọng như Điểm thi, Hóa đơn thanh toán, không nên CASCADE DELETE tự động vì khi vô ý xóa sinh viên, toàn bộ lịch sử điểm thi của họ sẽ biến mất vĩnh viễn!',
        why: 'Trong thực tế doanh nghiệp, người ta ưu tiên xóa mềm (Soft Delete bằng cột IsDeleted BIT) thay vì xóa vật lý.'
      },
      {
        mistake: 'Cộng chuỗi trực tiếp (String Concatenation) khi lập trình ứng dụng kết nối SQL Server.',
        correction: 'Tuyệt đối không viết mã ghép chuỗi dạng: "SELECT * FROM Users WHERE User = \'" + input + "\'". Luôn sử dụng Parameterized Query / PreparedStatement.',
        why: 'Ghép chuỗi mở toang cánh cửa cho kẻ tấn công thực hiện SQL Injection chiếm quyền kiểm soát toàn bộ CSDL!'
      }
    ],
    sections: [
      {
        id: 'sec-7-1',
        title: '1. Ràng buộc Toàn vẹn Nâng cao & Quy tắc Kích hoạt (CASCADE)',
        content: `Khi thiết lập Khóa ngoại, chúng ta cần quy định Hệ quản trị CSDL sẽ hành xử thế nào khi một dòng ở bảng Cha bị xóa hoặc bị sửa đổi Khóa chính:
- \`ON DELETE NO ACTION\` (Mặc định): Báo lỗi và chặn ngay lập tức hành động xóa bảng cha nếu đang có bảng con tham chiếu.
- \`ON DELETE CASCADE\`: Khi xóa dòng ở bảng Cha, SQL Server sẽ tự động xóa sạch tất cả các dòng ở bảng Con có tham chiếu đến dòng đó.
- \`ON DELETE SET NULL\`: Tự động gán giá trị khóa ngoại ở bảng con thành NULL khi dòng bảng cha bị xóa.
- \`ON UPDATE CASCADE\`: Khi cập nhật mã khóa chính ở bảng Cha, tất cả các khóa ngoại tương ứng ở bảng Con sẽ tự động được cập nhật đồng bộ theo!`,
        keyTakeaways: [
          'CASCADE giúp duy trì sự đồng bộ tự động giữa các bảng cha - con.',
          'Cần cân nhắc kỹ trước khi áp dụng ON DELETE CASCADE để tránh mất dữ liệu dây chuyền ngoài ý muốn.'
        ]
      },
      {
        id: 'sec-7-2',
        title: '2. Khung nhìn (VIEW) trong Cơ sở Dữ liệu',
        content: `**Khung nhìn (VIEW)** là một "bảng ảo" được định nghĩa dựa trên một câu lệnh truy vấn SELECT.
- VIEW không chiếm dung lượng lưu trữ dữ liệu vật lý (nó chỉ lưu câu lệnh truy vấn bên trong từ điển dữ liệu).
- Khi người dùng truy vấn trên VIEW, SQL Server sẽ thực thi câu lệnh định nghĩa bên dưới.

*3 Lợi ích to lớn của VIEW:*
1. **Đơn giản hóa truy vấn:** Gom các câu lệnh JOIN 4-5 bảng phức tạp thành một bảng ảo ngắn gọn cho các lập trình viên khác sử dụng.
2. **Bảo mật và Phân quyền:** Cho phép nhân viên chỉ được xem một số cột nhất định (ví dụ ẩn cột Mật khẩu, Lương, Số CCCD) mà không để họ thấy toàn bộ bảng gốc.
3. **Tính độc lập dữ liệu:** Khi cấu trúc bảng vật lý bên dưới thay đổi, ta chỉ cần sửa câu lệnh trong View mà không làm gãy các ứng dụng đang kết nối.`,
        sqlExamples: [
          {
            title: 'Tạo View xem danh sách sinh viên lớp 12A1 kèm xếp loại',
            description: 'Định nghĩa View an toàn bằng lệnh CREATE VIEW',
            sql: `CREATE VIEW vw_SinhVien12A1 AS
SELECT MaHS, HoTen, GioiTinh, DiaChi 
FROM HocSinh 
WHERE MaLop = '12A1';

-- Sau đó truy vấn View như một bảng bình thường:
SELECT * FROM vw_SinhVien12A1 WHERE GioiTinh = N'Nữ';`,
            explanation: 'Người dùng truy vấn qua vw_SinhVien12A1 chỉ nhìn thấy danh sách các bạn lớp 12A1 mà không thể truy cập các lớp khác.',
            expectedResult: 'Tạo View thành công và trả về dữ liệu học sinh nữ lớp 12A1.'
          }
        ],
        keyTakeaways: [
          'View là công cụ bảo mật và đóng gói câu lệnh truy vấn cực kỳ hữu ích.',
          'View được sử dụng như một bảng dữ liệu thông thường trong các câu lệnh SELECT.'
        ]
      },
      {
        id: 'sec-7-3',
        title: '3. Giao dịch (Transaction - ACID) & Phòng tránh SQL Injection',
        content: `Trong các hoạt động nghiệp vụ như chuyển tiền ngân hàng hay đăng ký học phần:
**Giao dịch (Transaction)** là một chuỗi các thao tác SQL được thực hiện như một đơn vị công việc duy nhất và bất khả phân.
*4 Thuộc tính vàng ACID:*
- **A - Atomicity (Tính nguyên tử):** "Tất cả hoặc không gì cả". Hoặc là toàn bộ các câu lệnh trong giao dịch hoàn thành thành công, hoặc không có câu lệnh nào được lưu lại (Rollback về trạng thái ban đầu).
- **C - Consistency (Tính nhất quán):** CSDL chuyển từ một trạng thái hợp lệ này sang một trạng thái hợp lệ khác, không vi phạm bất kỳ ràng buộc nào.
- **I - Isolation (Tính cô lập):** Các giao dịch thực thi đồng thời không được can thiệp hoặc nhìn thấy trạng thái trung gian chưa hoàn tất của nhau.
- **D - Durability (Tính bền vững):** Khi giao dịch đã COMMIT thành công, dữ liệu sẽ được lưu vĩnh viễn trên đĩa cứng ngay cả khi mất điện đột ngột.

*Cú pháp quản lý Transaction trong SQL Server:*
\`\`\`sql
BEGIN TRANSACTION;
-- Thực hiện chuỗi lệnh DML
UPDATE TaiKhoan SET SoDu = SoDu - 500000 WHERE MaTK = 'TK_A';
UPDATE TaiKhoan SET SoDu = SoDu + 500000 WHERE MaTK = 'TK_B';

-- Nếu không có lỗi:
COMMIT TRANSACTION;
-- Nếu phát sinh lỗi:
-- ROLLBACK TRANSACTION;
\`\`\`

*Nhận thức an toàn: Phòng chống SQL Injection:*
- **SQL Injection là gì?** Là kỹ thuật tấn công chèn các đoạn mã SQL độc hại vào các ô nhập liệu của người dùng trên Web Form (ví dụ nhập: \`' OR '1'='1\`) để bẻ gãy câu lệnh logic và xem trộm toàn bộ dữ liệu hoặc xóa sổ bảng.
- **Biện pháp phòng vệ tuyệt đối:** Sử dụng **Truy vấn có tham số (Parameterized Queries / Prepared Statements)**. Khi đó hệ quản trị xem nội dung người dùng nhập hoàn toàn là dữ liệu chuỗi thô, triệt tiêu khả năng biên dịch thành mã lệnh!`,
        keyTakeaways: [
          'Transaction bảo vệ sự toàn vẹn của dữ liệu trong các kịch bản đa bước phức tạp.',
          'Parameterized Query là nguyên tắc phòng thủ bắt buộc đối với mọi lập trình viên kết nối CSDL.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Giải thích ý nghĩa của 4 chữ cái trong chuẩn ACID bằng ví dụ chuyển tiền.',
      level2: 'Viết câu lệnh tạo View hiển thị danh sách các học sinh đạt danh hiệu Xuất sắc (DiemTB >= 9.0) của trường.',
      level3: 'Mô phỏng một đoạn mã giao dịch (BEGIN TRAN, COMMIT, ROLLBACK) thực hiện đăng ký môn học và trừ số chỗ còn lại của lớp học phần.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Tại sao việc ghép chuỗi khi nhận dữ liệu từ người dùng lại dẫn đến nguy cơ bị tấn công SQL Injection?',
      sqlChallenge: `BEGIN TRANSACTION;
UPDATE MonHoc SET SoTinChi = 3 WHERE MaMH = 'TIN';
COMMIT TRANSACTION;`,
      scenarioQuestion: 'Giả sử một hệ thống đăng ký học phần cho phép sinh viên đăng ký môn học. Bước 1: Thêm dòng vào bảng DangKy; Bước 2: Giảm số lượng chỗ trống trong LopHocPhan. Nếu bước 2 bị lỗi mất điện thì điều gì xảy ra nếu không dùng Transaction?',
      teacherAnswerKey: 'Nếu không dùng Transaction, bước 1 đã lưu sinh viên vào bảng nhưng bước 2 không giảm chỗ, dẫn đến sĩ số thực tế vượt quá sức chứa của phòng học. Dùng Transaction sẽ tự động ROLLBACK hủy bỏ dòng đăng ký ở bước 1, đảm bảo tính nguyên tử (Atomicity).'
    }
  },

  // =========================================================================
  // CHƯƠNG 8: DỰ ÁN TỔNG HỢP (CAPSTONE PROJECT)
  // =========================================================================
  {
    id: 'bai-8-du-an-tong-hop',
    chapterId: 'chuong-8',
    chapterTitle: 'Chương 8: Dự án Cơ sở Dữ liệu Tổng hợp (Capstone Project)',
    title: 'Bài 8: Dự án Thực tế Xuyên suốt: Phân tích, Thiết kế ERD, Cài đặt CSDL & Báo cáo Nghiệp vụ Quản lý Đào tạo',
    description: 'Vận dụng toàn bộ kiến thức của 7 chương học vào dự án tốt nghiệp môn học: Từ khảo sát bài toán thực tế, vẽ ERD, chuẩn hóa 3NF, viết mã DDL tạo bảng ràng buộc, nạp dữ liệu mẫu đến xây dựng bộ truy vấn nghiệp vụ báo cáo hoàn chỉnh.',
    level: 'nang-cao',
    competency: 'du-an-tong-hop',
    estimatedMinutes: 60,
    prerequisites: [
      'Hoàn thành đầy đủ 7 bài học lý thuyết và thực hành từ Chương 1 đến Chương 7'
    ],
    learningObjectives: [
      'Độc lập phân tích một đề bài thực tế để xác định đúng thực thể, thuộc tính và mối quan hệ.',
      'Thiết kế sơ đồ ERD hoàn chỉnh và chuyển đổi chuẩn xác sang lược đồ quan hệ chuẩn 3NF.',
      'Viết mã nguồn script SQL DDL tạo toàn bộ CSDL có đầy đủ khóa chính, khóa ngoại, unique, check, default.',
      'Viết kịch bản DML nạp bộ dữ liệu mẫu nhất quán và thực tế.',
      'Xây dựng tối thiểu 10 câu lệnh truy vấn nghiệp vụ phục vụ ban giám hiệu nhà trường.',
      'Kiểm thử phát hiện lỗi dữ liệu và bảo vệ dự án theo tiêu chí Rubric đánh giá năng lực.'
    ],
    relatedTable: 'HocSinh',
    suggestedPracticeSql: `SELECT H.MaHS, H.HoTen, L.TenLop,
       COUNT(K.MaMH) AS SoMonDaHoc,
       ROUND(AVG(K.DiemTB), 2) AS DiemTrungBinhTichLuy,
       CASE 
           WHEN AVG(K.DiemTB) >= 9.0 THEN N'Học bổng Xuất sắc'
           WHEN AVG(K.DiemTB) >= 8.0 THEN N'Học bổng Giỏi'
           ELSE N'Không đạt'
       END AS DanhHieuHocBong
FROM HocSinh H
JOIN LopHoc L ON H.MaLop = L.MaLop
JOIN KetQua K ON H.MaHS = K.MaHS
GROUP BY H.MaHS, H.HoTen, L.TenLop
ORDER BY DiemTrungBinhTichLuy DESC;`,
    commonMistakes: [
      {
        mistake: 'Tạo bảng Con trước khi tạo bảng Cha trong tệp script SQL.',
        correction: 'Luôn tạo bảng Cha trước (các bảng không chứa khóa ngoại như LopHoc, MonHoc), sau đó mới tạo bảng Con (như SinhVien, KetQua).',
        why: 'Nếu bảng Cha chưa tồn tại, câu lệnh tạo khóa ngoại ở bảng Con sẽ lập tức báo lỗi biên dịch.'
      },
      {
        mistake: 'Nạp dữ liệu vi phạm ràng buộc khóa ngoại (Foreign key violation).',
        correction: 'Khi nạp dữ liệu DML, phải nạp bảng Cha trước, sau đó mới nạp dữ liệu bảng Con tương ứng.',
        why: 'SQL Server sẽ chặn ngay việc chèn một sinh viên thuộc về một mã lớp chưa có trong bảng LopHoc.'
      }
    ],
    sections: [
      {
        id: 'sec-8-1',
        title: '1. Bản Mô tả Nghiệp vụ Dự án Thực tế: Hệ thống Quản lý Đào tạo Cao đẳng',
        content: `*Đề bài dự án:*
Trường Cao đẳng Kỹ thuật Công nghệ cần xây dựng một cơ sở dữ liệu trên Microsoft SQL Server để quản lý công tác đào tạo sinh viên:
1. **Quản lý Khoa & Giảng viên:** Mỗi khoa có mã khoa, tên khoa, số điện thoại. Mỗi giảng viên thuộc một khoa duy nhất, có học vị và số điện thoại liên hệ.
2. **Quản lý Lớp học:** Mỗi lớp học có một mã lớp duy nhất, tên lớp, thuộc một khoa và có một giảng viên làm Cố vấn học tập (GVCN).
3. **Quản lý Sinh viên:** Lưu trữ mã sinh viên, họ tên, giới tính, ngày sinh, quê quán và mã lớp đang theo học.
4. **Quản lý Môn học (Học phần):** Mỗi môn học có mã môn, tên môn, số tín chỉ và hệ số tính điểm.
5. **Đăng ký học phần & Kết quả học tập:** Mỗi kỳ, sinh viên đăng ký các môn học. Kết quả gồm điểm chuyên cần, điểm giữa kỳ, điểm thi kết thúc học phần và điểm tổng kết môn.`,
        keyTakeaways: [
          'Đọc kỹ đề bài để nắm bắt các ràng buộc logic thực tế.',
          'Các đối tượng chính: Khoa, GiangVien, LopHoc, SinhVien, MonHoc, DangKy, KetQua.'
        ]
      },
      {
        id: 'sec-8-2',
        title: '2. Hướng dẫn Từng Bước Thực hiện Dự án (6 Giai đoạn Chuẩn)',
        content: `Để hoàn thành dự án đạt điểm tối đa theo tiêu chuẩn công nghiệp, sinh viên thực hiện theo quy trình 6 bước:
- **Giai đoạn 1: Thiết kế Sơ đồ ERD:**
  Xác định các thực thể và vẽ sơ đồ liên kết biểu diễn quan hệ 1-N và N-N.
- **Giai đoạn 2: Chuyển đổi sang Lược đồ Quan hệ & Chuẩn hóa 3NF:**
  Phân rã quan hệ Nhiều - Nhiều thành các bảng trung gian; loại bỏ mọi phụ thuộc bộ phận và phụ thuộc bắc cầu.
- **Giai đoạn 3: Viết Script SQL DDL Tạo CSDL:**
  Khai báo kiểu dữ liệu, khóa chính, khóa ngoại, ràng buộc CHECK và DEFAULT hợp lý.
- **Giai đoạn 4: Viết Script SQL DML Nạp Dữ liệu Thử nghiệm:**
  Chuẩn bị tối thiểu 5 lớp, 10 sinh viên, 5 môn học và bảng điểm tương ứng để kiểm thử.
- **Giai đoạn 5: Xây dựng Bộ Câu hỏi & Câu lệnh Truy vấn Nghiệp vụ Báo cáo:**
  - Báo cáo danh sách sinh viên theo từng lớp.
  - Báo cáo bảng điểm chi tiết của từng sinh viên.
  - Thống kê điểm trung bình và xếp loại sinh viên.
  - Tìm Top sinh viên điểm cao nhất để xét học bổng.
  - Lập danh sách sinh viên nợ môn (Điểm tổng kết < 5.0) để gửi thông báo cảnh báo học vụ.
- **Giai đoạn 6: Đóng gói Script & Báo cáo Thuyết minh Sản phẩm.**`,
        keyTakeaways: [
          'Thực hiện tuần tự từ phân tích quan niệm đến cài đặt vật lý.',
          'Bộ truy vấn nghiệp vụ là minh chứng trực quan nhất cho thấy CSDL được thiết kế thành công.'
        ]
      },
      {
        id: 'sec-8-3',
        title: '3. Tiêu chí Đánh giá Dự án (Rubric Chấm điểm Năng lực)',
        content: `Dự án tổng hợp được đánh giá trên thang điểm 100 theo 5 tiêu chí rõ ràng:
1. **Thiết kế ERD & Chuẩn hóa 3NF (25 điểm):**
   - Xác định đúng thực thể, thuộc tính và khóa: 10đ
   - Biểu diễn quan hệ chuẩn xác, chuyển đổi đạt chuẩn 3NF không dị thường: 15đ
2. **Cấu trúc DDL & Hệ thống Ràng buộc (20 điểm):**
   - Chọn kiểu dữ liệu tối ưu, chuẩn Microsoft SQL Server: 5đ
   - Đầy đủ ràng buộc PK, FK, NOT NULL, UNIQUE, CHECK, DEFAULT: 15đ
3. **Chất lượng Bộ Dữ liệu Thử nghiệm DML (15 điểm):**
   - Dữ liệu thực tế, có ý nghĩa, hỗ trợ tiếng Việt Unicode (N'): 10đ
   - Không vi phạm toàn vẹn tham chiếu: 5đ
4. **Bộ Truy vấn Nghiệp vụ SQL DQL (30 điểm):**
   - Truy vấn cơ bản có lọc WHERE, sắp xếp ORDER BY: 10đ
   - Truy vấn nâng cao có JOIN nhiều bảng, GROUP BY và HAVING: 10đ
   - Vận dụng sáng tạo Subquery và biểu thức CASE WHEN: 10đ
5. **Khung nhìn (VIEW) & Quản trị Toàn vẹn (10 điểm):**
   - Xây dựng thành công View nghiệp vụ và giải thích được tính an toàn: 10đ`,
        keyTakeaways: [
          'Rubric định hướng rõ ràng mục tiêu phấn đấu cho từng sinh viên.',
          'Dự án hoàn thành là sản phẩm thực tế có thể đưa vào hồ sơ năng lực (Portfolio) xin việc!'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết kịch bản DDL tạo toàn bộ các bảng của dự án theo đúng thứ tự không bị lỗi khóa ngoại.',
      level2: 'Viết câu lệnh DML chèn dữ liệu mẫu cho 5 sinh viên mới và tính điểm trung bình học kỳ cho từng bạn.',
      level3: 'Viết truy vấn nâng cao lập danh sách xét học bổng kỳ 1 (Yêu cầu: Điểm TB >= 8.0 và không có bất kỳ môn nào dưới 5.0).'
    },
    endOfLessonReview: {
      summaryQuestion: 'Tại sao trong một dự án CSDL thực tế, bước phân tích nghiệp vụ và chuẩn hóa 3NF lại quyết định đến 80% sự thành bại của hệ thống phần mềm sau này?',
      sqlChallenge: `SELECT H.MaHS, H.HoTen, L.TenLop, M.TenMH, K.DiemTB
FROM HocSinh H
JOIN LopHoc L ON H.MaLop = L.MaLop
JOIN KetQua K ON H.MaHS = K.MaHS
JOIN MonHoc M ON K.MaMH = M.MaMH
WHERE K.DiemTB < 5.0;`,
      scenarioQuestion: 'Khi bảo vệ dự án trước hội đồng giảng viên, một thầy giáo hỏi: "Nếu nhà trường muốn mở thêm cơ sở 2 và cho phép một sinh viên có thể chuyển đổi cơ sở học tập, thiết kế CSDL của em cần điều chỉnh thế nào?"',
      teacherAnswerKey: 'Cần bổ sung thực thể CoSo (MaCoSo, TenCoSo, DiaChi), bổ sung khóa ngoại MaCoSo vào bảng LopHoc hoặc tạo bảng lịch sử ChuyenCoSo (MaSV, MaCoSoCu, MaCoSoMoi, NgayChuyen) để lưu lại dấu vết chuyển đổi của sinh viên.'
    }
  }
];
