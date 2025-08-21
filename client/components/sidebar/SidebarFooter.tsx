import React from 'react';
import { LogOut } from 'lucide-react';
import { SidebarFooterProps } from './types';

const SidebarFooter: React.FC<SidebarFooterProps> = ({ onLogout }) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
      >
        <LogOut className="w-5 h-5" />
        <span>Déconnexion</span>
      </button>
    </div>
  );
};

export default SidebarFooter;
