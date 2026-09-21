import React, { useState } from 'react';
import { LearningActivityLog } from '../types';
import { 
  History, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Terminal, 
  Award, 
  HelpCircle, 
  Clock, 
  RotateCcw,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

interface LearningHistoryModuleProps {
  activityLogs: LearningActivityLog[];
  onRunSqlInPlayground: (sql: string) => void;
  onClearHistory?: () => void;
}

export const LearningHistoryModule: React.FC<LearningHistoryModuleProps> = ({
  activityLogs,
  onRunSqlInPlayground,
  onClearHistory,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = activityLogs.filter((log) => {
    if (filterType !== 'all' && log.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = log.title.toLowerCase().includes(q);
      const matchDetail = (log.detail || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDetail) return false;
    }
    return true;
  });

  const getLogIcon = (type: LearningActivityLog['type'], status: LearningActivityLog['status']) => {
    if (type === 'sql_executed') {
      return status === 'failed' ? (
        <AlertCircle className="w-4 h-4 text-rose-600" />
      ) : (
        <Terminal className="w-4 h-4 text-amber-600" />
      );
    }
    if (type === 'lesson_completed') {
      return <BookOpen className="w-4 h-4 text-indigo-600" />;
    }
    if (type === 'exercise_submitted') {
      return <Award className="w-4 h-4 text-emerald-600" />;
    }
    return <HelpCircle className="w-4 h-4 text-purple-600" />;
  };

  const getLogBadge = (type: LearningActivityLog['type']) => {
    switch (type) {
      case 'sql_executed':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">Thực thi SQL</span>;
      case 'lesson_completed':
        return <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-bold">Học lý thuyết</span>;
      case 'exercise_submitted':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">Nộp bài tập</span>;
      case 'quiz_answered':
        return <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-bold">Trắc nghiệm</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">Hoạt động</span>;
    }
  };

  const totalSqlRuns = activityLogs.filter((l) => l.type === 'sql_executed').length;
  const successfulSqlRuns = activityLogs.filter((l) => l.type === 'sql_executed' && l.status === 'success').length;
  const sqlSuccessRate = totalSqlRuns > 0 ? Math.round((successfulSqlRuns / totalSqlRuns) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <History className="w-4 h-4" />
              <span>Nhật Ký Tiến Trình & Lịch Sử Tương Tác</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Lịch sử Học tập & Thực thi SQL Cá nhân
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ghi nhận toàn bộ câu lệnh bạn đã chạy thử, bài học đã hoàn thành và bài tập đã chấm điểm theo mốc thời gian.
            </p>
          </div>

          {onClearHistory && (
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa lịch sử nhật ký</span>
            </button>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 block">Tổng hoạt động</span>
            <span className="text-xl font-black text-slate-900">{activityLogs.length}</span>
          </div>
          <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60">
            <span className="text-[11px] font-bold text-amber-700 block">Lệnh SQL đã chạy</span>
            <span className="text-xl font-black text-amber-900">{totalSqlRuns}</span>
          </div>
          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/60">
            <span className="text-[11px] font-bold text-emerald-700 block">Tỷ lệ lệnh chuẩn</span>
            <span className="text-xl font-black text-emerald-900">{sqlSuccessRate}%</span>
          </div>
          <div className="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-200/60">
            <span className="text-[11px] font-bold text-indigo-700 block">Bài học hoàn thành</span>
            <span className="text-xl font-black text-indigo-900">
              {activityLogs.filter((l) => l.type === 'lesson_completed').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Tất cả ({activityLogs.length})
          </button>
          <button
            onClick={() => setFilterType('sql_executed')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === 'sql_executed'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Lệnh SQL ({activityLogs.filter((l) => l.type === 'sql_executed').length})
          </button>
          <button
            onClick={() => setFilterType('lesson_completed')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === 'lesson_completed'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Bài học ({activityLogs.filter((l) => l.type === 'lesson_completed').length})
          </button>
          <button
            onClick={() => setFilterType('exercise_submitted')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === 'exercise_submitted'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Bài tập ({activityLogs.filter((l) => l.type === 'exercise_submitted').length})
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nhật ký..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Timeline List */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-800 text-base">Chưa có nhật ký nào phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Mọi câu lệnh SQL bạn chạy hoặc bài học bạn hoàn thành sẽ tự động được ghi lại tại đây!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const hasSql = log.metadata?.sql || (log.type === 'sql_executed' && log.detail?.includes(';'));
            const extractedSql = log.metadata?.sql || log.detail;

            return (
              <div
                key={log.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition-all shadow-2xs flex items-start justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getLogIcon(log.type, log.status)}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getLogBadge(log.type)}
                      <span className="font-bold text-slate-900">{log.title}</span>
                      {log.pointsEarned && (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded text-[10px]">
                          +{log.pointsEarned} điểm
                        </span>
                      )}
                    </div>

                    {log.detail && (
                      <p className="text-slate-600 leading-relaxed font-mono text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100 break-all">
                        {log.detail}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                      {log.status === 'failed' && (
                        <span className="text-rose-600 font-bold">• Lỗi cú pháp SQL</span>
                      )}
                      {log.status === 'success' && (
                        <span className="text-emerald-600 font-bold">• Thành công</span>
                      )}
                    </div>
                  </div>
                </div>

                {log.type === 'sql_executed' && log.metadata?.sql && (
                  <button
                    onClick={() => onRunSqlInPlayground(log.metadata?.sql || '')}
                    className="shrink-0 px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                    title="Chạy lại câu lệnh này trong Playground"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span className="text-[11px]">Chạy lại</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
