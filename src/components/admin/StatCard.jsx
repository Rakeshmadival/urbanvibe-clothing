export default function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className={`border p-5 ${accent ? 'border-gold bg-ink text-ivory' : 'border-ink/10 bg-white'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs tracking-widest2 uppercase ${accent ? 'text-gold-soft' : 'text-fog'}`}>{label}</span>
        {Icon && <Icon size={18} className={accent ? 'text-gold' : 'text-gold-deep'} strokeWidth={1.5} />}
      </div>
      <p className="text-3xl font-display">{value}</p>
    </div>
  );
}
