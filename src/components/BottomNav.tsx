import React from 'react';
import { BookOpen, Terminal, Network, Award, TrendingUp, Layers, Bookmark, History } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookmarkCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, bookmarkCount = 0 }) => {
  const tabs = [
    { id: 'lessons', label: 'Bài học', icon: BookOpen },
    { id: 'playground', label: 'SQL', icon: Terminal },
    { id: 'erd', label: 'ERD', icon: Layers },
    { id: 'exercises', label: 'Luyện thi', icon: Award },
    { id: 'bookmarks', label: 'Dấu trang', icon: Bookmark, badge: bookmarkCount },
    { id: 'history', label: 'Lịch sử', icon: History },
    { id: 'competency', label: 'Năng lực', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 shadow-lg xl:hidden overflow-x-auto">
      <div className="flex items-center justify-around min-w-[340px] max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition-all duration-200 relative cursor-pointer ${
                isActive
                  ? 'text-indigo-600 font-bold scale-105'
                  : 'text-slate-500 font-medium hover:text-slate-900'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors relative ${
                  isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
