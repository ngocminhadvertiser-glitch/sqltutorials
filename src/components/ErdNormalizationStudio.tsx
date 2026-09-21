import React, { useState } from 'react';
import { 
  Layers, 
  Table, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Database, 
  Key, 
  Sparkles,
  Play,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';

interface ErdNormalizationStudioProps {
  onRunSqlInPlayground: (sql: string) => void;
}

export const ErdNormalizationStudio: React.FC<ErdNormalizationStudioProps> = ({
  onRunSqlInPlayground,
}) => {
  const [activeTab, setActiveTab] = useState<'erd' | 'normalization' | 'acid' | 'sqli'>('erd');
  
  // ERD State
  const [selectedEntity, setSelectedEntity] = useState<string>('SinhVien');
  
  // Normalization State
  const [normStep, setNormStep] = useState<'unnormalized' | '1nf' | '2nf' | '3nf'>('unnormalized');
  
  // ACID Simulator State
  const [acidBalanceA, setAcidBalanceA] = useState<number>(1000000);
  const [acidBalanceB, setAcidBalanceB] = useState<number>(500000);
  const [acidAmount, setAcidAmount] = useState<number>(200000);
  const [acidSimState, setAcidSimState] = useState<'idle' | 'started' | 'step1' | 'step2' | 'committed' | 'rolledback'>('idle');
  const [acidLogs, setAcidLogs] = useState<string[]>([]);

  // SQLi Simulator State
  const [userInput, setUserInput] = useState<string>("' OR '1'='1");
  const [sqliMode, setSqliMode] = useState<'vulnerable' | 'parameterized'>('vulnerable');

  // Entities Data
  const entities = [
    {
      id: 'LopHoc',
      name: 'LopHoc (Lớp Học)',
      category: 'Thực thể Độc lập (Bên 1)',
      description: 'Quản lý thông tin lớp sinh viên, cố vấn học tập.',
      pk: 'MaLop',
      columns: [
        { name: 'MaLop', type: 'VARCHAR(10)', role: 'PK', desc: 'Mã lớp định danh' },
        { name: 'TenLop', type: 'NVARCHAR(50)', role: 'NOT NULL', desc: 'Tên hiển thị của lớp' },
        { name: 'GVCN', type: 'NVARCHAR(100)', role: 'NOT NULL', desc: 'Giảng viên chủ nhiệm' }
      ],
      relationships: [
        { target: 'SinhVien', type: '1 - N', desc: 'Một lớp có nhiều sinh viên (1 - N)' }
      ]
    },
    {
      id: 'SinhVien',
      name: 'SinhVien (Sinh Viên / Học Sinh)',
      category: 'Thực thể Cốt lõi',
      description: 'Lưu trữ hồ sơ cá nhân của người học.',
      pk: 'MaHS',
      columns: [
        { name: 'MaHS', type: 'VARCHAR(10)', role: 'PK', desc: 'Mã số sinh viên/học sinh' },
        { name: 'HoTen', type: 'NVARCHAR(100)', role: 'NOT NULL', desc: 'Họ và tên đầy đủ' },
        { name: 'GioiTinh', type: 'NVARCHAR(5)', role: 'CHECK (Nam/Nữ)', desc: 'Giới tính' },
        { name: 'NgaySinh', type: 'DATE', role: 'NOT NULL', desc: 'Ngày tháng năm sinh' },
        { name: 'DiaChi', type: 'NVARCHAR(200)', role: '', desc: 'Quê quán / Địa chỉ' },
        { name: 'MaLop', type: 'VARCHAR(10)', role: 'FK', desc: 'Khóa ngoại trỏ sang LopHoc(MaLop)' }
      ],
      relationships: [
        { target: 'LopHoc', type: 'N - 1', desc: 'Mỗi sinh viên thuộc về đúng 1 Lớp học' },
        { target: 'KetQua', type: '1 - N', desc: 'Một sinh viên có nhiều kết quả điểm môn học' },
        { target: 'DangKy', type: '1 - N', desc: 'Một sinh viên đăng ký nhiều học phần' }
      ]
    },
    {
      id: 'MonHoc',
      name: 'MonHoc (Môn Học / Học Phần)',
      category: 'Thực thể Danh mục',
      description: 'Danh mục các môn học trong chương trình đào tạo.',
      pk: 'MaMH',
      columns: [
        { name: 'MaMH', type: 'VARCHAR(10)', role: 'PK', desc: 'Mã định danh môn học' },
        { name: 'TenMH', type: 'NVARCHAR(100)', role: 'UNIQUE', desc: 'Tên môn học không trùng' },
        { name: 'HeSo', type: 'INT', role: 'DEFAULT 1', desc: 'Hệ số tính điểm / Số tín chỉ' }
      ],
      relationships: [
        { target: 'KetQua', type: '1 - N', desc: 'Một môn học có nhiều điểm của nhiều sinh viên' },
        { target: 'DangKy', type: '1 - N', desc: 'Một môn học có nhiều lượt sinh viên đăng ký' }
      ]
    },
    {
      id: 'KetQua',
      name: 'KetQua (Kết Quả Học Tập)',
      category: 'Bảng Trung Gian (N - N)',
      description: 'Giải quyết quan hệ Nhiều - Nhiều giữa SinhVien và MonHoc.',
      pk: 'MaHS + MaMH',
      columns: [
        { name: 'MaHS', type: 'VARCHAR(10)', role: 'PK, FK', desc: 'Tham chiếu SinhVien(MaHS)' },
        { name: 'MaMH', type: 'VARCHAR(10)', role: 'PK, FK', desc: 'Tham chiếu MonHoc(MaMH)' },
        { name: 'DiemTX', type: 'FLOAT', role: 'CHECK [0, 10]', desc: 'Điểm thường xuyên' },
        { name: 'DiemGK', type: 'FLOAT', role: 'CHECK [0, 10]', desc: 'Điểm giữa kỳ' },
        { name: 'DiemCK', type: 'FLOAT', role: 'CHECK [0, 10]', desc: 'Điểm thi cuối kỳ' },
        { name: 'DiemTB', type: 'FLOAT', role: 'CHECK [0, 10]', desc: 'Điểm trung bình học phần' }
      ],
      relationships: [
        { target: 'SinhVien', type: 'N - 1', desc: 'Khóa ngoại MaHS tham chiếu SinhVien' },
        { target: 'MonHoc', type: 'N - 1', desc: 'Khóa ngoại MaMH tham chiếu MonHoc' }
      ]
    }
  ];

  const currentEntityData = entities.find(e => e.id === selectedEntity) || entities[1];

  // ACID Simulation Handler
  const handleStartTransaction = () => {
    setAcidSimState('started');
    setAcidLogs(['[BEGIN TRANSACTION]: Bắt đầu phiên làm việc an toàn. Thiết lập điểm khôi phục Savepoint.']);
  };

  const handleStep1 = () => {
    if (acidBalanceA < acidAmount) {
      setAcidLogs(prev => [...prev, `[LỖI]: Tài khoản A chỉ còn ${acidBalanceA.toLocaleString()}đ, không đủ ${acidAmount.toLocaleString()}đ để trừ!`]);
      return;
    }
    setAcidBalanceA(prev => prev - acidAmount);
    setAcidSimState('step1');
    setAcidLogs(prev => [...prev, `[BƯỚC 1]: Trừ ${acidAmount.toLocaleString()}đ từ Tài khoản A. Số dư mới: ${(acidBalanceA - acidAmount).toLocaleString()}đ.`]);
  };

  const handleStep2 = (simulateFailure = false) => {
    if (simulateFailure) {
      setAcidLogs(prev => [...prev, `[SỰ CỐ MẠNG / ĐỨT KẾT NỐI]: Không thể cộng tiền vào Tài khoản B! Giao dịch gặp lỗi bất khả kháng.`]);
      handleRollback();
      return;
    }
    setAcidBalanceB(prev => prev + acidAmount);
    setAcidSimState('step2');
    setAcidLogs(prev => [...prev, `[BƯỚC 2]: Cộng ${acidAmount.toLocaleString()}đ vào Tài khoản B. Số dư mới: ${(acidBalanceB + acidAmount).toLocaleString()}đ.`]);
  };

  const handleCommit = () => {
    setAcidSimState('committed');
    setAcidLogs(prev => [...prev, `[COMMIT TRANSACTION]: Giao dịch thành công hoàn hảo! Dữ liệu được ghi vĩnh viễn vào ổ cứng (Durability).`]);
  };

  const handleRollback = () => {
    // Revert state
    setAcidBalanceA(1000000);
    setAcidBalanceB(500000);
    setAcidSimState('rolledback');
    setAcidLogs(prev => [...prev, `[ROLLBACK TRANSACTION]: Kích hoạt cơ chế Hoàn tác! Số dư cả 2 tài khoản được đưa trở lại chính xác như trước khi giao dịch bắt đầu (Atomicity: Tất cả hoặc không gì cả!).`]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Studio Header */}
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Studio Thiết kế & Trực quan hóa CSDL
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Mô hình ERD, Chuẩn hóa 3NF, Giao dịch ACID & An toàn SQL
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Công cụ hỗ trợ giảng viên Tin học và sinh viên trực quan hóa các khái niệm trừu tượng: từ sơ đồ thực thể liên kết, quy trình chuẩn hóa đến mô phỏng an toàn giao dịch.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('erd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'erd'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sơ đồ ERD</span>
          </button>
          <button
            onClick={() => setActiveTab('normalization')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'normalization'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Chuẩn hóa 1NF - 3NF</span>
          </button>
          <button
            onClick={() => setActiveTab('acid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'acid'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Mô phỏng Giao dịch (ACID)</span>
          </button>
          <button
            onClick={() => setActiveTab('sqli')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sqli'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Chống SQL Injection</span>
          </button>
        </div>
      </div>

      {/* Tab 1: ERD Explorer */}
      {activeTab === 'erd' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Entity Selector */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Chọn Thực thể để quan sát:
              </span>
              <div className="space-y-2">
                {entities.map(e => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEntity(e.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                      selectedEntity === e.id
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-xs ring-2 ring-indigo-200'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-black text-xs">{e.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{e.category}</div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                      PK: {e.pk}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Info className="w-4 h-4 text-amber-600" />
                  Quy tắc giải quyết Quan hệ N - N:
                </div>
                <p className="text-[11px] leading-relaxed">
                  Một Sinh viên học nhiều Môn học; một Môn học có nhiều Sinh viên theo học. Đây là quan hệ Nhiều - Nhiều (N-N).
                  Trong mô hình CSDL quan hệ, quan hệ N-N được tách thành 2 quan hệ 1-N thông qua bảng trung gian <strong>[KetQua]</strong> (hoặc [DangKy]).
                </p>
              </div>
            </div>

            {/* Right: Entity Details & Relationship Diagram */}
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">{currentEntityData.name}</h3>
                    <p className="text-xs text-slate-500">{currentEntityData.description}</p>
                  </div>
                  <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" /> Khóa chính: {currentEntityData.pk}
                  </span>
                </div>

                {/* Columns Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-300 text-slate-600 font-bold bg-slate-100">
                        <th className="p-2.5">Tên Cột (Thuộc tính)</th>
                        <th className="p-2.5">Kiểu Dữ liệu</th>
                        <th className="p-2.5">Vai trò & Ràng buộc</th>
                        <th className="p-2.5">Ý nghĩa Nghiệp vụ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {currentEntityData.columns.map((col, idx) => (
                        <tr key={idx} className="hover:bg-white transition-colors">
                          <td className="p-2.5 font-mono font-bold text-slate-900">{col.name}</td>
                          <td className="p-2.5 font-mono text-indigo-600 font-semibold">{col.type}</td>
                          <td className="p-2.5">
                            {col.role.includes('PK') && (
                              <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[10px] mr-1">
                                PRIMARY KEY
                              </span>
                            )}
                            {col.role.includes('FK') && (
                              <span className="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded text-[10px] mr-1">
                                FOREIGN KEY
                              </span>
                            )}
                            {col.role && !col.role.includes('PK') && !col.role.includes('FK') && (
                              <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                                {col.role}
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-slate-600">{col.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Relationships Card */}
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Mối quan hệ liên kết (Cardinality):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentEntityData.relationships.map((rel, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-indigo-700">{rel.target}</span>
                          <p className="text-slate-500 text-[11px] mt-0.5">{rel.desc}</p>
                        </div>
                        <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded text-[10px] border border-indigo-200">
                          {rel.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action: Quick Test Query */}
              <div className="flex items-center justify-between bg-indigo-900 text-white p-4 rounded-xl text-xs">
                <span className="font-medium">Muốn thực thi truy vấn kiểm tra dữ liệu thực tế của thực thể này?</span>
                <button
                  onClick={() => onRunSqlInPlayground(`SELECT * FROM ${selectedEntity};`)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Chạy SELECT * FROM {selectedEntity}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Normalization Lab */}
      {activeTab === 'normalization' && (
        <div className="p-6 space-y-6">
          {/* Step Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Phòng Thí nghiệm Chuẩn hóa Dữ liệu (1NF &rarr; 2NF &rarr; 3NF)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quan sát quá trình chuyển đổi một bảng dữ liệu thực tế chứa dị thường thành các bảng chuẩn hóa hoàn hảo.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setNormStep('unnormalized')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  normStep === 'unnormalized' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chưa Chuẩn hóa
              </button>
              <button
                onClick={() => setNormStep('1nf')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  normStep === '1nf' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1NF (Nguyên tử)
              </button>
              <button
                onClick={() => setNormStep('2nf')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  normStep === '2nf' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2NF (Khử PTH bộ phận)
              </button>
              <button
                onClick={() => setNormStep('3nf')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  normStep === '3nf' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3NF (Khử PTH bắc cầu)
              </button>
            </div>
          </div>

          {/* Step Explanation Banner */}
          {normStep === 'unnormalized' && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 space-y-2">
              <div className="font-bold flex items-center gap-2 text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Hiện trạng: Bảng chứa thuộc tính đa trị (Lặp nhóm) & 3 Dị thường nguy hiểm!
              </div>
              <p className="text-[11px] leading-relaxed">
                Trong bảng này, một học sinh học nhiều môn nhưng tất cả các môn lại được gõ gom chung vào cột <code>DanhSachMonDiem</code> (ví dụ: &quot;TIN:9.5, TOAN:8.5&quot;).
                Điều này vi phạm nguyên tắc nguyên tử hóa. Đồng thời khi cần đổi tên giáo viên chủ nhiệm của lớp 12A1, chúng ta phải sửa ở nhiều dòng khác nhau (Dị thường sửa).
              </p>
            </div>
          )}

          {normStep === '1nf' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-2 text-amber-800">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Đạt 1NF: Đã tách mỗi ô thành một giá trị đơn (Atomic Value). Khóa chính hợp thành: (MaSV + MaMH)
              </div>
              <p className="text-[11px] leading-relaxed">
                Mỗi môn học của sinh viên giờ đây nằm trên một dòng độc lập. Tuy nhiên, bảng vẫn vi phạm chuẩn 2NF vì thuộc tính <strong>HoTen</strong> và <strong>MaLop</strong> chỉ phụ thuộc vào <strong>MaSV</strong> (chỉ phụ thuộc vào một phần của khóa chính kép).
              </p>
            </div>
          )}

          {normStep === '2nf' && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-900 space-y-2">
              <div className="font-bold flex items-center gap-2 text-indigo-800">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                Đạt 2NF: Đã tách thành 3 bảng để loại bỏ phụ thuộc bộ phận vào Khóa chính hợp thành!
              </div>
              <p className="text-[11px] leading-relaxed">
                Tách riêng <strong>SinhVien (MaSV, HoTen, MaLop, TenLop, GVCN)</strong>, <strong>MonHoc (MaMH, TenMH)</strong> và <strong>KetQua (MaSV, MaMH, DiemTB)</strong>.
                Tuy nhiên trong bảng SinhVien: MaSV -&gt; MaLop, và MaLop -&gt; TenLop, GVCN (Phụ thuộc bắc cầu!).
              </p>
            </div>
          )}

          {normStep === '3nf' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-2">
              <div className="font-bold flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Đạt 3NF Hoàn hảo: Tách riêng bảng LopHoc để loại bỏ hoàn toàn Phụ thuộc hàm bắc cầu!
              </div>
              <p className="text-[11px] leading-relaxed">
                Bây giờ thông tin Lớp học (TenLop, GVCN) chỉ lưu duy nhất 1 lần trong bảng <strong>LopHoc</strong>. Bảng <strong>SinhVien</strong> chỉ giữ lại khóa ngoại <strong>MaLop</strong>. Triệt tiêu hoàn toàn dư thừa dữ liệu và 3 loại dị thường!
              </p>
            </div>
          )}

          {/* Visual Data Representation */}
          <div className="space-y-4">
            {normStep === 'unnormalized' && (
              <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 overflow-x-auto text-xs">
                <div className="font-bold text-rose-400 mb-2 font-mono">[BangChung_ChuaChuan]</div>
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="p-2">MaSV</th>
                      <th className="p-2">HoTen</th>
                      <th className="p-2">MaLop</th>
                      <th className="p-2">TenLop</th>
                      <th className="p-2">GVCN</th>
                      <th className="p-2 text-rose-300">DanhSachMonDiem (ĐA TRỊ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-800">
                      <td className="p-2 text-amber-400">SV01</td>
                      <td className="p-2">Nguyễn Quốc Anh</td>
                      <td className="p-2">12A1</td>
                      <td className="p-2">Chuyên Tin</td>
                      <td className="p-2">Thầy Nam</td>
                      <td className="p-2 text-rose-300 bg-rose-950/40">TIN:9.5, TOAN:8.5</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="p-2 text-amber-400">SV02</td>
                      <td className="p-2">Trần Mai Linh</td>
                      <td className="p-2">12A1</td>
                      <td className="p-2">Chuyên Tin</td>
                      <td className="p-2">Thầy Nam</td>
                      <td className="p-2 text-rose-300 bg-rose-950/40">TIN:9.0, ANH:8.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {normStep === '1nf' && (
              <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 overflow-x-auto text-xs">
                <div className="font-bold text-amber-400 mb-2 font-mono">[Bang_1NF] (PK hợp thành: MaSV + MaMH)</div>
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="p-2 text-amber-400">MaSV (PK)</th>
                      <th className="p-2">HoTen</th>
                      <th className="p-2">MaLop</th>
                      <th className="p-2 text-amber-400">MaMH (PK)</th>
                      <th className="p-2">TenMH</th>
                      <th className="p-2 text-emerald-400">DiemTB</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-800">
                      <td className="p-2 text-amber-400 font-bold">SV01</td>
                      <td className="p-2">Nguyễn Quốc Anh</td>
                      <td className="p-2">12A1</td>
                      <td className="p-2 text-amber-400 font-bold">TIN</td>
                      <td className="p-2">Tin học</td>
                      <td className="p-2 text-emerald-400">9.5</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="p-2 text-amber-400 font-bold">SV01</td>
                      <td className="p-2">Nguyễn Quốc Anh</td>
                      <td className="p-2">12A1</td>
                      <td className="p-2 text-amber-400 font-bold">TOAN</td>
                      <td className="p-2">Toán học</td>
                      <td className="p-2 text-emerald-400">8.5</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="p-2 text-amber-400 font-bold">SV02</td>
                      <td className="p-2">Trần Mai Linh</td>
                      <td className="p-2">12A1</td>
                      <td className="p-2 text-amber-400 font-bold">TIN</td>
                      <td className="p-2">Tin học</td>
                      <td className="p-2 text-emerald-400">9.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {normStep === '2nf' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 text-xs">
                  <div className="font-bold text-indigo-400 mb-1 font-mono">[SinhVien] (PK: MaSV)</div>
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="p-1">MaSV</th>
                        <th className="p-1">HoTen</th>
                        <th className="p-1">MaLop</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-1 text-amber-400">SV01</td>
                        <td className="p-1">Quốc Anh</td>
                        <td className="p-1">12A1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 text-xs">
                  <div className="font-bold text-indigo-400 mb-1 font-mono">[MonHoc] (PK: MaMH)</div>
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="p-1">MaMH</th>
                        <th className="p-1">TenMH</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-1 text-amber-400">TIN</td>
                        <td className="p-1">Tin học</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 text-xs">
                  <div className="font-bold text-indigo-400 mb-1 font-mono">[KetQua] (PK: MaSV+MaMH)</div>
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="p-1">MaSV</th>
                        <th className="p-1">MaMH</th>
                        <th className="p-1">DiemTB</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-1 text-amber-400">SV01</td>
                        <td className="p-1 text-amber-400">TIN</td>
                        <td className="p-1 text-emerald-400">9.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {normStep === '3nf' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-slate-900 text-white rounded-xl p-3 border border-emerald-800/80 text-xs">
                  <div className="font-bold text-emerald-400 mb-1 font-mono">[LopHoc] (PK: MaLop)</div>
                  <div className="text-[10px] text-slate-300 space-y-1">
                    <div>12A1 - Chuyên Tin (Thầy Nam)</div>
                    <div>12A2 - Chuyên Toán (Cô Hà)</div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-xl p-3 border border-emerald-800/80 text-xs">
                  <div className="font-bold text-emerald-400 mb-1 font-mono">[SinhVien] (PK: MaSV)</div>
                  <div className="text-[10px] text-slate-300 space-y-1">
                    <div>SV01 - Nguyễn Quốc Anh (12A1)</div>
                    <div>SV02 - Trần Mai Linh (12A1)</div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-xl p-3 border border-emerald-800/80 text-xs">
                  <div className="font-bold text-emerald-400 mb-1 font-mono">[MonHoc] (PK: MaMH)</div>
                  <div className="text-[10px] text-slate-300 space-y-1">
                    <div>TIN - Tin học (3 TC)</div>
                    <div>TOAN - Toán học (4 TC)</div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-xl p-3 border border-emerald-800/80 text-xs">
                  <div className="font-bold text-emerald-400 mb-1 font-mono">[KetQua] (PK: MaSV+MaMH)</div>
                  <div className="text-[10px] text-slate-300 space-y-1">
                    <div>SV01 + TIN = 9.5</div>
                    <div>SV01 + TOAN = 8.5</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: ACID Simulator */}
      {activeTab === 'acid' && (
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Mô phỏng Trực quan Giao dịch CSDL (Transaction & Tính chất ACID)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thực hiện kịch bản chuyển tiền học phí giữa 2 tài khoản với cơ chế BEGIN TRANSACTION, COMMIT và ROLLBACK.
            </p>
          </div>

          {/* Bank Accounts Visual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 text-xs font-mono">Tài khoản A (Sinh viên)</span>
                <span className="text-[11px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded font-bold">Nguồn</span>
              </div>
              <div className="text-2xl font-black text-indigo-900">
                {acidBalanceA.toLocaleString()} VNĐ
              </div>
              <p className="text-[11px] text-slate-500">Tài khoản thanh toán học phí trực tuyến</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 text-xs font-mono">Tài khoản B (Nhà trường)</span>
                <span className="text-[11px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-bold">Đích</span>
              </div>
              <div className="text-2xl font-black text-emerald-900">
                {acidBalanceB.toLocaleString()} VNĐ
              </div>
              <p className="text-[11px] text-slate-500">Tài khoản thu học phí nhà trường</p>
            </div>
          </div>

          {/* Interactive Control Panel */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-amber-400">Bảng điều khiển Giao dịch (Transaction Console):</span>
              <span className="text-[11px] font-mono text-slate-400">
                Trạng thái: <span className="text-white font-bold">{acidSimState.toUpperCase()}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {acidSimState === 'idle' && (
                <button
                  onClick={handleStartTransaction}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>1. BEGIN TRANSACTION</span>
                </button>
              )}

              {acidSimState === 'started' && (
                <button
                  onClick={handleStep1}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>2. Chạy Lệnh DML 1: Trừ {acidAmount.toLocaleString()}đ của A</span>
                </button>
              )}

              {acidSimState === 'step1' && (
                <>
                  <button
                    onClick={() => handleStep2(false)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>3. Chạy Lệnh DML 2 (Thành công): Cộng {acidAmount.toLocaleString()}đ vào B</span>
                  </button>

                  <button
                    onClick={() => handleStep2(true)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Mô phỏng Gặp Sự cố Mạng / Lỗi máy chủ</span>
                  </button>
                </>
              )}

              {acidSimState === 'step2' && (
                <button
                  onClick={handleCommit}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>4. COMMIT TRANSACTION (Xác nhận)</span>
                </button>
              )}

              {(acidSimState === 'committed' || acidSimState === 'rolledback') && (
                <button
                  onClick={() => {
                    setAcidSimState('idle');
                    setAcidLogs([]);
                    setAcidBalanceA(1000000);
                    setAcidBalanceB(500000);
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại Mô phỏng Ban đầu</span>
                </button>
              )}
            </div>

            {/* Execution Log */}
            <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800/80 font-mono text-[11px] space-y-1 max-h-40 overflow-y-auto">
              <span className="text-slate-500 block mb-1">=== Nhật ký Giao dịch Máy chủ (Transaction Log) ===</span>
              {acidLogs.length === 0 ? (
                <span className="text-slate-600 italic">Nhấn nút [BEGIN TRANSACTION] để bắt đầu mô phỏng...</span>
              ) : (
                acidLogs.map((log, idx) => (
                  <div key={idx} className={log.includes('LỖI') || log.includes('SỰ CỐ') ? 'text-rose-400 font-bold' : log.includes('ROLLBACK') ? 'text-amber-400 font-bold' : log.includes('COMMIT') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: SQL Injection Simulator */}
      {activeTab === 'sqli' && (
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Mô phỏng An toàn CSDL: Tấn công & Phòng vệ SQL Injection
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hiểu cách thức kẻ tấn công khai thác kỹ thuật ghép chuỗi và cách Parameterized Query (Prepared Statement) ngăn chặn triệt để.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input & Form */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Ô nhập liệu của Form Đăng nhập Web:</span>
                <span className="text-[11px] text-slate-400">Thử nghiệm giá trị độc hại</span>
              </div>

              <div className="space-y-2">
                <label className="text-slate-600 font-medium block">Tên người dùng (Username):</label>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="admin' OR '1'='1"
                />
              </div>

              {/* Sample payloads */}
              <div className="space-y-1">
                <span className="text-slate-500 text-[11px]">Chọn mẫu chuỗi tấn công thử nghiệm:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setUserInput("' OR '1'='1")}
                    className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-mono hover:bg-slate-100 cursor-pointer"
                  >
                    &apos; OR &apos;1&apos;=&apos;1
                  </button>
                  <button
                    onClick={() => setUserInput("admin' --")}
                    className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-mono hover:bg-slate-100 cursor-pointer"
                  >
                    admin&apos; --
                  </button>
                  <button
                    onClick={() => setUserInput("nguyenvanan")}
                    className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-mono hover:bg-slate-100 cursor-pointer"
                  >
                    nguyenvanan (Bình thường)
                  </button>
                </div>
              </div>

              {/* Toggle Mode */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-700 font-bold block mb-2">Chế độ Lập trình phía Backend:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSqliMode('vulnerable')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      sqliMode === 'vulnerable'
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="text-xs">Ghép Chuỗi Ngây thơ</div>
                    <div className="text-[10px] text-rose-600">Dễ bị tấn công SQLi</div>
                  </button>

                  <button
                    onClick={() => setSqliMode('parameterized')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      sqliMode === 'parameterized'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="text-xs">Parameterized Query</div>
                    <div className="text-[10px] text-emerald-600">An toàn tuyệt đối</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Behind the scenes explanation */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-amber-400">Câu lệnh SQL Máy chủ Nhận được & Xử lý:</span>
              </div>

              {sqliMode === 'vulnerable' ? (
                <div className="space-y-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-rose-900/60 font-mono text-[11px] overflow-x-auto text-rose-300">
                    <code>{`SELECT * FROM Users WHERE Username = '${userInput}' AND Password = '***';`}</code>
                  </div>

                  <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl space-y-1.5 text-rose-200 text-[11px]">
                    <span className="font-bold flex items-center gap-1.5 text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      CẢNH BÁO NGUY HIỂM: LỖ HỔNG BỊ KHAI THÁC THÀNH CÔNG!
                    </span>
                    <p className="leading-relaxed">
                      Dấu nháy đơn <code>&apos;</code> đóng chuỗi Username sớm. Mệnh đề <code>OR &apos;1&apos;=&apos;1</code> làm cho toàn bộ biểu thức logic luôn luôn mang giá trị <strong>TRUE</strong>!
                      Hệ thống tự động đăng nhập vào tài khoản đầu tiên (thường là Administrator) mà không cần biết mật khẩu!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/60 font-mono text-[11px] overflow-x-auto text-emerald-300">
                    <code>{`-- Sử dụng PreparedStatement với tham số @username:
SELECT * FROM Users WHERE Username = @username AND Password = @hash;
-- Giá trị tham số @username: "${userInput}"`}</code>
                  </div>

                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl space-y-1.5 text-emerald-200 text-[11px]">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      AN TOÀN TUYỆT ĐỐI: TẤN CÔNG BỊ VÔ HIỆU HÓA!
                    </span>
                    <p className="leading-relaxed">
                      Toàn bộ chuỗi <code>{userInput}</code> được máy chủ đối xử như một giá trị chuỗi thuần túy (Plain literal string), không hề được biên dịch thành mã thực thi.
                      Hệ thống chỉ tìm kiếm người dùng có tên chính xác là <code>{userInput}</code> (không tồn tại) và từ chối đăng nhập một cách an toàn!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
