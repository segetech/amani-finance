import React from 'react';
import { SidebarMenuSectionProps } from './types';
import SidebarMenuItem from './SidebarMenuItem';

const SidebarMenuSection: React.FC<SidebarMenuSectionProps> = ({
  section,
  hasPermission,
  isItemActive,
  onItemClick,
}) => {
  // Vérifier si la section a une condition et si elle est remplie
  if (section.condition && !section.condition()) {
    return null;
  }

  // Vérifier les permissions pour la section
  if (section.permission && !hasPermission(section.permission)) {
    return null;
  }

  // Vérifier si au moins un élément de la section est visible
  const hasVisibleItems = section.items.some(
    (item) => !item.permission || hasPermission(item.permission)
  );

  if (!hasVisibleItems) {
    return null;
  }

  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 px-2">
        {section.title}
      </h3>
      <div className="space-y-1">
        {section.items.map((item) => {
          // Vérifier les permissions pour chaque élément
          if (item.permission && !hasPermission(item.permission)) {
            return null;
          }
          
          return (
            <SidebarMenuItem
              key={item.path}
              item={item}
              isActive={isItemActive(item.path)}
              hasPermission={hasPermission}
              onItemClick={onItemClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SidebarMenuSection;
