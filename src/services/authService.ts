import { UserAccount, StudentProgress, BookmarkItem, LearningActivityLog } from '../types';

const SQLITE_USERS_KEY = 'sql_master_sqlite_users_v3';
const CURRENT_USER_KEY = 'sql_master_sqlite_active_user_id_v3';
const SQLITE_PROGRESS_PREFIX = 'sql_master_sqlite_progress_';

// Purge any legacy mock users from old local storage
try {
  const legacyMockKeys = [
    'sql_master_registered_users_v2',
    'sql_master_active_user_id_v2',
    'sql_master_student_progress_v1',
    'sql_master_registered_users',
    'sql_master_active_user_id',
  ];
  for (const key of legacyMockKeys) {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  }
} catch (e) {
  // Ignore storage errors in non-browser environments
}

export const INITIAL_PROGRESS_TEMPLATE: StudentProgress = {
  userId: '',
  studentName: '',
  grade: '',
  completedLessons: [],
  completedExercises: {},
  quizScores: {},
  streakDays: 1,
  totalPoints: 0,
  competencyScores: {
    'tong-quan-csdl': 0,
    'csdl-quan-he': 0,
    'thiet-ke-rang-buoc': 0,
    'truy-van-co-ban': 0,
    'gom-nhom-thong-ke': 0,
    'join-subquery': 0,
    'thao-tac-du-lieu-dml': 0,
    'dinh-nghia-du-lieu-ddl': 0,
    'quan-tri-toan-ven': 0,
    'du-an-tong-hop': 0,
  },
  bookmarks: [],
  activityLogs: [],
};

class AuthService {
  private syncTimeoutMap: Map<string, any> = new Map();
  private syncedUsers: Set<string> = new Set();

