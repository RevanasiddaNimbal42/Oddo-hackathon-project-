import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

interface TimelineItem {
  label: string;
  timestamp: string;
  type: 'created' | 'dispatched' | 'completed' | 'cancelled' | 'custom';
  icon?: ReactNode;
}

const typeColors = {
  created: 'bg-info',
  dispatched: 'bg-primary',
  completed: 'bg-success',
  cancelled: 'bg-danger',
  custom: 'bg-accent',
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex gap-4 pb-6 last:pb-0"
        >
          <div className="flex flex-col items-center">
            <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-white flex-shrink-0', typeColors[item.type])}>
              {item.icon ?? <span className="h-2 w-2 rounded-full bg-white" />}
            </div>
            {i < items.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
          </div>
          <div className="pt-1">
            <p className="text-sm font-medium text-fg">{item.label}</p>
            <p className="text-xs text-muted mt-0.5">{new Date(item.timestamp).toLocaleString()}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
