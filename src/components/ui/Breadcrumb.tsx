import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  path?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <div key={i} className="flex items-center gap-1">
            {item.path && !isLast ? (
              <Link to={item.path} className="text-muted hover:text-fg transition-colors">{item.label}</Link>
            ) : (
              <span className={isLast ? 'text-fg font-medium' : 'text-muted'}>{item.label}</span>
            )}
            {!isLast && <ChevronRight size={14} className="text-subtle" />}
          </div>
        );
      })}
    </nav>
  );
}
