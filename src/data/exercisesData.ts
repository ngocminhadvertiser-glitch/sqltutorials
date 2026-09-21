import { Exercise } from '../types';

export const EXERCISES_DATA: Exercise[] = [
  {
    id: 'ex-1-hocsinh-nu-hanoi',
    title: 'Bài tập 1: Lọc danh sách học sinh Nữ ở Hà Nội',
    level: 'co-ban',
    competency: 'truy-van-co-ban',
    databaseId: 'QuanLyHocSinh',
    description: 'Trường học chuẩn bị tổ chức ngày hội Nữ sinh thủ đô. Hãy viết câu lệnh SQL Server trích xuất danh sách tất cả học sinh có giới tính là Nữ và có địa chỉ tại Hà Nội.',
    requirements: [
      'Chọn các cột: MaHS, HoTen, GioiTinh, DiaChi từ bảng HocSinh.',
      "Điều kiện GioiTinh = N'Nữ' và DiaChi = N'Hà Nội'.",
      'Chú ý dùng tiền tố N cho chuỗi tiếng Việt Unicode.'
    ],
    initialSql: `-- Viết câu lệnh SQL Server của em ở đây:
SELECT MaHS, HoTen, GioiTinh, DiaChi 
FROM HocSinh 
WHERE 
`,
    solutionSql: `SELECT MaHS, HoTen, GioiTinh, DiaChi 
FROM HocSinh 
WHERE GioiTinh = N'Nữ' AND DiaChi = N'Hà Nội';`,
    explanation: 'Sử dụng toán tử logic AND để kết hợp hai điều kiện đồng thời. Chuỗi Unicode trong SQL Server phải có tiền tố N\'...\' để không bị lỗi font tiếng Việt.',
    hints: [
      "Sử dụng mệnh đề: WHERE GioiTinh = N'Nữ' AND DiaChi = N'Hà Nội'",
      "Kiểm tra lại xem đã đóng dấu nháy đơn ' cho chuỗi văn bản chưa nhé."
    ],
    points: 10
  },
  {
    id: 'ex-2-sap-xep-top-diem',
    title: 'Bài tập 2: Tuyên dương Top 3 học sinh điểm môn Tin cao nhất',
    level: 'co-ban',
    competency: 'truy-van-co-ban',
    databaseId: 'QuanLyHocSinh',
    description: 'Cuối học kỳ, nhà trường muốn khen thưởng 3 bạn có điểm thi tổng kết môn Tin học (MaMH = \'TIN\') cao nhất. Hãy viết câu lệnh hiển thị mã học sinh và điểm tổng kết của 3 bạn này theo thứ tự giảm dần.',
    requirements: [
      'Sử dụng từ khóa TOP 3 của SQL Server.',
      'Lấy 2 cột: MaHS, DiemTB từ bảng KetQua.',
      'Lọc môn học: MaMH = \'TIN\'.',
      'Sắp xếp DiemTB giảm dần (DESC).'
    ],
    initialSql: `-- Viết câu lệnh SQL Server tìm Top 3:
SELECT 
FROM KetQua
WHERE 
ORDER BY 
`,
    solutionSql: `SELECT TOP 3 MaHS, DiemTB 
FROM KetQua 
WHERE MaMH = 'TIN' 
ORDER BY DiemTB DESC;`,
    explanation: 'Mệnh đề ORDER BY DiemTB DESC sắp xếp điểm từ cao xuống thấp, và TOP 3 chỉ trích xuất đúng 3 dòng đầu tiên của tập kết quả.',
    hints: [
      "Cú pháp SQL Server: SELECT TOP 3 MaHS, DiemTB FROM KetQua ...",
      "Sắp xếp giảm dần dùng từ khóa DESC ở cuối: ORDER BY DiemTB DESC"
    ],
    points: 15
  },
  {
    id: 'ex-3-thong-ke-so-luong-lop',
    title: 'Bài tập 3: Thống kê số lượng học sinh theo từng lớp',
    level: 'trung-binh',
    competency: 'gom-nhom-thong-ke',
    databaseId: 'QuanLyHocSinh',
    description: 'Ban Giám hiệu cần báo cáo sĩ số của từng lớp học trong trường để phân bổ phòng học phù hợp. Hãy viết câu lệnh thống kê số lượng học sinh của mỗi mã lớp (MaLop).',
    requirements: [
      'Chọn cột MaLop và cột tính toán COUNT(*) đặt bí danh là SoLuongHS.',
      'Nguồn dữ liệu từ bảng HocSinh.',
      'Gom nhóm theo cột MaLop.'
    ],
    initialSql: `-- Thống kê số lượng học sinh theo từng lớp:
SELECT MaLop, COUNT(*) AS SoLuongHS
FROM HocSinh
-- Thêm mệnh đề gom nhóm ở đây:

`,
    solutionSql: `SELECT MaLop, COUNT(*) AS SoLuongHS 
FROM HocSinh 
GROUP BY MaLop;`,
    explanation: 'Khi dùng hàm tổng hợp COUNT(*) cùng với cột MaLop, ta bắt buộc phải khai báo GROUP BY MaLop để phân đoạn dữ liệu theo từng lớp.',
    hints: [
      "Thêm mệnh đề: GROUP BY MaLop vào cuối câu lệnh.",
      "Đặt bí danh cho hàm đếm bằng từ khóa: AS SoLuongHS"
    ],
    points: 20
  },
  {
    id: 'ex-4-inner-join-hocsinh-lop',
    title: 'Bài tập 4: Kết nối bảng xuất danh sách học sinh kèm Tên Lớp & GVCN',
    level: 'trung-binh',
    competency: 'join-subquery',
    databaseId: 'QuanLyHocSinh',
    description: 'Để in thẻ học sinh, phòng Đào tạo cần in thông tin đầy đủ gồm: Mã học sinh, Họ tên học sinh, Tên lớp học và Tên giáo viên chủ nhiệm (GVCN). Thông tin này nằm ở 2 bảng khác nhau là HocSinh và LopHoc.',
    requirements: [
      'Kết nối bảng HocSinh và LopHoc thông qua cột chung MaLop.',
      'Lấy các cột: hs.MaHS, hs.HoTen, lp.TenLop, lp.GVCN.',
      'Sử dụng phép nối INNER JOIN.'
    ],
    initialSql: `-- Viết câu lệnh kết nối hai bảng:
SELECT hs.MaHS, hs.HoTen, lp.TenLop, lp.GVCN
FROM HocSinh hs
-- Nối với bảng LopHoc lp qua điều kiện ON nào?

`,
    solutionSql: `SELECT hs.MaHS, hs.HoTen, lp.TenLop, lp.GVCN 
FROM HocSinh hs 
INNER JOIN LopHoc lp ON hs.MaLop = lp.MaLop;`,
    explanation: 'INNER JOIN ghép các dòng từ HocSinh và LopHoc thỏa mãn điều kiện hs.MaLop = lp.MaLop (Khóa ngoại trỏ đến Khóa chính).',
    hints: [
      "Cú pháp nối: INNER JOIN LopHoc lp ON hs.MaLop = lp.MaLop",
      "hs và lp là các bí danh viết tắt giúp code ngắn gọn và chuyên nghiệp."
    ],
    points: 25
  },
  {
    id: 'ex-5-having-diem-cao',
    title: 'Bài tập 5: Lọc các môn học có điểm trung bình từ 8.5 trở lên',
    level: 'nang-cao',
    competency: 'gom-nhom-thong-ke',
    databaseId: 'QuanLyHocSinh',
    description: 'Tổ chuyên môn muốn khen thưởng các bộ môn có thành tích xuất sắc. Hãy tính điểm trung bình của từng môn học (MaMH) và chỉ giữ lại những môn có điểm trung bình (AVG(DiemTB)) lớn hơn hoặc bằng 8.5.',
    requirements: [
      'Chọn cột MaMH và AVG(DiemTB) AS DiemTBMon từ bảng KetQua.',
      'Gom nhóm theo MaMH.',
      'Lọc nhóm với điều kiện HAVING AVG(DiemTB) >= 8.5.'
    ],
    initialSql: `-- Tính điểm trung bình theo môn và lọc với HAVING:
SELECT MaMH, AVG(DiemTB) AS DiemTBMon
FROM KetQua
GROUP BY MaMH
-- Lọc nhóm ở đây:

`,
    solutionSql: `SELECT MaMH, AVG(DiemTB) AS DiemTBMon 
FROM KetQua 
GROUP BY MaMH 
HAVING AVG(DiemTB) >= 8.5;`,
    explanation: 'Để lọc sau khi đã gom nhóm theo kết quả của hàm tổng hợp AVG, ta bắt buộc phải dùng HAVING thay vì WHERE.',
    hints: [
      "Nhớ rằng không được dùng WHERE AVG(...) mà phải dùng HAVING AVG(DiemTB) >= 8.5",
      "Mệnh đề HAVING luôn đứng ngay sau GROUP BY."
    ],
    points: 25
  },
  {
    id: 'ex-6-subquery-max-gia',
    title: 'Bài tập 6: Tìm sản phẩm có giá bán cao nhất siêu thị (Subquery)',
    level: 'nang-cao',
    competency: 'join-subquery',
    databaseId: 'QuanLyBanHang',
    description: 'Chuyển sang CSDL Quản lý Bán hàng. Hãy tìm thông tin sản phẩm đắt giá nhất trong siêu thị (gồm MaSP, TenSP, DonGia) bằng kỹ thuật truy vấn con lồng trong WHERE.',
    requirements: [
      'Chuyển ngữ cảnh sang CSDL [QuanLyBanHang].',
      'Chọn MaSP, TenSP, DonGia từ bảng SanPham.',
      'Điều kiện: DonGia = (SELECT MAX(DonGia) FROM SanPham).'
    ],
    initialSql: `-- Tìm sản phẩm đắt nhất dùng Subquery lồng nhau:
SELECT MaSP, TenSP, DonGia
FROM SanPham
WHERE DonGia = (
    -- Viết câu lệnh con tìm giá cao nhất tại đây:
    
);`,
    solutionSql: `SELECT MaSP, TenSP, DonGia 
FROM SanPham 
WHERE DonGia = (SELECT MAX(DonGia) FROM SanPham);`,
    explanation: 'Câu lệnh con (SELECT MAX(DonGia) FROM SanPham) trả về giá trị 650000. Câu lệnh ngoài tìm các sản phẩm có DonGia đúng bằng con số này.',
    hints: [
      "Câu truy vấn con: SELECT MAX(DonGia) FROM SanPham",
      "Bao câu truy vấn con trong cặp dấu ngoặc đơn (...)"
    ],
    points: 30
  },
  {
    id: 'ex-7-insert-hocsinh-moi',
    title: 'Bài tập 7: Thêm hồ sơ học sinh mới chuyển trường (INSERT INTO)',
    level: 'co-ban',
    competency: 'thao-tac-du-lieu-dml',
    category: 'dml',
    verificationTable: 'HocSinh',
    databaseId: 'QuanLyHocSinh',
    description: 'Trường vừa tiếp nhận một học sinh mới chuyển từ trường chuyên về, tên là "Lê Hải Đăng", sinh ngày "2008-11-20", giới tính "Nam", địa chỉ tại "Hà Nội", được xếp vào lớp "12A1" với mã học sinh "HS009". Hãy viết câu lệnh INSERT INTO để lưu hồ sơ này.',
    requirements: [
      'Bảng đích: HocSinh.',
      'Chỉ định các cột: MaHS, HoTen, GioiTinh, NgaySinh, DiaChi, MaLop.',
      "Giá trị tương ứng: 'HS009', N'Lê Hải Đăng', N'Nam', '2008-11-20', N'Hà Nội', '12A1'.",
      'Chú ý tiền tố N trước các chuỗi tiếng Việt có dấu.'
    ],
    initialSql: `-- Viết lệnh INSERT INTO để thêm học sinh mới:
INSERT INTO HocSinh (MaHS, HoTen, GioiTinh, NgaySinh, DiaChi, MaLop)
VALUES (
    
);`,
    solutionSql: `INSERT INTO HocSinh (MaHS, HoTen, GioiTinh, NgaySinh, DiaChi, MaLop)
VALUES ('HS009', N'Lê Hải Đăng', N'Nam', '2008-11-20', N'Hà Nội', '12A1');`,
    explanation: 'Câu lệnh INSERT INTO chèn một bản ghi mới với mã khóa chính HS009 vào bảng HocSinh. Nhờ chỉ định danh sách cột rõ ràng, câu lệnh thực thi an toàn và chuẩn xác.',
    hints: [
      "Cú pháp: VALUES ('HS009', N'Lê Hải Đăng', N'Nam', '2008-11-20', N'Hà Nội', '12A1')",
      "Hãy nhớ đặt các giá trị chuỗi văn bản trong cặp dấu nháy đơn ' '."
    ],
    points: 20
  },
  {
    id: 'ex-8-update-diem-phuc-khao',
    title: 'Bài tập 8: Cập nhật điểm phúc khảo môn Tin học (UPDATE)',
    level: 'trung-binh',
    competency: 'thao-tac-du-lieu-dml',
    category: 'dml',
    verificationTable: 'KetQua',
    databaseId: 'QuanLyHocSinh',
    description: 'Học sinh có mã "HS004" làm đơn phúc khảo bài thi cuối kỳ môn Tin học (MaMH = \'TIN\'). Sau khi chấm lại, Hội đồng thống nhất nâng điểm cuối kỳ DiemCK lên 9.0 và tính lại điểm trung bình DiemTB lên 8.5. Hãy viết câu lệnh UPDATE để sửa điểm cho học sinh này.',
    requirements: [
      'Bảng đích: KetQua.',
      'Cập nhật 2 cột: DiemCK = 9.0 và DiemTB = 8.5.',
      "Điều kiện lọc: MaHS = 'HS004' AND MaMH = 'TIN'.",
      'Cực kỳ quan trọng: Bắt buộc phải có mệnh đề WHERE để không làm thay đổi điểm của các bạn khác!'
    ],
    initialSql: `-- Viết lệnh UPDATE sửa điểm phúc khảo:
UPDATE KetQua
SET 
WHERE 
`,
    solutionSql: `UPDATE KetQua
SET DiemCK = 9.0, DiemTB = 8.5
WHERE MaHS = 'HS004' AND MaMH = 'TIN';`,
    explanation: 'Mệnh đề WHERE MaHS = \'HS004\' AND MaMH = \'TIN\' xác định duy nhất bản ghi cần cập nhật điểm mà không làm ảnh hưởng đến dữ liệu của các học sinh khác.',
    hints: [
      "Mệnh đề SET: SET DiemCK = 9.0, DiemTB = 8.5",
      "Mệnh đề WHERE: WHERE MaHS = 'HS004' AND MaMH = 'TIN'"
    ],
    points: 20
  },
  {
    id: 'ex-9-delete-ket-qua-loi',
    title: 'Bài tập 9: Xóa bản ghi điểm thi không hợp lệ (DELETE)',
    level: 'trung-binh',
    competency: 'thao-tac-du-lieu-dml',
    category: 'dml',
    verificationTable: 'KetQua',
    databaseId: 'QuanLyHocSinh',
    description: 'Trong kỳ thi vừa qua, do sơ suất nhập liệu, học sinh "HS006" bị nhập nhầm một dòng điểm môn Ngữ văn (MaMH = \'VAN\') trong khi bạn này được miễn thi. Hãy xóa dòng điểm này khỏi bảng KetQua.',
    requirements: [
      'Sử dụng câu lệnh DELETE FROM.',
      'Bảng đích: KetQua.',
      "Điều kiện lọc: MaHS = 'HS006' AND MaMH = 'VAN'."
    ],
    initialSql: `-- Viết lệnh DELETE để xóa dòng điểm nhầm:
DELETE FROM KetQua
WHERE 
`,
    solutionSql: `DELETE FROM KetQua
WHERE MaHS = 'HS006' AND MaMH = 'VAN';`,
    explanation: 'Câu lệnh DELETE FROM KetQua cùng điều kiện WHERE loại bỏ chính xác bản ghi môn Văn của học sinh HS006 mà vẫn bảo toàn các dòng dữ liệu khác.',
    hints: [
      "Cú pháp: DELETE FROM KetQua WHERE MaHS = 'HS006' AND MaMH = 'VAN'",
      "Đừng quên từ khóa FROM và điều kiện WHERE nhé!"
    ],
    points: 20
  },
  {
    id: 'ex-10-create-table-giaovien',
    title: 'Bài tập 10: Tạo bảng Quản lý Giáo viên mới (CREATE TABLE & CONSTRAINTS)',
    level: 'nang-cao',
    competency: 'dinh-nghia-du-lieu-ddl',
    category: 'ddl',
    verificationTable: 'GiaoVien',
    databaseId: 'QuanLyHocSinh',
    description: 'Nhà trường muốn xây dựng phân hệ quản lý danh sách cán bộ giáo viên. Hãy tạo bảng [GiaoVien] với các thuộc tính và ràng buộc toàn vẹn chuẩn: MaGV (VARCHAR(10) là khóa chính PRIMARY KEY), HoTen (NVARCHAR(50) NOT NULL), SoDienThoai (VARCHAR(15) UNIQUE), Luong (FLOAT CHECK (Luong >= 0)).',
    requirements: [
      'Tên bảng: GiaoVien.',
      'Cột MaGV: VARCHAR(10) PRIMARY KEY.',
      'Cột HoTen: NVARCHAR(50) NOT NULL.',
      'Cột SoDienThoai: VARCHAR(15) UNIQUE.',
      'Cột Luong: FLOAT CHECK (Luong >= 0).'
    ],
    initialSql: `-- Định nghĩa cấu trúc bảng GiaoVien với các ràng buộc:
CREATE TABLE GiaoVien (
    
);`,
    solutionSql: `CREATE TABLE GiaoVien (
    MaGV VARCHAR(10) PRIMARY KEY,
    HoTen NVARCHAR(50) NOT NULL,
    SoDienThoai VARCHAR(15) UNIQUE,
    Luong FLOAT CHECK (Luong >= 0)
);`,
    explanation: 'Câu lệnh CREATE TABLE định nghĩa bảng mới với 4 cột và 4 loại ràng buộc: Khóa chính PK, bắt buộc nhập NOT NULL, chống trùng lặp UNIQUE và ràng buộc miền giá trị CHECK.',
    hints: [
      "Khai báo: MaGV VARCHAR(10) PRIMARY KEY, HoTen NVARCHAR(50) NOT NULL, ...",
      "Ràng buộc CHECK viết sau kiểu FLOAT: Luong FLOAT CHECK (Luong >= 0)"
    ],
    points: 25
  },
  {
    id: 'ex-11-alter-table-add-col',
    title: 'Bài tập 11: Bổ sung số điện thoại cho bảng Học sinh (ALTER TABLE)',
    level: 'nang-cao',
    competency: 'dinh-nghia-du-lieu-ddl',
    category: 'ddl',
    verificationTable: 'HocSinh',
    databaseId: 'QuanLyHocSinh',
    description: 'Để phục vụ công tác liên lạc điện tử giữa nhà trường và gia đình, hãy viết câu lệnh ALTER TABLE để thêm một cột mới có tên [SoDienThoai] kiểu dữ liệu [VARCHAR(15)] vào bảng [HocSinh].',
    requirements: [
      'Sử dụng câu lệnh ALTER TABLE.',
      'Bảng cần sửa đổi: HocSinh.',
      'Thêm cột: SoDienThoai kiểu VARCHAR(15).'
    ],
    initialSql: `-- Bổ sung cột mới vào bảng HocSinh:
ALTER TABLE HocSinh
ADD 
`,
    solutionSql: `ALTER TABLE HocSinh ADD SoDienThoai VARCHAR(15);`,
    explanation: 'Lệnh ALTER TABLE HocSinh ADD SoDienThoai VARCHAR(15) mở rộng cấu trúc bảng để lưu trữ thêm số điện thoại mà không ảnh hưởng tới dữ liệu học sinh hiện có.',
    hints: [
      "Cú pháp: ALTER TABLE HocSinh ADD SoDienThoai VARCHAR(15);",
      "Trong SQL Server, em có thể dùng ADD hoặc ADD COLUMN đều hợp lệ."
    ],
    points: 20
  },
  {
    id: 'ex-12-drop-table-tam',
    title: 'Bài tập 12: Xóa an toàn bảng tạm thi đua (DROP TABLE)',
    level: 'nang-cao',
    competency: 'dinh-nghia-du-lieu-ddl',
    category: 'ddl',
    verificationTable: 'BangTamThiDua',
    databaseId: 'QuanLyHocSinh',
    description: 'Sau đợt tổng kết thi đua chào mừng ngày Nhà giáo Việt Nam, bảng tạm [BangTamThiDua] không còn cần thiết lưu trữ. Hãy viết câu lệnh DROP TABLE để xóa hoàn toàn bảng này khỏi CSDL.',
    requirements: [
      'Sử dụng câu lệnh DROP TABLE.',
      'Tên bảng: BangTamThiDua.',
      'Có thể sử dụng IF EXISTS để tăng tính an toàn trong SQL Server.'
    ],
    initialSql: `-- Viết lệnh xóa bảng tạm:
DROP TABLE 
`,
    solutionSql: `DROP TABLE IF EXISTS BangTamThiDua;`,
    explanation: 'Lệnh DROP TABLE IF EXISTS BangTamThiDua xóa sạch cấu trúc và vùng nhớ của bảng khỏi CSDL an toàn mà không sinh lỗi nếu bảng không tồn tại.',
    hints: [
      "Cú pháp: DROP TABLE IF EXISTS BangTamThiDua;",
      "Hoặc viết ngắn gọn: DROP TABLE BangTamThiDua;"
    ],
    points: 20
  }
];