  // Initialize and try to fetch registered users from SQLite server
  async syncUsersFromSqlite(): Promise<UserAccount[]> {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const users = await res.json();
        if (Array.isArray(users)) {
          this.saveUsersToCache(users);
          return users;
        }
      }
    } catch (e) {
      console.warn('Could not sync users from SQLite server API:', e);
    }
    return this.getUsersFromCache();
  }

  // Get users from cache
  getUsers(): UserAccount[] {
    return this.getUsersFromCache();
  }

  private getUsersFromCache(): UserAccount[] {
    try {
      const stored = localStorage.getItem(SQLITE_USERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse cached users', e);
    }
    return [];
  }

  private saveUsersToCache(users: UserAccount[]): void {
    try {
      localStorage.setItem(SQLITE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to cache users in localStorage', e);
    }
  }

  // Current active user
  getCurrentUser(): UserAccount | null {
    const users = this.getUsers();
    const activeId = localStorage.getItem(CURRENT_USER_KEY);
    if (activeId) {
      const found = users.find((u) => u.id === activeId);
      if (found) return found;
    }
    // If there are registered users, return the first one
    if (users.length > 0) {
      localStorage.setItem(CURRENT_USER_KEY, users[0].id);
      return users[0];
    }
    return null;
  }

  // Switch to another registered user
  switchUser(userId: string): UserAccount {
    const users = this.getUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) {
      throw new Error('Người dùng không tồn tại trong SQLite Database.');
    }
    localStorage.setItem(CURRENT_USER_KEY, target.id);
    return target;
  }

  // Logout current user
  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // Login with username/email & password against SQLite backend
  async login(credential: string, password?: string): Promise<{ user: UserAccount; progress: StudentProgress }> {
    const clean = credential.trim().toLowerCase();
    
    // First attempt SQLite server API login
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: clean, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Đăng nhập không thành công.');
      }
      
      const user: UserAccount = data.user;
      const progress: StudentProgress = data.progress;

      // Update local cache
      const currentUsers = this.getUsers().filter((u) => u.id !== user.id);
      this.saveUsersToCache([user, ...currentUsers]);
      localStorage.setItem(CURRENT_USER_KEY, user.id);
      this.saveUserProgressToCache(user.id, progress);

      return { user, progress };
    } catch (apiErr: any) {
      // If network fails, check cached users as fallback
      const cachedUsers = this.getUsers();
      const found = cachedUsers.find(
        (u) => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean
      );
      if (found) {
        localStorage.setItem(CURRENT_USER_KEY, found.id);
        const progress = this.getUserProgress(found.id);
        return { user: found, progress };
      }
      throw new Error(apiErr.message || 'Không tìm thấy tài khoản trong SQLite Database.');
    }
  }

  // Register new account into SQLite backend
  async register(data: {
    username: string;
    password?: string;
    fullName: string;
    email: string;
    role?: 'student' | 'teacher' | 'enthusiast';
    grade?: string;
    school?: string;
  }): Promise<{ user: UserAccount; progress: StudentProgress }> {
    const cleanUsername = data.username.trim().toLowerCase();
    const cleanEmail = data.email.trim().toLowerCase();

    if (!cleanUsername || cleanUsername.length < 3) {
      throw new Error('Tên đăng nhập phải có ít nhất 3 ký tự.');
    }
    if (!data.fullName.trim()) {
      throw new Error('Vui lòng nhập Họ và Tên của bạn.');
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Vui lòng nhập định dạng Email hợp lệ.');
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          password: data.password || '123456',
          fullName: data.fullName.trim(),
          email: cleanEmail,
          role: data.role || 'student',
          grade: data.grade?.trim() || 'Lớp 11 Tin Học - THPT',
          school: data.school?.trim() || 'Trường THPT',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Đăng ký vào SQLite Database thất bại.');
      }

      const user: UserAccount = json.user;
      const progress: StudentProgress = json.progress;

      // Update local storage cache
      const currentUsers = this.getUsers().filter((u) => u.id !== user.id);
      this.saveUsersToCache([user, ...currentUsers]);
      localStorage.setItem(CURRENT_USER_KEY, user.id);
      this.saveUserProgressToCache(user.id, progress);

      return { user, progress };
    } catch (err: any) {
      throw new Error(err.message || 'Lỗi khi kết nối với SQLite Database.');
    }
  }

  // Load progress for user
  getUserProgress(userId: string): StudentProgress {
    const cached = this.getUserProgressFromCache(userId);
    if (cached) {
      // Async refresh from SQLite server only once per session
      if (!this.syncedUsers.has(userId) && userId !== 'guest_session') {
        this.syncedUsers.add(userId);
        this.fetchProgressFromSqlite(userId).catch(() => {});
      }
      return cached;
    }

    // Default template if brand new
    const initial: StudentProgress = {
      ...INITIAL_PROGRESS_TEMPLATE,
      userId,
      studentName: 'Học sinh',
      grade: 'Lớp 11 Tin Học - THPT',
    };
    this.saveUserProgressToCache(userId, initial);
    if (userId !== 'guest_session') {
      this.fetchProgressFromSqlite(userId).catch(() => {});
    }
    return initial;
  }

  private getUserProgressFromCache(userId: string): StudentProgress | null {
    try {
      const saved = localStorage.getItem(`${SQLITE_PROGRESS_PREFIX}${userId}`);
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
    } catch (e) {
      console.warn(`Failed to read progress cache for ${userId}`, e);
    }
    return null;
  }

  private saveUserProgressToCache(userId: string, progress: StudentProgress): void {
    try {
      localStorage.setItem(`${SQLITE_PROGRESS_PREFIX}${userId}`, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to cache progress to localStorage', e);
    }
  }

  async fetchProgressFromSqlite(userId: string): Promise<StudentProgress | null> {
    try {
      const res = await fetch(`/api/progress/${userId}`);
      if (res.ok) {
        const prog = await res.json();
        if (prog && prog.userId) {
          this.saveUserProgressToCache(userId, prog);
          return prog;
        }
      }
    } catch (e) {
      // Ignore background fetch failures
    }
    return null;
  }

  // Save progress: update cache immediately & debounced push to SQLite server
  saveUserProgress(userId: string, progress: StudentProgress): void {
    this.saveUserProgressToCache(userId, progress);

    // Debounced sync to SQLite backend
    if (this.syncTimeoutMap.has(userId)) {
      clearTimeout(this.syncTimeoutMap.get(userId));
    }

    const timer = setTimeout(async () => {
      try {
        await fetch(`/api/progress/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progress),
        });
      } catch (err) {
        console.warn('Failed to push progress to SQLite backend', err);
      }
    }, 400);

    this.syncTimeoutMap.set(userId, timer);
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
    const nextProg: StudentProgress = {
      ...progress,
      bookmarks: updatedBookmarks,
    };
    this.saveUserProgress(userId, nextProg);
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

  // SQLite Database status fetcher
  async getDatabaseStats(): Promise<{
    engine: string;
    dbPath: string;
    fileSizeBytes: number;
    userCount: number;
    progressCount: number;
    lastPersisted: string;
  } | null> {
    try {
      const res = await fetch('/api/sqlite/stats');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Could not fetch SQLite stats', e);
    }
    return null;
  }
}

export const authService = new AuthService();

// Convenience top-level exports
export const getCurrentUser = (): UserAccount | null => authService.getCurrentUser();
export const getAllAccounts = (): UserAccount[] => authService.getUsers();

export const loginUser = async (
  idOrUsername: string,
  password?: string
): Promise<{ success: boolean; user?: UserAccount; progress?: StudentProgress; error?: string }> => {
  try {
    const { user, progress } = await authService.login(idOrUsername, password);
    return { success: true, user, progress };
  } catch (err: any) {
    return { success: false, error: err.message || 'Đăng nhập không thành công' };
  }
};

export const registerUser = async (data: {
  username: string;
  fullName: string;
  email: string;
  password?: string;
  role?: 'student' | 'teacher' | 'enthusiast';
  grade?: string;
  school?: string;
}): Promise<{ success: boolean; user?: UserAccount; progress?: StudentProgress; error?: string }> => {
  try {
    const { user, progress } = await authService.register(data);
    return { success: true, user, progress };
  } catch (err: any) {
    return { success: false, error: err.message || 'Đăng ký không thành công' };
  }
};

export const logoutUser = (): void => {
  authService.logout();
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

export const fetchSqliteStats = () => authService.getDatabaseStats();
