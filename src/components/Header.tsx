import React from 'react';
import { Database, Flame, Award, Smartphone, Monitor, BookOpen } from 'lucide-react';
import { StudentProgress } from '../types';

interface HeaderProps {
  progress: StudentProgress;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (val: boolean) => void;
  currentDbId: string;
  setCurrentDbId: (dbId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  activeTab,
  setActiveTab,
  isMobileDeviceFrame,
  setIsMobileDeviceFrame,
  currentDbId,
  setCurrentDbId,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Teacher Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  SQL Master
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-full border border-indigo-200">
                  Tin học THPT
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Học T-SQL & Thiết kế CSDL Quan hệ cùng Thầy/Cô
              </p>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-lessons"
              onClick={() => setActiveTab('lessons')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'lessons'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Bài học lý thuyết
            </button>
            <button
              id="nav-playground"
              onClick={() => setActiveTab('playground')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'playground'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Chạy thử SQL
            </button>
            <button
              id="nav-erd"
              onClick={() => setActiveTab('erd')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'erd'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Studio ERD & Chuẩn hóa
            </button>
            <button
              id="nav-schema"
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'schema'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Sơ đồ CSDL
            </button>
            <button
              id="nav-exercises"
              onClick={() => setActiveTab('exercises')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'exercises'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Bài tập & Thi
            </button>
            <button
              id="nav-competency"
              onClick={() => setActiveTab('competency')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'competency'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Đánh giá năng lực
            </button>
          </nav>

          {/* User status & View Mode */}
          <div className="flex items-center gap-3">
            {/* Database switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium px-2">CSDL:</span>
              <select
                id="select-db-header"
                value={currentDbId}
                onChange={(e) => setCurrentDbId(e.target.value)}
                className="bg-white border-0 text-slate-800 font-semibold rounded py-1 px-2 text-xs focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
              >
                <option value="QuanLyHocSinh">Quản lý Học sinh</option>
                <option value="QuanLyBanHang">Quản lý Bán hàng</option>
              </select>
            </div>

            {/* Streak count */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-xs font-bold" title="Số ngày học liên tiếp">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{progress.streakDays} ngày</span>
            </div>

            {/* Points badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 text-xs font-bold" title="Tổng điểm rèn luyện">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>{progress.totalPoints} đ</span>
            </div>

            {/* Mobile View Toggle */}
            <button
              id="toggle-view-mode"
              onClick={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title={isMobileDeviceFrame ? "Chuyển chế độ Toàn màn hình máy tính" : "Chuyển chế độ Khung điện thoại di động"}
            >
              {isMobileDeviceFrame ? (
                <Monitor className="w-4 h-4" />
              ) : (
                <Smartphone className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
