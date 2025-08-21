import React from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { MenuItem } from './types';

export type RenderMenuItemParams = {
  item: MenuItem;
  isItemActive: (path: string) => boolean;
  hasPermission: (permission?: string) => boolean;
  onItemClick?: (item: MenuItem) => void;
  level?: number;
};

// Generic render function that delegates to SidebarMenuItem (supports nested, collapsible submenus)
export function renderMenuItem({
  item,
  isItemActive,
  hasPermission,
  onItemClick,
  level = 0,
}: RenderMenuItemParams) {
  return (
    <SidebarMenuItem
      item={item}
      isActive={isItemActive(item.path)}
      hasPermission={hasPermission}
      onItemClick={onItemClick}
      level={level}
    />
  );
}
