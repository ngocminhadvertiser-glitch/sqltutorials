import React, { useState } from 'react';
import { BookmarkItem, BookmarkType } from '../types';
import { 
  Bookmark, 
  Trash2, 
  Play, 
  BookOpen, 
  Search, 
  Plus, 
  Edit3, 
  ExternalLink, 
  Check, 
  Tag, 
  Code2, 
  FileText, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface BookmarksModuleProps {
  bookmarks: BookmarkItem[];
  onRemoveBookmark: (bookmarkId: string) => void;
  onAddBookmark: (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => void;
  onUpdateBookmarkNotes: (bookmarkId: string, notes: string) => void;
  onGoToLesson: (lessonId: string) => void;
  onGoToExercise?: (exerciseId: string) => void;
  onRunSqlInPlayground: (sql: string) => void;
}

export const BookmarksModule: React.FC<BookmarksModuleProps> = ({
  bookmarks,
  onRemoveBookmark,
  onAddBookmark,
  onUpdateBookmarkNotes,
  onGoToLesson,
  onGoToExercise,
  onRunSqlInPlayground,
}) => {
  const [filterType, setFilterType] = useState<BookmarkType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  
  // New manual bookmark form
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<BookmarkType>('note');
  const [newSql, setNewSql] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');
  const [newTags, setNewTags] = useState<string>('Ghi nhớ');

  const filteredBookmarks = bookmarks.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubtitle = (item.subtitle || '').toLowerCase().includes(q);
      const matchSql = (item.sqlSnippet || '').toLowerCase().includes(q);
      const matchNotes = (item.notes || '').toLowerCase().includes(q);
      const matchTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSubtitle && !matchSql && !matchNotes && !matchTags) return false;
    }
    return true;
  });

  const handleStartEdit = (bm: BookmarkItem) => {
    setEditingId(bm.id);
    setEditNotes(bm.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    onUpdateBookmarkNotes(id, editNotes);
    setEditingId(null);
  };

  const handleCreateBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddBookmark({
      type: newType,
      title: newTitle.trim(),
      subtitle: newType === 'sql_example' ? 'Mẫu câu lệnh tự lưu' : 'Ghi chú tự tạo',
      targetId: `custom-${Date.now()}`,
      sqlSnippet: newType === 'sql_example' ? newSql.trim() : undefined,
      notes: newNotes.trim() || undefined,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setNewTitle('');
    setNewSql('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const getTypeIcon = (type: BookmarkType) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'sql_example':
        return <Code2 className="w-4 h-4 text-amber-600" />;
      case 'exercise':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'quiz_question':
        return <HelpCircle className="w-4 h-4 text-purple-600" />;
      case 'note':
      default:
        return <Bookmark className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeName = (type: BookmarkType) => {
    switch (type) {
      case 'lesson':
        return 'Bài học';
      case 'sql_example':
        return 'Mẫu SQL';
      case 'exercise':
        return 'Bài tập';
      case 'quiz_question':
        return 'Trắc nghiệm';
      case 'note':
      default:
        return 'Ghi chú';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Kho Dấu Trang & Ghi Chú Cá Nhân</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Nội dung Cần xem lại & Mẫu SQL Đã lưu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lưu trữ những phần kiến thức quan trọng, câu lệnh T-SQL cần ghi nhớ và các mẹo làm bài do chính bạn đánh dấu.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Ghi Chú / Dấu Trang Mới</span>
        </button>
      </div>

      {/* Manual Add Form (Collapse) */}
      {showAddForm && (
        <form
          onSubmit={handleCreateBookmark}
          className="bg-indigo-50/70 border border-indigo-200 rounded-3xl p-6 space-y-4 text-xs animate-in fade-in"
        >
          <div className="font-bold text-indigo-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Tạo Dấu trang hoặc Ghi nhớ T-SQL mới:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Tiêu đề đánh dấu</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="ví dụ: Mẹo viết GROUP BY và HAVING"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Phân loại</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as BookmarkType)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="note">Ghi chú cá nhân</option>
                <option value="sql_example">Mẫu câu lệnh SQL</option>
                <option value="lesson">Bài học cần ôn tập</option>
                <option value="exercise">Bài tập thực hành</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Thẻ phân loại (Tags, cách nhau bởi dấu phẩy)</label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="Ôn thi, Quan trọng, JOIN"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {newType === 'sql_example' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Đoạn mã SQL Server (T-SQL)</label>
              <textarea
                rows={3}
                value={newSql}
                onChange={(e) => setNewSql(e.target.value)}
                placeholder="SELECT ... FROM ... WHERE ...;"
                className="w-full bg-slate-900 text-indigo-100 font-mono text-xs rounded-xl p-3 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Ghi chú riêng của bạn</label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Giải thích vì sao cần nhớ phần này, lỗi hay gặp..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer"
            >
              Lưu Dấu Trang
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Tất cả ({bookmarks.length})
          </button>
          <button
            onClick={() => setFilterType('lesson')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === 'lesson'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Bài học ({bookmarks.filter((b) => b.type === 'lesson').length})
          </button>
          <button
            onClick={() => setFilterType('sql_example')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === 'sql_example'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Mẫu SQL ({bookmarks.filter((b) => b.type === 'sql_example').length})
          </button>
          <button
            onClick={() => setFilterType('exercise')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === 'exercise'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Bài tập ({bookmarks.filter((b) => b.type === 'exercise').length})
          </button>
          <button
            onClick={() => setFilterType('note')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === 'note'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Ghi chú riêng ({bookmarks.filter((b) => b.type === 'note').length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nội dung đã lưu..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-800 text-base">Chưa có dấu trang nào được lưu</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Bạn có thể nhấn vào biểu tượng <Bookmark className="w-3 h-3 inline text-indigo-600" /> trong bất kỳ bài học nào hoặc bấm nút <strong>&quot;Thêm Ghi Chú / Dấu Trang Mới&quot;</strong> ở trên để lưu lại những phần cần ôn thi nhé!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookmarks.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
              >
                {/* Header item */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                      {getTypeIcon(item.type)}
                      <span>{getTypeName(item.type)}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                        title="Sửa ghi chú"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveBookmark(item.id)}
                        className="w-7 h-7 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        title="Xóa dấu trang"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {item.title}
                  </h4>

                  {item.subtitle && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {item.subtitle}
                    </p>
                  )}

                  {/* SQL Snippet box if any */}
                  {item.sqlSnippet && (
                    <div className="bg-slate-900 text-indigo-200 rounded-xl p-3 font-mono text-[11px] overflow-x-auto relative group">
                      <code>{item.sqlSnippet}</code>
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-indigo-500" />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Personal Notes */}
                  {isEditing ? (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <textarea
                        rows={2}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Nhập ghi chú riêng của bạn..."
                        className="w-full bg-slate-50 border border-indigo-300 rounded-xl p-2 text-xs focus:bg-white focus:outline-hidden"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-[11px] text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-2.5 py-1 text-[11px] bg-indigo-600 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Lưu ghi chú</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    item.notes && (
                      <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-2.5 text-xs text-amber-950 space-y-0.5">
                        <span className="font-bold text-amber-800 text-[10px] block uppercase tracking-wider">
                          Ghi chú cá nhân:
                        </span>
                        <p className="italic text-[11px] text-amber-900">{item.notes}</p>
                      </div>
                    )
                  )}
                </div>

                {/* Footer action button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {(item.sqlSnippet || item.sqlCode) && (
                      <button
                        onClick={() => onRunSqlInPlayground(item.sqlSnippet || item.sqlCode || '')}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                      >
                        <Play className="w-3 h-3 fill-slate-950" />
                        <span>Chạy thử SQL</span>
                      </button>
                    )}

                    {item.type === 'lesson' && item.targetId && (
                      <button
                        onClick={() => onGoToLesson(item.targetId!)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Mở bài học</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    {item.type === 'exercise' && item.targetId && onGoToExercise && (
                      <button
                        onClick={() => onGoToExercise(item.targetId!)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Làm bài tập</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
