import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Truck, X } from 'lucide-react';
import { getNavItemsForRole } from '../../config/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { cn } from '../../utils';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onMobileClose, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { trips, maintenance } = useData();
  const navItems = user ? getNavItemsForRole(user.role) : [];

  const badgeCount = (badge?: string) => {
    if (badge === 'trips') return trips.filter((t) => t.status === 'Draft').length;
    if (badge === 'maintenance') return maintenance.filter((m) => m.status !== 'Completed').length;
    return 0;
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className={cn('flex items-center h-16 px-5 border-b border-border-soft flex-shrink-0', collapsed && 'justify-center px-0')}>
        <Link to="/" className="flex items-center gap-2.5" onClick={onMobileClose}>
          <span className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-glow">
            <Truck size={20} className="text-primary-fg" />
          </span>
          {!collapsed && (
            <span className="font-bold text-lg text-fg tracking-tight">
              Transit<span className="text-primary">Ops</span>
            </span>
          )}
        </Link>
        <button
          onClick={onMobileClose}
          className="lg:hidden ml-auto text-subtle hover:text-fg p-1"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
        {!collapsed && <p className="px-3 mb-2 text-xs font-semibold text-subtle uppercase tracking-wider">Modules</p>}
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            const badge = badgeCount(item.badge);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive ? 'text-primary' : 'text-muted hover:text-fg hover:bg-surface-2',
                  collapsed && 'justify-center px-0',
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary-soft rounded-xl"
                    transition={{ type: 'spring', damping: 24, stiffness: 300 }}
                  />
                )}
                <Icon size={18} className="relative flex-shrink-0 z-10" />
                {!collapsed && <span className="relative z-10 flex-1">{item.label}</span>}
                {!collapsed && badge > 0 && (
                  <span className="relative z-10 h-5 min-w-5 px-1.5 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
                    {badge}
                  </span>
                )}
                {collapsed && badge > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-border-soft p-3 flex-shrink-0">
        <button
          onClick={onToggleCollapse}
          className="w-full hidden lg:flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-fg hover:bg-surface-2 transition-colors"
        >
          <ChevronLeft size={18} className={cn('transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <AnimatePresence initial={false}>
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 72 : 264 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="hidden lg:block bg-surface border-r border-border h-screen sticky top-0 flex-shrink-0 overflow-hidden"
        >
          {content}
        </motion.aside>
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 left-0 bottom-0 w-[264px] bg-surface border-r border-border"
            >
              {content}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
