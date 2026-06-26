export default function FullPageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink">
      <span className="font-display text-3xl tracking-wide mb-6">
        <span className="text-ivory">URBAN</span>
        <span className="text-gold ml-1">VIBE</span>
      </span>
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
