import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Command, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Avatar } from '../ui/Avatar';
import { ThemeSwitcher } from './ThemeSwitcher';
import { cn } from '../../utils';

interface NavbarProps {
  onMobileMenuOpen: () => void;
  onToggleNotifications: () => void;
  onOpenCommand: () => void;
  breadcrumb: ReactNode;
}

export function Navbar({ onMobileMenuOpen, onToggleNotifications, onOpenCommand, breadcrumb }: NavbarProps) {
  const { user, logout } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 glass border-b border-border sticky top-0 z-30 flex items-center px-4 gap-3">
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg text-muted hover:text-fg hover:bg-surface-2 transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="hidden md:block flex-shrink-0">{breadcrumb}</div>

      <button
        onClick={onOpenCommand}
        className="ml-auto flex items-center gap-2 h-9 px-3 rounded-lg bg-surface-2 border border-border text-sm text-subtle hover:text-muted hover:border-border transition-all w-full max-w-xs"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Search...</span>
        <span className="ml-auto hidden sm:flex items-center gap-0.5 text-xs">
          <Command size={12} />K
        </span>
      </button>

      <ThemeSwitcher />

      <button
        onClick={onToggleNotifications}
        className="relative h-9 w-9 flex items-center justify-center rounded-lg text-muted hover:text-fg hover:bg-surface-2 transition-colors flex-shrink-0"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <div className="relative flex-shrink-0" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-lg hover:bg-surface-2 transition-colors"
        >
          <Avatar name={user?.name ?? 'User'} hue={user?.avatarHue} size="sm" />
          <span className="hidden sm:block text-sm font-medium text-fg max-w-[120px] truncate">{user?.name}</span>
          <ChevronDown size={14} className={cn('text-subtle transition-transform', menuOpen && 'rotate-180')} />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-60 bg-surface border border-border rounded-xl shadow-lg overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border-soft">
                <p className="text-sm font-semibold text-fg">{user?.name}</p>
                <p className="text-xs text-muted">{user?.email}</p>
                <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-soft text-primary">
                  {user?.role}
                </span>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-fg hover:bg-surface-2 transition-colors"
                >
                  My Profile
                </button>
                <button
                  onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-fg hover:bg-surface-2 transition-colors"
                >
                  Settings
                </button>
                <div className="h-px bg-border-soft my-1.5" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger-soft transition-colors"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
