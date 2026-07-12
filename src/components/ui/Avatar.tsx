import { cn } from '../../utils';

interface AvatarProps {
  name: string;
  hue?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function Avatar({ name, hue = 210, size = 'md', className }: AvatarProps) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span
      className={cn('inline-flex items-center justify-center rounded-full font-semibold flex-shrink-0', sizes[size], className)}
      style={{
        backgroundColor: `hsl(${hue} 70% 92%)`,
        color: `hsl(${hue} 70% 30%)`,
      }}
    >
      {initials}
    </span>
  );
}
