import React, { useState } from 'react';
import { Type, Video, MessageSquare, Image, Link, Layout, Grid, Palette } from 'lucide-react';
import { VirtualPage } from '../types';

interface PageBuilderProps {
  onSave: (page: VirtualPage) => void;
  onCancel: () => void;
}

export default function PageBuilder({ onSave, onCancel }: PageBuilderProps) {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [elements, setElements] = useState<Array<{ type: string; content: string; style?: any }>>([]);
  const [showMessageBoard, setShowMessageBoard] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState('single');
  const [theme, setTheme] = useState('light');

  const addElement = (type: string) => {
    setElements([...elements, { type, content: '', style: {} }]);
  };

  const updateElement = (index: number, content: string) => {
    const newElements = [...elements];
    newElements[index].content = content;
    setElements(newElements);
  };

  const updateElementStyle = (index: number, style: any) => {
    const newElements = [...elements];
    newElements[index].style = { ...newElements[index].style, ...style };
    setElements(newElements);
  };

  const handleSave = () => {
    if (!title || !domain) {
      alert('Please enter a title and domain name');
      return;
    }

    if (!domain.endsWith('.ezy')) {
      alert('Domain must end with .ezy');
      return;
    }

    onSave({
      title,
      domain,
      elements,
      showMessageBoard,
      messages: [],
      layout: selectedLayout,
      theme,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Create Your Page</h1>
        <input
          type="text"
          placeholder="Page Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 text-xl font-semibold border rounded-lg mb-2"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value.toLowerCase())}
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <span className="py-2 text-gray-500">.ezy</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Layout & Theme</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => setSelectedLayout('single')}
            className={`p-4 border rounded-lg flex items-center gap-2 ${
              selectedLayout === 'single' ? 'border-blue-500 bg-blue-50' : ''
            }`}
          >
            <Layout className="w-5 h-5" />
            Single Column
          </button>
          <button
            onClick={() => setSelectedLayout('grid')}
            className={`p-4 border rounded-lg flex items-center gap-2 ${
              selectedLayout === 'grid' ? 'border-blue-500 bg-blue-50' : ''
            }`}
          >
            <Grid className="w-5 h-5" />
            Grid Layout
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 border rounded-lg flex-1 flex items-center justify-center gap-2 ${
              theme === 'light' ? 'border-blue-500 bg-blue-50' : ''
            }`}
          >
            <Palette className="w-5 h-5" />
            Light Theme
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 border rounded-lg flex-1 flex items-center justify-center gap-2 ${
              theme === 'dark' ? 'border-blue-500 bg-blue-50' : ''
            }`}
          >
            <Palette className="w-5 h-5" />
            Dark Theme
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={() => addElement('text')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <Type className="w-4 h-4" /> Text
        </button>
        <button
          onClick={() => addElement('youtube')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <Video className="w-4 h-4" /> YouTube
        </button>
        <button
          onClick={() => addElement('image')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <Image className="w-4 h-4" /> Image
        </button>
        <button
          onClick={() => addElement('link')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <Link className="w-4 h-4" /> Link
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowMessageBoard(!showMessageBoard)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${
            showMessageBoard ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          {showMessageBoard ? 'Message Board Enabled' : 'Enable Message Board'}
        </button>
      </div>

      <div className="space-y-4">
        {elements.map((element, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500 capitalize">{element.type}</span>
              <button
                onClick={() => {
                  const newElements = [...elements];
                  newElements.splice(index, 1);
                  setElements(newElements);
                }}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
            {element.type === 'text' && (
              <div>
                <textarea
                  placeholder="Enter your text here..."
                  value={element.content}
                  onChange={(e) => updateElement(index, e.target.value)}
                  className="w-full min-h-[100px] p-2 border rounded mb-2"
                />
                <div className="flex gap-2">
                  <select
                    onChange={(e) => updateElementStyle(index, { fontSize: e.target.value })}
                    className="border rounded p-1"
                  >
                    <option value="text-sm">Small</option>
                    <option value="text-base">Medium</option>
                    <option value="text-lg">Large</option>
                  </select>
                  <select
                    onChange={(e) => updateElementStyle(index, { textAlign: e.target.value })}
                    className="border rounded p-1"
                  >
                    <option value="text-left">Left</option>
                    <option value="text-center">Center</option>
                    <option value="text-right">Right</option>
                  </select>
                </div>
              </div>
            )}
            {element.type === 'youtube' && (
              <div>
                <input
                  type="text"
                  placeholder="Enter YouTube video URL or embed code"
                  value={element.content}
                  onChange={(e) => updateElement(index, e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                {element.content && (
                  <div className="aspect-video">
                    <iframe
                      src={element.content}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            )}
            {element.type === 'image' && (
              <div>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={element.content}
                  onChange={(e) => updateElement(index, e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                {element.content && (
                  <img
                    src={element.content}
                    alt=""
                    className="max-w-full h-auto rounded"
                  />
                )}
              </div>
            )}
            {element.type === 'link' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Link Text"
                  value={element.content.split('|')[0] || ''}
                  onChange={(e) => updateElement(index, `${e.target.value}|${element.content.split('|')[1] || ''}`)}
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="URL"
                  value={element.content.split('|')[1] || ''}
                  onChange={(e) => updateElement(index, `${element.content.split('|')[0] || ''}|${e.target.value}`)}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Page
        </button>
      </div>
    </div>
  );
}