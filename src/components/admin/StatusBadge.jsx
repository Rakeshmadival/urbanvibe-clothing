const styles = {
  draft: 'bg-ink/10 text-ink/60',
  published: 'bg-gold/20 text-gold-deep',
  'out-of-stock': 'bg-rust/15 text-rust',
  new: 'bg-gold/20 text-gold-deep',
  confirmed: 'bg-emerald-100 text-emerald-700',
};

const labels = {
  draft: 'Draft',
  published: 'Published',
  'out-of-stock': 'Out of Stock',
  new: 'New',
  confirmed: 'Confirmed',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase rounded-full ${styles[status] || 'bg-ink/10 text-ink/60'}`}>
      {labels[status] || status}
    </span>
  );
}
