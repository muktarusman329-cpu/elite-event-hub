import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Card = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export { Card };
