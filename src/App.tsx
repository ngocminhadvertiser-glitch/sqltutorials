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
import { StudentProgress, CompetencyCategory, Exercise } from './types';
import { BookOpen, CheckSquare, Award, HelpCircle } from 'lucide-react';

const STORAGE_KEY = 'sql_master_student_progress_v1';

const INITIAL_PROGRESS: StudentProgress = {
  studentName: 'Nguyễn Minh Quân',
  grade: 'Lớp 11 Tin Học - THPT',
  completedLessons: ['bai-1-tong-quan-csdl'],
  completedExercises: {},
  quizScores: {},
  streakDays: 4,
  totalPoints: 25,
  competencyScores: {
    'tong-quan-csdl': 75,
    'csdl-quan-he': 70,
    'thiet-ke-rang-buoc': 60,
    'truy-van-co-ban': 65,
    'gom-nhom-thong-ke': 40,
    'join-subquery': 35,
    'thao-tac-du-lieu-dml': 50,
    'dinh-nghia-du-lieu-ddl': 45,
    'quan-tri-toan-ven': 30,
    'du-an-tong-hop': 25,
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('lessons');
  const [currentDbId, setCurrentDbId] = useState<string>('QuanLyHocSinh');
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState<boolean>(false);
  const [playgroundSql, setPlaygroundSql] = useState<string>('SELECT * FROM HocSinh;');

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

  // Local persistence for student learning progress
  const [progress, setProgress] = useState<StudentProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          competencyScores: {
            ...INITIAL_PROGRESS.competencyScores,
            ...(parsed.competencyScores || {})
          }
        };
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e);
    }
    return INITIAL_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to persist progress', e);
    }
  }, [progress]);

  // Toggle completion of a lesson
  const handleToggleCompleteLesson = (lessonId: string) => {
    setProgress((prev) => {
      const isDone = prev.completedLessons.includes(lessonId);
      const newCompleted = isDone
        ? prev.completedLessons.filter((id) => id !== lessonId)
        : [...prev.completedLessons, lessonId];

      const pointsDiff = isDone ? -10 : 10;

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
    setProgress((prev) => {
      const alreadyDone = !!prev.completedExercises[exerciseId];
      const newScore = prev.totalPoints + (alreadyDone ? 0 : score);

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
    setProgress((prev) => {
      const alreadyAnswered = !!prev.quizScores[quizId];
      const pointsDiff = isCorrect && !alreadyAnswered ? 5 : 0;

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

  const handleResetProgress = () => {
    setProgress({
      ...INITIAL_PROGRESS,
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
    });
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
                className={`px-5 py-2 rounded-xl transition-all ${
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
                className={`px-5 py-2 rounded-xl transition-all ${
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
            />
          ) : (
            <QuizzesModule
              quizScores={progress.quizScores}
              onAnswerQuiz={handleAnswerQuiz}
            />
          )}
        </div>
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
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white pb-20 lg:pb-12">
      {/* Global Header */}
      <Header
        progress={progress}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileDeviceFrame={isMobileDeviceFrame}
        setIsMobileDeviceFrame={setIsMobileDeviceFrame}
        currentDbId={currentDbId}
        setCurrentDbId={setCurrentDbId}
      />

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
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

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
