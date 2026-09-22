import initSqlJs, { Database } from "sql.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface SqliteUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "student" | "teacher" | "enthusiast";
  grade: string;
  school?: string;
  avatarColor?: string;
  createdAt: string;
}

export interface SqliteProgress {
  userId: string;
  studentName: string;
  grade: string;
  completedLessons: string[];
  completedExercises: Record<string, { score: number; completedAt: string; userSql: string }>;
  quizScores: Record<string, { selectedOption: string; isCorrect: boolean }>;
  streakDays: number;
  totalPoints: number;
  competencyScores: Record<string, number>;
  bookmarks: any[];
  activityLogs: any[];
  updatedAt: string;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "sql_master.sqlite");

let dbInstance: Database | null = null;

function hashPassword(password: string, salt: string = "sql_salt_2026"): string {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

export async function getSqliteDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(fileBuffer);
    } catch (err) {
      console.warn("Could not read existing SQLite file, creating new one", err);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Initialize SQLite tables
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      grade TEXT,
      school TEXT,
      avatar_color TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS progress (
      user_id TEXT PRIMARY KEY,
      student_name TEXT NOT NULL,
      grade TEXT,
      completed_lessons TEXT NOT NULL,
      completed_exercises TEXT NOT NULL,
      quiz_scores TEXT NOT NULL,
      streak_days INTEGER NOT NULL DEFAULT 1,
      total_points INTEGER NOT NULL DEFAULT 0,
      competency_scores TEXT NOT NULL,
      bookmarks TEXT NOT NULL,
      activity_logs TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  persistDatabase();
  return dbInstance;
}

export function persistDatabase(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error("Failed to persist SQLite database to disk:", err);
  }
}

