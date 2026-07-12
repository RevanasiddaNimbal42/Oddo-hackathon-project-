import { type ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils';

interface AccordionItem {
  id: string;
  header: ReactNode;
  children: ReactNode;
}

export function Accordion({ items, defaultOpen }: { items: AccordionItem[]; defaultOpen?: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);

  return (
    <div className="divide-y divide-border-soft border border-border rounded-xl overflow-hidden bg-surface">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <button
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-surface-2 transition-colors"
            >
              <span className="text-sm font-medium text-fg">{item.header}</span>
              <ChevronDown size={18} className={cn('text-subtle transition-transform', isOpen && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3.5 text-sm text-muted">{item.children}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
