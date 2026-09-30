import { cn } from '@/lib/cn';

const base = 'animate-pulse bg-surface-muted rounded-control';

const Skeleton = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>) => {
  return (
    <div aria-hidden="true" className={cn(base, className)} {...rest}></div>
  );
};

export default Skeleton;
