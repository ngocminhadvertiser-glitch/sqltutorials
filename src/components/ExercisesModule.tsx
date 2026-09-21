import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EXERCISES_DATA } from '../data/exercisesData';
import { Exercise, DifficultyLevel, BookmarkItem } from '../types';
import { sqlEngine } from '../services/sqlEngine';
import { 
  Award, 
  CheckCircle2, 
  Play, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  Check, 
  AlertCircle,
  BookOpen,
  CheckSquare,
  Bookmark
} from 'lucide-react';

interface ExercisesModuleProps {
  completedExercises: Record<string, { score: number; completedAt: string; userSql: string }>;
  onExerciseCompleted: (exerciseId: string, score: number, userSql: string, competency: Exercise['competency']) => void;
  onAskAiTutor: (sql: string, error?: string, context?: string) => void;
  bookmarks?: BookmarkItem[];
  onToggleBookmarkExercise?: (exercise: Exercise) => void;
  initialSelectedExerciseId?: string;
}

export const ExercisesModule: React.FC<ExercisesModuleProps> = ({
  completedExercises,
  onExerciseCompleted,
  onAskAiTutor,
  bookmarks = [],
  onToggleBookmarkExercise,
  initialSelectedExerciseId,
}) => {
  const [selectedExId, setSelectedExId] = useState<string>(
    initialSelectedExerciseId || EXERCISES_DATA[0].id
  );
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'practice' | 'quiz'>('practice');

  useEffect(() => {
    if (initialSelectedExerciseId) {
      setSelectedExId(initialSelectedExerciseId);
      const targetEx = EXERCISES_DATA.find((e) => e.id === initialSelectedExerciseId);
      if (targetEx) {
        setCode(completedExercises[targetEx.id]?.userSql || targetEx.initialSql);
      }
    }
  }, [initialSelectedExerciseId]);

  const currentExercise = EXERCISES_DATA.find((e) => e.id === selectedExId) || EXERCISES_DATA[0];
  const [code, setCode] = useState<string>(
    completedExercises[currentExercise.id]?.userSql || currentExercise.initialSql
  );
  const [testResult, setTestResult] = useState<{ isCorrect: boolean; message: string; diffDetails?: string } | null>(null);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [runOutput, setRunOutput] = useState<any[] | null>(null);

  // Update code when selecting another exercise
  const handleSelectExercise = (ex: Exercise) => {
    setSelectedExId(ex.id);
    setCode(completedExercises[ex.id]?.userSql || ex.initialSql);
    setTestResult(null);
    setRevealedHints(0);
    setShowSolution(false);
    setRunOutput(null);
  };

  const handleRunOnly = () => {
    sqlEngine.setDatabase(currentExercise.databaseId);
    const res = sqlEngine.execute(code);
    if (res.success) {
      if (res.data && res.data.length > 0) {
        setRunOutput(res.data);
      } else if (currentExercise.verificationTable) {
        const mutatedData = sqlEngine.getTableData(currentExercise.verificationTable);
        setRunOutput(mutatedData);
      } else {
        setRunOutput([]);
      }
      setTestResult(null);
    } else {
      setTestResult({
        isCorrect: false,
        message: res.error || 'Lỗi thực thi câu lệnh',
        diffDetails: res.suggestedFix
      });
      setRunOutput(null);
    }
  };

  const handleGradeSolution = () => {
    const evaluation = sqlEngine.evaluateExercise(
      code, 
      currentExercise.solutionSql, 
      currentExercise.databaseId,
      currentExercise.verificationTable
    );
    setTestResult(evaluation);

    if (evaluation.isCorrect) {
      // Fire celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onExerciseCompleted(
        currentExercise.id, 
        currentExercise.points, 
        code, 
        currentExercise.competency
      );
    }
  };

  const filteredExercises = EXERCISES_DATA.filter((e) => {
    const matchLevel = filterLevel === 'all' || e.level === filterLevel;
    const matchCategory = filterCategory === 'all' || 
      (filterCategory === 'dml' && e.category === 'dml') ||
      (filterCategory === 'ddl' && e.category === 'ddl') ||
      (filterCategory === 'dql' && (!e.category || e.category === 'query'));
    return matchLevel && matchCategory;
  });

  const isCompleted = !!completedExercises[currentExercise.id];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Exercise Selection Sidebar */}
      <div className="lg:col-span-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              Bài tập Thực hành SQL
            </h3>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
              {Object.keys(completedExercises).length}/{EXERCISES_DATA.length} hoàn thành
            </span>
          </div>

          {/* Level Filter Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterLevel('all')}
              className={`py-1 rounded-lg transition-all ${
                filterLevel === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterLevel('co-ban')}
              className={`py-1 rounded-lg transition-all ${
                filterLevel === 'co-ban' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Cơ bản
            </button>
            <button
              onClick={() => setFilterLevel('trung-binh')}
              className={`py-1 rounded-lg transition-all ${
                filterLevel === 'trung-binh' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              T.Bình
            </button>
            <button
              onClick={() => setFilterLevel('nang-cao')}
              className={`py-1 rounded-lg transition-all ${
                filterLevel === 'nang-cao' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              N.Cao
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 text-[11px] overflow-x-auto pb-1">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                filterCategory === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả loại
            </button>
            <button
              onClick={() => setFilterCategory('dml')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                filterCategory === 'dml' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              DML (INSERT/UPDATE/DELETE)
            </button>
            <button
              onClick={() => setFilterCategory('ddl')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                filterCategory === 'ddl' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              DDL (CREATE/ALTER/DROP)
            </button>
            <button
              onClick={() => setFilterCategory('dql')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                filterCategory === 'dql' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              SELECT/JOIN
            </button>
          </div>

          {/* Exercise items */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredExercises.map((ex, idx) => {
              const isSelected = ex.id === currentExercise.id;
              const isDone = !!completedExercises[ex.id];

              return (
                <button
                  key={ex.id}
                  id={`ex-btn-${ex.id}`}
                  onClick={() => handleSelectExercise(ex)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Bài {idx + 1} • {ex.points}đ
                      </span>
                      {ex.category === 'dml' && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">DML</span>
                      )}
                      {ex.category === 'ddl' && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1 rounded">DDL</span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs line-clamp-1">{ex.title}</h4>
                    <span className="text-[10px] text-slate-500">CSDL: {ex.databaseId}</span>
                  </div>

                  <div className="shrink-0">
                    {isDone ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exercise Workspace */}
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          {/* Header */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Yêu cầu thực hành • CSDL {currentExercise.databaseId}
              </span>
              <div className="flex items-center gap-2">
                {onToggleBookmarkExercise && (
                  <button
                    id="btn-bookmark-exercise"
                    onClick={() => onToggleBookmarkExercise(currentExercise)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
                      bookmarks.some(b => b.type === 'exercise' && b.targetId === currentExercise.id)
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-800'
                    }`}
                    title="Lưu bài tập này vào Bookmarks"
                  >
                    <Bookmark className={`w-3 h-3 ${bookmarks.some(b => b.type === 'exercise' && b.targetId === currentExercise.id) ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                    <span>{bookmarks.some(b => b.type === 'exercise' && b.targetId === currentExercise.id) ? 'Đã lưu' : 'Bookmark'}</span>
                  </button>
                )}
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  +{currentExercise.points} điểm rèn luyện
                </span>
                {isCompleted && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành
                  </span>
                )}
              </div>
            </div>
            <h2 className="text-xl font-black text-slate-900">{currentExercise.title}</h2>
            <p className="text-slate-600 text-sm mt-1">{currentExercise.description}</p>
          </div>

          {/* Requirements list */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-1.5">
            <span className="font-bold text-slate-800 block">Yêu cầu cụ thể từ Giáo viên:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              {currentExercise.requirements.map((req, rIdx) => (
                <li key={rIdx}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Interactive SQL Editor */}
          <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            <div className="bg-slate-950 px-4 py-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800">
              <span className="font-mono font-bold text-slate-300">Khung viết lệnh SQL Server</span>
              <button
                onClick={() => setCode(currentExercise.initialSql)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                title="Khôi phục code ban đầu"
              >
                <RotateCcw className="w-3 h-3" /> Reset mã
              </button>
            </div>
            <textarea
              id="exercise-code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={6}
              className="w-full bg-slate-900 text-indigo-100 font-mono text-xs sm:text-sm p-4 focus:outline-none resize-y selection:bg-indigo-600 leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              {/* Hint button */}
              <button
                id="btn-reveal-hint"
                onClick={() => setRevealedHints((prev) => Math.min(prev + 1, currentExercise.hints.length))}
                disabled={revealedHints >= currentExercise.hints.length}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-50"
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>
                  Gợi ý ({revealedHints}/{currentExercise.hints.length})
                </span>
              </button>

              {/* Show solution toggle */}
              <button
                id="btn-toggle-solution"
                onClick={() => setShowSolution(!showSolution)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {showSolution ? 'Ẩn lời giải' : 'Xem lời giải mẫu'}
              </button>

              {/* Ask AI Teacher */}
              <button
                id="btn-ask-ai-exercise"
                onClick={() => onAskAiTutor(code, testResult?.message, currentExercise.title)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 hover:bg-indigo-100 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hỏi Giáo viên AI</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-run-exercise"
                onClick={handleRunOnly}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Chạy thử</span>
              </button>
              <button
                id="btn-grade-exercise"
                onClick={handleGradeSolution}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Chấm điểm ngay</span>
              </button>
            </div>
          </div>

          {/* Hints Display */}
          {revealedHints > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1.5 animate-in fade-in duration-150">
              <span className="font-bold text-amber-800 flex items-center gap-1">
                <HelpCircle className="w-4 h-4 text-amber-600" /> Gợi ý của Thầy/Cô:
              </span>
              <ul className="list-disc list-inside space-y-1">
                {currentExercise.hints.slice(0, revealedHints).map((hint, hIdx) => (
                  <li key={hIdx}>{hint}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Solution Display */}
          {showSolution && (
            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-800 text-xs space-y-2 animate-in fade-in duration-150">
              <span className="font-bold text-indigo-400 block">Lời giải mẫu chuẩn T-SQL:</span>
              <pre className="font-mono bg-slate-950 p-3 rounded-lg text-indigo-200 overflow-x-auto">
                <code>{currentExercise.solutionSql}</code>
              </pre>
              <div className="text-slate-300 pt-1">
                <strong>Phân tích của giáo viên: </strong>
                {currentExercise.explanation}
              </div>
            </div>
          )}

          {/* Test Evaluation Feedback */}
          {testResult && (
            <div
              id="exercise-feedback-card"
              className={`p-4 rounded-xl text-xs border animate-in fade-in duration-200 ${
                testResult.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {testResult.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {testResult.isCorrect ? 'Chúc mừng! Em đã giải chính xác bài toán' : 'Kết quả chưa đạt yêu cầu'}
                  </h4>
                  <p className="mt-0.5">{testResult.message}</p>
                  {testResult.diffDetails && (
                    <p className="mt-1 font-mono text-[11px] bg-white/70 p-2 rounded border border-rose-200">
                      {testResult.diffDetails}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Run output preview */}
          {runOutput && (
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 border-b border-slate-200">
                Xem trước kết quả chạy thử ({runOutput.length} dòng):
              </div>
              <div className="max-h-48 overflow-auto">
                {runOutput.length > 0 ? (
                  <table className="w-full text-left font-mono">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        {Object.keys(runOutput[0]).map((k) => (
                          <th key={k} className="p-2">
                            {k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {runOutput.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="p-2">
                              {String(val ?? 'NULL')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-center text-slate-400">Không có kết quả.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
