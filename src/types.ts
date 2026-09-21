export type DifficultyLevel = 'co-ban' | 'trung-binh' | 'nang-cao';

export type CompetencyCategory = 
  | 'tong-quan-csdl'        // Nhóm 1: Kiến thức nền tảng CSDL & DBMS
  | 'csdl-quan-he'          // Nhóm 1 & 2: Mô hình dữ liệu quan hệ, Bảng, Khóa, Bộ, Thuộc tính
  | 'thiet-ke-rang-buoc'    // Nhóm 2: Thiết kế CSDL, ERD, Chuẩn hóa 1NF/2NF/3NF
  | 'dinh-nghia-du-lieu-ddl' // Nhóm 3: DDL & Ràng buộc toàn vẹn (CREATE, ALTER, DROP)
  | 'thao-tac-du-lieu-dml'  // Nhóm 3: Thao tác DML (INSERT, UPDATE, DELETE)
  | 'truy-van-co-ban'       // Nhóm 3: Truy vấn SQL DQL (SELECT, WHERE, ORDER BY, TOP/LIMIT)
  | 'gom-nhom-thong-ke'     // Nhóm 3: Gom nhóm & Hàm tổng hợp (GROUP BY, HAVING, AGGREGATE)
  | 'join-subquery'         // Nhóm 3: Truy vấn phức tạp (JOIN, Subquery, CASE, CTE)
  | 'quan-tri-toan-ven'     // Nhóm 3 & 4: Quản trị, View, Transaction (ACID) & An toàn CSDL
  | 'du-an-tong-hop';       // Nhóm 4: Dự án cơ sở dữ liệu tổng hợp (Capstone Project)

export interface ColumnDefinition {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  referencesTable?: string;
  referencesColumn?: string;
  nullable?: boolean;
  defaultValue?: string;
  constraintDescription?: string;
}

export interface TableSchema {
  name: string;
  displayName: string;
  description: string;
  columns: ColumnDefinition[];
  initialData: Record<string, any>[];
  isUserCreated?: boolean;
}

export interface DatabaseModel {
  id: string;
  name: string;
  description: string;
  tables: TableSchema[];
}

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  sqlExamples?: {
    title: string;
    description: string;
    sql: string;
    explanation: string;
    expectedResult?: string;
    commonErrorNote?: string;
  }[];
  teacherNote?: string;
  keyTakeaways: string[];
}

export interface NormalizationStep {
  form: 'Unnormalized' | '1NF' | '2NF' | '3NF';
  name: string;
  issueExplained: string;
  rule: string;
  tables: {
    name: string;
    primaryKey: string[];
    columns: string[];
    sampleData: Record<string, any>[];
  }[];
}

export interface ErdEntity {
  name: string;
  displayName: string;
  type: 'strong' | 'weak' | 'associative';
  primaryKey: string;
  attributes: { name: string; type: string; isKey?: boolean; isForeign?: boolean }[];
}

export interface ErdRelationship {
  from: string;
  to: string;
  cardinality: '1:1' | '1:N' | 'N:N';
  name: string;
  description: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  description: string;
  level: DifficultyLevel;
  competency: CompetencyCategory;
  estimatedMinutes: number;
  prerequisites?: string[];
  learningObjectives?: string[];
  sections: LessonSection[];
  suggestedPracticeSql?: string;
  relatedTable?: string;
  mermaidDiagram?: string;
  normalizationCase?: {
    title: string;
    scenario: string;
    steps: NormalizationStep[];
  };
  commonMistakes?: {
    mistake: string;
    correction: string;
    why: string;
  }[];
  practiceLevels?: {
    level1: string; // Mức 1: Nhận biết & Thông hiểu
    level2: string; // Mức 2: Vận dụng
    level3: string; // Mức 3: Vận dụng nâng cao
  };
  endOfLessonReview?: {
    summaryQuestion: string;
    sqlChallenge: string;
    scenarioQuestion: string;
    teacherAnswerKey: string;
  };
}

export interface Exercise {
  id: string;
  title: string;
  level: DifficultyLevel;
  competency: CompetencyCategory;
  databaseId: string;
  description: string;
  requirements: string[];
  initialSql: string;
  solutionSql: string;
  explanation: string;
  hints: string[];
  points: number;
  targetTableContext?: string;
  category?: 'query' | 'dml' | 'ddl';
  verificationTable?: string;
}

export interface QuizQuestion {
  id: string;
  competency: CompetencyCategory;
  level: DifficultyLevel;
  question: string;
  sqlSnippet?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  teacherTip?: string;
}

export interface QueryResult {
  success: boolean;
  data?: Record<string, any>[];
  columns?: string[];
  rowsAffected?: number;
  executionTimeMs?: number;
  error?: string;
  suggestedFix?: string;
}

export interface StudentProgress {
  studentName: string;
  grade: string;
  completedLessons: string[];
  completedExercises: Record<string, { score: number; completedAt: string; userSql: string }>;
  quizScores: Record<string, { selectedOption: string; isCorrect: boolean }>;
  streakDays: number;
  totalPoints: number;
  competencyScores: Record<CompetencyCategory, number>; // 0 to 100
}