// User methods
export async function sqliteRegisterUser(data: {
  username: string;
  password?: string;
  fullName: string;
  email: string;
  role?: "student" | "teacher" | "enthusiast";
  grade?: string;
  school?: string;
}): Promise<SqliteUser> {
  const db = await getSqliteDb();

  const cleanUsername = data.username.trim().toLowerCase();
  const cleanEmail = data.email.trim().toLowerCase();

  // Check unique username
  const checkStmt = db.prepare("SELECT id FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?");
  checkStmt.bind([cleanUsername, cleanEmail]);
  if (checkStmt.step()) {
    checkStmt.free();
    throw new Error("Tên đăng nhập hoặc email đã tồn tại trong SQLite Database. Vui lòng chọn thông tin khác.");
  }
  checkStmt.free();

  const userId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const password = data.password || "123456";
  const passwordHash = hashPassword(password);
  const fullName = data.fullName.trim();
  const role = data.role || "student";
  const grade = data.grade?.trim() || "Lớp 11 Tin Học - THPT";
  const school = data.school?.trim() || "THPT";
  const createdAt = new Date().toISOString();

  const colors = [
    "from-indigo-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-purple-500 to-indigo-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-red-600",
    "from-cyan-500 to-blue-600",
  ];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  // Insert into SQLite users table
  const insertUserStmt = db.prepare(`
    INSERT INTO users (id, username, password_hash, full_name, email, role, grade, school, avatar_color, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertUserStmt.run([userId, cleanUsername, passwordHash, fullName, cleanEmail, role, grade, school, avatarColor, createdAt]);
  insertUserStmt.free();

  // Initialize initial progress in SQLite progress table
  const defaultCompetency = {
    "tong-quan-csdl": 0,
    "csdl-quan-he": 0,
    "thiet-ke-rang-buoc": 0,
    "dinh-nghia-du-lieu-ddl": 0,
    "thao-tac-du-lieu-dml": 0,
    "truy-van-co-ban": 0,
    "gom-nhom-thong-ke": 0,
    "join-subquery": 0,
    "quan-tri-toan-ven": 0,
    "du-an-tong-hop": 0,
  };

  const initialLog = [
    {
      id: `act_${Date.now()}`,
      timestamp: createdAt,
      type: "lesson_completed",
      title: "Đăng ký tài khoản thành công",
      detail: `Tài khoản ${cleanUsername} đã được khởi tạo trong SQLite Database!`,
      status: "success",
      pointsEarned: 10,
    },
  ];

  const insertProgStmt = db.prepare(`
    INSERT INTO progress (
      user_id, student_name, grade, completed_lessons, completed_exercises,
      quiz_scores, streak_days, total_points, competency_scores, bookmarks, activity_logs, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertProgStmt.run([
    userId,
    fullName,
    grade,
    JSON.stringify([]),
    JSON.stringify({}),
    JSON.stringify({}),
    1,
    10, // Welcome points
    JSON.stringify(defaultCompetency),
    JSON.stringify([]),
    JSON.stringify(initialLog),
    createdAt,
  ]);
  insertProgStmt.free();

  persistDatabase();

  return {
    id: userId,
    username: cleanUsername,
    fullName,
    email: cleanEmail,
    role,
    grade,
    school,
    avatarColor,
    createdAt,
  };
}

export async function sqliteLoginUser(credential: string, password?: string): Promise<{ user: SqliteUser; progress: SqliteProgress }> {
  const db = await getSqliteDb();
  const clean = credential.trim().toLowerCase();

  const stmt = db.prepare("SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?");
  stmt.bind([clean, clean]);

  if (!stmt.step()) {
    stmt.free();
    throw new Error("Không tìm thấy tài khoản với tên đăng nhập hoặc email này trong SQLite Database.");
  }

  const row = stmt.getAsObject() as any;
  stmt.free();

  if (password && row.password_hash) {
    const checkHash = hashPassword(password);
    if (checkHash !== row.password_hash) {
      throw new Error("Mật khẩu không chính xác. Vui lòng kiểm tra lại.");
    }
  }

  const user: SqliteUser = {
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    email: row.email,
    role: row.role as any,
    grade: row.grade,
    school: row.school,
    avatarColor: row.avatar_color,
    createdAt: row.created_at,
  };

  const progress = await sqliteGetProgress(user.id);

  return { user, progress };
}

export async function sqliteGetUsers(): Promise<SqliteUser[]> {
  const db = await getSqliteDb();
  const stmt = db.prepare("SELECT id, username, full_name, email, role, grade, school, avatar_color, created_at FROM users ORDER BY created_at DESC");
  const users: SqliteUser[] = [];

  while (stmt.step()) {
    const row = stmt.getAsObject() as any;
    users.push({
      id: row.id,
      username: row.username,
      fullName: row.full_name,
      email: row.email,
      role: row.role as any,
      grade: row.grade,
      school: row.school,
      avatarColor: row.avatar_color,
      createdAt: row.created_at,
    });
  }
  stmt.free();
  return users;
}

export async function sqliteGetProgress(userId: string): Promise<SqliteProgress> {
  const db = await getSqliteDb();
  const stmt = db.prepare("SELECT * FROM progress WHERE user_id = ?");
  stmt.bind([userId]);

  if (stmt.step()) {
    const row = stmt.getAsObject() as any;
    stmt.free();

    return {
      userId: row.user_id,
      studentName: row.student_name,
      grade: row.grade,
      completedLessons: JSON.parse(row.completed_lessons || "[]"),
      completedExercises: JSON.parse(row.completed_exercises || "{}"),
      quizScores: JSON.parse(row.quiz_scores || "{}"),
      streakDays: row.streak_days || 1,
      totalPoints: row.total_points || 0,
      competencyScores: JSON.parse(row.competency_scores || "{}"),
      bookmarks: JSON.parse(row.bookmarks || "[]"),
      activityLogs: JSON.parse(row.activity_logs || "[]"),
      updatedAt: row.updated_at,
    };
  }
  stmt.free();

  // If user exists in users table but not in progress table yet, create default
  const userStmt = db.prepare("SELECT full_name, grade FROM users WHERE id = ?");
  userStmt.bind([userId]);
  let name = "Học sinh";
  let grade = "Tin học THPT";
  if (userStmt.step()) {
    const u = userStmt.getAsObject() as any;
    name = u.full_name;
    grade = u.grade;
  }
  userStmt.free();

  const now = new Date().toISOString();
  const defaultProg: SqliteProgress = {
    userId,
    studentName: name,
    grade,
    completedLessons: [],
    completedExercises: {},
    quizScores: {},
    streakDays: 1,
    totalPoints: 10,
    competencyScores: {},
    bookmarks: [],
    activityLogs: [],
    updatedAt: now,
  };

  // Directly insert into progress table without calling sqliteSaveProgress to avoid recursion
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO progress (
      user_id, student_name, grade, completed_lessons, completed_exercises,
      quiz_scores, streak_days, total_points, competency_scores, bookmarks, activity_logs, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertStmt.run([
    userId,
    defaultProg.studentName,
    defaultProg.grade,
    JSON.stringify(defaultProg.completedLessons),
    JSON.stringify(defaultProg.completedExercises),
    JSON.stringify(defaultProg.quizScores),
    defaultProg.streakDays,
    defaultProg.totalPoints,
    JSON.stringify(defaultProg.competencyScores),
    JSON.stringify(defaultProg.bookmarks),
    JSON.stringify(defaultProg.activityLogs),
    defaultProg.updatedAt,
  ]);
  insertStmt.free();
  persistDatabase();

  return defaultProg;
}

export async function sqliteSaveProgress(userId: string, data: Partial<SqliteProgress>): Promise<SqliteProgress> {
  const db = await getSqliteDb();

  // Query existing row directly without calling sqliteGetProgress to avoid circular recursion
  let existing: any = null;
  const selectStmt = db.prepare("SELECT * FROM progress WHERE user_id = ?");
  selectStmt.bind([userId]);
  if (selectStmt.step()) {
    existing = selectStmt.getAsObject();
  }
  selectStmt.free();

  let existingCompletedLessons = [];
  let existingCompletedExercises = {};
  let existingQuizScores = {};
  let existingCompetencyScores = {};
  let existingBookmarks = [];
  let existingActivityLogs = [];

  try {
    if (existing?.completed_lessons) existingCompletedLessons = JSON.parse(existing.completed_lessons);
    if (existing?.completed_exercises) existingCompletedExercises = JSON.parse(existing.completed_exercises);
    if (existing?.quiz_scores) existingQuizScores = JSON.parse(existing.quiz_scores);
    if (existing?.competency_scores) existingCompetencyScores = JSON.parse(existing.competency_scores);
    if (existing?.bookmarks) existingBookmarks = JSON.parse(existing.bookmarks);
    if (existing?.activity_logs) existingActivityLogs = JSON.parse(existing.activity_logs);
  } catch (e) {
    // Ignore JSON parse errors on existing data
  }

  const merged: SqliteProgress = {
    userId,
    studentName: data.studentName || existing?.student_name || "Học sinh",
    grade: data.grade || existing?.grade || "Lớp 11 Tin Học - THPT",
    completedLessons: data.completedLessons ?? existingCompletedLessons,
    completedExercises: data.completedExercises ?? existingCompletedExercises,
    quizScores: data.quizScores ?? existingQuizScores,
    streakDays: data.streakDays ?? (existing?.streak_days || 1),
    totalPoints: data.totalPoints ?? (existing?.total_points || 0),
    competencyScores: data.competencyScores ?? existingCompetencyScores,
    bookmarks: data.bookmarks ?? existingBookmarks,
    activityLogs: data.activityLogs ?? existingActivityLogs,
    updatedAt: new Date().toISOString(),
  };

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO progress (
      user_id, student_name, grade, completed_lessons, completed_exercises,
      quiz_scores, streak_days, total_points, competency_scores, bookmarks, activity_logs, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run([
    userId,
    merged.studentName,
    merged.grade,
    JSON.stringify(merged.completedLessons),
    JSON.stringify(merged.completedExercises),
    JSON.stringify(merged.quizScores),
    merged.streakDays,
    merged.totalPoints,
    JSON.stringify(merged.competencyScores),
    JSON.stringify(merged.bookmarks),
    JSON.stringify(merged.activityLogs),
    merged.updatedAt,
  ]);
  stmt.free();

  persistDatabase();
  return merged;
}

export async function sqliteGetDatabaseStats(): Promise<{
  engine: string;
  dbPath: string;
  fileSizeBytes: number;
  userCount: number;
  progressCount: number;
  lastPersisted: string;
}> {
  const db = await getSqliteDb();

  let userCount = 0;
  let progressCount = 0;

  const uStmt = db.prepare("SELECT COUNT(*) as c FROM users");
  if (uStmt.step()) userCount = (uStmt.getAsObject() as any).c;
  uStmt.free();

  const pStmt = db.prepare("SELECT COUNT(*) as c FROM progress");
  if (pStmt.step()) progressCount = (pStmt.getAsObject() as any).c;
  pStmt.free();

  let fileSizeBytes = 0;
  if (fs.existsSync(DB_FILE)) {
    fileSizeBytes = fs.statSync(DB_FILE).size;
  }

  return {
    engine: "SQLite 3 (sql.js / WebAssembly) with On-Disk File Persistence",
    dbPath: DB_FILE,
    fileSizeBytes,
    userCount,
    progressCount,
    lastPersisted: new Date().toISOString(),
  };
}
