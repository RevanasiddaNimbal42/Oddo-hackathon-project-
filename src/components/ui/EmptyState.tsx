import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="h-14 w-14 rounded-2xl bg-surface-2 flex items-center justify-center mb-4">
        <Icon size={24} className="text-subtle" />
      </span>
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      <p className="text-sm text-muted mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
