import React from 'react';
import { StudentProgress, CompetencyCategory } from '../types';
import { 
  TrendingUp, 
  Award, 
  BookOpen, 
  CheckSquare, 
  Flame, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Download,
  RotateCcw
} from 'lucide-react';
import { CURRICULUM_LESSONS } from '../data/curriculumData';
import { EXERCISES_DATA } from '../data/exercisesData';
import { QUIZ_QUESTIONS } from '../data/quizzesData';

interface CompetencyReportProps {
  progress: StudentProgress;
  onResetProgress: () => void;
}

export const CompetencyReport: React.FC<CompetencyReportProps> = ({
  progress,
  onResetProgress,
}) => {
  const competencies: { id: CompetencyCategory; name: string; desc: string }[] = [
    {
      id: 'tong-quan-csdl',
      name: 'Tổng quan CSDL & Hệ Quản trị (DBMS)',
      desc: 'Phân biệt Data vs. Information, vai trò của DBMS trong hệ thống thông tin, các mô hình phân cấp, mạng, quan hệ và NoSQL.',
    },
    {
      id: 'csdl-quan-he',
      name: 'Kiến thức CSDL & Mô hình Quan hệ',
      desc: 'Hiểu khái niệm RDBMS, Bảng, Dòng, Cột và tổ chức dữ liệu theo chuẩn SQL Server.',
    },
    {
      id: 'thiet-ke-rang-buoc',
      name: 'Thiết kế Bảng, Khóa, ERD & Chuẩn hóa 3NF',
      desc: 'Phân tích thực tế, vẽ sơ đồ ERD, chuyển sang bảng, khóa chính PK, khóa ngoại FK và chuẩn hóa 1NF, 2NF, 3NF.',
    },
    {
      id: 'truy-van-co-ban',
      name: 'Truy vấn Dữ liệu Cơ bản (SELECT, WHERE)',
      desc: 'Khai thác dữ liệu với SELECT, lọc điều kiện WHERE (AND, OR, LIKE, BETWEEN), sắp xếp ORDER BY, TOP.',
    },
    {
      id: 'gom-nhom-thong-ke',
      name: 'Thống kê & Gom nhóm (GROUP BY, HAVING)',
      desc: 'Sử dụng các hàm tổng hợp COUNT, SUM, AVG, MIN, MAX và phân biệt điều kiện HAVING với WHERE.',
    },
    {
      id: 'join-subquery',
      name: 'Truy vấn Phức tạp (Phép nối JOIN & Subquery)',
      desc: 'Nối nhiều bảng với INNER JOIN, LEFT JOIN và kỹ thuật lồng câu truy vấn con Subquery trong WHERE.',
    },
    {
      id: 'thao-tac-du-lieu-dml',
      name: 'Thao tác Dữ liệu DML (INSERT, UPDATE, DELETE)',
      desc: 'Thêm bản ghi mới với INSERT INTO, cập nhật dữ liệu với UPDATE và xóa an toàn có điều kiện WHERE với DELETE.',
    },
    {
      id: 'dinh-nghia-du-lieu-ddl',
      name: 'Định nghĩa Cấu trúc DDL & Ràng buộc (CREATE, ALTER, DROP)',
      desc: 'Tạo bảng với CREATE TABLE, mở rộng cấu trúc với ALTER TABLE, xóa bảng với DROP TABLE và thiết lập các ràng buộc toàn vẹn.',
    },
    {
      id: 'quan-tri-toan-ven',
      name: 'Quản trị, Toàn vẹn, VIEW & Giao dịch ACID',
      desc: 'Cấu hình CASCADE, tạo Khung nhìn VIEW bảo mật, quản lý Giao dịch Transaction (ACID) và phòng chống SQL Injection.',
    },
    {
      id: 'du-an-tong-hop',
      name: 'Dự án Cơ sở Dữ liệu Tổng hợp (Capstone)',
      desc: 'Thực hiện dự án CSDL hoàn chỉnh từ phân tích nghiệp vụ, thiết kế ERD, tạo bảng, nạp dữ liệu đến viết bộ truy vấn báo cáo.',
    },
  ];

  // Calculate overall competency average
  const compValues = Object.values(progress.competencyScores);
  const averageScore = Math.round(
    compValues.reduce((sum, v) => sum + v, 0) / (compValues.length || 1)
  );

  const getRank = (score: number) => {
    if (score >= 90) return { title: 'Xuất Sắc - Chuyên gia CSDL Trẻ', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (score >= 80) return { title: 'Giỏi - Năng lực T-SQL Vững Vàng', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    if (score >= 65) return { title: 'Khá - Đang Làm Chủ CSDL', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' };
    return { title: 'Đang Rèn Luyện & Tích Lũy', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
  };

  const rank = getRank(averageScore);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Student Profile Card */}
      <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 font-black text-2xl">
              SQL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black">{progress.studentName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/10">
                  {progress.grade}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                Hồ sơ Năng lực Tin học Phổ thông • Môn Cơ sở Dữ liệu & SQL Server
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintReport}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <Download className="w-4 h-4" />
              <span>In Phiếu Đánh Giá</span>
            </button>
          </div>
        </div>

        {/* Highlight Score Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-medium block">Điểm Năng lực Tổng thể</span>
            <div className="text-2xl font-black text-white mt-1">{averageScore} / 100</div>
            <span className="text-[11px] text-indigo-300 font-semibold">{rank.title.split(' - ')[0]}</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-medium block">Bài học hoàn thành</span>
            <div className="text-2xl font-black text-white mt-1">
              {progress.completedLessons.length}/{CURRICULUM_LESSONS.length}
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">
              {Math.round((progress.completedLessons.length / CURRICULUM_LESSONS.length) * 100)}% giáo trình
            </span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-medium block">Bài thực hành đạt</span>
            <div className="text-2xl font-black text-white mt-1">
              {Object.keys(progress.completedExercises).length}/{EXERCISES_DATA.length}
            </div>
            <span className="text-[11px] text-blue-300 font-semibold">Tự động chấm 100%</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-medium block">Tổng điểm rèn luyện</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{progress.totalPoints} đ</div>
            <span className="text-[11px] text-amber-300 font-semibold">Chuỗi {progress.streakDays} ngày</span>
          </div>
        </div>
      </div>

      {/* Competency Evaluation Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Đánh giá 5 Chuẩn Năng lực Tin học CSDL
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Hệ thống tự động chấm điểm dựa trên kết quả bài tập viết lệnh SQL và bài trắc nghiệm khái niệm.
          </p>
        </div>

        <div className="space-y-5">
          {competencies.map((comp) => {
            const score = progress.competencyScores[comp.id] || 0;
            let barColor = 'bg-amber-500';
            if (score >= 80) barColor = 'bg-emerald-500';
            else if (score >= 60) barColor = 'bg-indigo-600';

            return (
              <div key={comp.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{comp.name}</span>
                    <p className="text-[11px] text-slate-500">{comp.desc}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="font-black text-sm text-slate-900">{score}</span>
                    <span className="text-slate-400 text-xs"> / 100</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${barColor} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(score, 5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teacher Pedagogical Review & Advice */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          Nhận xét & Định hướng từ Giáo viên Bộ môn
        </h3>

        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-indigo-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Điểm mạnh ghi nhận:</span>
            </div>
            <p>
              Em nắm khá tốt việc sử dụng câu lệnh SELECT và các điều kiện lọc WHERE cơ bản. Thao tác viết lệnh trên CSDL thực tế rất chủ động, biết cách tận dụng các mệnh đề sắp xếp ORDER BY.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Điểm cần rèn luyện thêm:</span>
            </div>
            <p>
              Cần chú ý kỹ quy tắc gom nhóm dữ liệu với <strong>GROUP BY</strong>: tất cả các cột xuất hiện ở SELECT không nằm trong hàm tổng hợp (COUNT, SUM, AVG) thì bắt buộc phải đưa vào GROUP BY.
              Khi thực hiện phép nối <strong>INNER/LEFT JOIN</strong>, hãy luôn kiểm tra đúng điều kiện liên kết khóa ngoại trỏ tới khóa chính trên mệnh đề <code>ON</code>.
            </p>
          </div>
        </div>

        {/* Reset Progress Confirmation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Tiến độ học tập được lưu tự động trên trình duyệt của em.</span>
          <button
            onClick={() => {
              if (window.confirm('Em có chắc chắn muốn đặt lại toàn bộ điểm số và làm lại từ đầu không?')) {
                onResetProgress();
              }
            }}
            className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khởi tạo lại dữ liệu học tập</span>
          </button>
        </div>
      </div>
    </div>
  );
};
