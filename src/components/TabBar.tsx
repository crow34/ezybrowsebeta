import React from 'react';
import { X, Plus } from 'lucide-react';
import { Tab } from '../types';

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  addTab: () => void;
  removeTab: (id: string, e: React.MouseEvent) => void;
}

export default function TabBar({ tabs, activeTab, setActiveTab, addTab, removeTab }: TabBarProps) {
  return (
    <div className="flex items-center px-2 pt-2 gap-1 bg-gray-100">
      {tabs.map(tab => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-sm max-w-[200px] ${
            activeTab === tab.id
              ? 'bg-white text-gray-800'
              : 'bg-gray-200/50 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="truncate">{tab.title}</span>
          <button
            onClick={(e) => removeTab(tab.id, e)}
            className="p-0.5 hover:bg-gray-200 rounded-full"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button
        onClick={addTab}
        className="p-1 hover:bg-gray-200 rounded-lg"
      >
        <Plus className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}