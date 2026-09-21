import React, { useState } from 'react';
import { UserAccount } from '../types';
import { authService, DEFAULT_USERS } from '../services/authService';
import { 
  User, 
  KeyRound, 
  Mail, 
  GraduationCap, 
  Check, 
  X, 
  LogIn, 
  UserPlus, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUserChanged: (newUser: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'switch'>('switch');
  const [credential, setCredential] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Register form
  const [regFullName, setRegFullName] = useState<string>('');
  const [regUsername, setRegUsername] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regRole, setRegRole] = useState<'student' | 'teacher' | 'enthusiast'>('student');
  const [regGrade, setRegGrade] = useState<string>('Lớp 11 Tin Học - THPT');
  const [regPassword, setRegPassword] = useState<string>('');
  
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  const usersList = authService.getUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      if (!credential.trim()) {
        setErrorMessage('Vui lòng nhập tên đăng nhập hoặc email.');
        return;
      }
      const user = authService.login(credential, password);
      setSuccessMessage(`Đăng nhập thành công! Chào mừng ${user.fullName}`);
      setTimeout(() => {
        onUserChanged(user);
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng nhập không thành công.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim()) {
        setErrorMessage('Vui lòng điền đầy đủ các thông tin bắt buộc.');
        return;
      }
      if (regUsername.length < 3) {
        setErrorMessage('Tên đăng nhập phải có ít nhất 3 ký tự.');
        return;
      }
      const newUser = authService.register({
        fullName: regFullName,
        username: regUsername,
        email: regEmail,
        role: regRole,
        grade: regGrade,
      });
      setSuccessMessage(`Tài khoản "${newUser.username}" đã được tạo thành công!`);
      setTimeout(() => {
        onUserChanged(newUser);
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng ký không thành công.');
    }
  };

  const handleSwitchUser = (userId: string) => {
    try {
      const user = authService.switchUser(userId);
      setSuccessMessage(`Đã chuyển sang hồ sơ của ${user.fullName}`);
      setTimeout(() => {
        onUserChanged(user);
        onClose();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể chuyển đổi tài khoản.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/40">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Hồ sơ Học tập Cá nhân</h2>
              <p className="text-xs text-indigo-200">Lưu trữ tiến trình, bài làm và bookmarks độc lập</p>
            </div>
          </div>

          {/* Current User Badge */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${currentUser.avatarColor || 'from-indigo-500 to-blue-600'} flex items-center justify-center text-white text-xs font-black shadow-xs`}>
                {currentUser.fullName.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{currentUser.fullName}</span>
                  <span className="text-[10px] bg-white/15 px-1.5 py-0.2 rounded font-normal text-indigo-200">
                    {currentUser.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">@{currentUser.username}</div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Đang hoạt động
            </span>
          </div>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold p-1">
          <button
            onClick={() => { setMode('switch'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'switch' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đổi Tài Khoản
          </button>
          <button
            onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'login' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'register' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Ký Mới
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Notification Banners */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium animate-in fade-in">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Mode 1: Quick Profile Switcher */}
          {mode === 'switch' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>Chọn hồ sơ người học:</span>
                <span className="text-[11px] text-indigo-600">Lưu tiến trình riêng biệt</span>
              </div>

              <div className="space-y-2">
                {usersList.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleSwitchUser(u.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200 text-indigo-950 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${
                            u.avatarColor || 'from-indigo-500 to-blue-600'
                          } flex items-center justify-center text-white font-black shadow-xs`}
                        >
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                            <span>{u.fullName}</span>
                            {u.role === 'teacher' && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                                Giáo viên
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{u.grade}</div>
                          <div className="text-[10px] text-slate-400 font-mono">@{u.username}</div>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
                          <span>Chọn</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setMode('register')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tạo thêm tài khoản mới cho bạn</span>
                </button>
              </div>
            </div>
          )}

          {/* Mode 2: Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Tên đăng nhập hoặc Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    placeholder="ví dụ: nguyenminhquan hoặc email"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Mật khẩu</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu (tùy chọn)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-slate-400">
                  * Mẹo: Tài khoản mẫu mặc định có thể nhấn Đăng nhập trực tiếp.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Ngay</span>
              </button>
            </form>
          )}

          {/* Mode 3: Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Họ và Tên người học</label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="ví dụ: Nguyễn Hoàng Anh"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Tên đăng nhập (viết liền)</label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="hoanganh12"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Vai trò</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="student">Học sinh / Sinh viên</option>
                    <option value="teacher">Giáo viên / Giảng viên</option>
                    <option value="enthusiast">Người tự học CSDL</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Email</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="hoanganh@gmail.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Trường / Lớp / Khối học</label>
                <input
                  type="text"
                  value={regGrade}
                  onChange={(e) => setRegGrade(e.target.value)}
                  placeholder="Lớp 11A1 - THPT Chuyên"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Hoàn tất Đăng Ký Tài Khoản</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
