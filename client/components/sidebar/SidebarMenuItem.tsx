import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SidebarMenuItemProps } from './types';
import { Link, useLocation } from 'react-router-dom';

// Animation variants for the dropdown
const variants = {
  open: { 
    opacity: 1, 
    height: 'auto',
    transition: { 
      duration: 0.2,
      ease: 'easeInOut'
    }
  },
  closed: { 
    opacity: 0, 
    height: 0,
    transition: {
      duration: 0.15,
      ease: 'easeInOut'
    }
  },
};

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isActive,
  hasPermission,
  onItemClick,
  level = 0,
}) => {
  const location = useLocation();
  const storageKey = useMemo(() => `sidebar-open:${item.path}`, [item.path]);
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.items && item.items.length > 0;
  const canShow = !item.permission || hasPermission(item.permission);
  
  // Initialize open state from localStorage and auto-expand if a child is active
  useEffect(() => {
    if (hasChildren) {
      const persisted = localStorage.getItem(storageKey);
      if (persisted !== null) {
        setIsOpen(persisted === '1');
      } else {
        const isAnyChildActive = item.items?.some(child => 
          location.pathname.startsWith(child.path)
        );
        if (isAnyChildActive) {
          setIsOpen(true);
        }
      }
    }
  }, [location.pathname, hasChildren, item.items, storageKey]);
  
  if (!canShow) return null;

  const paddingLeft = 12 + level * 16;
  const isParentActive = hasChildren && item.items?.some(child => 
    location.pathname.startsWith(child.path)
  );
  const isActiveClass = isActive || isParentActive 
    ? 'bg-gray-900 text-white' 
    : 'text-gray-700 hover:bg-gray-800 hover:text-white';
  const iconColor = isActive || isParentActive ? 'text-white' : 'text-gray-500 group-hover:text-white';

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      try { localStorage.setItem(storageKey, next ? '1' : '0'); } catch {}
      return next;
    });
  }, [storageKey]);

  const handleClick = (e: React.MouseEvent, clickedItem: typeof item) => {
    if (clickedItem.onClick) {
      e.preventDefault();
      clickedItem.onClick();
      return;
    }
    
    if (hasChildren) {
      e.preventDefault();
      toggleOpen();
    } else if (onItemClick) {
      onItemClick(clickedItem);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasChildren) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOpen();
    }
    if (e.key === 'ArrowRight' && !isOpen) {
      e.preventDefault();
      toggleOpen();
    }
    if (e.key === 'ArrowLeft' && isOpen) {
      e.preventDefault();
      toggleOpen();
    }
  };

  const submenuId = useMemo(() => `submenu-${item.path.replace(/[^a-z0-9]/gi, '-')}` , [item.path]);

  const content = (
    <div 
      className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${isActiveClass} ${item.className || ''}`}
      style={{ paddingLeft: `${paddingLeft}px` }}
      onClick={(e) => handleClick(e, item)}
      role={hasChildren ? 'button' : undefined}
      tabIndex={hasChildren ? 0 : -1}
      onKeyDown={handleKeyDown}
      aria-expanded={hasChildren ? isOpen : undefined}
      aria-controls={hasChildren ? submenuId : undefined}
    >
      <div className="flex items-center gap-3 flex-1">
        <item.icon
          className={`w-5 h-5 flex-shrink-0 ${isActive || isParentActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`}
          aria-hidden="true"
        />
        <span className="text-sm font-medium">{item.label}</span>
        {item.badge && (
          <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {item.badge}
          </span>
        )}
      </div>
      {hasChildren && (
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`${isActive || isParentActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      )}
    </div>
  );

  return (
    <div className="mb-1">
      {item.path && !hasChildren ? (
        <Link 
          to={item.path} 
          className="block"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => handleClick(e, item)}
          tabIndex={-1}
        >
          {content}
        </Link>
      ) : (
        <div className="cursor-pointer" onMouseDown={(e) => e.preventDefault()}>
          {content}
        </div>
      )}

      {hasChildren && (
        <AnimatePresence initial={false}>
          <motion.div
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
            variants={variants}
            className="overflow-hidden"
            id={submenuId}
            role="region"
            aria-label={`${item.label} submenu`}
          >
            <div className="mt-1 ml-2 border-l-2 border-gray-100 pl-2 space-y-1">
              {item.items?.map((child, index) => {
                const isChildActive = location.pathname === child.path || 
                  (child.path !== '/' && location.pathname.startsWith(child.path));
                
                return (
                  <SidebarMenuItem
                    key={index}
                    item={child}
                    isActive={isChildActive}
                    hasPermission={hasPermission}
                    onItemClick={onItemClick}
                    level={level + 1}
                  />
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default SidebarMenuItem;
