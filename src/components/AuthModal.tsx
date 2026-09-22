import React, { useState, useEffect } from 'react';
import { UserAccount } from '../types';
import { authService, fetchSqliteStats } from '../services/authService';
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
  Database,
  Lock,
  LogOut,
  Building,
  School,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUserChanged: (newUser: UserAccount | null) => void;
  initialMode?: 'login' | 'register' | 'profile';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  initialMode,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'profile'>('login');
  const [credential, setCredential] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Register form states
  const [regFullName, setRegFullName] = useState<string>('');
  const [regUsername, setRegUsername] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regRole, setRegRole] = useState<'student' | 'teacher' | 'enthusiast'>('student');
  const [regGrade, setRegGrade] = useState<string>('Lớp 11 Tin Học - THPT');
  const [regSchool, setRegSchool] = useState<string>('Trường THPT Chuyên');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [sqliteInfo, setSqliteInfo] = useState<{
    engine: string;
    userCount: number;
    progressCount: number;
    fileSizeBytes: number;
  } | null>(null);

  // Load registered users from SQLite server API on open
  useEffect(() => {
    if (isOpen) {
      if (initialMode) {
        setMode(initialMode);
      } else if (currentUser) {
        setMode('profile');
      } else {
        setMode('login');
      }
      setErrorMessage('');
      setSuccessMessage('');

      fetchSqliteStats().then((stats) => {
        if (stats) {
          setSqliteInfo({
            engine: stats.engine,
            userCount: stats.userCount,
            progressCount: stats.progressCount,
            fileSizeBytes: stats.fileSizeBytes,
          });
        }
      });
    }
  }, [isOpen, currentUser, initialMode]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (!credential.trim()) {
        setErrorMessage('Vui lòng nhập tên đăng nhập hoặc email.');
        setIsLoading(false);
        return;
      }
      const { user } = await authService.login(credential, password);
      setSuccessMessage(`Đăng nhập thành công! Chào mừng ${user.fullName}`);
      setTimeout(() => {
        onUserChanged(user);
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng nhập không thành công.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }
    if (regUsername.trim().length < 3) {
      setErrorMessage('Tên đăng nhập phải có ít nhất 3 ký tự.');
      return;
    }
    if (regPassword && regPassword.length < 4) {
      setErrorMessage('Mật khẩu phải có ít nhất 4 ký tự.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);

    try {
      const { user } = await authService.register({
        fullName: regFullName,
        username: regUsername,
        password: regPassword || '123456',
        email: regEmail,
        role: regRole,
        grade: regGrade,
        school: regSchool,
      });

      setSuccessMessage(`Tài khoản "${user.username}" đã được lưu trữ thành công vào SQLite Database!`);
      setTimeout(() => {
        onUserChanged(user);
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng ký không thành công.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    onUserChanged(null);
    setSuccessMessage('Đã đăng xuất tài khoản thành công.');
    setMode('login');
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
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Tài Khoản & SQLite Database</h2>
              <p className="text-xs text-indigo-200">Quản lý tiến trình học tập cá nhân với SQLite</p>
            </div>
          </div>

          {/* SQLite Engine Status Badge */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>CSDL: <strong>SQLite 3</strong> (Lưu trữ độc lập)</span>
            </div>
            {sqliteInfo && (
              <span className="text-indigo-300 font-mono text-[10px]">
                {sqliteInfo.userCount} tài khoản trong DB
              </span>
            )}
          </div>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold p-1">
          {currentUser && (
            <button
              onClick={() => { setMode('profile'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'profile' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hồ Sơ
            </button>
          )}
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
            Đăng Ký Tài Khoản
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Notification Banners */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Tab 1: Profile View */}
          {mode === 'profile' && currentUser && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-indigo-50/70 to-slate-50 border border-indigo-100 rounded-2xl flex items-center gap-3.5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${currentUser.avatarColor || 'from-indigo-500 to-blue-600'} flex items-center justify-center text-white text-xl font-black shadow-md`}>
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">{currentUser.fullName}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {currentUser.role === 'teacher' ? 'Giáo viên' : currentUser.role === 'enthusiast' ? 'Tự học' : 'Học sinh'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">@{currentUser.username}</div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <School className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser.grade || 'Lớp 11 Tin Học'} - {currentUser.school || 'THPT'}</span>
                  </div>
                </div>
              </div>

              {/* Database info card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>Trạng thái lưu trữ SQLite</span>
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">
                  Tiến trình bài học, điểm số trắc nghiệm, bài tập SQL và bookmark của bạn được ghi nhận trực tiếp vào tệp CSDL <strong>sql_master.sqlite</strong>.
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Đăng nhập tài khoản khác</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất khỏi thiết bị này</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tên đăng nhập hoặc Email</span>
                </label>
                <input
                  type="text"
                  required
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  placeholder="Ví dụ: hoangnam hoặc nam@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mật khẩu</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Đang kết nối SQLite DB...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Đăng Nhập Ngay</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
                  className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Chưa có tài khoản? Nhấn vào đây để Đăng Ký
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: Registration Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Họ và tên của bạn <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Văn Nam"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Tên đăng nhập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="nam11a"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Email học tập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nam@thpt.edu.vn"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 4 ký tự"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Nhập lại mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Khớp với mật khẩu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Vai trò</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['student', 'teacher', 'enthusiast'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegRole(r)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        regRole === r
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r === 'student' ? 'Học sinh' : r === 'teacher' ? 'Giáo viên' : 'Tự học'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Lớp / Khối học</label>
                  <input
                    type="text"
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    placeholder="Lớp 11 Tin Học"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Trường học</label>
                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="Trường THPT"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Đang khởi tạo trong SQLite...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Đăng Ký & Khởi Tạo Tiến Trình SQLite</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                  className="text-xs text-slate-500 hover:text-indigo-600 cursor-pointer"
                >
                  Đã có tài khoản? <span className="font-bold text-indigo-600 underline">Đăng nhập</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
