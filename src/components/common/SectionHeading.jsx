import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, align = 'center', light = false }) {
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center';
  return (
    <motion.div
      className={`flex flex-col ${alignClass} mb-10 md:mb-14`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {eyebrow && (
        <span
          className={`text-xs tracking-widest3 uppercase mb-3 ${
            light ? 'text-gold-soft' : 'text-gold-deep'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-serif italic font-medium text-3xl md:text-5xl relative pb-3 ${
          light ? 'text-ivory' : 'text-ink'
        }`}
      >
        {title}
        <motion.span
          className="absolute left-0 bottom-0 h-[1.5px] bg-gradient-to-r from-gold to-gold-soft"
          initial={{ width: 0 }}
          whileInView={{ width: align === 'left' ? '70%' : '60%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
          style={align === 'center' ? { left: '20%' } : {}}
        />
      </h2>
    </motion.div>
  );
}
