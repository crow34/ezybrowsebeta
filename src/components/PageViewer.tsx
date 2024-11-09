import React, { useState } from 'react';
import { VirtualPage } from '../types';

interface PageViewerProps {
  url: string;
  pages: Record<string, VirtualPage>;
}

export default function PageViewer({ url, pages }: PageViewerProps) {
  const [newMessage, setNewMessage] = useState('');

  if (url.startsWith('ezy://')) {
    const domain = url.replace('ezy://', '');
    const page = Object.values(pages).find(p => p.domain === domain);
    
    if (page) {
      const containerClass = `max-w-4xl mx-auto p-6 ${
        page.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
      }`;

      const gridClass = page.layout === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
        : 'space-y-6';

      return (
        <div className={containerClass}>
          <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
          
          <div className={gridClass}>
            {page.elements.map((element, index) => (
              <div key={index} className="mb-6">
                {element.type === 'text' && (
                  <div className={`prose max-w-none ${element.style?.fontSize || ''} ${element.style?.textAlign || ''}`}>
                    {element.content}
                  </div>
                )}
                {element.type === 'youtube' && (
                  <div className="aspect-video">
                    <iframe
                      src={element.content}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
                {element.type === 'image' && (
                  <img
                    src={element.content}
                    alt=""
                    className="max-w-full h-auto rounded"
                  />
                )}
                {element.type === 'link' && (
                  <a
                    href={element.content.split('|')[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {element.content.split('|')[0]}
                  </a>
                )}
              </div>
            ))}
          </div>

          {page.showMessageBoard && (
            <div className={`mt-8 border-t pt-6 ${
              page.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className="text-xl font-semibold mb-4">Message Board</h2>
              <div className="space-y-4 mb-4">
                {page.messages.map((message, index) => (
                  <div key={index} className={`p-4 rounded-lg ${
                    page.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    {message}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write a message..."
                  className={`flex-1 px-4 py-2 border rounded-lg ${
                    page.theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-300'
                  }`}
                />
                <button
                  onClick={() => {
                    if (newMessage.trim()) {
                      page.messages.push(newMessage);
                      setNewMessage('');
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Browsing: {url}</h2>
      {url.startsWith('search://') && (
        <div>
          <p>Search results for: {url.replace('search://', '')}</p>
        </div>
      )}
    </div>
  );
}