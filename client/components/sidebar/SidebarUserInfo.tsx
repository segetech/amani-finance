import React from 'react';
import { SidebarUserInfoProps } from './types';

const getUserInitials = (firstName?: string, lastName?: string) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
};

const getRoleLabel = (role?: string) => {
  switch (role) {
    case 'admin':
      return '👑 Admin';
    case 'editeur':
      return '✏️ Éditeur';
    case 'analyste':
      return '📊 Analyste';
    case 'moderateur':
      return '🛡️ Modérateur';
    default:
      return role || '👤 Utilisateur';
  }
};

const SidebarUserInfo: React.FC<SidebarUserInfoProps> = ({ user }) => {
  const { firstName, lastName, role, email, avatar } = user;

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={`${firstName} ${lastName}`}
            className="w-12 h-12 rounded-xl object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {getUserInitials(firstName, lastName)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 truncate text-sm">
            {[firstName, lastName].filter(Boolean).join(' ') || email || 'Utilisateur'}
          </div>
          {role && (
            <div className="text-xs text-blue-600 font-medium">
              {getRoleLabel(role)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarUserInfo;
