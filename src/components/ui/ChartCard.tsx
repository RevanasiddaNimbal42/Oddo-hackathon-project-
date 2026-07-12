import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ChartCard({ title, description, action, children, delay = 0, className }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`bg-surface border border-border rounded-2xl shadow-sm ${className ?? ''}`}
    >
      <div className="px-5 py-4 border-b border-border-soft flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-fg">{title}</h3>
          {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}
