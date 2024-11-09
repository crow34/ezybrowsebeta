import React from 'react';
import { User, LogOut, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserMenuProps {
  onAuthClick: () => void;
}

export default function UserMenu({ onAuthClick }: UserMenuProps) {
  const { user, isAuthenticated, logout, upgradeAccount } = useAuth();

  if (!isAuthenticated) {
    return (
      <button
        onClick={onAuthClick}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <User className="w-4 h-4" />
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user?.role === 'free' && (
        <button
          onClick={upgradeAccount}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600"
        >
          <Crown className="w-4 h-4" />
          Upgrade
        </button>
      )}
      <div className="text-sm text-gray-600">
        {user?.email}
        <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
          {user?.role}
        </span>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}