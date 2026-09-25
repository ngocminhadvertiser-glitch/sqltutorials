import React, { useState, useEffect, useMemo } from 'react';
import { CURRICULUM_LESSONS } from '../data/curriculumData';
import { Lesson, BookmarkItem } from '../types';
import { 
  BookOpen, 
  CheckCircle2, 
  Play, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Lightbulb,
  GraduationCap,
  Target,
  AlertTriangle,
  FileCheck2,
  Table,
  Layers,
  HelpCircle,
  Eye,
  EyeOff,
  Bookmark,
  Search,
  Sparkles,
  Filter,
  ChevronRight
} from 'lucide-react';

interface LessonViewerProps {
  completedLessons: string[];
  onToggleCompleteLesson: (lessonId: string) => void;
  onRunSqlInPlayground: (sql: string) => void;
  onOpenErdStudio?: () => void;
  bookmarks?: BookmarkItem[];
  onToggleBookmarkLesson?: (lesson: Lesson) => void;
  onBookmarkSqlExample?: (example: { title: string; sql: string; explanation: string }, lessonTitle: string) => void;
  initialSelectedLessonId?: string;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  completedLessons,
  onToggleCompleteLesson,
  onRunSqlInPlayground,
  onOpenErdStudio,
  bookmarks = [],
  onToggleBookmarkLesson,
  onBookmarkSqlExample,
  initialSelectedLessonId,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    initialSelectedLessonId || CURRICULUM_LESSONS[0].id
  );
  const [activeNormTab, setActiveNormTab] = useState<number>(0);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (initialSelectedLessonId) {
      setSelectedLessonId(initialSelectedLessonId);
    }
  }, [initialSelectedLessonId]);

  const currentLesson = CURRICULUM_LESSONS.find((l) => l.id === selectedLessonId) || CURRICULUM_LESSONS[0];
  const currentIndex = CURRICULUM_LESSONS.findIndex((l) => l.id === selectedLessonId);
  const isCompleted = completedLessons.includes(currentLesson.id);
  const isLessonBookmarked = bookmarks.some(
    (b) => b.type === 'lesson' && b.targetId === currentLesson.id
  );

  // Group chapters
  const chaptersList = useMemo(() => {
    const map = new Map<string, { id: string; title: string; count: number }>();
    CURRICULUM_LESSONS.forEach((l) => {
      const existing = map.get(l.chapterId);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(l.chapterId, { id: l.chapterId, title: l.chapterTitle.split(':')[0], count: 1 });
      }
    });
    return Array.from(map.values());
  }, []);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return CURRICULUM_LESSONS.filter((lesson) => {
      const matchesChapter = chapterFilter === 'all' || lesson.chapterId === chapterFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lesson.title.toLowerCase().includes(q) ||
        lesson.description.toLowerCase().includes(q);
      return matchesChapter && matchesSearch;
    });
  }, [chapterFilter, searchQuery]);

  // Chapter 5 sequence
  const chapter5Lessons = useMemo(() => {
    return CURRICULUM_LESSONS.filter((l) => l.chapterId === 'chuong-5');
  }, []);

  // Chapter 2 sequence (Chuẩn THCS: Khóa chính & Khóa ngoại)
  const chapter2Lessons = useMemo(() => {
    return CURRICULUM_LESSONS.filter((l) => l.chapterId === 'chuong-2');
  }, []);

  const getLevelBadge = (level: Lesson['level']) => {
    switch (level) {
      case 'co-ban':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-xs font-semibold">Cơ bản</span>;
      case 'trung-binh':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-semibold">Trung bình</span>;
      case 'nang-cao':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-xs font-semibold">Nâng cao</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar: Lesson List */}
      <div className="lg:col-span-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Chương trình Học (8 Chương)
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              {completedLessons.length}/{CURRICULUM_LESSONS.length} bài
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedLessons.length / CURRICULUM_LESSONS.length) * 100}%` }}
            />
          </div>

          {/* Search and Chapter Filter Chips */}
          <div className="space-y-2 mb-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài học (SELECT, WHERE, JOIN...)"
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Chapter filter selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <button
                onClick={() => setChapterFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  chapterFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({CURRICULUM_LESSONS.length})
              </button>
              <button
                onClick={() => setChapterFilter('chuong-2')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                  chapterFilter === 'chuong-2'
                    ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-semibold'
                }`}
              >
                <span>🌱 Chương 2 (Cấp 2)</span>
              </button>
              <button
                onClick={() => setChapterFilter('chuong-5')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                  chapterFilter === 'chuong-5'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-semibold'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Chương 5 (11 bài)</span>
              </button>
              {chaptersList
                .filter((c) => c.id !== 'chuong-5' && c.id !== 'chuong-2')
                .map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setChapterFilter(ch.id)}
                    className={`px-2 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      chapterFilter === ch.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {ch.title}
                  </button>
                ))}
            </div>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredLessons.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Không tìm thấy bài học phù hợp với từ khóa "{searchQuery}"
              </div>
            ) : (
              filteredLessons.map((lesson) => {
                const isSelected = lesson.id === selectedLessonId;
                const isDone = completedLessons.includes(lesson.id);
                const globalIdx = CURRICULUM_LESSONS.findIndex((l) => l.id === lesson.id);

                return (
                  <button
                    key={lesson.id}
                    id={`lesson-item-${lesson.id}`}
                    onClick={() => {
                      setSelectedLessonId(lesson.id);
                      setActiveNormTab(0);
                      setShowAnswerKey(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          {lesson.chapterTitle.split(':')[0]}
                        </span>
                        {lesson.chapterId === 'chuong-5' && (
                          <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded-sm text-[10px] font-semibold">
                            SQL Core
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs leading-snug line-clamp-2">
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-2 pt-1">
                        {getLevelBadge(lesson.level)}
                        <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" /> {lesson.estimatedMinutes}p
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 mt-1">
                      {isDone ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                          {globalIdx + 1}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Quick link to ERD Studio */}
          {onOpenErdStudio && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={onOpenErdStudio}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Mở Studio ERD & Chuẩn hóa</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-6">
        <article className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Header */}
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>{currentLesson.chapterTitle}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {currentLesson.title}
            </h1>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">{currentLesson.description}</p>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                {getLevelBadge(currentLesson.level)}
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Thời lượng: {currentLesson.estimatedMinutes} phút
                </span>
              </div>

              {/* Action buttons: Bookmark & Complete */}
              <div className="flex items-center gap-2">
                {onToggleBookmarkLesson && (
                  <button
                    id="btn-bookmark-lesson"
                    onClick={() => onToggleBookmarkLesson(currentLesson)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isLessonBookmarked
                        ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-800'
                    }`}
                    title={isLessonBookmarked ? 'Bỏ lưu dấu trang' : 'Lưu bài học vào Bookmarks'}
                  >
                    <Bookmark className={`w-4 h-4 ${isLessonBookmarked ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                    <span>{isLessonBookmarked ? 'Đã Lưu Dấu Trang' : 'Lưu Dấu Trang'}</span>
                  </button>
                )}

                {/* Complete button */}
                <button
                  id="btn-toggle-complete-lesson"
                  onClick={() => onToggleCompleteLesson(currentLesson.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Đã học xong (+10 đ)</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đánh dấu hoàn thành</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Chapter 2 Roadmap: Chuẩn THCS - Trọng tâm Khóa chính & Khóa ngoại */}
          {currentLesson.chapterId === 'chuong-2' && (
            <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-cyan-50/90 border border-emerald-200/80 rounded-2xl p-4 space-y-3 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                      <span>Chương 2: Mô hình Dữ liệu Quan hệ (Dành cho Học sinh Cấp 2)</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                        Trọng tâm: Khóa chính & Khóa ngoại
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Tiếp cận trực quan, dễ hiểu qua ví dụ Thẻ học sinh & Danh sách lớp học; loại bỏ các loại khóa lý thuyết phức tạp.
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                  Bài {chapter2Lessons.findIndex((l) => l.id === currentLesson.id) + 1} / {chapter2Lessons.length}
                </div>
              </div>

              {/* 2 Lessons Switcher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {chapter2Lessons.map((l, index) => {
                  const isCurrent = l.id === currentLesson.id;
                  const isDone = completedLessons.includes(l.id);

                  return (
                    <button
                      key={l.id}
                      onClick={() => {
                        setSelectedLessonId(l.id);
                        setActiveNormTab(0);
                        setShowAnswerKey(false);
                      }}
                      className={`p-3 rounded-xl text-left transition-all border cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isCurrent ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          2.{index + 1}
                        </span>
                        <div>
                          <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                            {l.title.split(':')[1]?.trim() || l.title}
                          </p>
                          <p className={`text-[11px] line-clamp-1 mt-0.5 ${isCurrent ? 'text-emerald-100' : 'text-slate-500'}`}>
                            {index === 0 ? 'Mã học sinh độc nhất, 2 quy tắc vàng PK' : 'Cầu nối liên kết bảng, quan hệ 1-N'}
                          </p>
                        </div>
                      </div>
                      {isDone && (
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ml-2 ${
                          isCurrent ? 'bg-white text-emerald-700' : 'bg-emerald-500 text-white'
                        }`}>
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chapter 5 Interactive Roadmap: Lộ trình 11 nội dung từ Cơ bản đến Phức hợp */}
          {currentLesson.chapterId === 'chuong-5' && (
            <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-blue-50/90 border border-indigo-200/80 rounded-2xl p-4 space-y-3 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                    5
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-2">
                      <span>Lộ trình Chương 5: Tiếp cận từ Cơ bản đến Phức hợp</span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold">
                        11 nội dung & cú pháp
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Mỗi từ khóa/mệnh đề đều giới thiệu cú pháp chuẩn và ví dụ mẫu trực quan
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-indigo-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs">
                  Bước {chapter5Lessons.findIndex((l) => l.id === currentLesson.id) + 1} / {chapter5Lessons.length}
                </div>
              </div>

              {/* Steps Roadmap Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-1.5 pt-1">
                {chapter5Lessons.map((l, index) => {
                  const isCurrent = l.id === currentLesson.id;
                  const isDone = completedLessons.includes(l.id);
                  const shortName = l.title.split(':')[1]?.trim() || l.title;

                  return (
                    <button
                      key={l.id}
                      onClick={() => {
                        setSelectedLessonId(l.id);
                        setActiveNormTab(0);
                        setShowAnswerKey(false);
                      }}
                      title={l.title}
                      className={`p-2 rounded-xl text-left transition-all border cursor-pointer relative group flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-300'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`text-[10px] font-bold ${isCurrent ? 'text-indigo-200' : 'text-slate-400'}`}>
                          0{index + 1}
                        </span>
                        {isDone && (
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${isCurrent ? 'bg-white text-indigo-600' : 'bg-emerald-500 text-white'}`}>
                            ✓
                          </span>
                        )}
                      </div>
                      <span className={`text-[10.5px] font-bold line-clamp-1 leading-tight ${isCurrent ? 'text-white' : 'text-slate-800'}`}>
                        {shortName.split(' ')[0]} {shortName.split(' ')[1] || ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Module 1: Thông tin Bài học (Tiên quyết & Mục tiêu đào tạo) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentLesson.prerequisites && currentLesson.prerequisites.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  Kiến thức tiên quyết:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {currentLesson.prerequisites.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentLesson.learningObjectives && currentLesson.learningObjectives.length > 0 && (
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 text-xs">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5 mb-2">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  Mục tiêu bài học (Chuẩn đầu ra):
                </span>
                <ul className="space-y-1 text-slate-700">
                  {currentLesson.learningObjectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Module 2: Minh họa trực quan ERD hoặc Chuẩn hóa (nếu có) */}
          {currentLesson.normalizationCase && (
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-sm text-amber-400">
                    {currentLesson.normalizationCase.title}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Minh họa đối sánh trực quan</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentLesson.normalizationCase.scenario}
              </p>

              {/* Normalization Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                {currentLesson.normalizationCase.steps.map((step, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setActiveNormTab(sIdx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeNormTab === sIdx
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {step.form}
                  </button>
                ))}
              </div>

              {/* Active Step Content */}
              {currentLesson.normalizationCase.steps[activeNormTab] && (
                <div className="space-y-3">
                  <div className="bg-slate-800/80 rounded-xl p-3 text-xs space-y-1">
                    <div className="font-bold text-amber-300">
                      {currentLesson.normalizationCase.steps[activeNormTab].name}
                    </div>
                    <div className="text-slate-300">
                      <span className="font-semibold text-slate-400">Vấn đề / Hiện trạng: </span>
                      {currentLesson.normalizationCase.steps[activeNormTab].issueExplained}
                    </div>
                    <div className="text-emerald-300 text-[11px]">
                      <span className="font-semibold">Quy tắc áp dụng: </span>
                      {currentLesson.normalizationCase.steps[activeNormTab].rule}
                    </div>
                  </div>

                  {/* Sample tables for this step */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentLesson.normalizationCase.steps[activeNormTab].tables.map((tbl, tIdx) => (
                      <div key={tIdx} className="bg-slate-950 rounded-xl border border-slate-800 p-3 text-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-200 font-mono">[{tbl.name}]</span>
                          <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.5 rounded">
                            PK: {tbl.primaryKey.join(' + ')}
                          </span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-[11px] text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                                {tbl.columns.map((c, cIdx) => (
                                  <th key={cIdx} className="p-1 whitespace-nowrap">
                                    {c}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {tbl.sampleData.slice(0, 3).map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-slate-900 text-slate-300">
                                  {tbl.columns.map((c, cIdx) => (
                                    <td key={cIdx} className="p-1 font-mono whitespace-nowrap">
                                      {String(row[c] !== undefined ? row[c] : '-')}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Module 3: Nội dung Lý thuyết (Sections) */}
          <div className="space-y-6">
            {currentLesson.sections.map((section) => (
              <section key={section.id} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
                  {section.title}
                </h2>

                <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>

                {/* Teacher Note Callout */}
                {section.teacherNote && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-800">Lời khuyên của Thầy/Cô: </span>
                      <span>{section.teacherNote}</span>
                    </div>
                  </div>
                )}

                {/* SQL Examples */}
                {section.sqlExamples && section.sqlExamples.length > 0 && (
                  <div className="space-y-3">
                    {section.sqlExamples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-xs shadow-xs"
                      >
                        <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                          <span className="font-semibold text-slate-300">
                            {ex.title}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {onBookmarkSqlExample && (
                              <button
                                onClick={() => onBookmarkSqlExample(ex, currentLesson.title)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer border border-slate-700"
                                title="Lưu mẫu lệnh này vào Bookmarks"
                              >
                                <Bookmark className="w-3 h-3" />
                                <span className="hidden sm:inline">Lưu mẫu</span>
                              </button>
                            )}
                            <button
                              id={`run-example-${exIdx}`}
                              onClick={() => onRunSqlInPlayground(ex.sql)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Play className="w-3 h-3 fill-white" />
                              <span>Chạy thử lệnh</span>
                            </button>
                          </div>
                        </div>

                        <pre className="p-4 font-mono text-indigo-100 overflow-x-auto selection:bg-indigo-600">
                          <code>{ex.sql}</code>
                        </pre>

                        <div className="bg-slate-900/90 px-4 py-2 text-slate-400 border-t border-slate-800/80 space-y-1">
                          <div>
                            <span className="font-semibold text-slate-300">Giải thích: </span>
                            {ex.explanation}
                          </div>
                          {ex.expectedResult && (
                            <div className="text-emerald-400 text-[11px]">
                              <span className="font-semibold">Kết quả kỳ vọng: </span>
                              {ex.expectedResult}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Key Takeaways */}
                {section.keyTakeaways && section.keyTakeaways.length > 0 && (
                  <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-950">
                    <span className="font-bold text-indigo-800 block mb-1">
                      Ghi nhớ trọng tâm:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {section.keyTakeaways.map((point, pIdx) => (
                        <li key={pIdx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Module 4: Các lỗi hiểu sai thường gặp (Common Mistakes) */}
          {currentLesson.commonMistakes && currentLesson.commonMistakes.length > 0 && (
            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-rose-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Các lỗi hiểu sai thường gặp & Cách khắc phục:
              </h3>
              <div className="space-y-3">
                {currentLesson.commonMistakes.map((item, mIdx) => (
                  <div key={mIdx} className="bg-white rounded-xl p-3.5 border border-rose-100 shadow-2xs space-y-1.5">
                    <div className="text-rose-900 font-semibold flex items-start gap-2">
                      <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[10px] font-bold">Lỗi #{mIdx + 1}</span>
                      <span>{item.mistake}</span>
                    </div>
                    <div className="text-emerald-800 font-medium pl-2 border-l-2 border-emerald-500">
                      <span className="font-bold">Cách khắc phục: </span>{item.correction}
                    </div>
                    <div className="text-slate-500 text-[11px] pl-2">
                      <span className="font-semibold text-slate-600">Bản chất: </span>{item.why}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module 5: Bài tập thực hành 3 Mức độ (Mức 1, Mức 2, Mức 3) */}
          {currentLesson.practiceLevels && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                Hệ thống Bài tập Thực hành theo 3 Mức độ:
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">
                    Mức 1: Nhận biết & Thông hiểu
                  </span>
                  <p className="text-slate-700 leading-relaxed">{currentLesson.practiceLevels.level1}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">
                    Mức 2: Vận dụng
                  </span>
                  <p className="text-slate-700 leading-relaxed">{currentLesson.practiceLevels.level2}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">
                    Mức 3: Vận dụng nâng cao
                  </span>
                  <p className="text-slate-700 leading-relaxed">{currentLesson.practiceLevels.level3}</p>
                </div>
              </div>
            </div>
          )}

          {/* Module 6: Kiểm tra cuối bài & Hướng dẫn giải sư phạm */}
          {currentLesson.endOfLessonReview && (
            <div className="bg-indigo-950 text-white rounded-2xl p-5 border border-indigo-900 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-indigo-900 pb-3">
                <h3 className="font-bold text-sm text-indigo-200 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Kiểm tra Đánh giá Năng lực Cuối bài:
                </h3>
                <button
                  onClick={() => setShowAnswerKey(!showAnswerKey)}
                  className="px-2.5 py-1 bg-indigo-900 hover:bg-indigo-800 text-indigo-200 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  {showAnswerKey ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Ẩn đáp án
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Xem đáp án & hướng dẫn giải
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3 text-slate-300">
                <div className="space-y-1">
                  <span className="font-bold text-amber-400">1. Câu hỏi tư duy tổng kết:</span>
                  <p className="text-slate-200">{currentLesson.endOfLessonReview.summaryQuestion}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">2. Thử thách viết lệnh SQL:</span>
                    <button
                      onClick={() => onRunSqlInPlayground(currentLesson.endOfLessonReview!.sqlChallenge)}
                      className="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-0.5 rounded flex items-center gap-1 font-semibold"
                    >
                      <Play className="w-3 h-3" /> Nạp vào SQL Playground
                    </button>
                  </div>
                  <pre className="bg-slate-900 p-2.5 rounded-lg font-mono text-indigo-200 text-[11px] overflow-x-auto">
                    <code>{currentLesson.endOfLessonReview.sqlChallenge}</code>
                  </pre>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-amber-400">3. Tình huống thực tế:</span>
                  <p className="text-slate-200">{currentLesson.endOfLessonReview.scenarioQuestion}</p>
                </div>

                {showAnswerKey && (
                  <div className="mt-4 p-4 bg-slate-900/90 border border-emerald-500/50 rounded-xl space-y-2 text-emerald-300">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Đáp án & Hướng dẫn sư phạm dành cho Giảng viên:
                    </span>
                    <p className="text-slate-200 leading-relaxed text-[11px]">
                      {currentLesson.endOfLessonReview.teacherAnswerKey}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-3">
            <button
              disabled={currentIndex === 0}
              onClick={() => {
                setSelectedLessonId(CURRICULUM_LESSONS[currentIndex - 1].id);
                setActiveNormTab(0);
                setShowAnswerKey(false);
              }}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer max-w-[45%]"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <div className="text-left min-w-0">
                <span className="text-[10px] text-slate-400 block font-normal">Bài trước</span>
                <span className="truncate block font-bold">
                  {currentIndex > 0 ? CURRICULUM_LESSONS[currentIndex - 1].title.split(':')[0] : 'Đầu danh mục'}
                </span>
              </div>
            </button>

            <button
              disabled={currentIndex === CURRICULUM_LESSONS.length - 1}
              onClick={() => {
                setSelectedLessonId(CURRICULUM_LESSONS[currentIndex + 1].id);
                setActiveNormTab(0);
                setShowAnswerKey(false);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer max-w-[45%]"
            >
              <div className="text-right min-w-0">
                <span className="text-[10px] text-indigo-200 block font-normal">Bài tiếp theo</span>
                <span className="truncate block font-bold">
                  {currentIndex < CURRICULUM_LESSONS.length - 1
                    ? CURRICULUM_LESSONS[currentIndex + 1].title.split(':')[0]
                    : 'Cuối giáo trình'}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};
