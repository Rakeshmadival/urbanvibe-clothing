import { useState, useRef } from 'react';

export default function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)',
    });
  };

  const resetZoom = () => setZoomStyle({ transform: 'scale(1)' });

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible no-scrollbar">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => setActive(i)}
            className={`w-16 h-20 flex-shrink-0 overflow-hidden border ${
              active === i ? 'border-ink' : 'border-transparent opacity-60'
            }`}
          >
            <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
      <div
        ref={containerRef}
        className="relative flex-1 aspect-[3/4] overflow-hidden bg-sand cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetZoom}
      >
        <img
          src={images[active]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-200 ease-out"
          style={zoomStyle}
        />
      </div>
    </div>
  );
}
