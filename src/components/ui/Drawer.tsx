import { type ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'right' | 'left';
  width?: string;
}

export function Drawer({ open, onClose, title, description, children, footer, side = 'right', width = 'max-w-md' }: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', handler);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handler);
      };
    }
  }, [open, onClose]);

  const xInitial = side === 'right' ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: xInitial }}
            animate={{ x: 0 }}
            exit={{ x: xInitial }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn('absolute top-0 bottom-0 w-full bg-surface border-l border-border shadow-xl flex flex-col', width, side === 'left' ? 'left-0 border-l-0 border-r' : 'right-0')}
          >
            {(title || description) && (
              <div className="px-6 py-5 border-b border-border-soft flex items-start justify-between gap-4">
                <div>
                  {title && <h2 className="text-lg font-semibold text-fg">{title}</h2>}
                  {description && <p className="text-sm text-muted mt-1">{description}</p>}
                </div>
                <button onClick={onClose} className="text-subtle hover:text-fg transition-colors rounded-lg p-1 hover:bg-surface-2">
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-border-soft">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
