import type { HTMLAttributes } from 'react';
import { cn } from '../../utils';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const tones: Record<Tone, string> = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-surface-2 text-muted',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

export function Badge({ tone = 'neutral', dot, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        tones[tone], className,
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const statusToneMap: Record<string, Tone> = {
  'Available': 'success', 'On Trip': 'info', 'In Shop': 'warning', 'Retired': 'neutral',
  'Off Duty': 'neutral', 'Suspended': 'danger',
  'Draft': 'neutral', 'Dispatched': 'info', 'Completed': 'success', 'Cancelled': 'danger',
  'Open': 'warning', 'In Progress': 'info',
  'Low': 'neutral', 'Medium': 'info', 'High': 'warning', 'Critical': 'danger',
};

export function StatusBadge({ status, dot = true }: { status: string; dot?: boolean }) {
  const tone = statusToneMap[status] ?? 'neutral';
  return <Badge tone={tone} dot={dot}>{status}</Badge>;
}
