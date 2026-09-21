import React from 'react';
import { BookOpen, Terminal, Network, Award, TrendingUp, Layers } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'lessons', label: 'Bài học', icon: BookOpen },
    { id: 'erd', label: 'ERD & 3NF', icon: Layers },
    { id: 'playground', label: 'Chạy SQL', icon: Terminal },
    { id: 'schema', label: 'Sơ đồ', icon: Network },
    { id: 'exercises', label: 'Bài tập/Thi', icon: Award },
    { id: 'competency', label: 'Năng lực', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg lg:hidden">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-indigo-600 font-bold scale-105'
                  : 'text-slate-500 font-medium hover:text-slate-900'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
