import { UserAccount, StudentProgress, BookmarkItem, LearningActivityLog } from '../types';

const USERS_STORAGE_KEY = 'sql_master_registered_users_v2';
const CURRENT_USER_KEY = 'sql_master_active_user_id_v2';
const LEGACY_PROGRESS_KEY = 'sql_master_student_progress_v1';

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'user-quan-1',
    username: 'nguyenminhquan',
    fullName: 'Nguyễn Minh Quân',
    email: 'minhquan.thpt@gmail.com',
    role: 'student',
    grade: 'Lớp 11 Tin Học - THPT Chuyên',
    avatarColor: 'from-indigo-500 to-blue-600',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'user-huong-2',
    username: 'lethihuong',
    fullName: 'Lê Thị Hương',
    email: 'thihuong.thpt@gmail.com',
    role: 'student',
    grade: 'Lớp 10A2 - THPT Ban Tự Nhiên',
    avatarColor: 'from-emerald-500 to-teal-600',
    createdAt: '2026-09-10T09:30:00.000Z',
  },
  {
    id: 'user-thaynam-3',
    username: 'thaynam',
    fullName: 'Thầy Trần Văn Nam',
    email: 'thaynam.tinhoc@edu.vn',
    role: 'teacher',
    grade: 'Tổ trưởng Bộ môn Tin học THPT',
    avatarColor: 'from-amber-500 to-orange-600',
    createdAt: '2026-08-15T10:00:00.000Z',
  },
];

export const INITIAL_PROGRESS_TEMPLATE: StudentProgress = {
  userId: '',
  studentName: '',
  grade: '',
  completedLessons: ['bai-1-tong-quan-csdl'],
  completedExercises: {},
  quizScores: {},
  streakDays: 1,
  totalPoints: 20,
  competencyScores: {
    'tong-quan-csdl': 70,
    'csdl-quan-he': 65,
    'thiet-ke-rang-buoc': 50,
    'truy-van-co-ban': 60,
    'gom-nhom-thong-ke': 40,
    'join-subquery': 30,
    'thao-tac-du-lieu-dml': 45,
    'dinh-nghia-du-lieu-ddl': 40,
    'quan-tri-toan-ven': 25,
    'du-an-tong-hop': 20,
  },
  bookmarks: [
    {
      id: 'bm-init-1',
      type: 'lesson',
      title: 'Chương 3: Phân tích và Thiết kế CSDL (ERD & 3NF)',
      subtitle: 'Quy tắc chuẩn hóa 1NF -> 2NF -> 3NF',
      targetId: 'bai-3-thiet-ke-csdl-erd-chuan-hoa',
      notes: 'Phần khử phụ thuộc bắc cầu rất hay ra trong bài kiểm tra định kỳ!',
      createdAt: '2026-09-18T14:20:00.000Z',
      tags: ['Chuẩn hóa', 'Thiết kế ERD', 'Trọng tâm'],
    },
    {
      id: 'bm-init-2',
      type: 'sql_example',
      title: 'Mẫu lệnh INNER JOIN nối SinhVien và Lop',
      subtitle: 'SELECT sv.HoTen, lp.TenLop FROM SinhVien sv INNER JOIN Lop lp ON sv.MaLop = lp.MaLop',
      targetId: 'bai-6-truy-van-nang-cao-join-subquery',
      sqlSnippet: 'SELECT sv.MaHS, sv.HoTen, lp.TenLop FROM HocSinh sv INNER JOIN Lop lp ON sv.MaLop = lp.MaLop;',
      notes: 'Lưu ý đặt alias ngắn gọn sv, lp để câu lệnh sáng sủa.',
      createdAt: '2026-09-19T09:15:00.000Z',
      tags: ['JOIN', 'Mẫu truy vấn'],
    },
  ],
  activityLogs: [
    {
      id: 'act-init-1',
      timestamp: '2026-09-20T10:00:00.000Z',
      type: 'lesson_completed',
      title: 'Hoàn thành Bài 1: Tổng quan về Cơ sở Dữ liệu',
      detail: 'Nắm vững phân biệt Dữ liệu vs Thông tin và vai trò của DBMS.',
      status: 'success',
      pointsEarned: 10,
    },
    {
      id: 'act-init-2',
      timestamp: '2026-09-20T10:30:00.000Z',
      type: 'sql_executed',
      title: 'Thực thi câu lệnh SELECT kiểm tra danh sách học sinh',
      detail: 'SELECT * FROM HocSinh; (Trả về 8 dòng dữ liệu thành công)',
      status: 'success',
    },
  ],
};

