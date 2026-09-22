import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LessonViewer } from './components/LessonViewer';
import { SqlPlayground } from './components/SqlPlayground';
import { DatabaseSchemaViewer } from './components/DatabaseSchemaViewer';
import { ExercisesModule } from './components/ExercisesModule';
import { QuizzesModule } from './components/QuizzesModule';
import { CompetencyReport } from './components/CompetencyReport';
import { ErdNormalizationStudio } from './components/ErdNormalizationStudio';
import { AiTutorModal } from './components/AiTutorModal';
import { AuthModal } from './components/AuthModal';
import { BookmarksModule } from './components/BookmarksModule';
import { LearningHistoryModule } from './components/LearningHistoryModule';
import { 
  StudentProgress, 
  CompetencyCategory, 
  Exercise, 
  UserAccount, 
  BookmarkItem,
  Lesson,
  QueryResult 
} from './types';
import { 
  getCurrentUser, 
  getAllAccounts, 
  loginUser, 
  registerUser, 
  logoutUser, 
  getUserProgress, 
  saveUserProgress, 
  addBookmarkToUser, 
  removeBookmarkFromUser, 
  updateUserBookmarkNotes,
  addActivityLogToUser,
  clearUserActivityLogs
} from './services/authService';
import { 
  BookOpen, 
  CheckSquare, 
  Award, 
  HelpCircle, 
  Bookmark, 
  History,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUser());
  const [accounts, setAccounts] = useState<UserAccount[]>(() => getAllAccounts());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const effectiveUserId = currentUser ? currentUser.id : 'guest_session';

  const [activeTab, setActiveTab] = useState<string>('lessons');
  const [currentDbId, setCurrentDbId] = useState<string>('QuanLyHocSinh');
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState<boolean>(false);
  const [playgroundSql, setPlaygroundSql] = useState<string>('SELECT * FROM HocSinh;');

  // Navigation targets from bookmarks/history
  const [targetLessonId, setTargetLessonId] = useState<string | undefined>(undefined);
  const [targetExerciseId, setTargetExerciseId] = useState<string | undefined>(undefined);

  // AI Tutor Modal state
  const [aiModal, setAiModal] = useState<{
    isOpen: boolean;
    sql: string;
    error?: string;
    contextTitle?: string;
  }>({
    isOpen: false,
    sql: '',
    error: undefined,
    contextTitle: undefined,
  });

  // Current user's learning progress and activity history from SQLite
  const [progress, setProgress] = useState<StudentProgress>(() => getUserProgress(effectiveUserId));

  // When user switches or registers, sync progress to state
  useEffect(() => {
    const userProg = getUserProgress(effectiveUserId);
    setProgress(userProg);
  }, [effectiveUserId]);

  // Persist progress to local user storage & SQLite
  const updateProgress = (updater: (prev: StudentProgress) => StudentProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveUserProgress(effectiveUserId, next);
      return next;
    });
  };

  // Switch / Login user
  const handleLogin = async (identifier: string, password?: string) => {
    const res = await loginUser(identifier, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setAccounts(getAllAccounts());
      const loadedProgress = getUserProgress(res.user.id);
      setProgress(loadedProgress);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  // Register user
  const handleRegister = async (data: { username: string; fullName: string; email: string; grade?: string; school?: string; password?: string }) => {
    const res = await registerUser(data);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setAccounts(getAllAccounts());
      const loadedProgress = getUserProgress(res.user.id);
      setProgress(loadedProgress);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setProgress(getUserProgress('guest_session'));
  };

  // Toggle completion of a lesson
  const handleToggleCompleteLesson = (lessonId: string) => {
    updateProgress((prev) => {
      const isDone = prev.completedLessons.includes(lessonId);
      const newCompleted = isDone
        ? prev.completedLessons.filter((id) => id !== lessonId)
        : [...prev.completedLessons, lessonId];

      const pointsDiff = isDone ? -10 : 10;

      // Log activity if completed
      if (!isDone) {
        addActivityLogToUser(effectiveUserId, {
          type: 'lesson_completed',
          title: `Hoàn thành bài học: ${lessonId}`,
          detail: 'Đã hoàn thành phần lý thuyết & câu hỏi trắc nghiệm kiểm tra.',
          pointsEarned: 10,
          status: 'success',
        });
      }

      return {
        ...prev,
        completedLessons: newCompleted,
        totalPoints: Math.max(0, prev.totalPoints + pointsDiff),
        competencyScores: {
          ...prev.competencyScores,
          'csdl-quan-he': Math.min(100, prev.competencyScores['csdl-quan-he'] + (isDone ? -5 : 5)),
        },
      };
    });
  };

  // Complete an exercise
  const handleExerciseCompleted = (
    exerciseId: string,
    score: number,
    userSql: string,
    competency: CompetencyCategory
  ) => {
    updateProgress((prev) => {
      const alreadyDone = !!prev.completedExercises[exerciseId];
      const newScore = prev.totalPoints + (alreadyDone ? 0 : score);

      addActivityLogToUser(effectiveUserId, {
        type: 'exercise_submitted',
        title: `Nộp bài tập: ${exerciseId}`,
        detail: `Lệnh SQL: ${userSql.slice(0, 100)}`,
        pointsEarned: alreadyDone ? 0 : score,
        status: score > 0 ? 'success' : 'failed',
        metadata: { exerciseId, sql: userSql },
      });

      return {
        ...prev,
        totalPoints: newScore,
        completedExercises: {
          ...prev.completedExercises,
          [exerciseId]: {
            score,
            completedAt: new Date().toISOString(),
            userSql,
          },
        },
        competencyScores: {
          ...prev.competencyScores,
          [competency]: Math.min(100, (prev.competencyScores[competency] || 50) + (alreadyDone ? 2 : 12)),
        },
      };
    });
  };

  // Answer a quiz question
  const handleAnswerQuiz = (
    quizId: string,
    selectedOption: string,
    isCorrect: boolean,
    competency: CompetencyCategory
  ) => {
    updateProgress((prev) => {
      const alreadyAnswered = !!prev.quizScores[quizId];
      const pointsDiff = isCorrect && !alreadyAnswered ? 5 : 0;

      addActivityLogToUser(effectiveUserId, {
        type: 'quiz_answered',
        title: `Trả lời câu hỏi trắc nghiệm: ${quizId}`,
        detail: `Đáp án chọn: ${selectedOption} (${isCorrect ? 'Chính xác' : 'Chưa đúng'})`,
        pointsEarned: pointsDiff,
        status: isCorrect ? 'success' : 'failed',
      });

      return {
        ...prev,
        totalPoints: prev.totalPoints + pointsDiff,
        quizScores: {
          ...prev.quizScores,
          [quizId]: { selectedOption, isCorrect },
        },
        competencyScores: {
          ...prev.competencyScores,
          [competency]: Math.min(
            100,
            (prev.competencyScores[competency] || 50) + (isCorrect ? 8 : -2)
          ),
        },
      };
    });
  };

  // Log SQL execution in history
  const handleLogSqlExecution = (sql: string, result: QueryResult) => {
    addActivityLogToUser(effectiveUserId, {
      type: 'sql_executed',
      title: result.success ? 'Thực thi SQL thành công' : 'Lỗi thực thi SQL',
      detail: sql,
      status: result.success ? 'success' : 'failed',
      metadata: {
        sql,
        databaseId: currentDbId,
        rowCount: result.data ? result.data.length : result.rowsAffected,
      },
    });
    // refresh progress
    setProgress(getUserProgress(effectiveUserId));
  };

  // Bookmark handlers
  const handleToggleBookmarkLesson = (lesson: Lesson) => {
    const existing = (progress.bookmarks || []).find(
      (b) => b.type === 'lesson' && b.targetId === lesson.id
    );
    if (existing) {
      removeBookmarkFromUser(effectiveUserId, existing.id);
    } else {
      addBookmarkToUser(effectiveUserId, {
        type: 'lesson',
        title: lesson.title,
        description: lesson.description,
        targetId: lesson.id,
        category: lesson.chapterTitle,
        tags: [lesson.level, 'Lý thuyết'],
      });
    }
    setProgress(getUserProgress(effectiveUserId));
  };

  const handleToggleBookmarkExercise = (exercise: Exercise) => {
    const existing = (progress.bookmarks || []).find(
      (b) => b.type === 'exercise' && b.targetId === exercise.id
    );
    if (existing) {
      removeBookmarkFromUser(effectiveUserId, existing.id);
    } else {
      addBookmarkToUser(effectiveUserId, {
        type: 'exercise',
        title: exercise.title,
        description: exercise.description,
        targetId: exercise.id,
        category: `Bài tập • CSDL ${exercise.databaseId}`,
        tags: [exercise.level, exercise.category || 'Truy vấn'],
      });
    }
    setProgress(getUserProgress(effectiveUserId));
  };

  const handleBookmarkSqlSnippet = (sql: string, note?: string) => {
    addBookmarkToUser(effectiveUserId, {
      type: 'sql_snippet',
      title: note || `Lệnh SQL ${new Date().toLocaleTimeString()}`,
      sqlCode: sql,
      description: 'Lưu từ trình soạn thảo SQL Playground.',
      category: `CSDL ${currentDbId}`,
      tags: ['T-SQL', currentDbId],
    });
    setProgress(getUserProgress(effectiveUserId));
  };

  const handleBookmarkSqlExampleFromLesson = (
    example: { title: string; sql: string; explanation: string },
    lessonTitle: string
  ) => {
    addBookmarkToUser(effectiveUserId, {
      type: 'sql_snippet',
      title: example.title,
      sqlCode: example.sql,
      description: example.explanation,
      category: lessonTitle,
      tags: ['Mẫu lệnh', 'Lý thuyết'],
    });
    setProgress(getUserProgress(effectiveUserId));
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    removeBookmarkFromUser(effectiveUserId, bookmarkId);
    setProgress(getUserProgress(effectiveUserId));
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử hoạt động cá nhân?')) {
      clearUserActivityLogs(effectiveUserId);
      setProgress(getUserProgress(effectiveUserId));
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Khôi phục tiến trình học tập của tài khoản này về ban đầu?')) {
      updateProgress((prev) => ({
        ...prev,
        completedLessons: [],
        completedExercises: {},
        quizScores: {},
        totalPoints: 0,
        competencyScores: {
          'tong-quan-csdl': 30,
          'csdl-quan-he': 30,
          'thiet-ke-rang-buoc': 30,
          'truy-van-co-ban': 30,
          'gom-nhom-thong-ke': 20,
          'join-subquery': 15,
          'thao-tac-du-lieu-dml': 20,
          'dinh-nghia-du-lieu-ddl': 20,
          'quan-tri-toan-ven': 10,
          'du-an-tong-hop': 10,
        },
      }));
    }
  };

  const handleSendToPlayground = (sql: string) => {
    setPlaygroundSql(sql);
    setActiveTab('playground');
  };

  const handleOpenAiModal = (sql: string, error?: string, contextTitle?: string) => {
    setAiModal({
      isOpen: true,
      sql,
      error,
      contextTitle,
    });
  };

  // Sub-tabs for Exercises / Quizzes
  const [exerciseMode, setExerciseMode] = useState<'coding' | 'quiz'>('coding');

  // App Content Component
  const renderAppContent = () => (
    <div className="space-y-6">
      {/* Tab 1: Lesson Viewer */}
      {activeTab === 'lessons' && (
        <LessonViewer
          completedLessons={progress.completedLessons}
          onToggleCompleteLesson={handleToggleCompleteLesson}
          onRunSqlInPlayground={handleSendToPlayground}
          onOpenErdStudio={() => setActiveTab('erd')}
          bookmarks={progress.bookmarks || []}
          onToggleBookmarkLesson={handleToggleBookmarkLesson}
          onBookmarkSqlExample={handleBookmarkSqlExampleFromLesson}
          initialSelectedLessonId={targetLessonId}
        />
      )}

      {/* Tab: ERD & Normalization Studio */}
      {activeTab === 'erd' && (
        <ErdNormalizationStudio
          onRunSqlInPlayground={handleSendToPlayground}
        />
      )}

      {/* Tab 2: Interactive SQL Playground */}
      {activeTab === 'playground' && (
        <SqlPlayground
          currentDbId={currentDbId}
          setCurrentDbId={setCurrentDbId}
          initialSql={playgroundSql}
          onAskAiTutor={(sql, error) => handleOpenAiModal(sql, error, 'Chạy thử câu lệnh T-SQL')}
          onBookmarkSql={handleBookmarkSqlSnippet}
          onSqlExecuted={handleLogSqlExecution}
        />
      )}

      {/* Tab 3: Database Schema & Visual Relational Model */}
      {activeTab === 'schema' && (
        <DatabaseSchemaViewer
          currentDbId={currentDbId}
          onSendToPlayground={handleSendToPlayground}
        />
      )}

      {/* Tab 4: Exercises & Quizzes */}
      {activeTab === 'exercises' && (
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold shadow-2xs">
              <button
                id="tab-mode-coding"
                onClick={() => setExerciseMode('coding')}
                className={`px-5 py-2 rounded-xl transition-all cursor-pointer ${
                  exerciseMode === 'coding'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bài tập Viết lệnh SQL (Chấm tự động)
              </button>
              <button
                id="tab-mode-quiz"
                onClick={() => setExerciseMode('quiz')}
                className={`px-5 py-2 rounded-xl transition-all cursor-pointer ${
                  exerciseMode === 'quiz'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trắc nghiệm Khái niệm CSDL
              </button>
            </div>
          </div>

          {exerciseMode === 'coding' ? (
            <ExercisesModule
              completedExercises={progress.completedExercises}
              onExerciseCompleted={handleExerciseCompleted}
              onAskAiTutor={(sql, error, context) =>
                handleOpenAiModal(sql, error, context)
              }
              bookmarks={progress.bookmarks || []}
              onToggleBookmarkExercise={handleToggleBookmarkExercise}
              initialSelectedExerciseId={targetExerciseId}
            />
          ) : (
            <QuizzesModule
              quizScores={progress.quizScores}
              onAnswerQuiz={handleAnswerQuiz}
            />
          )}
        </div>
      )}

      {/* Tab: Bookmarks (Dấu trang) */}
      {activeTab === 'bookmarks' && (
        <BookmarksModule
          bookmarks={progress.bookmarks || []}
          onRemoveBookmark={handleRemoveBookmark}
          onAddBookmark={(item) => {
            addBookmarkToUser(effectiveUserId, item);
            setProgress(getUserProgress(effectiveUserId));
          }}
          onUpdateBookmarkNotes={(bookmarkId: string, notes: string) => {
            updateUserBookmarkNotes(effectiveUserId, bookmarkId, notes);
            setProgress(getUserProgress(effectiveUserId));
          }}
          onGoToLesson={(lessonId: string) => {
            setTargetLessonId(lessonId);
            setActiveTab('lessons');
          }}
          onGoToExercise={(exerciseId: string) => {
            setTargetExerciseId(exerciseId);
            setActiveTab('exercises');
            setExerciseMode('coding');
          }}
          onRunSqlInPlayground={handleSendToPlayground}
        />
      )}

      {/* Tab: Learning History (Lịch sử) */}
      {activeTab === 'history' && (
        <LearningHistoryModule
          activityLogs={progress.activityLogs || []}
          onRunSqlInPlayground={handleSendToPlayground}
          onClearHistory={handleClearHistory}
        />
      )}

      {/* Tab 5: Personal Competency Evaluation & Progress Tracking */}
      {activeTab === 'competency' && (
        <CompetencyReport
          progress={progress}
          onResetProgress={handleResetProgress}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white pb-20 xl:pb-12">
      {/* Global Header */}
      <Header
        progress={progress}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileDeviceFrame={isMobileDeviceFrame}
        setIsMobileDeviceFrame={setIsMobileDeviceFrame}
        currentDbId={currentDbId}
        setCurrentDbId={setCurrentDbId}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Account Info Pill Banner on top */}
      <div className="bg-indigo-900 text-indigo-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Học sinh: <strong className="text-white">{currentUser.fullName}</strong> ({currentUser.grade || 'Lớp 11 Tin học'})</span>
              <span className="text-indigo-300">• {currentUser.school || 'Trường THPT'}</span>
              <span className="hidden sm:inline-block ml-1.5 px-2 py-0.5 rounded bg-indigo-800 text-[10px] text-emerald-300 border border-indigo-700 font-mono">
                SQLite 3 Active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Chế độ Khách • Hãy tạo tài khoản để lưu trữ tiến trình học tập an toàn vào <strong>SQLite Database</strong></span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('bookmarks')}
              className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-300" />
              <span>Dấu trang ({progress.bookmarks?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <History className="w-3.5 h-3.5 text-indigo-300" />
              <span>Lịch sử ({progress.activityLogs?.length || 0})</span>
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-indigo-700/80 hover:bg-indigo-600 text-white font-bold px-2.5 py-0.5 rounded-lg text-[11px] transition-all cursor-pointer"
            >
              {currentUser ? 'Quản lý tài khoản' : 'Đăng ký / Đăng nhập'}
            </button>
          </div>
        </div>
      </div>

      {/* Device Mode Wrapper */}
      {isMobileDeviceFrame ? (
        /* Realistic Mobile Phone Frame for previewing mobile app experience */
        <main className="py-8 px-4 flex justify-center items-center">
          <div className="w-full max-w-[430px] min-h-[820px] bg-slate-900 rounded-[48px] p-3.5 shadow-2xl ring-1 ring-slate-800/80 border-4 border-slate-700 relative flex flex-col">
            {/* Phone Speaker & Dynamic Island */}
            <div className="w-28 h-5 bg-slate-950 rounded-full mx-auto mb-3 flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-900/60"></div>
            </div>

            {/* Mobile Screen Area */}
            <div className="bg-slate-50 rounded-[36px] overflow-y-auto flex-1 p-4 pb-16 relative">
              {renderAppContent()}
            </div>

            {/* Simulated Home indicator */}
            <div className="w-32 h-1 bg-slate-400 rounded-full mx-auto mt-3 opacity-60"></div>
          </div>
        </main>
      ) : (
        /* Full Desktop / Tablet View */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderAppContent()}
        </main>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        bookmarkCount={progress.bookmarks?.length || 0}
      />

      {/* Authentication & User Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChanged={(newUser) => {
          setCurrentUser(newUser);
          setAccounts(getAllAccounts());
          const targetId = newUser ? newUser.id : 'guest_session';
          setProgress(getUserProgress(targetId));
        }}
      />

      {/* AI Teacher Assistance Modal */}
      <AiTutorModal
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal((prev) => ({ ...prev, isOpen: false }))}
        initialSql={aiModal.sql}
        initialError={aiModal.error}
        contextTitle={aiModal.contextTitle}
      />
    </div>
  );
}
