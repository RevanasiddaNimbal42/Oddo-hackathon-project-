import { useState, useEffect, useRef } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils';

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = themes.find((t) => t.name === theme);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-9 px-2.5 rounded-lg text-muted hover:text-fg hover:bg-surface-2 transition-colors"
        title="Switch theme"
      >
        <span
          className="h-4 w-4 rounded-md flex-shrink-0 ring-1 ring-black/10"
          style={{ backgroundColor: current?.color }}
        />
        <span className="hidden lg:block text-sm font-medium">{current?.label}</span>
        <ChevronDown size={14} className={cn('text-subtle transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 bg-surface border border-border rounded-xl shadow-lg overflow-hidden p-1.5 z-50"
          >
            <div className="px-2.5 py-1.5 flex items-center gap-2 text-xs font-semibold text-subtle uppercase tracking-wider">
              <Palette size={12} /> Theme
            </div>
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => { setTheme(t.name); setOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors',
                  theme === t.name ? 'bg-primary-soft text-primary font-medium' : 'text-fg hover:bg-surface-2',
                )}
              >
                <span
                  className="h-5 w-5 rounded-md flex-shrink-0 ring-1 ring-black/10"
                  style={{ backgroundColor: t.color }}
                />
                <span className="flex-1 text-left">{t.label}</span>
                {theme === t.name && <Check size={15} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
