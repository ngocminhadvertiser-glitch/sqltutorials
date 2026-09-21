import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/quizzesData';
import { QuizQuestion, CompetencyCategory } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Lightbulb, 
  RotateCcw, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QuizzesModuleProps {
  quizScores: Record<string, { selectedOption: string; isCorrect: boolean }>;
  onAnswerQuiz: (quizId: string, selectedOption: string, isCorrect: boolean, competency: CompetencyCategory) => void;
}

export const QuizzesModule: React.FC<QuizzesModuleProps> = ({
  quizScores,
  onAnswerQuiz,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const currentQuiz = QUIZ_QUESTIONS[currentIdx];

  const currentAnswer = quizScores[currentQuiz.id];
  const [selectedOpt, setSelectedOpt] = useState<string | null>(currentAnswer?.selectedOption || null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!currentAnswer);

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    setSelectedOpt(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOpt) return;

    const chosenOptionObj = currentQuiz.options.find((o) => o.id === selectedOpt);
    const isCorrect = !!chosenOptionObj?.isCorrect;

    setIsSubmitted(true);
    onAnswerQuiz(currentQuiz.id, selectedOpt, isCorrect, currentQuiz.competency);

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNextQuiz = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextAnswer = quizScores[QUIZ_QUESTIONS[nextIdx].id];
      setSelectedOpt(nextAnswer?.selectedOption || null);
      setIsSubmitted(!!nextAnswer);
    }
  };

  const correctAnswersCount = Object.values(quizScores).filter((a) => a.isCorrect).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Progress & Stats */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Bài kiểm tra Trắc nghiệm Lý thuyết CSDL & T-SQL
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-0.5">
            Câu {currentIdx + 1} / {QUIZ_QUESTIONS.length}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 font-semibold block">Độ chính xác:</span>
          <span className="text-base font-extrabold text-indigo-600">
            {correctAnswersCount} / {QUIZ_QUESTIONS.length} câu đúng
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-slate-900 leading-relaxed">
          {currentQuiz.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuiz.options.map((option) => {
            const isSelected = selectedOpt === option.id;
            let optionStyles = 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-800';

            if (isSubmitted) {
              if (option.isCorrect) {
                optionStyles = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'bg-rose-50 border-rose-400 text-rose-900';
              } else {
                optionStyles = 'border-slate-200 opacity-60 text-slate-500';
              }
            } else if (isSelected) {
              optionStyles = 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-2 ring-indigo-500/20';
            }

            return (
              <button
                key={option.id}
                id={`quiz-option-${option.id}`}
                onClick={() => handleSelectOption(option.id)}
                disabled={isSubmitted}
                className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs uppercase text-slate-700 shrink-0">
                    {option.id}
                  </span>
                  <span>{option.text}</span>
                </div>

                {isSubmitted && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isSubmitted && isSelected && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit or Next Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              setSelectedOpt(null);
              setIsSubmitted(false);
            }}
            disabled={!isSubmitted}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 disabled:opacity-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Làm lại câu này
          </button>

          {!isSubmitted ? (
            <button
              id="btn-submit-quiz"
              onClick={handleSubmitAnswer}
              disabled={!selectedOpt}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Kiểm tra đáp án
            </button>
          ) : (
            <button
              id="btn-next-quiz"
              onClick={handleNextQuiz}
              disabled={currentIdx >= QUIZ_QUESTIONS.length - 1}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Câu tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Explanation & Teacher Tip */}
        {isSubmitted && (
          <div className="space-y-3 pt-2 animate-in fade-in duration-200">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900 block">Giải thích chi tiết:</span>
              <p>{currentQuiz.explanation}</p>
            </div>

            {currentQuiz.teacherTip && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-800">Mẹo từ Thầy/Cô: </span>
                  <span>{currentQuiz.teacherTip}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
