import { useId } from 'react';

import { cn } from '@/lib/cn';

const base =
  'h-10 w-full rounded-control border border-border bg-surface px-3 text-sm ' +
  'text-fg transition-colors placeholder:text-fg-muted ' +
  'focus-visible:border-accent focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-50 ' +
  'aria-invalid:border-danger-fg';

interface InputProps extends React.ComponentPropsWithRef<'input'> {
  label: string;
  error?: string;
}

const Input = ({ label, error, className, ...rest }: InputProps) => {
  const errorId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-fg">{label}</span>
        <input
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(base, className)}
          {...rest}
        />
      </label>
      {error && (
        <p id={errorId} className="text-sm text-danger-fg">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
