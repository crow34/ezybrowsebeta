import React, { useState, useEffect } from 'react';
import { X, Plus, Search, ChevronLeft, ChevronRight, Home, BookmarkPlus, Settings } from 'lucide-react';
import BrowserChrome from './BrowserChrome';
import TabBar from './TabBar';
import PageBuilder from './PageBuilder';
import PageViewer from './PageViewer';
import HomePage from './HomePage';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
import { Tab, VirtualPage } from '../types';
import { useAuth } from '../context/AuthContext';

export default function Browser() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'EzyBrowse', url: 'about:blank' }
  ]);
  const [activeTab, setActiveTab] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [pages, setPages] = useState<Record<string, VirtualPage>>({});
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    const savedPages = localStorage.getItem('virtual-pages');
    if (savedPages) {
      setPages(JSON.parse(savedPages));
    }
  }, []);

  const addTab = () => {
    const newTab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'about:blank'
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const removeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = tabs.filter(tab => tab.id !== id);
    if (newTabs.length === 0) {
      addTab();
    } else if (activeTab === id) {
      setActiveTab(newTabs[0].id);
    }
    setTabs(newTabs);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = searchQuery.toLowerCase();
    if (url.endsWith('.ezy')) {
      const domain = url.replace('http://', '').replace('https://', '');
      const page = Object.entries(pages).find(([_, page]) => page.domain === domain);
      if (page) {
        const newTabs = tabs.map(tab => 
          tab.id === activeTab 
            ? { ...tab, url: `ezy://${domain}`, title: page[1].title }
            : tab
        );
        setTabs(newTabs);
        return;
      }
    }
    
    const newTabs = tabs.map(tab => 
      tab.id === activeTab 
        ? { ...tab, url: `search://${searchQuery}`, title: `Search: ${searchQuery}` }
        : tab
    );
    setTabs(newTabs);
  };

  const handlePageSave = (page: VirtualPage) => {
    if (!user) return;

    const pageWithUser = {
      ...page,
      userId: user.id
    };

    const pageId = `page_${Date.now()}`;
    const updatedPages = { ...pages, [pageId]: pageWithUser };
    setPages(updatedPages);
    localStorage.setItem('virtual-pages', JSON.stringify(updatedPages));
    
    const newTab = {
      id: Date.now().toString(),
      title: page.title,
      url: `ezy://${page.domain}`
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
    setIsBuilderOpen(false);
  };

  const navigateToPage = (domain: string) => {
    const page = Object.values(pages).find(p => p.domain === domain);
    if (page) {
      const newTab = {
        id: Date.now().toString(),
        title: page.title,
        url: `ezy://${domain}`
      };
      setTabs([...tabs, newTab]);
      setActiveTab(newTab.id);
    }
  };

  return (
    <div className="fixed inset-4 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-600">EzyBrowse</div>
        <UserMenu onAuthClick={() => setIsAuthModalOpen(true)} />
      </div>

      <BrowserChrome
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
      
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        addTab={addTab}
        removeTab={removeTab}
      />

      <div className="flex-1 bg-white overflow-auto">
        {isBuilderOpen ? (
          <PageBuilder onSave={handlePageSave} onCancel={() => setIsBuilderOpen(false)} />
        ) : (
          tabs.map(tab => (
            <div
              key={tab.id}
              className={`h-full ${activeTab === tab.id ? '' : 'hidden'}`}
            >
              {tab.url === 'about:blank' ? (
                <HomePage
                  pages={pages}
                  onCreatePage={() => setIsBuilderOpen(true)}
                  onNavigateToPage={navigateToPage}
                  onAuthClick={() => setIsAuthModalOpen(true)}
                />
              ) : (
                <PageViewer url={tab.url} pages={pages} />
              )}
            </div>
          ))
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}