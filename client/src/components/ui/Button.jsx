import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loading = false,
      icon: Icon = null,
      iconPosition = 'left',
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50 dark:from-blue-600 dark:to-blue-500 focus:ring-blue-500',
      secondary:
        'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 focus:ring-slate-400',
      outline:
        'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 focus:ring-blue-500',
      ghost:
        'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400',
      danger:
        'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/50 focus:ring-red-500',
      success:
        'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/50 focus:ring-green-500',
    };

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs gap-1.5',
      sm: 'h-9 px-4 text-sm gap-2',
      md: 'h-11 px-6 text-sm gap-2',
      lg: 'h-14 px-8 text-base gap-3',
      xl: 'px-8 py-4 text-lg gap-3',
      icon: 'h-10 w-10',
    };

    const isLoadingState = isLoading || loading;
    const combinedClass = clsx(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isLoadingState || props.disabled}
        className={combinedClass}
        whileHover={!isLoadingState && !props.disabled ? { scale: 1.02 } : {}}
        whileTap={!isLoadingState && !props.disabled ? { scale: 0.98 } : {}}
        {...props}
      >
        {isLoadingState ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
            <span>{children}</span>
            {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
