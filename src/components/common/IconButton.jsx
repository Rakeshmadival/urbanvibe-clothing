export default function IconButton({ icon: Icon, badge, onClick, label, light = true, className = '' }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`relative p-2 transition-colors duration-200 ${
        light ? 'text-ivory hover:text-gold-soft' : 'text-ink hover:text-gold-deep'
      } ${className}`}
    >
      <Icon size={20} strokeWidth={1.5} />
      {badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-gold text-ink text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
}
