import { DatabaseModel } from '../types';

export const SAMPLE_DATABASES: DatabaseModel[] = [
  {
    id: 'QuanLyHocSinh',
    name: 'CSDL Quản lý Học sinh (THPT)',
    description: 'Cơ sở dữ liệu quản lý các lớp học, hồ sơ học sinh, môn học và bảng điểm học kỳ theo chương trình phổ thông.',
    tables: [
      {
        name: 'LopHoc',
        displayName: 'Lớp học',
        description: 'Lưu thông tin các lớp học, giáo viên chủ nhiệm và phòng học',
        columns: [
          { name: 'MaLop', type: 'VARCHAR(10)', isPrimaryKey: true, nullable: false, constraintDescription: 'Khóa chính (PK)' },
          { name: 'TenLop', type: 'NVARCHAR(50)', nullable: false, constraintDescription: 'Tên lớp không được để trống' },
          { name: 'Khoi', type: 'INT', nullable: false, constraintDescription: 'CHECK (Khoi IN (10, 11, 12))' },
          { name: 'GVCN', type: 'NVARCHAR(100)', nullable: false },
          { name: 'PhongHoc', type: 'VARCHAR(10)', nullable: true }
        ],
        initialData: [
          { MaLop: '12A1', TenLop: '12 Chuyên Tin', Khoi: 12, GVCN: 'Thầy Nguyễn Văn Nam', PhongHoc: 'P.301' },
          { MaLop: '12A2', TenLop: '12 Chuyên Toán', Khoi: 12, GVCN: 'Cô Trần Thị Thu', PhongHoc: 'P.302' },
          { MaLop: '11B1', TenLop: '11 Ban Tự Nhiên', Khoi: 11, GVCN: 'Thầy Lê Hoàng Long', PhongHoc: 'P.201' },
          { MaLop: '11B2', TenLop: '11 Ban Xã Hội', Khoi: 11, GVCN: 'Cô Phạm Thanh Hà', PhongHoc: 'P.202' },
          { MaLop: '10C1', TenLop: '10 Tin Học Ứng Dụng', Khoi: 10, GVCN: 'Thầy Vũ Minh Tuấn', PhongHoc: 'P.101' }
        ]
      },
      {
        name: 'HocSinh',
        displayName: 'Học sinh',
        description: 'Lưu danh sách học sinh toàn trường, có liên kết khóa ngoại tới LopHoc',
        columns: [
          { name: 'MaHS', type: 'VARCHAR(10)', isPrimaryKey: true, nullable: false, constraintDescription: 'Khóa chính (PK) định danh học sinh' },
          { name: 'HoTen', type: 'NVARCHAR(100)', nullable: false },
          { name: 'GioiTinh', type: 'NVARCHAR(10)', nullable: false, constraintDescription: "CHECK (GioiTinh IN (N'Nam', N'Nữ'))" },
          { name: 'NgaySinh', type: 'DATE', nullable: false },
          { name: 'DiaChi', type: 'NVARCHAR(200)', nullable: true },
          { name: 'MaLop', type: 'VARCHAR(10)', isForeignKey: true, referencesTable: 'LopHoc', referencesColumn: 'MaLop', nullable: false, constraintDescription: 'Khóa ngoại (FK) trỏ tới LopHoc(MaLop)' }
        ],
        initialData: [
          { MaHS: 'HS001', HoTen: 'Nguyễn Quốc Anh', GioiTinh: 'Nam', NgaySinh: '2008-03-15', DiaChi: 'Hà Nội', MaLop: '12A1' },
          { MaHS: 'HS002', HoTen: 'Trần Mai Linh', GioiTinh: 'Nữ', NgaySinh: '2008-07-22', DiaChi: 'Đà Nẵng', MaLop: '12A1' },
          { MaHS: 'HS003', HoTen: 'Lê Minh Tuấn', GioiTinh: 'Nam', NgaySinh: '2008-11-05', DiaChi: 'TP Hồ Chí Minh', MaLop: '12A2' },
          { MaHS: 'HS004', HoTen: 'Hoàng Thị Hoa', GioiTinh: 'Nữ', NgaySinh: '2009-02-18', DiaChi: 'Hải Phòng', MaLop: '11B1' },
          { MaHS: 'HS005', HoTen: 'Đỗ Văn Khoa', GioiTinh: 'Nam', NgaySinh: '2009-09-30', DiaChi: 'Cần Thơ', MaLop: '11B1' },
          { MaHS: 'HS006', HoTen: 'Phạm Hồng Nhung', GioiTinh: 'Nữ', NgaySinh: '2009-05-12', DiaChi: 'Hà Nội', MaLop: '11B2' },
          { MaHS: 'HS007', HoTen: 'Vũ Đức Thịnh', GioiTinh: 'Nam', NgaySinh: '2010-01-20', DiaChi: 'Quảng Ninh', MaLop: '10C1' },
          { MaHS: 'HS008', HoTen: 'Bùi Thảo My', GioiTinh: 'Nữ', NgaySinh: '2010-08-14', DiaChi: 'Nghệ An', MaLop: '10C1' }
        ]
      },
      {
        name: 'MonHoc',
        displayName: 'Môn học',
        description: 'Danh mục các môn học trong chương trình GDPT',
        columns: [
          { name: 'MaMH', type: 'VARCHAR(10)', isPrimaryKey: true, nullable: false, constraintDescription: 'Khóa chính (PK)' },
          { name: 'TenMH', type: 'NVARCHAR(50)', nullable: false, constraintDescription: 'UNIQUE (Tên môn không trùng lặp)' },
          { name: 'HeSo', type: 'INT', defaultValue: '1', nullable: false, constraintDescription: 'DEFAULT 1, CHECK (HeSo >= 1)' }
        ],
        initialData: [
          { MaMH: 'TIN', TenMH: 'Tin học (SQL Server)', HeSo: 2 },
          { MaMH: 'TOAN', TenMH: 'Toán học', HeSo: 2 },
          { MaMH: 'LY', TenMH: 'Vật lý', HeSo: 1 },
          { MaMH: 'VAN', TenMH: 'Ngữ văn', HeSo: 2 },
          { MaMH: 'ANH', TenMH: 'Tiếng Anh', HeSo: 2 }
        ]
      },
      {
        name: 'KetQua',
        displayName: 'Kết quả học tập',
        description: 'Điểm số học kỳ của học sinh/sinh viên cho từng môn học (Khóa chính kép MaHS + MaMH)',
        columns: [
          { name: 'MaHS', type: 'VARCHAR(10)', isPrimaryKey: true, isForeignKey: true, referencesTable: 'HocSinh', referencesColumn: 'MaHS', nullable: false, constraintDescription: 'Khóa chính kép & Khóa ngoại tới HocSinh' },
          { name: 'MaMH', type: 'VARCHAR(10)', isPrimaryKey: true, isForeignKey: true, referencesTable: 'MonHoc', referencesColumn: 'MaMH', nullable: false, constraintDescription: 'Khóa chính kép & Khóa ngoại tới MonHoc' },
          { name: 'DiemTX', type: 'FLOAT', nullable: true, constraintDescription: 'CHECK (DiemTX BETWEEN 0 AND 10)' },
          { name: 'DiemGK', type: 'FLOAT', nullable: true, constraintDescription: 'CHECK (DiemGK BETWEEN 0 AND 10)' },
          { name: 'DiemCK', type: 'FLOAT', nullable: true, constraintDescription: 'CHECK (DiemCK BETWEEN 0 AND 10)' },
          { name: 'DiemTB', type: 'FLOAT', nullable: true, constraintDescription: 'Điểm tổng kết môn' }
        ],
        initialData: [
          { MaHS: 'HS001', MaMH: 'TIN', DiemTX: 9.5, DiemGK: 9.0, DiemCK: 10.0, DiemTB: 9.6 },
          { MaHS: 'HS001', MaMH: 'TOAN', DiemTX: 8.5, DiemGK: 8.0, DiemCK: 9.0, DiemTB: 8.6 },
          { MaHS: 'HS002', MaMH: 'TIN', DiemTX: 9.0, DiemGK: 9.5, DiemCK: 9.0, DiemTB: 9.2 },
          { MaHS: 'HS002', MaMH: 'TOAN', DiemTX: 9.5, DiemGK: 9.0, DiemCK: 9.5, DiemTB: 9.3 },
          { MaHS: 'HS003', MaMH: 'TIN', DiemTX: 8.0, DiemGK: 7.5, DiemCK: 8.5, DiemTB: 8.1 },
          { MaHS: 'HS003', MaMH: 'LY', DiemTX: 8.5, DiemGK: 8.0, DiemCK: 8.5, DiemTB: 8.3 },
          { MaHS: 'HS004', MaMH: 'TIN', DiemTX: 7.0, DiemGK: 6.5, DiemCK: 7.5, DiemTB: 7.1 },
          { MaHS: 'HS005', MaMH: 'TIN', DiemTX: 8.5, DiemGK: 8.0, DiemCK: 8.5, DiemTB: 8.3 },
          { MaHS: 'HS006', MaMH: 'VAN', DiemTX: 9.0, DiemGK: 8.5, DiemCK: 9.0, DiemTB: 8.8 },
          { MaHS: 'HS007', MaMH: 'TIN', DiemTX: 9.0, DiemGK: 8.5, DiemCK: 9.0, DiemTB: 8.8 }
        ]
      },
      {
        name: 'GiangVien',
        displayName: 'Giảng viên',
        description: 'Thông tin đội ngũ cán bộ giảng viên bộ môn và cố vấn học tập',
        columns: [
          { name: 'MaGV', type: 'VARCHAR(10)', isPrimaryKey: true, nullable: false, constraintDescription: 'Khóa chính (PK)' },
          { name: 'HoTen', type: 'NVARCHAR(100)', nullable: false },
          { name: 'HocVi', type: 'NVARCHAR(50)', nullable: false, constraintDescription: "N'Thạc sĩ', N'Tiến sĩ', N'Kỹ sư'" },
          { name: 'SoDT', type: 'VARCHAR(15)', nullable: true, constraintDescription: 'UNIQUE' },
          { name: 'Khoa', type: 'NVARCHAR(100)', nullable: false }
        ],
        initialData: [
          { MaGV: 'GV01', HoTen: 'ThS. Nguyễn Văn Nam', HocVi: 'Thạc sĩ', SoDT: '0901234567', Khoa: 'Công nghệ thông tin' },
          { MaGV: 'GV02', HoTen: 'TS. Trần Thị Thu', HocVi: 'Tiến sĩ', SoDT: '0902345678', Khoa: 'Toán - Thống kê' },
          { MaGV: 'GV03', HoTen: 'ThS. Lê Hoàng Long', HocVi: 'Thạc sĩ', SoDT: '0903456789', Khoa: 'Khoa học cơ bản' },
          { MaGV: 'GV04', HoTen: 'TS. Vũ Minh Tuấn', HocVi: 'Tiến sĩ', SoDT: '0904567890', Khoa: 'Công nghệ thông tin' }
        ]
      },
      {
        name: 'DangKy',
        displayName: 'Đăng ký học phần',
        description: 'Ghi nhận sinh viên đăng ký môn học theo học kỳ và năm học',
        columns: [
          { name: 'MaHS', type: 'VARCHAR(10)', isPrimaryKey: true, isForeignKey: true, referencesTable: 'HocSinh', referencesColumn: 'MaHS', nullable: false },
          { name: 'MaMH', type: 'VARCHAR(10)', isPrimaryKey: true, isForeignKey: true, referencesTable: 'MonHoc', referencesColumn: 'MaMH', nullable: false },
          { name: 'HocKy', type: 'INT', nullable: false, constraintDescription: 'CHECK (HocKy IN (1, 2, 3))' },
          { name: 'NamHoc', type: 'VARCHAR(20)', nullable: false },
          { name: 'NgayDK', type: 'DATE', nullable: false }
        ],
        initialData: [
          { MaHS: 'HS001', MaMH: 'TIN', HocKy: 1, NamHoc: '2025-2026', NgayDK: '2025-08-20' },
          { MaHS: 'HS001', MaMH: 'TOAN', HocKy: 1, NamHoc: '2025-2026', NgayDK: '2025-08-20' },
          { MaHS: 'HS002', MaMH: 'TIN', HocKy: 1, NamHoc: '2025-2026', NgayDK: '2025-08-21' },
          { MaHS: 'HS002', MaMH: 'TOAN', HocKy: 1, NamHoc: '2025-2026', NgayDK: '2025-08-21' },
          { MaHS: 'HS003', MaMH: 'TIN', HocKy: 1, NamHoc: '2025-2026', NgayDK: '2025-08-22' },
          { MaHS: 'HS004', MaMH: 'TIN', HocKy: 1, NamHoc: '2025-2026', NgayDK: '2025-08-23' }
        ]
      }
    ]
  },
  {
    id: 'QuanLyBanHang',
    name: 'CSDL Quản lý Bán hàng / Siêu thị',
    description: 'Cơ sở dữ liệu mô phỏng hoạt động kinh doanh bán lẻ gồm khách hàng, sản phẩm và hóa đơn thanh toán.',
    tables: [
      {
        name: 'KhachHang',
        displayName: 'Khách hàng',
        description: 'Thông tin khách hàng mua sắm tại cửa hàng',
        columns: [
          { name: 'MaKH', type: 'VARCHAR(10)', isPrimaryKey: true, nullable: false, constraintDescription: 'Khóa chính (PK)' },
          { name: 'HoTen', type: 'NVARCHAR(100)', nullable: false },
          { name: 'SoDT', type: 'VARCHAR(15)', nullable: true, constraintDescription: 'UNIQUE (Số điện thoại không trùng)' },
          { name: 'DiaChi', type: 'NVARCHAR(150)', nullable: true }
        ],
        initialData: [
          { MaKH: 'KH01', HoTen: 'Lê Thanh Bình', SoDT: '0912345678', DiaChi: 'Hà Nội' },
          { MaKH: 'KH02', HoTen: 'Nguyễn Hương Giang', SoDT: '0987654321', DiaChi: 'Hải Phòng' },
          { MaKH: 'KH03', HoTen: 'Vũ Trọng Phụng', SoDT: '0905112233', DiaChi: 'Đà Nẵng' },
          { MaKH: 'KH04', HoTen: 'Đặng Kim Chi', SoDT: '0978998877', DiaChi: 'TP Hồ Chí Minh' }
        ]
      },
      {
        name: 'SanPham',
        displayName: 'Sản phẩm',
        description: 'Danh mục hàng hóa và đơn giá',
        columns: [
          { name: 'MaSP', type: 'VARCHAR(10)', isPrimaryKey: true, nullable: false, constraintDescription: 'Khóa chính (PK)' },
          { name: 'TenSP', type: 'NVARCHAR(100)', nullable: false },
          { name: 'DanhMuc', type: 'NVARCHAR(50)', nullable: false },
          { name: 'DonGia', type: 'DECIMAL(12,2)', nullable: false, constraintDescription: 'CHECK (DonGia > 0)' },
          { name: 'SoLuongTon', type: 'INT', nullable: false, defaultValue: '0', constraintDescription: 'CHECK (SoLuongTon >= 0)' }
        ],
        initialData: [
          { MaSP: 'SP01', TenSP: 'Bút bi Thiên Long', DanhMuc: 'Văn phòng phẩm', DonGia: 5000, SoLuongTon: 250 },
          { MaSP: 'SP02', TenSP: 'Vở kẻ ngang 200 trang', DanhMuc: 'Văn phòng phẩm', DonGia: 15000, SoLuongTon: 180 },
          { MaSP: 'SP03', TenSP: 'Máy tính Casio FX-580VN', DanhMuc: 'Dụng cụ học tập', DonGia: 650000, SoLuongTon: 35 },
          { MaSP: 'SP04', TenSP: 'Balo chống gù học sinh', DanhMuc: 'Thời trang học đường', DonGia: 320000, SoLuongTon: 40 },
          { MaSP: 'SP05', TenSP: 'USB Kingston 64GB 3.0', DanhMuc: 'Phụ kiện máy tính', DonGia: 140000, SoLuongTon: 60 }
        ]
      },
      {
        name: 'HoaDon',
        displayName: 'Hóa đơn',
        description: 'Thông tin các đơn hàng đã thực hiện',
        columns: [
          { name: 'MaHD', type: 'VARCHAR(10)', isPrimaryKey: true, nullable: false },
          { name: 'NgayLap', type: 'DATE', nullable: false },
          { name: 'MaKH', type: 'VARCHAR(10)', isForeignKey: true, referencesTable: 'KhachHang', referencesColumn: 'MaKH', nullable: false },
          { name: 'TongTien', type: 'DECIMAL(12,2)', nullable: false, defaultValue: '0' }
        ],
        initialData: [
          { MaHD: 'HD001', NgayLap: '2026-03-10', MaKH: 'KH01', TongTien: 665000 },
          { MaHD: 'HD002', NgayLap: '2026-03-11', MaKH: 'KH02', TongTien: 30000 },
          { MaHD: 'HD003', NgayLap: '2026-03-12', MaKH: 'KH01', TongTien: 460000 },
          { MaHD: 'HD004', NgayLap: '2026-03-15', MaKH: 'KH03', TongTien: 650000 }
        ]
      },
      {
        name: 'ChiTietHD',
        displayName: 'Chi tiết hóa đơn',
        description: 'Số lượng và giá bán từng sản phẩm trong hóa đơn',
        columns: [
          { name: 'MaHD', type: 'VARCHAR(10)', isPrimaryKey: true, isForeignKey: true, referencesTable: 'HoaDon', referencesColumn: 'MaHD', nullable: false },
          { name: 'MaSP', type: 'VARCHAR(10)', isPrimaryKey: true, isForeignKey: true, referencesTable: 'SanPham', referencesColumn: 'MaSP', nullable: false },
          { name: 'SoLuong', type: 'INT', nullable: false, constraintDescription: 'CHECK (SoLuong > 0)' },
          { name: 'DonGiaBan', type: 'DECIMAL(12,2)', nullable: false }
        ],
        initialData: [
          { MaHD: 'HD001', MaSP: 'SP03', SoLuong: 1, DonGiaBan: 650000 },
          { MaHD: 'HD001', MaSP: 'SP01', SoLuong: 3, DonGiaBan: 5000 },
          { MaHD: 'HD002', MaSP: 'SP02', SoLuong: 2, DonGiaBan: 15000 },
          { MaHD: 'HD003', MaSP: 'SP04', SoLuong: 1, DonGiaBan: 320000 },
          { MaHD: 'HD003', MaSP: 'SP05', SoLuong: 1, DonGiaBan: 140000 },
          { MaHD: 'HD004', MaSP: 'SP03', SoLuong: 1, DonGiaBan: 650000 }
        ]
      }
    ]
  },
  {
    id: 'QuanLyThuVien',
    name: 'CSDL Quản lý Thư viện Sinh viên',
    description: 'Quản lý kho sách, hồ sơ độc giả và phiếu mượn trả tài liệu học tập của trường cao đẳng/đại học.',
    tables: [
      {
        name: 'DocGia',
        displayName: 'Độc giả',
        description: 'Danh mục bạn đọc là sinh viên, giảng viên mượn sách',
        columns: [
          { name: 'MaDG', type: 'VARCHAR(10)', isPrimaryKey: true, nullable: false, constraintDescription: 'Khóa chính (PK)' },
          { name: 'HoTen', type: 'NVARCHAR(100)', nullable: false },
          { name: 'LoaiDG', type: 'NVARCHAR(20)', nullable: false, constraintDescription: "CHECK (LoaiDG IN (N'Sinh viên', N'Giảng viên'))" },
          { name: 'NgayHetHan', type: 'DATE', nullable: false }
        ],
        initialData: [
          { MaDG: 'DG001', HoTen: 'Nguyễn Quốc Anh', LoaiDG: 'Sinh viên', NgayHetHan: '2027-12-31' },
          { MaDG: 'DG002', HoTen: 'Trần Mai Linh', LoaiDG: 'Sinh viên', NgayHetHan: '2027-12-31' },
          { MaDG: 'DG003', HoTen: 'ThS. Nguyễn Văn Nam', LoaiDG: 'Giảng viên', NgayHetHan: '2029-12-31' }
        ]
      },
      {
        name: 'Sach',
        displayName: 'Đầu sách',
        description: 'Kho sách giáo trình, tài liệu tham khảo và chuyên khảo',
        columns: [
          { name: 'MaSach', type: 'VARCHAR(10)', isPrimaryKey: true, nullable: false },
          { name: 'TenSach', type: 'NVARCHAR(150)', nullable: false },
          { name: 'TacGia', type: 'NVARCHAR(100)', nullable: false },
          { name: 'SoLuong', type: 'INT', nullable: false, constraintDescription: 'CHECK (SoLuong >= 0)' }
        ],
        initialData: [
          { MaSach: 'S01', TenSach: 'Giáo trình Hệ quản trị CSDL SQL Server', TacGia: 'TS. Nguyễn Kim Anh', SoLuong: 20 },
          { MaSach: 'S02', TenSach: 'Nhập môn Lập trình Cơ sở dữ liệu', TacGia: 'ThS. Lê Hoàng', SoLuong: 15 },
          { MaSach: 'S03', TenSach: 'Phân tích & Thiết kế Hệ thống Thông tin', TacGia: 'PGS. Trần Văn Hùng', SoLuong: 10 }
        ]
      },
      {
        name: 'MuonTra',
        displayName: 'Mượn trả sách',
        description: 'Nhật ký mượn trả tài liệu học tập của độc giả',
        columns: [
          { name: 'MaPhieu', type: 'VARCHAR(10)', isPrimaryKey: true, nullable: false },
          { name: 'MaDG', type: 'VARCHAR(10)', isForeignKey: true, referencesTable: 'DocGia', referencesColumn: 'MaDG', nullable: false },
          { name: 'MaSach', type: 'VARCHAR(10)', isForeignKey: true, referencesTable: 'Sach', referencesColumn: 'MaSach', nullable: false },
          { name: 'NgayMuon', type: 'DATE', nullable: false },
          { name: 'NgayTra', type: 'DATE', nullable: true },
          { name: 'TrangThai', type: 'NVARCHAR(20)', nullable: false, constraintDescription: "N'Đang mượn', N'Đã trả'" }
        ],
        initialData: [
          { MaPhieu: 'P001', MaDG: 'DG001', MaSach: 'S01', NgayMuon: '2026-03-01', NgayTra: null, TrangThai: 'Đang mượn' },
          { MaPhieu: 'P002', MaDG: 'DG002', MaSach: 'S02', NgayMuon: '2026-03-02', NgayTra: '2026-03-10', TrangThai: 'Đã trả' },
          { MaPhieu: 'P003', MaDG: 'DG003', MaSach: 'S03', NgayMuon: '2026-03-05', NgayTra: null, TrangThai: 'Đang mượn' }
        ]
      }
    ]
  }
];
