import React from 'react';
import { Search, ChevronLeft, ChevronRight, Home, BookmarkPlus, Settings } from 'lucide-react';

interface BrowserChromeProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export default function BrowserChrome({ searchQuery, setSearchQuery, handleSearch }: BrowserChromeProps) {
  return (
    <div className="bg-gray-100 p-2 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div className="flex space-x-2">
          <button className="p-1.5 hover:bg-gray-200 rounded-full">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded-full">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded-full">
            <Home className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1">
          <div className="flex items-center bg-white rounded-full border border-gray-300 px-3 py-1.5">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or enter address"
              className="flex-1 outline-none text-sm"
            />
          </div>
        </form>

        <div className="flex space-x-2">
          <button className="p-1.5 hover:bg-gray-200 rounded-full">
            <BookmarkPlus className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded-full">
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}