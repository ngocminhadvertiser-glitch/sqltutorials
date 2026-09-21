import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-1',
    competency: 'csdl-quan-he',
    level: 'co-ban',
    question: 'Trong mô hình cơ sở dữ liệu quan hệ (RDBMS), thuật ngữ "Bản ghi" (Record / Tuple) tương ứng với khái niệm nào sau đây trong bảng?',
    options: [
      { id: 'a', text: 'Một cột (Column / Field) trong bảng', isCorrect: false },
      { id: 'b', text: 'Một dòng (Row) trong bảng', isCorrect: true },
      { id: 'c', text: 'Toàn bộ tên bảng', isCorrect: false },
      { id: 'd', text: 'Kiểu dữ liệu của bảng', isCorrect: false }
    ],
    explanation: 'Trong CSDL quan hệ, mỗi hàng (dòng / Row / Tuple / Record) đại diện cho một cá thể đối tượng cụ thể, còn mỗi cột (Column / Field / Attribute) đại diện cho một thuộc tính.',
    teacherTip: 'Thầy mẹo nhỏ: Dòng là cá thể, Cột là đặc điểm thuộc tính!'
  },
  {
    id: 'quiz-2',
    competency: 'thiet-ke-rang-buoc',
    level: 'co-ban',
    question: 'Khẳng định nào sau đây là ĐÚNG NHẤT về Khóa chính (PRIMARY KEY) trong Microsoft SQL Server?',
    options: [
      { id: 'a', text: 'Một bảng có thể có nhiều khóa chính độc lập với nhau', isCorrect: false },
      { id: 'b', text: 'Giá trị trong cột khóa chính có thể nhận giá trị NULL nếu chưa biết', isCorrect: false },
      { id: 'c', text: 'Mỗi bảng chỉ có duy nhất 1 khóa chính, và giá trị không được trùng lặp, không được NULL', isCorrect: true },
      { id: 'd', text: 'Khóa chính bắt buộc phải có kiểu dữ liệu là số nguyên INT', isCorrect: false }
    ],
    explanation: 'Một bảng chỉ có duy nhất một khóa chính (có thể gồm một hoặc nhiều cột kết hợp). Khóa chính bắt buộc phải duy nhất (Unique) và không được rỗng (NOT NULL).',
    teacherTip: 'Khóa chính có thể là chuỗi ký tự (như VARCHAR cho MaHS, MaLop), không bắt buộc phải là số!'
  },
  {
    id: 'quiz-3',
    competency: 'thiet-ke-rang-buoc',
    level: 'co-ban',
    question: 'Ràng buộc toàn vẹn nào dùng để giới hạn miền giá trị hợp lệ của một cột (ví dụ: Điểm kiểm tra phải từ 0 đến 10)?',
    options: [
      { id: 'a', text: 'Ràng buộc UNIQUE', isCorrect: false },
      { id: 'b', text: 'Ràng buộc CHECK', isCorrect: true },
      { id: 'c', text: 'Ràng buộc DEFAULT', isCorrect: false },
      { id: 'd', text: 'Ràng buộc PRIMARY KEY', isCorrect: false }
    ],
    explanation: 'Ràng buộc CHECK định nghĩa biểu thức logic kiểm tra điều kiện dữ liệu nhập vào (ví dụ: CHECK (Diem >= 0 AND Diem <= 10)).',
    teacherTip: 'CHECK kiểm tra điều kiện, DEFAULT gán giá trị mặc định, UNIQUE chống trùng lặp!'
  },
  {
    id: 'quiz-4',
    competency: 'truy-van-co-ban',
    level: 'co-ban',
    question: 'Trong SQL Server, ký tự đại diện nào trong mệnh đề LIKE tương ứng với "chuỗi ký tự bất kỳ có độ dài tùy ý (kể cả rỗng)"?',
    options: [
      { id: 'a', text: 'Dấu sao (*)', isCorrect: false },
      { id: 'b', text: 'Dấu gạch dưới (_)', isCorrect: false },
      { id: 'c', text: 'Dấu phần trăm (%)', isCorrect: true },
      { id: 'd', text: 'Dấu hỏi chấm (?)', isCorrect: false }
    ],
    explanation: 'Trong SQL chuẩn và SQL Server, ký tự % đại diện cho 0 hoặc nhiều ký tự bất kỳ. Ký tự _ đại diện cho đúng 1 ký tự.',
    teacherTip: 'Ví dụ LIKE N\'Nguyễn%\' sẽ tìm tất cả người mang họ Nguyễn bất kể tên đệm dài bao nhiêu.'
  },
  {
    id: 'quiz-5',
    competency: 'gom-nhom-thong-ke',
    level: 'trung-binh',
    question: 'Điểm khác biệt căn bản nhất giữa mệnh đề WHERE và mệnh đề HAVING là gì?',
    options: [
      { id: 'a', text: 'WHERE dùng để lọc nhóm dữ liệu, còn HAVING dùng để lọc từng bản ghi', isCorrect: false },
      { id: 'b', text: 'WHERE lọc các bản ghi trước khi gom nhóm, còn HAVING lọc các nhóm sau khi đã GROUP BY', isCorrect: true },
      { id: 'c', text: 'HAVING có thể viết mà không cần mệnh đề SELECT', isCorrect: false },
      { id: 'd', text: 'WHERE cho phép dùng các hàm tổng hợp như SUM, AVG, còn HAVING thì không', isCorrect: false }
    ],
    explanation: 'WHERE lọc trên từng dòng dữ liệu thô và không được chứa hàm tổng hợp. HAVING lọc trên dữ liệu nhóm đã tổng hợp sau mệnh đề GROUP BY.',
    teacherTip: 'Mẹo: Nhớ câu thần chú "WHERE trước gom nhóm, HAVING sau gom nhóm".'
  },
  {
    id: 'quiz-6',
    competency: 'join-subquery',
    level: 'nang-cao',
    question: 'Giả sử có bảng HocSinh (bên trái) và bảng KetQua (bên phải). Phép nối nào sẽ hiển thị TẤT CẢ học sinh, kể cả những học sinh chưa dự thi và chưa có điểm?',
    options: [
      { id: 'a', text: 'INNER JOIN', isCorrect: false },
      { id: 'b', text: 'LEFT OUTER JOIN (LEFT JOIN)', isCorrect: true },
      { id: 'c', text: 'RIGHT OUTER JOIN (RIGHT JOIN)', isCorrect: false },
      { id: 'd', text: 'CROSS JOIN', isCorrect: false }
    ],
    explanation: 'LEFT JOIN giữ lại toàn bộ các bản ghi của bảng bên trái (HocSinh). Nếu học sinh chưa có điểm trong bảng bên phải, các cột của KetQua sẽ tự động nhận giá trị NULL.',
    teacherTip: 'Khi muốn tìm đối tượng chưa có liên kết (chưa mua hàng, chưa có điểm), luôn nghĩ ngay đến LEFT JOIN kết hợp WHERE cột IS NULL!'
  },
  {
    id: 'quiz-7',
    competency: 'thao-tac-du-lieu-dml',
    level: 'co-ban',
    question: 'Điều gì sẽ xảy ra nếu một câu lệnh UPDATE trong SQL Server được thực thi mà KHÔNG CÓ mệnh đề WHERE?',
    options: [
      { id: 'a', text: 'SQL Server báo lỗi cú pháp và từ chối chạy lệnh', isCorrect: false },
      { id: 'b', text: 'Chỉ có dòng đầu tiên trong bảng bị cập nhật giá trị mới', isCorrect: false },
      { id: 'c', text: 'Tất cả mọi dòng trong bảng đều bị cập nhật theo giá trị mới', isCorrect: true },
      { id: 'd', text: 'Chỉ các dòng có giá trị NULL mới được cập nhật', isCorrect: false }
    ],
    explanation: 'Nếu không có điều kiện lọc WHERE, lệnh UPDATE sẽ áp dụng phép gán dữ liệu mới lên 100% các dòng trong bảng. Đây là một trong những lỗi nguy hiểm nhất cần hết sức cảnh giác.',
    teacherTip: 'Quy tắc an toàn của lập trình viên CSDL: Luôn viết WHERE trước khi viết SET trong lệnh UPDATE!'
  },
  {
    id: 'quiz-8',
    competency: 'thao-tac-du-lieu-dml',
    level: 'trung-binh',
    question: 'Khi thực hiện câu lệnh INSERT INTO HocSinh (MaHS, HoTen) VALUES (\'HS001\', N\'Trần Văn A\'), nếu trong bảng đã có học sinh mã \'HS001\' (MaHS là PRIMARY KEY), SQL Server sẽ phản hồi như thế nào?',
    options: [
      { id: 'a', text: 'Ghi đè thông tin mới lên học sinh cũ', isCorrect: false },
      { id: 'b', text: 'Báo lỗi vi phạm ràng buộc Khóa chính (Violation of PRIMARY KEY constraint)', isCorrect: true },
      { id: 'c', text: 'Tự động tạo mã HS002 cho học sinh mới', isCorrect: false },
      { id: 'd', text: 'Chèn thêm bản ghi bình thường thành 2 học sinh cùng mã', isCorrect: false }
    ],
    explanation: 'Khóa chính PRIMARY KEY bắt buộc tính duy nhất (UNIQUE). Hệ thống sẽ chặn ngay lập tức và ném lỗi vi phạm ràng buộc toàn vẹn.',
    teacherTip: 'Thầy lưu ý: RDBMS bảo vệ dữ liệu tự động ở tầng lõi, không cho phép khóa chính trùng lặp.'
  },
  {
    id: 'quiz-9',
    competency: 'dinh-nghia-du-lieu-ddl',
    level: 'co-ban',
    question: 'Câu lệnh nào sau đây là cú pháp CHUẨN trong SQL Server để thêm một cột mới có tên [DiemCong] kiểu số thực FLOAT vào bảng [KetQua]?',
    options: [
      { id: 'a', text: 'UPDATE TABLE KetQua ADD DiemCong FLOAT;', isCorrect: false },
      { id: 'b', text: 'ALTER TABLE KetQua ADD DiemCong FLOAT;', isCorrect: true },
      { id: 'c', text: 'INSERT INTO KetQua (DiemCong) VALUES (FLOAT);', isCorrect: false },
      { id: 'd', text: 'MODIFY TABLE KetQua NEW COLUMN DiemCong FLOAT;', isCorrect: false }
    ],
    explanation: 'Để sửa đổi cấu trúc bảng trong SQL Server, ta dùng lệnh DDL ALTER TABLE TenBang ADD TenCot KieuDuLieu.',
    teacherTip: 'Nhớ phân biệt: DDL (CREATE, ALTER, DROP) tác động lên cấu trúc; DML (INSERT, UPDATE, DELETE) tác động lên dữ liệu.'
  },
  {
    id: 'quiz-10',
    competency: 'dinh-nghia-du-lieu-ddl',
    level: 'nang-cao',
    question: 'Phát biểu nào sau đây phân biệt ĐÚNG NHẤT giữa hai câu lệnh: DELETE FROM LopHoc và DROP TABLE LopHoc?',
    options: [
      { id: 'a', text: 'DELETE xóa cấu trúc bảng; DROP chỉ xóa các dòng dữ liệu', isCorrect: false },
      { id: 'b', text: 'Cả hai câu lệnh hoàn toàn giống hệt nhau về tác động', isCorrect: false },
      { id: 'c', text: 'DELETE xóa tất cả các dòng dữ liệu nhưng giữ lại bảng; DROP TABLE xóa vĩnh viễn cả cấu trúc bảng lẫn dữ liệu', isCorrect: true },
      { id: 'd', text: 'DROP TABLE chỉ áp dụng được cho bảng không có khóa chính', isCorrect: false }
    ],
    explanation: 'DELETE FROM là lệnh DML chỉ dọn sạch các dòng dữ liệu, bảng vẫn còn tồn tại để nhận dữ liệu mới. DROP TABLE là lệnh DDL hủy hoàn toàn định nghĩa bảng khỏi CSDL.',
    teacherTip: 'DELETE = dọn sạch đồ trong phòng; DROP TABLE = phá hủy cả căn phòng!'
  }
];
