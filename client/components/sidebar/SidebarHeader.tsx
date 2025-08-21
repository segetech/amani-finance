import React from 'react';
import { SidebarHeaderProps } from './types';

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  logo = 'https://cdn.builder.io/api/v1/image/assets%2Fa7441c9084eb43e6855cf7e960c5c609%2F6ebebc1a91e8447db48a68aa5b391a28?format=webp&width=200',
  appName = 'Dashboard',
  appDescription = 'Amani Finance',
}) => {
  return (
    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center gap-3">
        {logo && (
          <img
            src={logo}
            alt={appName}
            className="h-8 w-auto"
          />
        )}
        <div>
          <div className="font-bold text-blue-700 text-lg">{appName}</div>
          <div className="text-xs text-blue-600">{appDescription}</div>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
