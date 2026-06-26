const messages = [
  'FREE SHIPPING ON ORDERS ABOVE ₹999',
  'NEW SEASON ARRIVALS — SHOP NOW',
  'ORDER DIRECTLY ON WHATSAPP — NO SIGNUP NEEDED',
  'COD AVAILABLE ACROSS INDIA',
];

export default function AnnouncementBar() {
  const loop = [...messages, ...messages];
  return (
    <div className="bg-ink text-ivory overflow-hidden py-2 select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {loop.map((msg, i) => (
          <span key={i} className="mx-8 text-xs tracking-widest2 uppercase text-ivory/80">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
