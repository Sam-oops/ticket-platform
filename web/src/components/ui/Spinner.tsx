import { cn } from '@/lib/cn';

const base =
  'inline-block animate-spin rounded-full border-2 border-current border-t-transparent';

type Size = 'sm' | 'md' | 'lg';

interface SpinnerProps extends React.ComponentPropsWithRef<'span'> {
  size?: Size;
}

const sizes: Record<Size, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

const Spinner = ({ className, size = 'md', ...rest }: SpinnerProps) => {
  return (
    <span role="status" className={cn(base, sizes[size], className)} {...rest}>
      <span className="sr-only">Загрузка...</span>
    </span>
  );
};

export default Spinner;
