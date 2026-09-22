import React from 'react';
import { Database, Flame, Award, Smartphone, Monitor, BookOpen, Bookmark, History, User, ChevronDown } from 'lucide-react';
import { StudentProgress, UserAccount } from '../types';

interface HeaderProps {
  progress: StudentProgress;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (val: boolean) => void;
  currentDbId: string;
  setCurrentDbId: (dbId: string) => void;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  activeTab,
  setActiveTab,
  isMobileDeviceFrame,
  setIsMobileDeviceFrame,
  currentDbId,
  setCurrentDbId,
  currentUser,
  onOpenAuthModal,
}) => {
  const bookmarkCount = progress.bookmarks?.length || 0;

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
          <nav className="hidden xl:flex items-center gap-1">
            <button
              id="nav-lessons"
              onClick={() => setActiveTab('lessons')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'lessons'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Bài học
            </button>
            <button
              id="nav-playground"
              onClick={() => setActiveTab('playground')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'playground'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Chạy SQL
            </button>
            <button
              id="nav-erd"
              onClick={() => setActiveTab('erd')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'erd'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              ERD & 3NF
            </button>
            <button
              id="nav-schema"
              onClick={() => setActiveTab('schema')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'schema'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Sơ đồ
            </button>
            <button
              id="nav-exercises"
              onClick={() => setActiveTab('exercises')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'exercises'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Bài tập & Thi
            </button>
            <button
              id="nav-bookmarks"
              onClick={() => setActiveTab('bookmarks')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'bookmarks'
                  ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Dấu trang</span>
              {bookmarkCount > 0 && (
                <span className="bg-amber-200 text-amber-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                  {bookmarkCount}
                </span>
              )}
            </button>
            <button
              id="nav-history"
              onClick={() => setActiveTab('history')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'history'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Lịch sử</span>
            </button>
            <button
              id="nav-competency"
              onClick={() => setActiveTab('competency')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'competency'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Năng lực
            </button>
          </nav>

          {/* User status & View Mode */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Database switcher */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
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
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-xs font-bold" title="Số ngày học liên tiếp">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{progress.streakDays}d</span>
            </div>

            {/* Points badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 text-xs font-bold" title="Tổng điểm rèn luyện">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>{progress.totalPoints}đ</span>
            </div>

            {/* User Account / Profile Button or Login/Register */}
            {onOpenAuthModal && (
              currentUser ? (
                <button
                  id="btn-user-profile"
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                  title="Tài khoản cá nhân & SQLite Database"
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${currentUser.avatarColor || 'from-indigo-500 to-blue-600'} text-white font-black text-xs flex items-center justify-center shadow-xs`}>
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono leading-none">
                      @{currentUser.username}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              ) : (
                <button
                  id="btn-login-register"
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                  title="Đăng nhập hoặc Đăng ký tài khoản mới"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Đăng ký / Đăng nhập</span>
                </button>
              )
            )}

            {/* Mobile View Toggle */}
            <button
              id="toggle-view-mode"
              onClick={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
              className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
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