class AuthService {
  // Get all registered users
  getUsers(): UserAccount[] {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse registered users, resetting to default', e);
    }
    // Seed initial users
    this.saveUsers(DEFAULT_USERS);
    return DEFAULT_USERS;
  }

  saveUsers(users: UserAccount[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  // Get current active user
  getCurrentUser(): UserAccount {
    const users = this.getUsers();
    const activeId = localStorage.getItem(CURRENT_USER_KEY);
    if (activeId) {
      const found = users.find((u) => u.id === activeId);
      if (found) return found;
    }
    // Default to first user
    const defaultUser = users[0] || DEFAULT_USERS[0];
    localStorage.setItem(CURRENT_USER_KEY, defaultUser.id);
    return defaultUser;
  }

  // Switch/Login to user
  switchUser(userId: string): UserAccount {
    const users = this.getUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) {
      throw new Error('Người dùng không tồn tại.');
    }
    localStorage.setItem(CURRENT_USER_KEY, target.id);
    return target;
  }

  // Login with username/email & password
  login(credential: string, _password?: string): UserAccount {
    const users = this.getUsers();
    const clean = credential.trim().toLowerCase();
    const found = users.find(
      (u) => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean
    );
    if (!found) {
      throw new Error('Tài khoản hoặc Email không tồn tại trong hệ thống.');
    }
    localStorage.setItem(CURRENT_USER_KEY, found.id);
    return found;
  }

  // Register new account
  register(data: {
    username: string;
    fullName: string;
    email: string;
    role: 'student' | 'teacher' | 'enthusiast';
    grade: string;
  }): UserAccount {
    const users = this.getUsers();
    const cleanUsername = data.username.trim().toLowerCase();
    const cleanEmail = data.email.trim().toLowerCase();

    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      throw new Error('Tên đăng nhập này đã có người sử dụng. Vui lòng chọn tên khác.');
    }
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('Email này đã được đăng ký trong hệ thống.');
    }

    const colors = [
      'from-blue-600 to-indigo-600',
      'from-emerald-500 to-teal-700',
      'from-purple-600 to-pink-600',
      'from-amber-500 to-rose-600',
      'from-cyan-600 to-blue-700',
    ];
    const randomColor = colors[users.length % colors.length];

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      fullName: data.fullName.trim(),
      email: cleanEmail,
      role: data.role,
      grade: data.grade.trim() || 'Học sinh Tin học',
      avatarColor: randomColor,
      createdAt: new Date().toISOString(),
    };

    const updated = [...users, newUser];
    this.saveUsers(updated);
    localStorage.setItem(CURRENT_USER_KEY, newUser.id);

    // Initialize blank progress for new user
    const initialProgress: StudentProgress = {
      ...INITIAL_PROGRESS_TEMPLATE,
      userId: newUser.id,
      studentName: newUser.fullName,
      grade: newUser.grade,
      completedLessons: [],
      completedExercises: {},
      quizScores: {},
      streakDays: 1,
      totalPoints: 0,
      bookmarks: [],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'lesson_completed',
          title: 'Chào mừng gia nhập SQL Master!',
          detail: 'Tài khoản đã được khởi tạo thành công. Hãy bắt đầu từ Chương 1!',
          status: 'info',
        },
      ],
    };
    this.saveUserProgress(newUser.id, initialProgress);

    return newUser;
  }

  // Load progress for a specific user
  getUserProgress(userId: string): StudentProgress {
    const userKey = `sql_master_progress_${userId}`;
    try {
      const saved = localStorage.getItem(userKey);
      if (saved) {
        const parsed: StudentProgress = JSON.parse(saved);
        return {
          ...INITIAL_PROGRESS_TEMPLATE,
          ...parsed,
          userId,
          bookmarks: parsed.bookmarks || [],
          activityLogs: parsed.activityLogs || [],
        };
      }

      // Check legacy progress for first default user
      if (userId === 'user-quan-1') {
        const legacy = localStorage.getItem(LEGACY_PROGRESS_KEY);
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          const merged: StudentProgress = {
            ...INITIAL_PROGRESS_TEMPLATE,
            ...parsedLegacy,
            userId,
            bookmarks: parsedLegacy.bookmarks || INITIAL_PROGRESS_TEMPLATE.bookmarks,
            activityLogs: parsedLegacy.activityLogs || INITIAL_PROGRESS_TEMPLATE.activityLogs,
          };
          this.saveUserProgress(userId, merged);
          return merged;
        }
      }
    } catch (e) {
      console.warn(`Failed to read progress for user ${userId}`, e);
    }

    // Default template for user
    const user = this.getUsers().find((u) => u.id === userId);
    const initial: StudentProgress = {
      ...INITIAL_PROGRESS_TEMPLATE,
      userId,
      studentName: user?.fullName || 'Học sinh',
      grade: user?.grade || 'Tin học THPT',
    };
    this.saveUserProgress(userId, initial);
    return initial;
  }

  // Save progress for a specific user
  saveUserProgress(userId: string, progress: StudentProgress): void {
    const userKey = `sql_master_progress_${userId}`;
    const cleanProgress: StudentProgress = {
      ...progress,
      userId,
      bookmarks: progress.bookmarks || [],
      activityLogs: progress.activityLogs || [],
    };
    localStorage.setItem(userKey, JSON.stringify(cleanProgress));
  }

  // Bookmarks helper
  addBookmark(userId: string, bookmark: Omit<BookmarkItem, 'id' | 'createdAt'>): BookmarkItem {
    const progress = this.getUserProgress(userId);
    const newBookmark: BookmarkItem = {
      ...bookmark,
      id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updatedBookmarks = [newBookmark, ...(progress.bookmarks || [])];
    this.saveUserProgress(userId, {
      ...progress,
      bookmarks: updatedBookmarks,
    });
    return newBookmark;
  }

  removeBookmark(userId: string, bookmarkId: string): void {
    const progress = this.getUserProgress(userId);
    const updatedBookmarks = (progress.bookmarks || []).filter((b) => b.id !== bookmarkId);
    this.saveUserProgress(userId, {
      ...progress,
      bookmarks: updatedBookmarks,
    });
  }

  updateBookmarkNotes(userId: string, bookmarkId: string, notes: string): void {
    const progress = this.getUserProgress(userId);
    const updatedBookmarks = (progress.bookmarks || []).map((b) =>
      b.id === bookmarkId ? { ...b, notes } : b
    );
    this.saveUserProgress(userId, {
      ...progress,
      bookmarks: updatedBookmarks,
    });
  }

  // Activity Logs helper
  addActivityLog(userId: string, log: Omit<LearningActivityLog, 'id' | 'timestamp'>): void {
    const progress = this.getUserProgress(userId);
    const newLog: LearningActivityLog = {
      ...log,
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    // Keep last 100 logs
    const updatedLogs = [newLog, ...(progress.activityLogs || [])].slice(0, 100);
    this.saveUserProgress(userId, {
      ...progress,
      activityLogs: updatedLogs,
    });
  }

  clearActivityLogs(userId: string): void {
    const progress = this.getUserProgress(userId);
    this.saveUserProgress(userId, {
      ...progress,
      activityLogs: [],
    });
  }
}

export const authService = new AuthService();

// Convenience top-level exports for direct consumption across the app
export const getCurrentUser = (): UserAccount => authService.getCurrentUser();
export const getAllAccounts = (): UserAccount[] => authService.getUsers();

export const loginUser = (idOrUsername: string, password?: string): { success: boolean; user?: UserAccount; error?: string } => {
  try {
    const user = authService.login(idOrUsername, password);
    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Đăng nhập không thành công' };
  }
};

export const registerUser = (data: {
  username: string;
  fullName: string;
  email?: string;
  role?: 'student' | 'teacher' | 'enthusiast';
  grade?: string;
  school?: string;
  password?: string;
}): { success: boolean; user?: UserAccount; error?: string } => {
  try {
    const user = authService.register({
      username: data.username,
      fullName: data.fullName,
      email: data.email || `${data.username}@thpt.edu.vn`,
      role: data.role || 'student',
      grade: data.grade || 'Lớp 11 Tin Học - THPT',
    });
    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Đăng ký không thành công' };
  }
};

export const logoutUser = (): void => {
  const users = authService.getUsers();
  if (users.length > 0) {
    authService.switchUser(users[0].id);
  }
};

export const getUserProgress = (userId: string): StudentProgress => authService.getUserProgress(userId);

export const saveUserProgress = (userId: string, progress: StudentProgress): void => {
  authService.saveUserProgress(userId, progress);
};

export const addBookmarkToUser = (userId: string, bookmark: Omit<BookmarkItem, 'id' | 'createdAt'>): BookmarkItem => {
  return authService.addBookmark(userId, bookmark);
};

export const removeBookmarkFromUser = (userId: string, bookmarkId: string): void => {
  authService.removeBookmark(userId, bookmarkId);
};

export const updateUserBookmarkNotes = (userId: string, bookmarkId: string, notes: string): void => {
  authService.updateBookmarkNotes(userId, bookmarkId, notes);
};

export const addActivityLogToUser = (userId: string, log: Omit<LearningActivityLog, 'id' | 'timestamp'>): void => {
  authService.addActivityLog(userId, log);
};

export const clearUserActivityLogs = (userId: string): void => {
  authService.clearActivityLogs(userId);
};
