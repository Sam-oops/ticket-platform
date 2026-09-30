import { cn } from '@/lib/cn';

const base = 'bg-surface border border-border rounded-card p-4';

const Card = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'div'>) => {
  return (
    <div className={cn(base, className)} {...rest}>
      {children}
    </div>
  );
};

export default Card;
