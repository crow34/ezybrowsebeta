import React from 'react';
import { Globe, Plus, Calendar, MessageSquare } from 'lucide-react';
import { VirtualPage } from '../types';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  pages: Record<string, VirtualPage>;
  onCreatePage: () => void;
  onNavigateToPage: (domain: string) => void;
  onAuthClick: () => void;
}

export default function HomePage({ pages, onCreatePage, onNavigateToPage, onAuthClick }: HomePageProps) {
  const { user, isAuthenticated } = useAuth();
  const pagesList = Object.values(pages);

  const canCreatePage = isAuthenticated && (
    user?.role === 'admin' ||
    (user?.role === 'free' && pagesList.filter(p => p.userId === user.id).length < 2) ||
    user?.role === 'paid'
  );

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Globe className="w-12 h-12 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-800 ml-4">EzyBrowse</h1>
          </div>
          <div className="flex gap-4 justify-center mb-8">
            {canCreatePage ? (
              <button
                onClick={onCreatePage}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create New Page
              </button>
            ) : !isAuthenticated ? (
              <button
                onClick={onAuthClick}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Sign in to Create Pages
              </button>
            ) : (
              <div className="text-gray-600">
                You've reached your page limit. Upgrade to create more pages.
              </div>
            )}
          </div>
        </div>

        {pagesList.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagesList.map((page, index) => (
                <div
                  key={index}
                  onClick={() => onNavigateToPage(page.domain)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border border-gray-100"
                >
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center">
                    <Globe className="w-16 h-16 text-blue-400 opacity-50" />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{page.title}</h2>
                    <p className="text-sm text-blue-500 mb-4">{page.domain}</p>
                    <div className="flex gap-4 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {page.messages?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(page.createdAt || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="mb-4">No pages created yet. Create your first page to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}