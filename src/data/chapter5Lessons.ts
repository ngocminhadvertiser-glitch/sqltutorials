import { Lesson } from '../types';

export const CHAPTER_5_LESSONS: Lesson[] = [
  // =========================================================================
  // BÀI 5.1: CÂU LỆNH SELECT *, SELECT cot1, col2, ...
  // =========================================================================
  {
    id: 'bai-5-1-select-co-ban',
    chapterId: 'chuong-5',
    chapterTitle: 'Chương 5: Thao tác & Truy vấn Dữ liệu SQL (DML & DQL)',
    title: 'Bài 5.1: Cú pháp câu lệnh SELECT * và SELECT cot1, col2,...',
    description: 'Bắt đầu hành trình truy vấn dữ liệu SQL với lệnh SELECT: cấu trúc cơ bản, chọn toàn bộ cột với *, chiếu các cột cụ thể, đặt bí danh AS và khử trùng lặp DISTINCT.',
    level: 'co-ban',
    competency: 'truy-van-co-ban',
    estimatedMinutes: 20,
    prerequisites: [
      'Bài 4: Khái niệm bảng và cấu trúc cơ sở dữ liệu quan hệ'
    ],
    learningObjectives: [
      'Hiểu rõ mục đích và vai trò của câu lệnh SELECT trong nhóm ngôn ngữ DQL.',
      'Sử dụng thành thạo ký tự đại diện * để lấy toàn bộ cột trong bảng.',
      'Viết câu lệnh SELECT chỉ định danh sách cột cụ thể (Projection) để tối ưu hiệu năng.',
      'Đặt tên bí danh (Alias) cho cột bằng từ khóa AS giúp tiêu đề kết quả rõ ràng.',
      'Thực hiện các biểu thức tính toán số học trực tiếp trong danh sách SELECT.',
      'Sử dụng từ khóa DISTINCT để loại bỏ các dòng có giá trị trùng lặp hoàn toàn.'
    ],
    relatedTable: 'HocSinh',
    suggestedPracticeSql: 'SELECT MaHS, HoTen, GioiTinh, DiaChi FROM HocSinh;',
    commonMistakes: [
      {
        mistake: 'Lạm dụng SELECT * trong các ứng dụng phần mềm sản phẩm thực tế.',
        correction: 'Luôn liệt kê tường minh các cột cần lấy (ví dụ: SELECT MaHS, HoTen FROM HocSinh).',
        why: 'SELECT * làm máy chủ đọc thừa dữ liệu không cần thiết vào RAM, tốn băng thông mạng và dễ gây lỗi phần mềm khi cấu trúc bảng thay đổi.'
      },
      {
        mistake: 'Đặt bí danh cột có chứa dấu cách tiếng Việt mà không bao bọc trong dấu ngoặc vuông [] hoặc nháy kép.',
        correction: 'Nếu bí danh có dấu cách, bắt buộc dùng: AS [Họ và Tên] hoặc AS "Họ và Tên".',
        why: 'SQL Server coi khoảng trắng là ký tự phân tách từ khóa cú pháp.'
      }
    ],
    sections: [
      {
        id: 'sec-5-1-1',
        title: '1. Cú pháp Câu lệnh SELECT Cơ bản & Phép Chiếu (Projection)',
        content: `Trong ngôn ngữ SQL, câu lệnh \`SELECT\` là công cụ trung tâm của nhóm ngôn ngữ truy vấn dữ liệu (DQL - Data Query Language). Phép chiếu (Projection) là thao tác chỉ chọn ra một số cột nhất định trong bảng.

*Cú pháp cơ bản:*
\`\`\`sql
-- 1. Lấy tất cả các cột trong bảng:
SELECT * FROM TenBang;

-- 2. Chỉ lấy các cột cụ thể cần thiết:
SELECT TenCot1, TenCot2, TenCot3
FROM TenBang;

-- 3. Đặt bí danh (Alias) cho cột:
SELECT TenCot1 AS BiDanh1, TenCot2 AS [Bí Danh Có Dấu Cách]
FROM TenBang;

-- 4. Biểu thức tính toán và nối chuỗi:
SELECT TenCot1, (CotDiem1 + CotDiem2) / 2 AS DiemTB
FROM TenBang;
\`\`\`

*Ý nghĩa các thành phần:*
- \`SELECT\`: Từ khóa bắt buộc chỉ định các cột dữ liệu cần xuất ra màn hình kết quả.
- \`*\`: Ký tự đại diện lấy toàn bộ mọi cột được định nghĩa trong bảng.
- \`FROM TenBang\`: Xác định nguồn dữ liệu được đọc từ bảng nào trong CSDL.
- \`AS BiDanh\`: Đặt tên mới cho cột hiển thị mà không làm thay đổi tên cột gốc trong bảng.`,
        sqlExamples: [
          {
            title: 'Lấy toàn bộ thông tin học sinh bằng SELECT *',
            description: 'Truy xuất tất cả 6 cột trong bảng HocSinh',
            sql: 'SELECT * FROM HocSinh;',
            explanation: 'Hệ quản trị quét toàn bộ bảng HocSinh và trả về tất cả các cột: MaHS, HoTen, GioiTinh, NgaySinh, DiaChi, MaLop.',
            expectedResult: 'Danh sách toàn bộ các học sinh với đầy đủ mọi trường thông tin.'
          },
          {
            title: 'Lấy một số cột cụ thể & đặt bí danh tiếng Việt',
            description: 'Chỉ lấy Mã, Họ tên và Địa chỉ, đặt tên hiển thị thân thiện',
            sql: `SELECT MaHS AS [Mã Học Sinh],
       HoTen AS [Họ Và Tên],
       GioiTinh AS [Giới Tính],
       DiaChi AS [Nơi Cư Trú]
FROM HocSinh;`,
            explanation: 'Câu lệnh chỉ đọc 4 cột cần thiết vào bộ nhớ, giúp ứng dụng chạy nhanh hơn và tiêu đề kết quả dễ đọc hơn.',
            expectedResult: 'Bảng kết quả 4 cột với tiêu đề tiếng Việt có dấu rõ ràng.'
          }
        ],
        keyTakeaways: [
          'SELECT * chỉ nên dùng khi khám phá nhanh cấu trúc dữ liệu trong môi trường học tập.',
          'Trong code lập trình thực tế, luôn liệt kê danh sách cột cụ thể để đảm bảo an toàn và tối ưu tài nguyên.'
        ]
      },
      {
        id: 'sec-5-1-2',
        title: '2. Tính toán trên Cột & Loại bỏ Trùng lặp với DISTINCT',
        content: `Câu lệnh SELECT không chỉ đọc dữ liệu thô mà còn cho phép tính toán trực tiếp trên từng dòng và khử các dòng trùng lặp:

*Cú pháp DISTINCT (Khử trùng lặp):*
\`\`\`sql
SELECT DISTINCT TenCot1, TenCot2
FROM TenBang;
\`\`\`

*Biểu thức tính toán số học:*
Hỗ trợ các toán tử số học cơ bản: \`+\`, \`-\`, \`*\`, \`/\`, \`%\` (chia lấy dư) và các hàm toán học như \`ROUND(giá_trị, số_chữ_số_thập_phân)\`.`,
        sqlExamples: [
          {
            title: 'Liệt kê danh sách các tỉnh/thành phố của học sinh (Không trùng lặp)',
            description: 'Sử dụng DISTINCT trên cột DiaChi để loại bỏ các địa chỉ bị lặp',
            sql: 'SELECT DISTINCT DiaChi FROM HocSinh;',
            explanation: 'Bảng HocSinh có nhiều bạn cùng ở Hà Nội; từ khóa DISTINCT đảm bảo mỗi thành phố chỉ xuất hiện đúng 1 lần trong kết quả.',
            expectedResult: 'Danh sách các tỉnh/thành phố độc bản: Hà Nội, Đà Nẵng, Hải Phòng, TP Hồ Chí Minh...'
          },
          {
            title: 'Tính điểm trung bình học kỳ từ các đầu điểm thành phần',
            description: 'Áp dụng công thức tính điểm hệ số 1, hệ số 2 và làm tròn',
            sql: `SELECT MaHS, MaMH,
       DiemTX, DiemGK, DiemCK,
       ROUND((DiemTX + DiemGK * 2 + DiemCK * 3) / 6.0, 2) AS DiemTongKet
FROM KetQua;`,
            explanation: 'Thực hiện phép tính trên từng dòng của bảng KetQua và gán kết quả vào cột ảo mới có tên là DiemTongKet.',
            expectedResult: 'Bảng điểm chi tiết kèm điểm tổng kết được làm tròn đến 2 chữ số thập phân.'
          }
        ],
        keyTakeaways: [
          'DISTINCT xét trên TỔNG THỂ tất cả các cột được liệt kê sau nó.',
          'Tính toán trong SELECT không làm thay đổi dữ liệu gốc trong bảng.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh SELECT lấy ra MaMH, TenMH và HeSo từ bảng MonHoc.',
      level2: 'Viết câu lệnh hiển thị MaLop, TenLop và GVCN với các bí danh tiếng Việt tương ứng từ bảng LopHoc.',
      level3: 'Viết câu lệnh lấy danh sách các mã lớp (MaLop) duy nhất hiện đang có học sinh theo học trong bảng HocSinh bằng từ khóa DISTINCT.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Tại sao trong phát triển ứng dụng chuyên nghiệp, các chuyên gia luôn khuyến cáo không được dùng SELECT * ?',
      sqlChallenge: 'SELECT DISTINCT MaLop FROM HocSinh;',
      scenarioQuestion: 'Một website bán hàng có bảng SanPham(MaSP, TenSP, GiaNhap, ThueVAT). Hãy viết câu lệnh hiển thị Mã, Tên và Giá bán lẻ dự kiến (GiaNhap * 1.3 * (1 + ThueVAT)).',
      teacherAnswerKey: 'Vì SELECT * gây lãng phí băng thông mạng, tốn RAM máy chủ, ngăn chặn tối ưu hóa chỉ mục (Index-Only Scan) và dễ làm crash ứng dụng khi cấu trúc bảng được thêm bớt cột. Câu lệnh website: SELECT MaSP, TenSP, ROUND(GiaNhap * 1.3 * (1 + ThueVAT), 0) AS GiaBanLe FROM SanPham;'
    }
  },

  // =========================================================================
  // BÀI 5.2: MỆNH ĐỀ WHERE VỚI TOÁN TỬ SO SÁNH & TOÁN TỬ LOGIC
  // =========================================================================
  {
    id: 'bai-5-2-menh-de-where-toan-tu',
    chapterId: 'chuong-5',
    chapterTitle: 'Chương 5: Thao tác & Truy vấn Dữ liệu SQL (DML & DQL)',
    title: 'Bài 5.2: Mệnh đề WHERE với Toán tử So sánh & Toán tử Logic',
    description: 'Làm chủ mệnh đề WHERE để lọc dữ liệu: sử dụng các toán tử so sánh (=, <>, <, >, <=, >=), kết hợp điều kiện phức với AND, OR, NOT, lọc khoảng BETWEEN và tập hợp IN.',
    level: 'co-ban',
    competency: 'truy-van-co-ban',
    estimatedMinutes: 25,
    prerequisites: [
      'Bài 5.1: Cú pháp câu lệnh SELECT * và SELECT cot1, col2,...'
    ],
    learningObjectives: [
      'Hiểu rõ vị trí và thời điểm thực thi của mệnh đề WHERE trong chu trình xử lý SQL.',
      'Sử dụng thành thạo các toán tử so sánh: =, <>, !=, <, >, <=, >=.',
      'Kết hợp nhiều điều kiện logic bằng AND, OR, NOT và kiểm soát độ ưu tiên với cặp dấu ngoặc đơn ().',
      'Sử dụng toán tử BETWEEN ... AND ... để lọc dữ liệu trong một đoạn đóng.',
      'Sử dụng toán tử IN (...) để kiểm tra giá trị nằm trong danh sách cho trước.',
      'Kiểm tra giá trị rỗng chuẩn xác bằng IS NULL và IS NOT NULL.'
    ],
    relatedTable: 'HocSinh',
    suggestedPracticeSql: "SELECT MaHS, HoTen, GioiTinh, DiaChi FROM HocSinh WHERE GioiTinh = N'Nữ' AND (DiaChi = N'Hà Nội' OR DiaChi = N'Đà Nẵng');",
    commonMistakes: [
      {
        mistake: 'So sánh giá trị rỗng bằng dấu bằng (ví dụ: WHERE DiaChi = NULL).',
        correction: 'Trong SQL, bắt buộc phải dùng toán tử IS NULL hoặc IS NOT NULL.',
        why: 'NULL biểu thị giá trị chưa biết hoặc không tồn tại, nên mọi phép so sánh = NULL đều trả về UNKNOWN (coi như False).'
      },
      {
        mistake: 'Quên đóng mở ngoặc đơn () khi kết hợp toán tử AND và OR.',
        correction: 'Luôn gom nhóm các điều kiện OR bằng ngoặc đơn: WHERE (A OR B) AND C.',
        why: 'Toán tử AND có độ ưu tiên cao hơn OR. Nếu không có ngoặc, SQL Server sẽ thực hiện phép AND trước, làm sai lệch hoàn toàn logic nghiệp vụ.'
      }
    ],
    sections: [
      {
        id: 'sec-5-2-1',
        title: '1. Cú pháp Mệnh đề WHERE & Bộ Toán tử So sánh',
        content: `Mệnh đề \`WHERE\` có nhiệm vụ lọc các dòng (Records/Rows) của bảng nguồn. Chỉ những dòng nào thỏa mãn biểu thức điều kiện (trả về \`TRUE\`) mới được đưa vào tập kết quả.

*Cú pháp chuẩn:*
\`\`\`sql
SELECT DanhSachCot
FROM TenBang
WHERE DieuKienLoc;
\`\`\`

*Các toán tử so sánh cơ bản:*
| Toán tử | Ý nghĩa | Ví dụ |
| :--- | :--- | :--- |
| \`=\` | Bằng nhau | \`GioiTinh = N'Nữ'\` |
| \`<>\` hoặc \`!=\` | Khác nhau | \`MaLop <> '12A1'\` |
| \`<\` | Nhỏ hơn | \`DiemTB < 5.0\` |
| \`>\` | Lớn hơn | \`DiemTB > 8.0\` |
| \`<=\` | Nhỏ hơn hoặc bằng | \`Khoi <= 11\` |
| \`>=\` | Lớn hơn hoặc bằng | \`DiemCK >= 9.0\` |`,
        sqlExamples: [
          {
            title: 'Lọc danh sách các bạn học sinh Nữ',
            description: 'Sử dụng toán tử so sánh bằng = với chuỗi Unicode N\'Nữ\'',
            sql: "SELECT MaHS, HoTen, GioiTinh, DiaChi FROM HocSinh WHERE GioiTinh = N'Nữ';",
            explanation: 'Hệ thống quét từng dòng trong bảng HocSinh, chỉ giữ lại những dòng có cột GioiTinh bằng chính xác chữ "Nữ".',
            expectedResult: 'Danh sách các bạn nữ: Trần Mai Linh, Hoàng Thị Hoa, Phạm Hồng Nhung, Bùi Thảo My.'
          }
        ],
        keyTakeaways: [
          'Chuỗi ký tự trong SQL đặt trong cặp nháy đơn \' \'.',
          'Chuỗi tiếng Việt có dấu trong SQL Server cần có tiền tố N phía trước (ví dụ: N\'Hà Nội\').'
        ]
      },
      {
        id: 'sec-5-2-2',
        title: '2. Các Toán tử Logic: AND, OR, NOT & Toán tử Mở rộng (BETWEEN, IN, IS NULL)',
        content: `Khi điều kiện lọc phức tạp cần kết hợp nhiều tiêu chí:
- \`AND\`: Trả về TRUE khi TẤT CẢ các điều kiện thành phần đều TRUE.
- \`OR\`: Trả về TRUE khi có ÍT NHẤT MỘT điều kiện thành phần là TRUE.
- \`NOT\`: Phủ định điều kiện (TRUE thành FALSE, FALSE thành TRUE).
- \`BETWEEN a AND b\`: Nằm trong đoạn đóng [a, b] (bao gồm cả giá trị a và b).
- \`IN (gt1, gt2, ...)\`: Tương đương với nhiều phép OR liên tiếp, kiểm tra giá trị có nằm trong tập hợp liệt kê hay không.
- \`IS NULL\` / \`IS NOT NULL\`: Kiểm tra giá trị rỗng.

*Thứ tự ưu tiên xử lý toán tử:*
1. Dấu ngoặc đơn \`( ... )\`
2. Toán tử so sánh (\`=\`, \`<\`, \`>\`...)
3. \`NOT\`
4. \`AND\`
5. \`OR\``,
        sqlExamples: [
          {
            title: 'Tìm học sinh nữ cư trú tại Hà Nội hoặc Đà Nẵng',
            description: 'Kết hợp toán tử AND và OR có sử dụng ngoặc đơn',
            sql: `SELECT MaHS, HoTen, GioiTinh, DiaChi 
FROM HocSinh 
WHERE GioiTinh = N'Nữ' 
  AND (DiaChi = N'Hà Nội' OR DiaChi = N'Đà Nẵng');`,
            explanation: 'Ngoặc đơn đảm bảo hệ quản trị kiểm tra địa chỉ trước (Hà Nội hoặc Đà Nẵng), sau đó mới kết hợp với điều kiện giới tính nữ.',
            expectedResult: 'Học sinh nữ ở Hà Nội hoặc Đà Nẵng.'
          },
          {
            title: 'Lọc điểm thi cuối kỳ đạt loại Giỏi bằng toán tử BETWEEN',
            description: 'Tìm các bản ghi có Điểm cuối kỳ từ 8.0 đến 10.0',
            sql: `SELECT MaHS, MaMH, DiemCK, DiemTB 
FROM KetQua 
WHERE DiemCK BETWEEN 8.0 AND 10.0;`,
            explanation: 'BETWEEN 8.0 AND 10.0 tương đương với: DiemCK >= 8.0 AND DiemCK <= 10.0.',
            expectedResult: 'Danh sách các kết quả thi có điểm cuối kỳ từ 8.0 đến 10.0.'
          }
        ],
        keyTakeaways: [
          'Luôn bao bọc biểu thức OR trong cặp ngoặc đơn () khi đi cùng với AND.',
          'Dùng toán tử IN (...) thay cho chuỗi dài các phép OR để câu lệnh ngắn gọn, dễ đọc.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh tìm tất cả các lớp học thuộc khối 12 trong bảng LopHoc.',
      level2: 'Tìm danh sách học sinh thuộc các lớp 12A1 hoặc 11B1 có địa chỉ ở Hà Nội.',
      level3: 'Viết câu lệnh truy vấn các môn học có hệ số bằng 2 và không phải là môn Toán (MaMH <> \'TOAN\').'
    },
    endOfLessonReview: {
      summaryQuestion: 'Giải thích sự khác biệt giữa câu lệnh có dấu ngoặc: WHERE (A OR B) AND C với câu lệnh không có dấu ngoặc: WHERE A OR B AND C.',
      sqlChallenge: "SELECT MaHS, HoTen, DiaChi FROM HocSinh WHERE DiaChi IN (N'Hà Nội', N'Hải Phòng') AND GioiTinh = N'Nam';",
      scenarioQuestion: 'Ngân hàng muốn tìm các giao dịch có số tiền từ 10 triệu đến 50 triệu diễn ra trong ngày hôm nay nhưng bị lỗi (TrangThai = N\'Thất bại\'). Hãy viết câu lệnh WHERE tương ứng.',
      teacherAnswerKey: 'Nếu không có ngoặc, SQL Server ưu tiên tính B AND C trước rồi mới OR với A; do đó dòng chỉ cần thỏa mãn A là được chọn ngay dù C sai. Trong khi có ngoặc, bắt buộc C phải đúng và (A hoặc B đúng). Mệnh đề ngân hàng: WHERE SoTien BETWEEN 10000000 AND 50000000 AND TrangThai = N\'Thất bại\'.'
    }
  },

  // =========================================================================
  // BÀI 5.3: TOÁN TỬ LIKE & TÌM KIẾM MẪU CHUỖI
  // =========================================================================
  {
    id: 'bai-5-3-toan-tu-like-chuoi',
    chapterId: 'chuong-5',
    chapterTitle: 'Chương 5: Thao tác & Truy vấn Dữ liệu SQL (DML & DQL)',
    title: 'Bài 5.3: Toán tử LIKE và Ký tự Đại diện Tìm kiếm Chuỗi',
    description: 'Khám phá kỹ thuật tìm kiếm so khớp mẫu chuỗi (Pattern Matching) với toán tử LIKE, các ký tự đại diện %, _, tập ký tự [charlist] và ứng dụng xây dựng thanh tìm kiếm thông minh.',
    level: 'co-ban',
    competency: 'truy-van-co-ban',
    estimatedMinutes: 20,
    prerequisites: [
      'Bài 5.2: Mệnh đề WHERE với Toán tử So sánh & Toán tử Logic'
    ],
    learningObjectives: [
      'Hiểu rõ sự khác biệt giữa so sánh tuyệt đối (=) và so sánh mẫu chuỗi (LIKE).',
      'Vận dụng thành thạo ký tự đại diện % để biểu diễn chuỗi ký tự có độ dài bất kỳ (từ 0 đến nhiều ký tự).',
      'Vận dụng ký tự đại diện _ để biểu diễn chính xác đúng 1 ký tự bất kỳ.',
      'Sử dụng tập ký tự [a-z] và [^a-z] trong SQL Server để lọc theo khoảng chữ cái.',
      'Áp dụng toán tử NOT LIKE để loại bỏ các chuỗi chứa mẫu không mong muốn.'
    ],
    relatedTable: 'HocSinh',
    suggestedPracticeSql: "SELECT MaHS, HoTen, DiaChi FROM HocSinh WHERE HoTen LIKE N'Nguyễn%';",
    commonMistakes: [
      {
        mistake: 'Dùng dấu bằng (=) khi tìm kiếm mẫu (ví dụ: WHERE HoTen = N\'Nguyễn%\').',
        correction: 'Khi sử dụng ký tự đại diện %, bắt buộc phải dùng từ khóa LIKE thay cho dấu =.',
        why: 'Dấu = sẽ tìm chính xác người nào có tên là chữ "Nguyễn%" nguyên văn thay vì hiểu % là đại diện.'
      },
      {
        mistake: 'Quên tiền tố N khi tìm kiếm từ khóa tiếng Việt có dấu.',
        correction: 'Luôn viết: WHERE HoTen LIKE N\'%Nguyễn%\'.',
        why: 'Thiếu N khiến chuỗi Unicode bị chuyển đổi thành mã ASCII không dấu, dẫn tới tìm không ra kết quả.'
      }
    ],
    sections: [
      {
        id: 'sec-5-3-1',
        title: '1. Cú pháp Toán tử LIKE & Các Ký tự Đại diện (Wildcards)',
        content: `Toán tử \`LIKE\` được sử dụng trong mệnh đề \`WHERE\` để tìm kiếm một mẫu xác định trong một cột văn bản/chuỗi ký tự.

*Cú pháp chuẩn:*
\`\`\`sql
SELECT DanhSachCot
FROM TenBang
WHERE CotChuoi LIKE 'MauKiemTra';
\`\`\`

*Hai ký tự đại diện thông dụng nhất:*
1. Dấu phần trăm (\`%\`): Đại diện cho 0, 1 hoặc nhiều ký tự bất kỳ.
   - \`N'Nguyễn%'\`: Bắt đầu bằng chữ "Nguyễn" (Ví dụ: Nguyễn Văn A, Nguyễn Mai...).
   - \`N'%Linh'\`: Kết thúc bằng chữ "Linh" (Ví dụ: Mai Linh, Thùy Linh...).
   - \`N'%Thị%'\`: Chứa từ "Thị" ở bất kỳ vị trí nào trong chuỗi.
2. Dấu gạch dưới (\`_\`): Đại diện cho ĐÚNG MỘT ký tự đơn bất kỳ.
   - \`'HS00_'\`: Khớp với HS001, HS002... đến HS009 (đúng 5 ký tự).
   - \`'1_A_'\`: Khớp với 10A1, 12A1, 11A2... (đúng 4 ký tự).`,
        sqlExamples: [
          {
            title: 'Tìm tất cả học sinh có Họ là "Nguyễn"',
            description: 'Sử dụng LIKE N\'Nguyễn%\' để tìm các học sinh bắt đầu bằng họ Nguyễn',
            sql: "SELECT MaHS, HoTen, GioiTinh, DiaChi FROM HocSinh WHERE HoTen LIKE N'Nguyễn%';",
            explanation: 'Mọi học sinh có phần họ bắt đầu bằng chữ Nguyễn đều được chọn, phần phía sau có thể là bất kỳ ký tự nào.',
            expectedResult: 'Danh sách học sinh họ Nguyễn: Nguyễn Quốc Anh.'
          },
          {
            title: 'Tìm học sinh có tên đệm là "Thị"',
            description: 'Sử dụng LIKE N\'%Thị%\' để tìm mẫu xuất hiện ở giữa tên',
            sql: "SELECT MaHS, HoTen, DiaChi FROM HocSinh WHERE HoTen LIKE N'%Thị%';",
            explanation: 'Hệ quản trị quét và chọn bất kỳ dòng nào mà chuỗi HoTen có chứa từ "Thị".',
            expectedResult: 'Học sinh có tên đệm Thị: Hoàng Thị Hoa.'
          }
        ],
        keyTakeaways: [
          'Ký tự % đại diện cho số lượng ký tự tùy ý; ký tự _ đại diện cho đúng 1 ký tự.',
          'Kết hợp NOT LIKE để loại trừ các mẫu không mong muốn.'
        ]
      },
      {
        id: 'sec-5-3-2',
        title: '2. Ký tự Đại diện Nâng cao: [charlist] & [^charlist]',
        content: `Trong Microsoft SQL Server, toán tử \`LIKE\` còn hỗ trợ tập hợp ký tự đặc biệt trong cặp dấu ngoặc vuông \`[ ]\`:
- \`[abc]%\`: Khớp với chuỗi bắt đầu bằng một trong các ký tự: a, b hoặc c.
- \`[A-F]%\`: Khớp với chuỗi bắt đầu bằng bất kỳ chữ cái nào trong khoảng từ A đến F.
- \`[^abc]%\` hoặc \`[!abc]%\`: Khớp với chuỗi bắt đầu KHÔNG PHẢI là các ký tự a, b hoặc c.`,
        sqlExamples: [
          {
            title: 'Tìm các phòng học thuộc tầng 1 hoặc tầng 2',
            description: 'Dùng ký tự đại diện P.[12]__',
            sql: "SELECT MaLop, TenLop, GVCN, PhongHoc FROM LopHoc WHERE PhongHoc LIKE 'P.[12]%';",
            explanation: 'Lọc các phòng học có ký tự đầu là P., ký tự tiếp theo là số 1 hoặc 2.',
            expectedResult: 'Các lớp học tại phòng P.101, P.201, P.202.'
          }
        ],
        keyTakeaways: [
          'Toán tử LIKE kết hợp % ở đầu chuỗi (%tu_khoa) sẽ không dùng được B-Tree Index, có thể gây chậm khi dữ liệu lớn.',
          'Cần cân nhắc giải pháp Full-Text Search nếu hệ thống có hàng triệu bài viết.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh tìm tất cả các lớp học có tên chứa từ "Chuyên" trong bảng LopHoc.',
      level2: 'Tìm các học sinh có mã học sinh bắt đầu bằng "HS00" và kết thúc bằng một chữ số chẵn (2, 4, 6, 8).',
      level3: 'Viết truy vấn tìm tất cả học sinh có tên kết thúc bằng chữ "Tuấn" hoặc "Khoa" trong bảng HocSinh.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Sự khác biệt cốt lõi giữa ký tự đại diện % và ký tự đại diện _ là gì? Cho ví dụ minh họa.',
      sqlChallenge: "SELECT MaHS, HoTen, DiaChi FROM HocSinh WHERE DiaChi LIKE N'%Nội%' OR DiaChi LIKE N'%Nẵng%';",
      scenarioQuestion: 'Bạn đang lập trình tính năng Auto-complete cho ô tìm kiếm tên học sinh. Nếu người dùng gõ từ "hoa", câu lệnh SQL cần viết thế nào để tìm được cả "Hoa", "Hoàng" hoặc "Thanh Hoa"?',
      teacherAnswerKey: 'Ký tự % đại diện cho 0 hoặc nhiều ký tự bất kỳ, còn _ đại diện cho đúng 1 ký tự duy nhất. Ví dụ: \'H_\' chỉ khớp với chuỗi 2 ký tự như Ha, He; \'H%\' khớp với bất kỳ độ dài nào như Hoa, Hoang, HaiPhong. Cho thanh tìm kiếm: WHERE HoTen LIKE N\'%\' + @keyword + N\'%\'.'
    }
  },

  // =========================================================================
  // BÀI 5.4: MỆNH ĐỀ GROUP BY & CÁC HÀM TỔNG HỢP
  // =========================================================================
  {
    id: 'bai-5-4-group-by-ham-tong-hop',
    chapterId: 'chuong-5',
    chapterTitle: 'Chương 5: Thao tác & Truy vấn Dữ liệu SQL (DML & DQL)',
    title: 'Bài 5.4: Mệnh đề GROUP BY column_name & Các Hàm Tổng hợp',
    description: 'Chinh phục kỹ thuật gom nhóm dữ liệu để tính toán báo cáo thống kê: thành thạo 5 hàm tổng hợp COUNT, SUM, AVG, MIN, MAX và tuân thủ tuyệt đối quy tắc vàng của mệnh đề GROUP BY.',
    level: 'trung-binh',
    competency: 'gom-nhom-thong-ke',
    estimatedMinutes: 30,
    prerequisites: [
      'Bài 5.1: Cú pháp câu lệnh SELECT * và SELECT cot1, col2,...',
      'Bài 5.2: Mệnh đề WHERE với Toán tử So sánh & Toán tử Logic'
    ],
    learningObjectives: [
      'Hiểu rõ bản chất gom nhóm các dòng dữ liệu của mệnh đề GROUP BY.',
      'Sử dụng chính xác 5 hàm tổng hợp tiêu chuẩn: COUNT, SUM, AVG, MIN, MAX.',
      'Phân biệt rõ COUNT(*) và COUNT(TenCot) khi xử lý các giá trị rỗng NULL.',
      'Hiểu và tuân thủ Quy tắc vàng của GROUP BY (tránh lỗi kinh điển SQL 8120).',
      'Thực hiện gom nhóm dữ liệu trên nhiều cột đồng thời.'
    ],
    relatedTable: 'KetQua',
    suggestedPracticeSql: 'SELECT MaMH, COUNT(MaHS) AS SoLuongDuThi, ROUND(AVG(DiemTB), 2) AS DiemTrungBinh, MAX(DiemCK) AS DiemCaoNhat FROM KetQua GROUP BY MaMH;',
    commonMistakes: [
      {
        mistake: 'Chọn một cột không nằm trong hàm tổng hợp mà cũng không khai báo trong mệnh đề GROUP BY (Lỗi SQL 8120).',
        correction: 'Mọi cột nằm trong SELECT bắt buộc phải: hoặc nằm trong hàm tổng hợp, hoặc phải xuất hiện trong GROUP BY!',
        why: 'Nếu không gom nhóm cột đó, SQL Server không thể biết chọn giá trị nào trong số nhiều dòng của nhóm để hiển thị.'
      },
      {
        mistake: 'Nghĩ rằng hàm AVG tự động tính cả các dòng có giá trị NULL.',
        correction: 'Hàm AVG chỉ tính trung bình cộng của các giá trị KHÁC NULL.',
        why: 'Nếu muốn tính cả NULL coi như 0 điểm, bắt buộc phải dùng hàm ISNULL(Diem, 0).'
      }
    ],
    sections: [
      {
        id: 'sec-5-4-1',
        title: '1. Năm Hàm Tổng Hợp Cơ Bản (Aggregate Functions)',
        content: `Các hàm tổng hợp thực hiện tính toán trên một tập hợp các giá trị và trả về một giá trị đơn duy nhất:
1. \`COUNT(*)\`: Đếm tổng số dòng (kể cả dòng có chứa giá trị NULL).
2. \`COUNT(TenCot)\`: Đếm số dòng có giá trị KHÁC NULL tại cột đó.
3. \`SUM(TenCot)\`: Tính tổng các giá trị số (bỏ qua NULL).
4. \`AVG(TenCot)\`: Tính trung bình cộng của các giá trị số (bỏ qua NULL).
5. \`MIN(TenCot)\` / \`MAX(TenCot)\`: Tìm giá trị nhỏ nhất / lớn nhất trong tập hợp.`,
        sqlExamples: [
          {
            title: 'Thống kê tổng quan kết quả học tập toàn trường',
            description: 'Áp dụng các hàm tổng hợp trực tiếp trên toàn bộ bảng KetQua',
            sql: `SELECT COUNT(*) AS TongSoLuotThi,
       ROUND(AVG(DiemTB), 2) AS DiemTrungBinhChung,
       MAX(DiemCK) AS DiemThiCaoNhat,
       MIN(DiemCK) AS DiemThiThapNhat
FROM KetQua;`,
            explanation: 'Toàn bộ bảng KetQua được xem như 1 nhóm duy nhất để tính toán các chỉ số thống kê.',
            expectedResult: 'Một dòng duy nhất chứa tổng lượt thi, điểm trung bình toàn trường, điểm cao nhất và thấp nhất.'
          }
        ],
        keyTakeaways: [
          'Hàm tổng hợp bỏ qua các ô NULL, ngoại trừ COUNT(*) đếm mọi dòng.',
          'Các hàm SUM, AVG chỉ áp dụng cho cột có kiểu dữ liệu số (INT, FLOAT, DECIMAL...).'
        ]
      },
      {
        id: 'sec-5-4-2',
        title: '2. Cú pháp Mệnh đề GROUP BY & Quy Tắc Vàng',
        content: `Mệnh đề \`GROUP BY\` dùng để phân chia các dòng trong bảng thành các nhóm nhỏ dựa trên giá trị giống nhau của một hoặc nhiều cột. Sau đó, các hàm tổng hợp sẽ được tính toán riêng biệt cho từng nhóm đó.

*Cú pháp chuẩn:*
\`\`\`sql
SELECT CotGomNhom, HAM_TONG_HOP(CotGiaTri) AS TenCotMoi
FROM TenBang
[WHERE DieuKienLocDong]
GROUP BY CotGomNhom;
\`\`\`

*Quy tắc vàng bất biến của GROUP BY:*
Mọi cột xuất hiện trong danh sách \`SELECT\` bắt buộc phải:
1. Nằm bên trong một hàm tổng hợp (\`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`), HOẶC
2. Phải được liệt kê tường minh trong mệnh đề \`GROUP BY\`.`,
        sqlExamples: [
          {
            title: 'Thống kê sĩ số học sinh theo từng mã lớp',
            description: 'Gom nhóm bảng HocSinh theo cột MaLop',
            sql: `SELECT MaLop, COUNT(MaHS) AS SiSoLop
FROM HocSinh
GROUP BY MaLop;`,
            explanation: 'Hệ quản trị gom tất cả các học sinh có cùng MaLop vào 1 nhóm và dùng hàm COUNT để đếm số học sinh của từng nhóm đó.',
            expectedResult: 'Danh sách các mã lớp cùng sĩ số học sinh tương ứng.'
          },
          {
            title: 'Thống kê điểm số theo từng môn học',
            description: 'Gom nhóm bảng KetQua theo MaMH và tính điểm trung bình, điểm cao nhất',
            sql: `SELECT MaMH,
       COUNT(MaHS) AS SoHocSinhDuThi,
       ROUND(AVG(DiemTB), 2) AS DiemTrungBinhMon,
       MAX(DiemCK) AS DiemThiCaoNhat
FROM KetQua
GROUP BY MaMH;`,
            explanation: 'Tính toán riêng biệt các chỉ số thống kê cho từng môn học (TIN, TOAN, LY, VAN...).',
            expectedResult: 'Báo cáo điểm thi chi tiết theo từng môn học.'
          }
        ],
        keyTakeaways: [
          'GROUP BY biến nhiều dòng chi tiết thành các dòng tổng hợp tóm tắt.',
          'Nếu cần lọc dữ liệu trước khi gom nhóm, sử dụng mệnh đề WHERE đặt trước GROUP BY.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh đếm tổng số lượng học sinh đang có trong bảng HocSinh.',
      level2: 'Viết câu lệnh thống kê số lượng học sinh theo từng giới tính (Nam, Nữ) trong trường.',
      level3: 'Thống kê số lượng học sinh của từng tỉnh/thành phố (DiaChi), hiển thị tên địa chỉ và số lượng học sinh tương ứng.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Tại sao câu lệnh sau đây bị báo lỗi SQL Server: SELECT MaLop, HoTen, COUNT(MaHS) FROM HocSinh GROUP BY MaLop; ?',
      sqlChallenge: 'SELECT MaLop, COUNT(MaHS) AS SiSo FROM HocSinh GROUP BY MaLop;',
      scenarioQuestion: 'Phòng đào tạo yêu cầu thống kê số môn học mà mỗi học sinh đã tham gia thi và điểm tổng kết cao nhất của bạn đó. Hãy viết câu lệnh SQL tương ứng.',
      teacherAnswerKey: 'Câu lệnh bị lỗi vì cột HoTen xuất hiện ở SELECT nhưng không nằm trong hàm tổng hợp và cũng không có trong GROUP BY; máy chủ không thể biết lấy tên của học sinh nào khi một lớp có nhiều bạn. Câu lệnh phòng đào tạo: SELECT MaHS, COUNT(MaMH) AS SoMonThi, MAX(DiemTB) AS DiemCaoNhat FROM KetQua GROUP BY MaHS;'
    }
  },

  // =========================================================================
  // BÀI 5.5: MỆNH ĐỀ HAVING CONDITION
  // =========================================================================
  {
    id: 'bai-5-5-having-loc-nhom',
    chapterId: 'chuong-5',
    chapterTitle: 'Chương 5: Thao tác & Truy vấn Dữ liệu SQL (DML & DQL)',
    title: 'Bài 5.5: Mệnh đề HAVING condition (Lọc Điều kiện Sau Gom nhóm)',
    description: 'Nắm vững mệnh đề HAVING để lọc các nhóm sau khi đã tổng hợp dữ liệu: phân biệt rạch ròi sự khác nhau giữa WHERE và HAVING, kết hợp cả hai mệnh đề trong cùng một truy vấn báo cáo.',
    level: 'trung-binh',
    competency: 'gom-nhom-thong-ke',
    estimatedMinutes: 25,
    prerequisites: [
      'Bài 5.4: Mệnh đề GROUP BY column_name & Các Hàm Tổng hợp'
    ],
    learningObjectives: [
      'Hiểu rõ mục đích và vai trò của mệnh đề HAVING trong câu lệnh SELECT.',
      'Phân biệt bản chất, đối tượng lọc và thời điểm thực thi giữa WHERE và HAVING.',
      'Viết điều kiện lọc trên kết quả của các hàm tổng hợp (COUNT, AVG, SUM...) bằng HAVING.',
      'Kết hợp linh hoạt cả WHERE (lọc dòng) và HAVING (lọc nhóm) trong một báo cáo thực tế.',
      'Nắm vững thứ tự thực thi 6 bước của câu lệnh truy vấn trong RDBMS.'
    ],
    relatedTable: 'HocSinh',
    suggestedPracticeSql: 'SELECT MaLop, COUNT(MaHS) AS SiSo FROM HocSinh GROUP BY MaLop HAVING COUNT(MaHS) >= 2;',
    commonMistakes: [
      {
        mistake: 'Dùng hàm tổng hợp bên trong mệnh đề WHERE (ví dụ: WHERE AVG(DiemTB) >= 8.0).',
        correction: 'Mọi điều kiện liên quan đến hàm tổng hợp BẮT BUỘC phải đặt trong mệnh đề HAVING!',
        why: 'WHERE thực thi trước khi gom nhóm, tại thời điểm đó giá trị trung bình AVG chưa hề tồn tại.'
      },
      {
        mistake: 'Dùng HAVING để lọc các điều kiện đơn giản của từng dòng (ví dụ: HAVING GioiTinh = N\'Nam\').',
        correction: 'Các điều kiện lọc dòng không chứa hàm tổng hợp nên đặt ở WHERE để lọc sớm, giúp truy vấn chạy nhanh hơn.',
        why: 'Lọc sớm ở WHERE làm giảm số lượng bản ghi cần gom nhóm, tiết kiệm RAM và CPU.'
      }
    ],
    sections: [
      {
        id: 'sec-5-5-1',
        title: '1. Cú pháp Mệnh đề HAVING & Bản chất Lọc Nhóm',
        content: `Mệnh đề \`HAVING\` được thiết kế riêng để lọc các nhóm bản ghi sau khi đã thực hiện phép gom nhóm bằng \`GROUP BY\`.

*Cú pháp chuẩn:*
\`\`\`sql
SELECT CotGomNhom, HAM_TONG_HOP(CotGiaTri) AS TenCotThongKe
FROM TenBang
[WHERE DieuKienLocDong]
GROUP BY CotGomNhom
HAVING DieuKienLocTrenNhom;
\`\`\`

*Ví dụ tư duy nghiệp vụ:*
- "Tìm những lớp học có sĩ số từ 2 học sinh trở lên." -> Phải đếm sĩ số của từng lớp xong rồi mới lọc được -> Dùng \`HAVING COUNT(MaHS) >= 2\`.
- "Tìm các môn học có điểm trung bình toàn trường lớn hơn hoặc bằng 8.5." -> Phải tính AVG xong mới lọc -> Dùng \`HAVING AVG(DiemTB) >= 8.5\`.`,
        sqlExamples: [
          {
            title: 'Lọc các lớp có sĩ số từ 2 học sinh trở lên',
            description: 'Sử dụng HAVING COUNT(MaHS) >= 2',
            sql: `SELECT MaLop, COUNT(MaHS) AS SiSoLop
FROM HocSinh
GROUP BY MaLop
HAVING COUNT(MaHS) >= 2;`,
            explanation: 'Hệ thống gom nhóm theo mã lớp, đếm số học sinh, sau đó chỉ giữ lại những nhóm có số lượng từ 2 trở lên.',
            expectedResult: 'Danh sách các lớp đông học sinh: 12A1, 11B1, 10C1.'
          }
        ],
        keyTakeaways: [
          'HAVING luôn đi kèm với GROUP BY và lọc trên kết quả của hàm tổng hợp.',
          'Nếu không có GROUP BY, toàn bộ bảng được coi là một nhóm duy nhất.'
        ]
      },
      {
        id: 'sec-5-5-2',
        title: '2. Bảng So Sánh Chi Tiết: WHERE vs. HAVING',
        content: `*So sánh trực quan giữa WHERE và HAVING:*
| Đặc điểm | Mệnh đề WHERE | Mệnh đề HAVING |
| :--- | :--- | :--- |
| Đối tượng lọc | Từng dòng dữ liệu riêng lẻ | Từng nhóm bản ghi sau khi gom |
| Thời điểm thực thi | Trước khi gom nhóm (Trước GROUP BY) | Sau khi gom nhóm (Sau GROUP BY) |
| Dùng hàm tổng hợp? | TUYỆT ĐỐI KHÔNG ĐƯỢC | BẮT BUỘC / KHUYẾN NGHỊ |
| Ảnh hưởng hiệu năng | Rất tốt (lọc bớt dữ liệu từ đầu) | Xử lý trên tập dữ liệu đã gom |

*Thứ tự thực thi 6 bước của SQL Server:*
1. FROM: Xác định bảng nguồn.
2. WHERE: Lọc bỏ các dòng không thỏa mãn.
3. GROUP BY: Gom các dòng còn lại thành các nhóm.
4. HAVING: Lọc bỏ các nhóm không thỏa mãn.
5. SELECT: Chiếu các cột và hàm tổng hợp ra kết quả.
6. ORDER BY: Sắp xếp tập kết quả cuối cùng.`,
        sqlExamples: [
          {
            title: 'Kết hợp cả WHERE và HAVING trong cùng một truy vấn',
            description: 'Chỉ xét các bài thi có điểm >= 8.0 và chỉ lấy môn có từ 2 bạn đạt loại này',
            sql: `SELECT MaMH,
       COUNT(MaHS) AS SoLuongHocSinhGioi,
       ROUND(AVG(DiemTB), 2) AS DiemTBMonHoc
FROM KetQua
WHERE DiemTB >= 8.0
GROUP BY MaMH
HAVING COUNT(MaHS) >= 2;`,
            explanation: 'WHERE lọc bỏ các bài thi dưới 8.0 ngay từ đầu. Sau đó GROUP BY gom theo môn học. Cuối cùng HAVING chỉ giữ lại các môn có từ 2 bài thi giỏi trở lên.',
            expectedResult: 'Danh sách các môn học có thành tích xuất sắc vượt trội.'
          }
        ],
        keyTakeaways: [
          'WHERE lọc dòng trước, HAVING lọc nhóm sau.',
          'Nắm vững thứ tự thực thi giúp bạn không bao giờ viết sai vị trí các mệnh đề.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh hiển thị các môn học có điểm trung bình thi cuối kỳ (AVG(DiemCK)) lớn hơn hoặc bằng 8.0.',
      level2: 'Tìm những địa chỉ (DiaChi) có từ 2 học sinh trở lên đang cư trú.',
      level3: 'Thống kê các lớp thuộc khối 12 có tổng số học sinh nữ lớn hơn hoặc bằng 1 bạn.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Tại sao mệnh đề WHERE lại không được phép chứa các hàm tổng hợp như SUM, COUNT, AVG?',
      sqlChallenge: 'SELECT MaMH, AVG(DiemTB) AS DTB FROM KetQua GROUP BY MaMH HAVING AVG(DiemTB) >= 8.5;',
      scenarioQuestion: 'Giám đốc đào tạo muốn lọc ra những giáo viên chủ nhiệm đang quản lý lớp học có tổng số sinh viên lớn hơn 30 bạn. Bạn sẽ dùng WHERE hay HAVING để lọc con số 30 này?',
      teacherAnswerKey: 'Vì WHERE được thực thi trước khi các dòng được gom nhóm; tại thời điểm đó các hàm tổng hợp chưa được tính toán nên SQL Server không có số liệu để so sánh. Với giám đốc đào tạo: Bắt buộc dùng HAVING COUNT(MaSV) > 30 vì con số 30 là kết quả đếm sau khi gom nhóm theo từng giáo viên.'
    }
  },

  // =========================================================================
  // BÀI 5.6: MỆNH ĐỀ ORDER BY COLUMN_NAME [ASC | DESC]
  // =========================================================================
  {
    id: 'bai-5-6-order-by-sap-xep',
    chapterId: 'chuong-5',
    chapterTitle: 'Chương 5: Thao tác & Truy vấn Dữ liệu SQL (DML & DQL)',
    title: 'Bài 5.6: Mệnh đề ORDER BY column_name [ASC | DESC]',
    description: 'Sắp xếp kết quả truy vấn chuyên nghiệp với mệnh đề ORDER BY: hiểu rõ cơ chế sắp xếp tăng dần ASC và giảm dần DESC, sắp xếp đa cột ưu tiên và kết hợp lấy Top bản ghi dẫn đầu.',
    level: 'co-ban',
    competency: 'truy-van-co-ban',
    estimatedMinutes: 20,
    prerequisites: [
      'Bài 5.1: Cú pháp câu lệnh SELECT * và SELECT cot1, col2,...',
      'Bài 5.2: Mệnh đề WHERE với Toán tử So sánh & Toán tử Logic'
    ],
    learningObjectives: [
      'Hiểu rõ vai trò và vị trí của mệnh đề ORDER BY trong câu lệnh SELECT.',
      'Phân biệt hai hướng sắp xếp: ASC (tăng dần) và DESC (giảm dần).',
      'Sắp xếp kết quả trên nhiều cột đồng thời theo thứ tự ưu tiên từ trái sang phải.',
      'Sắp xếp theo biểu thức tính toán hoặc bí danh cột (Alias).',
      'Hiểu quy tắc xử lý giá trị rỗng NULL khi sắp xếp trong SQL Server.',
      'Kết hợp mệnh đề ORDER BY với từ khóa TOP để tìm ra các bản ghi dẫn đầu.'
    ],
    relatedTable: 'KetQua',
    suggestedPracticeSql: 'SELECT MaHS, MaMH, DiemCK, DiemTB FROM KetQua ORDER BY DiemCK DESC, DiemTB DESC;',
    commonMistakes: [
      {
        mistake: 'Nghĩ rằng nếu không viết ORDER BY thì dữ liệu sẽ luôn tự động sắp xếp theo Khóa chính.',
        correction: 'Trong CSDL quan hệ, bảng là một tập hợp không có thứ tự tự nhiên. Nếu không có ORDER BY, thứ tự trả về là hoàn toàn ngẫu nhiên và không được bảo đảm!',
        why: 'Hệ quản trị có thể quét dữ liệu từ bộ nhớ đệm hoặc từ các luồng song song khiến thứ tự thay đổi bất cứ lúc nào.'
      },
      {
        mistake: 'Chỉ định từ khóa DESC ở cuối câu lệnh và nghĩ rằng nó áp dụng cho tất cả các cột được liệt kê.',
        correction: 'Từ khóa ASC hoặc DESC chỉ có tác dụng đối với cột đứng ngay trước nó. Nếu muốn sắp xếp giảm dần trên 2 cột, phải viết: ORDER BY Cot1 DESC, Cot2 DESC.',
        why: 'Nếu viết ORDER BY Cot1, Cot2 DESC thì Cot1 vẫn bị sắp xếp tăng dần (ASC mặc định)!'
      }
    ],
    sections: [
      {
        id: 'sec-5-6-1',
        title: '1. Cú pháp Mệnh đề ORDER BY & Hai Chế Độ Sắp Xếp (ASC / DESC)',
        content: `Mệnh đề \`ORDER BY\` được sử dụng để sắp xếp tập kết quả trả về theo một hoặc nhiều cột.

*Cú pháp chuẩn:*
\`\`\`sql
SELECT DanhSachCot
FROM TenBang
[WHERE DieuKien]
ORDER BY TenCot1 [ASC | DESC], TenCot2 [ASC | DESC];
\`\`\`

*Quy tắc sắp xếp:*
- ASC (Ascending - Tăng dần): Là chế độ mặc định nếu bạn không ghi rõ từ khóa.
  - Số: Từ nhỏ đến lớn (ví dụ: 1 -> 10).
  - Ký tự/Chuỗi: Theo thứ tự bảng chữ cái (A -> Z).
  - Ngày tháng: Từ ngày cũ nhất đến ngày gần đây nhất.
- DESC (Descending - Giảm dần):
  - Số: Từ lớn đến bé (ví dụ: 10 -> 1).
  - Ký tự/Chuỗi: Ngược bảng chữ cái (Z -> A).
  - Ngày tháng: Từ ngày mới nhất đến ngày xa xưa nhất.`,
        sqlExamples: [
          {
            title: 'Sắp xếp danh sách học sinh theo họ tên tăng dần (A -> Z)',
            description: 'Sử dụng ORDER BY HoTen ASC',
            sql: 'SELECT MaHS, HoTen, GioiTinh, NgaySinh, DiaChi FROM HocSinh ORDER BY HoTen ASC;',
            explanation: 'Danh sách học sinh được sắp xếp thứ tự bảng chữ cái theo họ tên.',
            expectedResult: 'Học sinh có tên chữ cái đầu (Bùi Thảo My, Đỗ Văn Khoa...) hiển thị trước.'
          },
          {
            title: 'Sắp xếp bảng điểm theo điểm cuối kỳ giảm dần (Cao nhất xuống thấp nhất)',
            description: 'Sử dụng ORDER BY DiemCK DESC',
            sql: 'SELECT MaHS, MaMH, DiemCK, DiemTB FROM KetQua ORDER BY DiemCK DESC;',
            explanation: 'Các bạn có điểm thi cuối kỳ xuất sắc (10.0, 9.5...) sẽ xuất hiện ở đầu bảng kết quả.',
            expectedResult: 'Bảng điểm được xếp hạng từ điểm cao nhất đến thấp nhất.'
          }
        ],
        keyTakeaways: [
          'ORDER BY luôn là mệnh đề được thực thi cuối cùng trong câu lệnh SELECT.',
          'Vì thực thi sau SELECT, bạn CÓ THỂ dùng bí danh (Alias) cột trong mệnh đề ORDER BY.'
        ]
      },
      {
        id: 'sec-5-6-2',
        title: '2. Sắp Xếp Nhiều Cột Ưu Tiên & Kết Hợp Lấy TOP Dẫn Đầu',
        content: `Khi nhiều dòng có giá trị trùng nhau ở cột thứ nhất, bạn cần chỉ định cột thứ hai để phân định thứ tự ưu tiên:
\`\`\`sql
ORDER BY DiemCK DESC, DiemTB DESC;
\`\`\`
*(Nghĩa là: Ưu tiên điểm cuối kỳ cao hơn đứng trước. Nếu hai bạn có cùng điểm cuối kỳ, bạn nào có điểm trung bình cao hơn sẽ đứng trước).*

*Kết hợp với từ khóa TOP n:*
Từ khóa \`TOP n\` chỉ thực sự có ý nghĩa khi kết hợp với \`ORDER BY\` để chọn ra n bản ghi cao nhất hoặc thấp nhất.`,
        sqlExamples: [
          {
            title: 'Tìm 3 kết quả thi môn Tin học xuất sắc nhất trường',
            description: 'Dùng TOP 3 kết hợp ORDER BY DiemTB DESC',
            sql: `SELECT TOP 3 MaHS, MaMH, DiemCK, DiemTB
FROM KetQua
WHERE MaMH = 'TIN'
ORDER BY DiemTB DESC;`,
            explanation: 'SQL Server lọc các bài thi môn TIN, sắp xếp giảm dần theo điểm trung bình và lấy đúng 3 kết quả dẫn đầu.',
            expectedResult: 'Top 3 bạn học sinh có điểm tổng kết môn Tin học cao nhất trường.'
          }
        ],
        keyTakeaways: [
          'Luôn dùng ORDER BY khi kết hợp với TOP để kết quả trả về có tính xác định.',
          'Trong MySQL/PostgreSQL/SQLite, thay vì TOP ở đầu, người ta dùng LIMIT n ở cuối câu lệnh.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh hiển thị danh sách học sinh sắp xếp theo ngày sinh (NgaySinh) từ người lớn tuổi nhất đến nhỏ tuổi nhất.',
      level2: 'Hiển thị danh sách các lớp học sắp xếp theo khối (Khoi) tăng dần, nếu cùng khối thì sắp xếp theo tên lớp (TenLop) từ A -> Z.',
      level3: 'Viết truy vấn tìm ra học sinh có điểm thi môn Toán học (MaMH = \'TOAN\') cao nhất trường.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Tại sao câu lệnh sau đây cho phép dùng bí danh cột DiemTongKet trong ORDER BY nhưng lại KHÔNG cho phép dùng trong WHERE: SELECT HoTen, (DiemTX + DiemCK)/2 AS DiemTongKet FROM KetQua WHERE DiemTongKet >= 8.0 ORDER BY DiemTongKet DESC; ?',
      sqlChallenge: 'SELECT TOP 5 MaHS, HoTen, NgaySinh FROM HocSinh ORDER BY NgaySinh DESC;',
      scenarioQuestion: 'Trang web thương mại điện tử cần hiển thị sản phẩm theo tiêu chí: "Còn hàng lên trước, sau đó sản phẩm nào bán chạy nhất đứng đầu, nếu bằng nhau thì giá rẻ hơn xếp trước". Hãy viết mệnh đề ORDER BY tương ứng.',
      teacherAnswerKey: 'Vì theo chu trình thực thi của RDBMS, mệnh đề WHERE chạy TRƯỚC mệnh đề SELECT (khi đó bí danh chưa tồn tại); còn ORDER BY chạy SAU SELECT (khi đó bí danh đã được tạo ra). Cho web bán hàng: ORDER BY ConHang DESC, SoLuongBan DESC, GiaBan ASC;'
    }
  },

  // =========================================================================
  // BÀI 5.7: KỸ THUẬT NỐI BẢNG INNER JOIN
  // =========================================================================
  {
    id: 'bai-5-7-inner-join-noi-trong',
    chapterId: 'chuong-5',
    chapterTitle: 'Chương 5: Thao tác & Truy vấn Dữ liệu SQL (DML & DQL)',
    title: 'Bài 5.7: Kỹ thuật Nối Bảng INNER JOIN',
    description: 'Chinh phục phép nối quan hệ cơ bản nhất trong CSDL: hiểu bản chất phép giao INNER JOIN, ghép nối các bảng qua Khóa ngoại - Khóa chính và thực thi truy vấn kết hợp nhiều bảng.',
    level: 'trung-binh',
    competency: 'join-subquery',
    estimatedMinutes: 30,
    prerequisites: [
      'Bài 2: Mô hình Dữ liệu Quan hệ & Ràng buộc Toàn vẹn (Khóa chính PK, Khóa ngoại FK)',
      'Bài 5.1: Cú pháp câu lệnh SELECT * và SELECT cot1, col2,...'
    ],
    learningObjectives: [
      'Hiểu rõ lý do tại sao cần nối bảng trong CSDL quan hệ đã chuẩn hóa.',
      'Nắm vững bản chất đại số quan hệ của phép nối trong (INNER JOIN - Phép giao).',
      'Sử dụng mệnh đề ON để xác định chính xác điều kiện ghép nối (PK = FK).',
      'Sử dụng bí danh bảng (Table Alias) để viết câu lệnh ngắn gọn, tránh xung đột tên cột.',
      'Thực hiện nối thành thạo từ 3 đến 4 bảng dữ liệu trong cùng một truy vấn.'
    ],
    relatedTable: 'HocSinh',
    suggestedPracticeSql: 'SELECT H.MaHS, H.HoTen, L.TenLop, L.GVCN FROM HocSinh H INNER JOIN LopHoc L ON H.MaLop = L.MaLop;',
    commonMistakes: [
      {
        mistake: 'Quên mệnh đề ON khi viết câu lệnh JOIN.',
        correction: 'Mỗi mệnh đề JOIN bắt buộc phải đi kèm với ON DieuKienGhepNoi.',
        why: 'Nếu thiếu ON, SQL Server sẽ thực hiện phép nhân Descartes (CROSS JOIN), ghép mọi dòng bảng A với mọi dòng bảng B tạo ra hàng nghìn kết quả rác sai lệch.'
      },
      {
        mistake: 'Truy vấn một cột có mặt ở cả hai bảng mà không chỉ định rõ tên bảng hoặc bí danh phía trước (Lỗi Ambiguous column name).',
        correction: 'Luôn viết tiền tố rõ ràng: BangA.MaLop hoặc H.MaLop thay vì chỉ viết mỗi MaLop.',
        why: 'Hệ quản trị không thể tự đoán bạn muốn lấy giá trị MaLop của bảng HocSinh hay của bảng LopHoc.'
      }
    ],
    sections: [
      {
        id: 'sec-5-7-1',
        title: '1. Cú pháp INNER JOIN & Nguyên Lý Nối Hai Bảng',
        content: `Trong CSDL quan hệ chuẩn hóa 3NF, dữ liệu bị chia nhỏ thành nhiều bảng để tránh dư thừa. \`INNER JOIN\` (hoặc viết tắt là \`JOIN\`) dùng để ghép nối các dòng của hai bảng lại với nhau dựa trên sự trùng khớp giá trị của một cột chung (thường là mối quan hệ Khóa ngoại trỏ đến Khóa chính).

*Cú pháp chuẩn nối 2 bảng:*
\`\`\`sql
SELECT BangA.Cot1, BangB.Cot2, ...
FROM BangA
INNER JOIN BangB ON BangA.KhoaNgoai = BangB.KhoaChinh;
\`\`\`

*Đặc điểm của INNER JOIN:*
- Chỉ giữ lại những dòng có sự trùng khớp giá trị ở CẢ HAI BẢNG.
- Nếu một dòng ở bảng A không tìm thấy dòng khớp ở bảng B (hoặc ngược lại), dòng đó sẽ bị LOẠI BỎ hoàn toàn khỏi tập kết quả.`,
        sqlExamples: [
          {
            title: 'Xem danh sách học sinh kèm tên lớp và giáo viên chủ nhiệm',
            description: 'Nối bảng HocSinh với bảng LopHoc thông qua cột MaLop',
            sql: `SELECT H.MaHS, H.HoTen, H.GioiTinh, L.TenLop, L.GVCN
FROM HocSinh H
INNER JOIN LopHoc L ON H.MaLop = L.MaLop;`,
            explanation: 'Hệ quản trị dùng mã lớp (MaLop) trong từng dòng của HocSinh để tra cứu sang bảng LopHoc và ghép lấy TenLop, GVCN tương ứng.',
            expectedResult: 'Danh sách học sinh có đầy đủ tên lớp và tên thầy cô chủ nhiệm.'
          }
        ],
        keyTakeaways: [
          'Dùng bí danh ngắn gọn (H cho HocSinh, L cho LopHoc) giúp câu lệnh gọn gàng, chuyên nghiệp.',
          'INNER JOIN là phép nối mặc định và được sử dụng nhiều nhất trong lập trình SQL.'
        ]
      },
      {
        id: 'sec-5-7-2',
        title: '2. Nối Ba Bảng Trở Lên & Truy Vấn Đa Bảng Nghiệp Vụ',
        content: `Khi thông tin cần hiển thị nằm rải rác trên nhiều bảng liên kết, ta nối tiếp các bảng bằng nhiều mệnh đề \`INNER JOIN\` liên tiếp:

*Cú pháp nối 3 bảng:*
\`\`\`sql
SELECT A.Cot, B.Cot, C.Cot
FROM BangA A
INNER JOIN BangB B ON A.Khoa = B.Khoa
INNER JOIN BangC C ON B.KhoaKhac = C.KhoaKhac;
\`\`\``,
        sqlExamples: [
          {
            title: 'Xem bảng điểm chi tiết kèm Họ tên học sinh và Tên môn học',
            description: 'Nối 3 bảng HocSinh, KetQua và MonHoc',
            sql: `SELECT H.MaHS, H.HoTen, M.TenMH,
       K.DiemTX, K.DiemGK, K.DiemCK, K.DiemTB
FROM HocSinh H
INNER JOIN KetQua K ON H.MaHS = K.MaHS
INNER JOIN MonHoc M ON K.MaMH = M.MaMH
ORDER BY H.HoTen ASC, M.TenMH ASC;`,
            explanation: 'Từ HocSinh nối với KetQua qua MaHS; từ KetQua nối tiếp với MonHoc qua MaMH.',
            expectedResult: 'Bảng điểm học sinh thể hiện rõ ràng tên người và tên môn học tiếng Việt.'
          }
        ],
        keyTakeaways: [
          'Để nối N bảng, thông thường bạn cần tối thiểu (N - 1) điều kiện nối trong mệnh đề ON.',
          'Thứ tự nối các bảng trong INNER JOIN không làm thay đổi kết quả dữ liệu.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh hiển thị MaHS, HoTen và PhongHoc của lớp mà học sinh đó đang theo học.',
      level2: 'Nối 3 bảng LopHoc, HocSinh, KetQua để hiển thị Tên lớp, Họ tên học sinh và Điểm trung bình môn Tin học.',
      level3: 'Viết truy vấn thống kê điểm trung bình chung của từng lớp học bằng cách kết hợp INNER JOIN và GROUP BY.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Điều gì xảy ra nếu bạn thực hiện INNER JOIN giữa bảng HocSinh và bảng LopHoc nhưng trong bảng HocSinh có một bạn chưa được xếp lớp (MaLop mang giá trị NULL)?',
      sqlChallenge: 'SELECT H.HoTen, L.TenLop FROM HocSinh H INNER JOIN LopHoc L ON H.MaLop = L.MaLop;',
      scenarioQuestion: 'Hệ thống website thương mại điện tử có 3 bảng: DonHang(MaDH, MaKH), KhachHang(MaKH, TenKH), ChiTietDonHang(MaDH, MaSP, SoLuong, DonGia). Hãy viết câu lệnh hiển thị: Mã đơn, Tên khách hàng, Mã sản phẩm và Thành tiền (SoLuong * DonGia).',
      teacherAnswerKey: 'Học sinh có MaLop là NULL sẽ bị loại bỏ hoàn toàn khỏi kết quả của phép INNER JOIN vì không tìm thấy dòng khớp nào trong bảng LopHoc. Câu lệnh thương mại điện tử: SELECT D.MaDH, K.TenKH, C.MaSP, (C.SoLuong * C.DonGia) AS ThanhTien FROM DonHang D INNER JOIN KhachHang K ON D.MaKH = K.MaKH INNER JOIN ChiTietDonHang C ON D.MaDH = C.MaDH;'
    }
  },

  // =========================================================================
  // BÀI 5.8: KỸ THUẬT NỐI NGOÀI OUTER JOINS (LEFT, RIGHT, FULL)
  // =========================================================================
  {
    id: 'bai-5-8-outer-joins-noi-ngoai',
    chapterId: 'chuong-5',
    chapterTitle: 'Chương 5: Thao tác & Truy vấn Dữ liệu SQL (DML & DQL)',
    title: 'Bài 5.8: Kỹ thuật Nối Ngoài OUTER JOINS (LEFT, RIGHT, FULL)',
    description: 'Nâng cao khả năng phân tích dữ liệu với phép nối ngoài OUTER JOINS: làm chủ LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN và ứng dụng quan trọng trong việc tìm kiếm dữ liệu mồ côi hoặc chưa phát sinh.',
    level: 'trung-binh',
    competency: 'join-subquery',
    estimatedMinutes: 30,
    prerequisites: [
      'Bài 5.7: Kỹ thuật Nối Bảng INNER JOIN'
    ],
    learningObjectives: [
      'Hiểu rõ bản chất và sự khác nhau căn bản giữa INNER JOIN và OUTER JOIN.',
      'Sử dụng thành thạo LEFT JOIN để giữ lại toàn bộ các dòng của bảng bên trái.',
      'Hiểu cơ chế điền giá trị NULL tự động cho các cột không tìm thấy dòng khớp.',
      'Sử dụng RIGHT JOIN và FULL OUTER JOIN trong các bài toán đối soát số liệu.',
      'Ứng dụng kỹ thuật LEFT JOIN kết hợp WHERE ... IS NULL để phát hiện các bản ghi chưa có dữ liệu phát sinh (Ví dụ: sinh viên chưa thi, lớp chưa có học sinh).'
    ],
    relatedTable: 'LopHoc',
    suggestedPracticeSql: 'SELECT L.MaLop, L.TenLop, COUNT(H.MaHS) AS SiSoHienTai FROM LopHoc L LEFT JOIN HocSinh H ON L.MaLop = H.MaLop GROUP BY L.MaLop, L.TenLop;',
    commonMistakes: [
      {
        mistake: 'Đặt điều kiện lọc của bảng bên phải vào mệnh đề WHERE khi dùng LEFT JOIN.',
        correction: 'Nếu muốn giữ toàn bộ bảng bên trái, điều kiện lọc của bảng bên phải nên đặt trực tiếp trong mệnh đề ON.',
        why: 'Nếu đặt ở WHERE (ví dụ: WHERE BangPhai.TrangThai = 1), các dòng có NULL sinh ra từ LEFT JOIN sẽ bị loại bỏ, biến phép LEFT JOIN thành INNER JOIN ngoài ý muốn!'
      },
      {
        mistake: 'Nhầm lẫn giữa LEFT JOIN và RIGHT JOIN.',
        correction: 'LEFT JOIN ưu tiên bảng đứng trước chữ JOIN; RIGHT JOIN ưu tiên bảng đứng sau chữ JOIN.',
        why: 'Trong thực tế, 95% lập trình viên sử dụng LEFT JOIN để câu lệnh dễ đọc theo chiều từ trái qua phải.'
      }
    ],
    sections: [
      {
        id: 'sec-5-8-1',
        title: '1. Cú pháp LEFT JOIN, RIGHT JOIN & FULL OUTER JOIN',
        content: `Trong thực tế, nhiều khi chúng ta muốn lấy TOÀN BỘ danh mục (kể cả những mục chưa có dữ liệu liên kết). Phép nối ngoài \`OUTER JOIN\` giải quyết xuất sắc bài toán này:

*Cú pháp chuẩn:*
\`\`\`sql
-- 1. LEFT OUTER JOIN (viết tắt: LEFT JOIN)
SELECT A.Cot, B.Cot
FROM BangA A
LEFT JOIN BangB B ON A.Khoa = B.Khoa;

-- 2. RIGHT OUTER JOIN (viết tắt: RIGHT JOIN)
SELECT A.Cot, B.Cot
FROM BangA A
RIGHT JOIN BangB B ON A.Khoa = B.Khoa;

-- 3. FULL OUTER JOIN
SELECT A.Cot, B.Cot
FROM BangA A
FULL OUTER JOIN BangB B ON A.Khoa = B.Khoa;
\`\`\`

*Ý nghĩa hoạt động:*
1. LEFT JOIN: Giữ lại toàn bộ mọi dòng của bảng bên trái (BangA). Nếu bảng bên phải (BangB) không có dòng tương ứng thì các cột của BangB sẽ tự động nhận giá trị \`NULL\`.
2. RIGHT JOIN: Tương tự LEFT JOIN nhưng ưu tiên giữ lại toàn bộ bảng bên phải (BangB).
3. FULL OUTER JOIN: Giữ lại toàn bộ mọi dòng của cả hai bảng; bên nào thiếu sẽ được điền \`NULL\`.`,
        sqlExamples: [
          {
            title: 'Thống kê sĩ số tất cả các lớp (kể cả lớp chưa có học sinh nào)',
            description: 'Dùng LEFT JOIN giữa LopHoc và HocSinh',
            sql: `SELECT L.MaLop, L.TenLop, L.GVCN,
       COUNT(H.MaHS) AS SiSoThucTe
FROM LopHoc L
LEFT JOIN HocSinh H ON L.MaLop = H.MaLop
GROUP BY L.MaLop, L.TenLop, L.GVCN;`,
            explanation: 'Dùng LEFT JOIN đảm bảo mọi lớp trong danh mục LopHoc đều xuất hiện. Lớp nào chưa có học sinh sẽ có sĩ số bằng 0 (nhờ COUNT(H.MaHS) bỏ qua NULL).',
            expectedResult: 'Danh sách đầy đủ mọi lớp học kèm sĩ số thực tế chính xác.'
          }
        ],
        keyTakeaways: [
          'Dùng INNER JOIN khi chỉ muốn lấy dữ liệu có mối liên kết đầy đủ.',
          'Dùng LEFT JOIN khi cần giữ trọn vẹn danh mục bảng chính bất kể bảng phụ có dữ liệu hay chưa.'
        ]
      },
      {
        id: 'sec-5-8-2',
        title: '2. Kỹ Thuật Kinh Điển: LEFT JOIN ... WHERE IS NULL',
        content: `Một trong những ứng dụng phổ biến và quyền lực nhất của \`LEFT JOIN\` là tìm kiếm các phần tử chưa từng phát sinh dữ liệu:
- Tìm khách hàng chưa từng mua đơn hàng nào.
- Tìm học sinh chưa dự thi môn học nào.
- Tìm sản phẩm tồn kho chưa từng bán được.

*Cơ chế:* Khi thực hiện LEFT JOIN, những dòng ở bảng trái không có liên kết ở bảng phải sẽ có khóa chính của bảng phải mang giá trị \`NULL\`. Thêm điều kiện \`WHERE BangPhai.KhoaChinh IS NULL\` sẽ lọc ra chính xác các bản ghi này!`,
        sqlExamples: [
          {
            title: 'Tìm những học sinh chưa có điểm thi môn nào trong bảng KetQua',
            description: 'Sử dụng LEFT JOIN kết hợp WHERE K.MaHS IS NULL',
            sql: `SELECT H.MaHS, H.HoTen, H.MaLop, H.DiaChi
FROM HocSinh H
LEFT JOIN KetQua K ON H.MaHS = K.MaHS
WHERE K.MaHS IS NULL;`,
            explanation: 'LEFT JOIN ghép toàn bộ học sinh với bảng điểm. Những bạn nào chưa thi môn nào sẽ có K.MaHS là NULL. Mệnh đề WHERE lọc đúng các bạn này.',
            expectedResult: 'Danh sách các bạn học sinh chưa có bất kỳ đầu điểm nào trong hệ thống.'
          }
        ],
        keyTakeaways: [
          'LEFT JOIN + WHERE IS NULL là giải pháp thay thế rất nhanh cho NOT IN hoặc NOT EXISTS.',
          'Đảm bảo cột kiểm tra IS NULL là Khóa chính (hoặc cột NOT NULL) của bảng bên phải.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh LEFT JOIN hiển thị tất cả các môn học và điểm thi của các môn đó (nếu môn chưa có ai thi thì hiển thị NULL).',
      level2: 'Viết truy vấn tìm ra các lớp học hiện tại chưa có bất kỳ học sinh nào đăng ký theo học.',
      level3: 'So sánh kết quả trả về giữa INNER JOIN và FULL OUTER JOIN khi nối bảng HocSinh và KetQua.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Tại sao khi tính sĩ số lớp học bằng câu lệnh LEFT JOIN giữa LopHoc và HocSinh, ta bắt buộc phải dùng COUNT(H.MaHS) thay vì COUNT(*) ?',
      sqlChallenge: 'SELECT L.TenLop, COUNT(H.MaHS) AS TongSoHS FROM LopHoc L LEFT JOIN HocSinh H ON L.MaLop = H.MaLop GROUP BY L.TenLop;',
      scenarioQuestion: 'Giám đốc kinh doanh muốn gửi email nhắc nhở tới tất cả những khách hàng đã đăng ký tài khoản nhưng sau 30 ngày vẫn chưa mua đơn hàng nào. Bạn thiết kế câu lệnh SQL như thế nào?',
      teacherAnswerKey: 'Vì COUNT(*) đếm cả dòng có chứa NULL (dòng của lớp trống vẫn tính là 1 dòng), dẫn đến lớp không có học sinh lại hiển thị sĩ số là 1! Trong khi COUNT(H.MaHS) bỏ qua ô NULL nên trả về sĩ số là 0 chính xác. Cho giám đốc: SELECT K.Email FROM KhachHang K LEFT JOIN DonHang D ON K.MaKH = D.MaKH WHERE D.MaDH IS NULL AND DATEDIFF(day, K.NgayTao, GETDATE()) >= 30;'
    }
  },

  // =========================================================================
  // BÀI 5.9: CÂU LỆNH INSERT THÊM DỮ LIỆU
  // =========================================================================
  {
    id: 'bai-5-9-insert-them-du-lieu',
    chapterId: 'chuong-5',
    chapterTitle: 'Chương 5: Thao tác & Truy vấn Dữ liệu SQL (DML & DQL)',
    title: 'Bài 5.9: Thao tác Thêm Dữ liệu với Lệnh INSERT',
    description: 'Làm chủ câu lệnh INSERT INTO trong nhóm ngôn ngữ thao tác dữ liệu (DML): chèn một dòng, chèn nhiều dòng đồng thời, chèn từ kết quả truy vấn SELECT và tuân thủ các ràng buộc toàn vẹn.',
    level: 'co-ban',
    competency: 'thao-tac-du-lieu-dml',
    estimatedMinutes: 20,
    prerequisites: [
      'Bài 4: Ngôn ngữ SQL & Thao tác Dữ liệu Cơ bản',
      'Bài 2: Ràng buộc Toàn vẹn (Khóa chính, Khóa ngoại, CHECK, DEFAULT)'
    ],
    learningObjectives: [
      'Hiểu rõ vai trò của lệnh INSERT trong nhóm ngôn ngữ thao tác dữ liệu DML.',
      'Viết thành thạo cú pháp INSERT INTO có chỉ định danh sách cột rõ ràng.',
      'Thực hiện chèn nhiều dòng dữ liệu đồng thời trong một câu lệnh duy nhất (Multi-row Insert).',
      'Sử dụng kỹ thuật INSERT INTO ... SELECT để sao chép dữ liệu giữa các bảng.',
      'Xử lý an toàn các lỗi vi phạm ràng buộc: Trùng khóa chính PK, vi phạm Khóa ngoại FK, vi phạm NOT NULL.'
    ],
    relatedTable: 'HocSinh',
    suggestedPracticeSql: "INSERT INTO HocSinh (MaHS, HoTen, GioiTinh, NgaySinh, DiaChi, MaLop) VALUES ('HS009', N'Đặng Phương Mai', N'Nữ', '2008-06-18', N'Hải Phòng', '12A1');",
    commonMistakes: [
      {
        mistake: 'Không khai báo danh sách cột trong lệnh INSERT (ví dụ: INSERT INTO HocSinh VALUES (...)).',
        correction: 'Luôn khai báo tường minh danh sách cột: INSERT INTO HocSinh (MaHS, HoTen, ...) VALUES (...).',
        why: 'Nếu sau này bảng được bổ sung thêm cột mới, câu lệnh không chỉ định cột sẽ bị lỗi ngay lập tức vì không khớp số lượng trường dữ liệu.'
      },
      {
        mistake: 'Chèn giá trị khóa ngoại trỏ tới một mã không tồn tại ở bảng cha.',
        correction: 'Dữ liệu khóa ngoại (ví dụ: MaLop = \'12A9\') bắt buộc phải đã tồn tại trong bảng LopHoc trước khi chèn vào bảng HocSinh.',
        why: 'Hệ quản trị sẽ chặn lại với lỗi Foreign Key Constraint Violation để bảo vệ tính toàn vẹn tham chiếu.'
      }
    ],
    sections: [
      {
        id: 'sec-5-9-1',
        title: '1. Cú pháp Lệnh INSERT INTO & Các Dạng Sử Dụng',
        content: `Lệnh \`INSERT INTO\` dùng để thêm một hoặc nhiều bản ghi mới vào một bảng trong cơ sở dữ liệu.

*Dạng 1: Chỉ định danh sách cột rõ ràng (Khuyên dùng trong dự án thực tế):*
\`\`\`sql
INSERT INTO TenBang (Cot1, Cot2, Cot3, ...)
VALUES (GiaTri1, GiaTri2, GiaTri3, ...);
\`\`\`

*Dạng 2: Chèn nhiều dòng đồng thời trong 1 câu lệnh (Multi-row Insert):*
\`\`\`sql
INSERT INTO TenBang (Cot1, Cot2)
VALUES 
  (GT1_Dong1, GT2_Dong1),
  (GT1_Dong2, GT2_Dong2),
  (GT1_Dong3, GT2_Dong3);
\`\`\`

*Dạng 3: Chèn từ kết quả của câu lệnh SELECT (Copy dữ liệu):*
\`\`\`sql
INSERT INTO BangLuuTru (Cot1, Cot2)
SELECT Cot1, Cot2
FROM BangNguon
WHERE DieuKien;
\`\`\`

*Quy tắc chuẩn khi chèn dữ liệu:*
- Cột số (INT, FLOAT): Điền số trực tiếp, không có dấu nháy (ví dụ: \`10\`, \`8.5\`).
- Cột chuỗi (VARCHAR): Bao bọc trong nháy đơn (ví dụ: \`'HS001'\`).
- Cột chuỗi tiếng Việt Unicode (NVARCHAR): Bắt buộc có tiền tố N phía trước (ví dụ: \`N'Nguyễn Văn A'\`).
- Cột ngày tháng (DATE): Định dạng chuẩn quốc tế \`'YYYY-MM-DD'\` (ví dụ: \`'2008-03-15'\`).`,
        sqlExamples: [
          {
            title: 'Thêm một học sinh mới vào lớp 12A1',
            description: 'Chèn một bản ghi đầy đủ thông tin vào bảng HocSinh',
            sql: `INSERT INTO HocSinh (MaHS, HoTen, GioiTinh, NgaySinh, DiaChi, MaLop)
VALUES ('HS009', N'Đặng Phương Mai', N'Nữ', '2008-06-18', N'Hải Phòng', '12A1');`,
            explanation: 'Bản ghi học sinh mới có mã HS009 được chèn an toàn vào bảng với đầy đủ các trường thông tin hợp lệ.',
            expectedResult: '1 dòng dữ liệu được thêm thành công vào bảng HocSinh.'
          },
          {
            title: 'Thêm một môn học mới có hệ số mặc định',
            description: 'Chèn môn Hóa học vào bảng MonHoc',
            sql: `INSERT INTO MonHoc (MaMH, TenMH, HeSo)
VALUES ('HOA', N'Hóa học', 2);`,
            explanation: 'Môn Hóa học được bổ sung vào danh mục các môn học của trường.',
            expectedResult: 'Danh mục môn học có thêm môn HOA với hệ số 2.'
          }
        ],
        keyTakeaways: [
          'Chỉ định danh sách cột giúp code bền vững trước những thay đổi cấu trúc bảng sau này.',
          'Các cột có DEFAULT hoặc cho phép NULL có thể được lược bớt trong danh sách cột khi INSERT.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh thêm môn học Giáo dục công dân (Mã: GDCD, Tên: Giáo dục kinh tế & pháp luật, Hệ số: 1) vào bảng MonHoc.',
      level2: 'Chèn một bản ghi điểm thi môn Tin học cho học sinh HS009 vừa tạo ở trên với các đầu điểm: DiemTX = 9.0, DiemGK = 8.5, DiemCK = 9.5, DiemTB = 9.1.',
      level3: 'Viết câu lệnh INSERT chèn đồng thời 2 phòng học mới vào bảng LopHoc trong cùng một câu lệnh duy nhất.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Khi thực hiện INSERT, điều gì sẽ xảy ra nếu bạn cố tình chèn một bản ghi có MaHS trùng với mã học sinh đã có sẵn trong bảng?',
      sqlChallenge: "INSERT INTO HocSinh (MaHS, HoTen, GioiTinh, NgaySinh, DiaChi, MaLop) VALUES ('HS010', N'Lê Quốc Bảo', N'Nam', '2008-09-12', N'Hà Nội', '12A2');",
      scenarioQuestion: 'Hệ thống đăng ký tài khoản người dùng yêu cầu mật khẩu phải được mã hóa trước khi lưu vào CSDL. Nếu câu lệnh INSERT bị lỗi do mất kết nối mạng giữa chừng, CSDL quan hệ xử lý thế nào để đảm bảo không bị lưu dữ liệu rác?',
      teacherAnswerKey: 'Hệ quản trị CSDL sẽ báo lỗi vi phạm ràng buộc Khóa chính (Primary Key Violation) và hủy bỏ toàn bộ câu lệnh INSERT đó. Cơ chế ACID của RDBMS sẽ tự động kích hoạt tính nguyên tử (Atomicity), Rollback lại trạng thái ban đầu để CSDL không bao giờ bị ghi dữ liệu dở dang.'
    }
  },

  // =========================================================================
  // BÀI 5.10: CÂU LỆNH UPDATE CẬP NHẬT DỮ LIỆU
  // =========================================================================
  {
    id: 'bai-5-10-update-cap-nhat-du-lieu',
    chapterId: 'chuong-5',
    chapterTitle: 'Chương 5: Thao tác & Truy vấn Dữ liệu SQL (DML & DQL)',
    title: 'Bài 5.10: Thao tác Cập nhật Dữ liệu với Lệnh UPDATE',
    description: 'Làm chủ câu lệnh UPDATE để chỉnh sửa dữ liệu: cú pháp chuẩn, cập nhật một hoặc nhiều cột đồng thời, tính toán giá trị mới và cảnh báo sống còn về mệnh đề WHERE trong cập nhật dữ liệu.',
    level: 'co-ban',
    competency: 'thao-tac-du-lieu-dml',
    estimatedMinutes: 20,
    prerequisites: [
      'Bài 5.2: Mệnh đề WHERE với Toán tử So sánh & Toán tử Logic',
      'Bài 5.9: Thao tác Thêm Dữ liệu với Lệnh INSERT'
    ],
    learningObjectives: [
      'Hiểu rõ chức năng của câu lệnh UPDATE trong việc sửa đổi bản ghi hiện có.',
      'Viết thành thạo cú pháp UPDATE ... SET ... WHERE ...',
      'Cập nhật đồng thời nhiều cột trong cùng một dòng dữ liệu.',
      'Sử dụng biểu thức tính toán để cập nhật dữ liệu tự động (ví dụ: tính lại Điểm trung bình).',
      'Hiểu rõ sự nguy hiểm chết người khi quên mệnh đề WHERE trong câu lệnh UPDATE.',
      'Áp dụng quy tắc kiểm tra trước với SELECT để đảm bảo an toàn tuyệt đối.'
    ],
    relatedTable: 'HocSinh',
    suggestedPracticeSql: "UPDATE HocSinh SET DiaChi = N'Hà Nội' WHERE MaHS = 'HS002';",
    commonMistakes: [
      {
        mistake: 'Chạy câu lệnh UPDATE mà KHÔNG CÓ mệnh đề WHERE.',
        correction: 'Bắt buộc luôn kiểm tra kỹ mệnh đề WHERE trước khi nhấn nút Thực thi (Execute).',
        why: 'Nếu thiếu WHERE, TOÀN BỘ tất cả các dòng trong bảng đều bị đổi sang giá trị mới! Đây là sự cố mất an toàn dữ liệu kinh điển nhất trong ngành CNTT.'
      },
      {
        mistake: 'Cập nhật giá trị cột Khóa ngoại sang một mã không tồn tại ở bảng cha.',
        correction: 'Đảm bảo giá trị mới hợp lệ và tuân thủ các ràng buộc toàn vẹn tham chiếu.',
        why: 'Hệ thống sẽ chặn câu lệnh với lỗi vi phạm ràng buộc Khóa ngoại (FK Constraint Violation).'
      }
    ],
    sections: [
      {
        id: 'sec-5-10-1',
        title: '1. Cú pháp Lệnh UPDATE & Cảnh Báo An Toàn Sống Còn',
        content: `Lệnh \`UPDATE\` dùng để sửa đổi dữ liệu của các bản ghi đã tồn tại trong bảng.

*Cú pháp chuẩn:*
\`\`\`sql
UPDATE TenBang
SET Cot1 = GiaTriMoi1,
    Cot2 = GiaTriMoi2,
    Cot3 = GiaTriMoi3
WHERE DieuKienXacDinhDongCanSua;
\`\`\`

*CẢNH BÁO AN TOÀN NGHỀ NGHIỆP:*
- Nếu có mệnh đề WHERE: Chỉ những dòng thỏa mãn điều kiện mới bị sửa đổi.
- NẾU THIẾU MỆNH ĐỀ WHERE: TOÀN BỘ tất cả các dòng trong bảng đều bị cập nhật theo giá trị mới!

*Quy tắc vàng của kỹ sư dữ liệu:*
Trước khi chạy lệnh UPDATE, hãy viết lệnh \`SELECT * FROM TenBang WHERE DieuKien\` để nhìn tận mắt xem chính xác những dòng nào sẽ bị tác động!`,
        sqlExamples: [
          {
            title: 'Cập nhật địa chỉ cư trú mới cho học sinh Trần Mai Linh (HS002)',
            description: 'Đổi địa chỉ từ Đà Nẵng sang Hà Nội có điều kiện WHERE MaHS = \'HS002\'',
            sql: `UPDATE HocSinh 
SET DiaChi = N'Hà Nội' 
WHERE MaHS = 'HS002';`,
            explanation: 'SQL Server chỉ tìm đúng học sinh có mã HS002 để cập nhật cột DiaChi thành Hà Nội; các học sinh khác hoàn toàn không bị ảnh hưởng.',
            expectedResult: '1 dòng dữ liệu được cập nhật thành công.'
          },
          {
            title: 'Cập nhật điểm thi và tính lại điểm trung bình môn',
            description: 'Sửa điểm cuối kỳ và cập nhật lại điểm tổng kết',
            sql: `UPDATE KetQua 
SET DiemCK = 9.5, 
    DiemTB = ROUND((DiemTX + DiemGK * 2 + 9.5 * 3) / 6.0, 1)
WHERE MaHS = 'HS003' AND MaMH = 'TIN';`,
            explanation: 'Cập nhật đồng thời điểm thi cuối kỳ mới và tính toán lại điểm trung bình tự động cho môn Tin học của bạn HS003.',
            expectedResult: 'Điểm thi của học sinh HS003 được cập nhật chính xác theo công thức mới.'
          }
        ],
        keyTakeaways: [
          'Luôn viết mệnh đề WHERE trước rồi mới gõ mệnh đề SET để không bao giờ bị quên WHERE.',
          'Trong môi trường Production, luôn bao bọc lệnh UPDATE trong TRANSACTION để có thể ROLLBACK nếu có sai sót.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh đổi tên phòng học của lớp 12A1 từ P.301 sang P.305 trong bảng LopHoc.',
      level2: 'Cập nhật họ tên của giáo viên chủ nhiệm lớp 11B1 thành "Thầy Lê Hoàng Minh".',
      level3: 'Cộng thêm 0.5 điểm vào điểm thi cuối kỳ (DiemCK) cho tất cả các học sinh đang có điểm thi môn Tin học dưới 8.0.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Một lập trình viên sơ ý chạy lệnh: UPDATE HocSinh SET DiaChi = N\'Hà Nội\'. Hậu quả gì xảy ra và làm thế nào để khắc phục?',
      sqlChallenge: "UPDATE KetQua SET DiemTB = 9.0 WHERE MaHS = 'HS001' AND MaMH = 'TOAN';",
      scenarioQuestion: 'Giả sử một sàn thương mại điện tử cần tăng giá 10% cho tất cả các sản phẩm thuộc danh mục "Điện tử" có giá dưới 5 triệu đồng. Bạn viết câu lệnh UPDATE như thế nào?',
      teacherAnswerKey: 'Hậu quả: Toàn bộ tất cả học sinh trong trường đều bị đổi địa chỉ thành Hà Nội vì câu lệnh thiếu mệnh đề WHERE. Khắc phục: Phải phục hồi lại dữ liệu từ bản sao lưu gần nhất (Backup Log) hoặc Rollback transaction nếu lệnh nằm trong giao dịch. Cho sàn TMĐT: UPDATE SanPham SET GiaBan = GiaBan * 1.10 WHERE DanhMuc = N\'Điện tử\' AND GiaBan < 5000000;'
    }
  },

  // =========================================================================
  // BÀI 5.11: CÂU LỆNH DELETE XÓA DỮ LIỆU
  // =========================================================================
  {
    id: 'bai-5-11-delete-xoa-du-lieu',
    chapterId: 'chuong-5',
    chapterTitle: 'Chương 5: Thao tác & Truy vấn Dữ liệu SQL (DML & DQL)',
    title: 'Bài 5.11: Thao tác Xóa Dữ liệu với Lệnh DELETE',
    description: 'Thao tác xóa dữ liệu an toàn với lệnh DELETE: cú pháp chọn lọc, kiểm soát ràng buộc toàn vẹn tham chiếu khóa ngoại, so sánh rạch ròi DELETE vs TRUNCATE vs DROP và quy tắc giao dịch an toàn.',
    level: 'co-ban',
    competency: 'thao-tac-du-lieu-dml',
    estimatedMinutes: 20,
    prerequisites: [
      'Bài 5.2: Mệnh đề WHERE với Toán tử So sánh & Toán tử Logic',
      'Bài 5.10: Thao tác Cập nhật Dữ liệu với Lệnh UPDATE'
    ],
    learningObjectives: [
      'Hiểu rõ chức năng của câu lệnh DELETE trong việc xóa bỏ các dòng dữ liệu không còn sử dụng.',
      'Viết thành thạo cú pháp DELETE FROM TenBang WHERE DieuKien.',
      'Nhận biết mối nguy hiểm khi xóa thiếu WHERE và cách phòng ngừa.',
      'Hiểu cơ chế bảo vệ của ràng buộc Khóa ngoại (không cho phép xóa bản ghi cha nếu còn bản ghi con tham chiếu).',
      'Phân biệt rõ ràng giữa 3 lệnh: DELETE, TRUNCATE TABLE và DROP TABLE.',
      'Sử dụng TRANSACTION để thử nghiệm xóa và hoàn tác an toàn.'
    ],
    relatedTable: 'KetQua',
    suggestedPracticeSql: "DELETE FROM KetQua WHERE MaHS = 'HS008' AND MaMH = 'TIN';",
    commonMistakes: [
      {
        mistake: 'Chạy lệnh DELETE FROM TenBang mà không có mệnh đề WHERE.',
        correction: 'Bắt buộc luôn chỉ định rõ điều kiện WHERE khi xóa dòng dữ liệu.',
        why: 'Lệnh DELETE thiếu WHERE sẽ xóa sạch toàn bộ mọi dòng dữ liệu có trong bảng!'
      },
      {
        mistake: 'Cố tình xóa một lớp học trong bảng LopHoc khi vẫn còn học sinh thuộc lớp đó trong bảng HocSinh.',
        correction: 'Phải xóa hoặc chuyển lớp cho các học sinh trước, sau đó mới được xóa lớp học ở bảng cha (trừ khi có cài đặt ON DELETE CASCADE).',
        why: 'Hệ quản trị sẽ báo lỗi vi phạm ràng buộc toàn vẹn tham chiếu (FK Constraint Violation).'
      }
    ],
    sections: [
      {
        id: 'sec-5-11-1',
        title: '1. Cú pháp Lệnh DELETE FROM & Ràng Buộc Khóa Ngoại',
        content: `Lệnh \`DELETE\` dùng để xóa một hoặc nhiều bản ghi ra khỏi một bảng dựa trên điều kiện lọc của mệnh đề \`WHERE\`.

*Cú pháp chuẩn:*
\`\`\`sql
DELETE FROM TenBang
WHERE DieuKienXacDinhDongCanXoa;
\`\`\`

*CẢNH BÁO AN TOÀN SỐNG CÒN:*
- Nếu có \`WHERE\`: Chỉ những dòng thỏa mãn điều kiện mới bị xóa.
- NẾU THIẾU WHERE: Toàn bộ dữ liệu của bảng sẽ bị xóa sạch!

*Ràng buộc Khóa Ngoại (Foreign Key):*
Nếu bạn cố xóa một dòng trong bảng cha (\`LopHoc\`), nhưng mã lớp đó đang được tham chiếu bởi các học sinh trong bảng con (\`HocSinh\`), SQL Server sẽ CHẶN hành động xóa lại để bảo vệ tính toàn vẹn. Bạn chỉ xóa được khi bảng con không còn dòng nào trỏ đến.`,
        sqlExamples: [
          {
            title: 'Xóa kết quả thi môn Tin học của học sinh HS008',
            description: 'Xóa có chọn lọc với điều kiện WHERE MaHS = \'HS008\' AND MaMH = \'TIN\'',
            sql: `DELETE FROM KetQua 
WHERE MaHS = 'HS008' AND MaMH = 'TIN';`,
            explanation: 'Hệ thống tìm đúng bản ghi điểm thi thỏa mãn cả 2 tiêu chí mã học sinh và mã môn học để xóa.',
            expectedResult: '1 bản ghi điểm thi bị xóa khỏi bảng KetQua.'
          }
        ],
        keyTakeaways: [
          'Khác với DROP TABLE, lệnh DELETE chỉ xóa dữ liệu bên trong, cấu trúc bảng vẫn được giữ nguyên vẹn.',
          'Hãy chạy SELECT trước khi DELETE để chắc chắn không xóa nhầm.'
        ]
      },
      {
        id: 'sec-5-11-2',
        title: '2. Phân Biệt Ba Lệnh: DELETE vs. TRUNCATE TABLE vs. DROP TABLE',
        content: `Trong SQL, có 3 câu lệnh đều mang ý nghĩa loại bỏ dữ liệu nhưng bản chất rất khác nhau:

| Tiêu chí | Lệnh DELETE | Lệnh TRUNCATE TABLE | Lệnh DROP TABLE |
| :--- | :--- | :--- | :--- |
| Nhóm lệnh | DML (Thao tác dữ liệu) | DDL (Định nghĩa dữ liệu) | DDL (Định nghĩa dữ liệu) |
| Có dùng WHERE? | CÓ (Xóa dòng có chọn lọc) | KHÔNG (Xóa sạch toàn bảng) | KHÔNG (Xóa luôn cả bảng) |
| Ghi Log giao dịch | Ghi log chi tiết từng dòng | Ghi log giải phóng trang nhớ | Ghi log xóa metadata |
| Tốc độ thực thi | Chậm hơn với bảng lớn | Rất nhanh | Cực nhanh |
| Reset Identity? | KHÔNG reset bộ đếm tự tăng | CÓ (Reset bộ đếm về 1) | Không còn bảng để xét |
| Số phận cấu trúc | Cấu trúc bảng VẪN CÒN | Cấu trúc bảng VẪN CÒN | Cấu trúc bảng BỊ XÓA MẤT |

*Kỹ thuật thử nghiệm xóa an toàn với Transaction:*
\`\`\`sql
BEGIN TRANSACTION;
  DELETE FROM KetQua WHERE DiemTB < 5.0;
  -- Kiểm tra: SELECT * FROM KetQua;
  -- Nếu chuẩn xác: COMMIT;
  -- Nếu phát hiện xóa nhầm: ROLLBACK;
\`\`\``,
        sqlExamples: [
          {
            title: 'Quy trình thử nghiệm xóa dữ liệu an toàn với Transaction',
            description: 'Bao bọc lệnh xóa trong BEGIN TRANSACTION và ROLLBACK',
            sql: `BEGIN TRANSACTION;
DELETE FROM KetQua WHERE DiemCK < 5.0;
-- Hoàn tác ngay lập tức để giữ an toàn dữ liệu:
ROLLBACK;`,
            explanation: 'Nhờ lệnh ROLLBACK, mọi thay đổi của lệnh DELETE được hoàn nguyên 100%, bảo vệ dữ liệu tuyệt đối.',
            expectedResult: 'Giao dịch hoàn tất và được rollback an toàn, không có dòng nào bị mất vĩnh viễn.'
          }
        ],
        keyTakeaways: [
          'TRUNCATE TABLE nhanh hơn DELETE rất nhiều khi cần làm sạch một bảng dữ liệu tạm.',
          'DROP TABLE xóa luôn cả bảng ra khỏi hệ thống CSDL.'
        ]
      }
    ],
    practiceLevels: {
      level1: 'Viết câu lệnh xóa môn học có mã MaMH = \'GDCD\' ra khỏi bảng MonHoc.',
      level2: 'Viết câu lệnh xóa tất cả các kết quả thi của học sinh có mã "HS009" trong bảng KetQua.',
      level3: 'Phân tích tại sao câu lệnh: DELETE FROM LopHoc WHERE MaLop = \'12A1\' lại bị hệ thống báo lỗi Foreign Key Constraint.'
    },
    endOfLessonReview: {
      summaryQuestion: 'Sự khác biệt căn bản nhất giữa DELETE FROM TenBang và TRUNCATE TABLE TenBang là gì?',
      sqlChallenge: "DELETE FROM KetQua WHERE MaHS = 'HS009';",
      scenarioQuestion: 'Một lập trình viên sơ ý chạy lệnh DELETE FROM DonHang trên cơ sở dữ liệu đang vận hành thực tế (Production). Bạn cần kích hoạt quy trình ứng phó khẩn cấp nào để cứu dữ liệu?',
      teacherAnswerKey: 'DELETE xóa từng dòng và ghi log đầy đủ, có thể dùng WHERE để lọc; TRUNCATE giải phóng các trang lưu trữ, xóa toàn bộ bảng cực nhanh, reset cột Identity và không hỗ trợ WHERE. Quy trình ứng cứu: (1) Khóa quyền ghi của ứng dụng ngay lập tức; (2) Trích xuất bản sao lưu Transaction Log gần nhất; (3) Khôi phục dữ liệu về thời điểm Point-in-time ngay trước giây phút câu lệnh DELETE được chạy.'
    }
  }
];
