import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils';

interface KPICardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  delay?: number;
  children?: ReactNode;
}

const tones = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
};

export function KPICard({ label, value, icon: Icon, trend, tone = 'primary', delay = 0, children }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={cn('h-10 w-10 rounded-xl flex items-center justify-center', tones[tone])}>
          <Icon size={20} />
        </span>
        {trend && (
          <span className={cn('flex items-center gap-1 text-xs font-medium', trend.up ? 'text-success' : 'text-danger')}>
            {trend.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-fg tracking-tight">{value}</p>
      <p className="text-sm text-muted mt-0.5">{label}</p>
      {children}
    </motion.div>
  );
}
