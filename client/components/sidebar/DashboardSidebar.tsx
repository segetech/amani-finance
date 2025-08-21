import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { menuSections } from './menuConfig';
import SidebarHeader from './SidebarHeader';
import SidebarUserInfo from './SidebarUserInfo';
import SidebarMenuSection from './SidebarMenuSection';
import SidebarFooter from './SidebarFooter';
import { MenuItem } from './types';

const DashboardSidebar: React.FC = () => {
  const { user, logout, hasPermission: checkPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Persist sidebar scroll position across route changes
  const navRef = useRef<HTMLDivElement | null>(null);
  const SCROLL_KEY = 'sidebar:scrollTop';

  // Restore scroll before paint to avoid visual jump
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved && navRef.current) {
      const value = parseInt(saved, 10);
      if (!Number.isNaN(value)) {
        navRef.current.scrollTop = value;
      }
    }
  }, []);

  // On route change, re-apply the saved position in case the DOM resets scroll
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved && navRef.current) {
      const value = parseInt(saved, 10);
      if (!Number.isNaN(value)) {
        // apply immediately and once again next tick
        navRef.current.scrollTop = value;
        requestAnimationFrame(() => {
          if (navRef.current) navRef.current.scrollTop = value;
        });
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const onScroll = () => {
      try {
        sessionStorage.setItem(SCROLL_KEY, String(el.scrollTop));
      } catch {}
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleItemClick = useCallback((item: MenuItem) => {
    // Gérer les clics sur les éléments de menu si nécessaire
    console.log('Menu item clicked:', item.label);
  }, []);

  const isItemActive = useCallback(
    (path: string) => {
      if (path === '/dashboard') {
        return location.pathname === '/dashboard';
      }
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  // Vérifier les permissions de manière plus robuste
  const hasPermission = useCallback(
    (permission?: string) => {
      if (!permission) return true;
      return checkPermission(permission);
    },
    [checkPermission]
  );

  // Filtrer les sections en fonction des permissions
  const filteredSections = menuSections.filter((section) => {
    // Si la section a une condition, l'utiliser
    if (section.condition) {
      return section.condition();
    }
    
    // Vérifier la permission de la section si elle en a une
    if (section.permission) {
      return hasPermission(section.permission);
    }
    
    // Si la section n'a pas de permission spécifique, vérifier si elle a des éléments visibles
    return section.items.some(
      (item) => !item.permission || hasPermission(item.permission)
    );
  });

  if (!user) {
    return null; // Ne pas afficher la sidebar si l'utilisateur n'est pas connecté
  }

  // Injecter un onClick sur l'élément "Déconnexion" du menu
  const enhancedSections = filteredSections.map((section) => ({
    ...section,
    items: section.items.map((item) =>
      item.label === 'Déconnexion' ? { ...item, onClick: handleLogout } : item
    )
  }));

  return (
    <div className="w-80 bg-white h-screen sticky top-0 shadow-2xl border-r border-gray-200 flex flex-col overflow-hidden">
      {/* En-tête */}
      <SidebarHeader appName="Amani Finance" appDescription="Your Financial Dashboard" />

      {/* Informations utilisateur */}
      <SidebarUserInfo user={user} />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto overscroll-contain" ref={navRef}>
        {enhancedSections.map((section) => (
          <div key={section.title}>
            <SidebarMenuSection
              section={section}
              hasPermission={hasPermission}
              isItemActive={isItemActive}
              onItemClick={handleItemClick}
            />
          </div>
        ))}
      </nav>

      {/* Pied de page */}
      <SidebarFooter onLogout={handleLogout} />
    </div>
  );
};

export default DashboardSidebar;
