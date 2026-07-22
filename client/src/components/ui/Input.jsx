import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const Input = forwardRef(
  (
    {
      className = '',
      label = '',
      error = '',
      success = false,
      helpText = '',
      type = 'text',
      size = 'md',
      variant = 'default',
      icon: Icon = null,
      iconPosition = 'left',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full rounded-lg transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950';

    const variants = {
      default: 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100',
      filled: 'border border-transparent bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100',
      flushed: 'border-0 border-b border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-slate-100 rounded-none',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const stateStyles = clsx(
      error && 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400',
      success && !error && 'border-green-500 dark:border-green-400 focus:ring-green-500 dark:focus:ring-green-400'
    );

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={clsx(
              baseStyles,
              variants[variant],
              sizes[size],
              stateStyles,
              disabled && 'opacity-50 cursor-not-allowed',
              Icon && iconPosition === 'left' && 'pl-10',
              Icon && iconPosition === 'right' && 'pr-10',
              className
            )}
            {...props}
          />
          {Icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
              <Icon className="w-5 h-5" />
            </div>
          )}
          {success && !error && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 dark:text-green-400" />
          )}
          {error && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 dark:text-red-400" />
          )}
        </div>
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        ) : helpText ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{helpText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
