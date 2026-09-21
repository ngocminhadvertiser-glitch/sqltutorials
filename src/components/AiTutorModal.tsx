import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { askAiTutor } from '../services/aiTutorService';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSql: string;
  initialError?: string;
  contextTitle?: string;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  initialSql,
  initialError,
  contextTitle,
}) => {
  const [question, setQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [responseAdvice, setResponseAdvice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAsk = async (customPrompt?: string) => {
    setLoading(true);
    setResponseAdvice(null);

    const payload = {
      sql: initialSql,
      error: initialError,
      context: customPrompt || question || 'Giải thích lỗi và hướng dẫn sửa',
      question: contextTitle || 'Thực hành SQL Server THPT',
    };

    const res = await askAiTutor(payload);
    setLoading(false);
    setResponseAdvice(res.advice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150 border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">Thầy/Cô Trợ lý AI Môn Tin Học</h3>
                <span className="bg-indigo-500/40 text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-indigo-400/30">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Chuyên gia sư phạm giải thích lỗi SQL Server & hướng dẫn sửa bài
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Context Snippet */}
          <div className="space-y-2">
            <span className="font-bold text-slate-700 block">Câu lệnh SQL hiện tại của em:</span>
            <pre className="bg-slate-900 text-indigo-100 p-3 rounded-xl font-mono text-xs overflow-x-auto max-h-32">
              <code>{initialSql || '-- (Chưa có câu lệnh)'}</code>
            </pre>
          </div>

          {/* If there was an error */}
          {initialError && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-800 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Thông báo lỗi từ hệ thống:
              </span>
              <p className="font-mono text-[11px] text-rose-700">{initialError}</p>
            </div>
          )}

          {/* Quick prompt buttons */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-600">Câu hỏi nhanh:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAsk('Hãy giải thích tại sao câu lệnh này bị lỗi và gợi ý cách viết lại đúng chuẩn T-SQL')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl font-medium border border-slate-200 transition-colors"
              >
                🔍 Lỗi này do đâu và sửa thế nào?
              </button>
              <button
                onClick={() => handleAsk('Giải thích nguyên lý hoạt động của câu lệnh này cho học sinh THPT dễ hiểu')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl font-medium border border-slate-200 transition-colors"
              >
                📖 Giải thích bản chất câu lệnh
              </button>
              <button
                onClick={() => handleAsk('Câu lệnh này có cách viết nào tối ưu và ngắn gọn hơn trong SQL Server không?')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl font-medium border border-slate-200 transition-colors"
              >
                ⚡ Gợi ý tối ưu cú pháp
              </button>
            </div>
          </div>

          {/* Custom question input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Hoặc nhập câu hỏi cụ thể cho thầy/cô tại đây..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-xs"
            >
              {loading ? (
                <span>Đang suy nghĩ...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Hỏi</span>
                </>
              )}
            </button>
          </div>

          {/* AI Response Card */}
          {loading && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-500 animate-pulse">
              <Bot className="w-8 h-8 text-indigo-500 animate-bounce" />
              <p>Thầy/Cô đang đọc câu lệnh và chuẩn bị câu trả lời cho em...</p>
            </div>
          )}

          {responseAdvice && (
            <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-5 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <span>Lời khuyên của Thầy/Cô:</span>
              </div>
              <div className="text-slate-800 leading-relaxed whitespace-pre-line text-xs font-normal">
                {responseAdvice}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
