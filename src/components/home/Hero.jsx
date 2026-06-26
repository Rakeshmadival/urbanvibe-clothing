import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';

export default function Hero() {
  return (
    <section className="relative h-[88vh] min-h-[560px] overflow-hidden bg-ink">
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img
          src="/images/hero/home-hero.svg"
          alt="UrbanVibe new season"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
      </motion.div>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-start justify-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gold-soft text-xs md:text-sm tracking-widest3 uppercase mb-4"
        >
          New Season — Women · Men · Kids
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="font-display text-5xl sm:text-6xl md:text-8xl text-ivory leading-[0.95]"
        >
          DRESS YOUR
          <br />
          <span className="font-serif italic font-medium text-gold-soft text-4xl sm:text-5xl md:text-7xl">
            Everyday
          </span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="flex flex-wrap gap-4 mt-8"
        >
          <Button as={Link} to="/shop" variant="gold">
            Shop Now
          </Button>
          <Button as={Link} to="/collections" variant="outlineLight">
            Explore Collections
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
