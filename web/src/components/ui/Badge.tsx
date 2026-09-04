import { cn } from '@/lib/cn';
import { HTMLAttributes } from 'react';

type Status = 'neutral' | 'success' | 'warning' | 'danger';

const base =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full ' +
  'px-2 py-0.5 text-xs font-medium';

const statuses: Record<Status, string> = {
  neutral: 'bg-surface-muted text-fg-muted',
  success: 'bg-success text-success-fg',
  warning: 'bg-warning text-warning-fg',
  danger: 'bg-danger text-danger-fg',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Status;
}

const Badge = ({
  tone = 'neutral',
  className,
  children,
  ...rest
}: BadgeProps) => {
  return (
    <span className={cn(base, statuses[tone], className)} {...rest}>
      {children}
    </span>
  );
};

export default Badge;
