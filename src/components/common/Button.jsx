import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-ink text-ivory hover:bg-charcoal',
  gold: 'bg-gold text-ink hover:bg-gold-soft',
  outline: 'bg-transparent border border-ink text-ink hover:bg-ink hover:text-ivory',
  outlineLight: 'bg-transparent border border-ivory/60 text-ivory hover:bg-ivory hover:text-ink',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  as: Component = 'button',
  ...props
}) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
      <Component
        className={`px-7 py-3 text-sm tracking-widest2 uppercase transition-colors duration-300 ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  );
}
