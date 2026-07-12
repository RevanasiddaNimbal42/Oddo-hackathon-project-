import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CornerDownLeft, ArrowUp, ArrowDown, Truck, User, Route as RouteIcon, type LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNavItemsForRole } from '../../config/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { cn } from '../../utils';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  action: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { user } = useAuth();
  const { vehicles, drivers, trips } = useData();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = useMemo(() => {
    if (!user) return [];
    const navCommands: CommandItem[] = getNavItemsForRole(user.role).map((item) => ({
      id: `nav-${item.path}`,
      label: item.label,
      hint: 'Navigation',
      icon: item.icon,
      action: () => { navigate(item.path); onClose(); },
    }));

    const vehicleCommands: CommandItem[] = vehicles.slice(0, 5).map((v) => ({
      id: `v-${v.id}`,
      label: `${v.name} (${v.registration})`,
      hint: 'Vehicle',
      icon: Truck,
      action: () => { navigate(`/vehicles/${v.id}`); onClose(); },
    }));

    const driverCommands: CommandItem[] = drivers.slice(0, 5).map((d) => ({
      id: `d-${d.id}`,
      label: d.name,
      hint: 'Driver',
      icon: User,
      action: () => { navigate(`/drivers/${d.id}`); onClose(); },
    }));

    const tripCommands: CommandItem[] = trips.slice(0, 5).map((t) => ({
      id: `t-${t.id}`,
      label: `${t.code}: ${t.source} → ${t.destination}`,
      hint: 'Trip',
      icon: RouteIcon,
      action: () => { navigate('/trips'); onClose(); },
    }));

    return [...navCommands, ...vehicleCommands, ...driverCommands, ...tripCommands];
  }, [user, vehicles, drivers, trips, navigate, onClose]);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && filtered[activeIndex]) { filtered[activeIndex].action(); }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 border-b border-border-soft">
              <Search size={18} className="text-subtle" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search vehicles, drivers, trips, or navigate..."
                className="flex-1 h-14 bg-transparent text-sm text-fg placeholder:text-subtle focus:outline-none"
              />
              <kbd className="text-xs text-subtle bg-surface-2 px-2 py-0.5 rounded-md">ESC</kbd>
            </div>
            <div className="max-h-[40vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted text-center py-8">No results for "{query}"</p>
              ) : (
                filtered.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={item.action}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                        i === activeIndex ? 'bg-primary-soft' : 'hover:bg-surface-2',
                      )}
                    >
                      <Icon size={16} className={i === activeIndex ? 'text-primary' : 'text-subtle'} />
                      <span className={cn('text-sm flex-1 truncate', i === activeIndex ? 'text-primary font-medium' : 'text-fg')}>{item.label}</span>
                      <span className="text-xs text-subtle">{item.hint}</span>
                    </button>
                  );
                })
              )}
            </div>
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border-soft text-xs text-subtle">
              <span className="flex items-center gap-1"><ArrowUp size={12} /><ArrowDown size={12} /> navigate</span>
              <span className="flex items-center gap-1"><CornerDownLeft size={12} /> select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
