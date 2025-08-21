import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export type MenuItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  permission?: string;
  description?: string;
  badge?: string;
  items?: MenuItem[];
  className?: string;
  onClick?: () => void;
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
  permission?: string;
  condition?: () => boolean;
};

export type SidebarMenuItemProps = {
  item: MenuItem;
  isActive: boolean;
  hasPermission: (permission?: string) => boolean;
  onItemClick?: (item: MenuItem) => void;
  level?: number;
};

export type SidebarMenuSectionProps = {
  section: MenuSection;
  hasPermission: (permission?: string) => boolean;
  isItemActive: (path: string) => boolean;
  onItemClick?: (item: MenuItem) => void;
};

export type SidebarHeaderProps = {
  logo?: string;
  appName: string;
  appDescription: string;
};

export type SidebarUserInfoProps = {
  user: {
    firstName?: string;
    lastName?: string;
    role?: string;
    email?: string;
    avatar?: string;
  };
};

export type SidebarFooterProps = {
  onLogout: () => void;
};
