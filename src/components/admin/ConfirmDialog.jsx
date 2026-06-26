import { AnimatePresence, motion } from 'framer-motion';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger = true }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-ink/60 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-ivory max-w-sm w-full p-6"
          >
            <h3 className="font-serif italic text-xl mb-2">{title}</h3>
            <p className="text-sm text-ink/70 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onCancel} className="px-4 py-2 text-sm border border-ink/20 hover:bg-ink/5">
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm text-ivory ${danger ? 'bg-rust hover:bg-rust/90' : 'bg-ink hover:bg-charcoal'}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
