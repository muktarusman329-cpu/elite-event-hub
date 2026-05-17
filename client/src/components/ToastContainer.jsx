import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  return (
    <motion.div
      layout
      className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl"
          >
            {toast.type === 'error' ? (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            )}
            <motion.div layout className="flex-1">
              {toast.title && <p className="font-semibold text-white">{toast.title}</p>}
              <p className="text-sm text-slate-300">{toast.message}</p>
            </motion.div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="text-slate-500 transition hover:text-white"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default ToastContainer;
