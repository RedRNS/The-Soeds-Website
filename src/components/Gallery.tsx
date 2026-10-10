import React, { useRef, useState } from 'react';
import { GALLERY } from '../data/images';
import { Img, Reveal } from './ui';

const DragBadge: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <div
    style={style}
    className={`label pointer-events-none flex h-[76px] w-[76px] items-center justify-center rounded-full bg-crimson tracking-[0.12em] text-white shadow-lg ${className}`}
  >
    DRAG
  </div>
);

/** Galeri horizontal: bisa digeser dengan mouse (drag), sentuhan, atau scroll biasa. */
export const Gallery: React.FC = () => {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const moved = useRef(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft };
    moved.current = false;
    setDragging(true);
  };
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      const r = e.currentTarget.getBoundingClientRect();
      setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
    }
    if (!drag.current || !track.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 3) moved.current = true;
    track.current.scrollLeft = drag.current.left - dx;
  };
  const end = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <section aria-label="Galeri" className="overflow-hidden bg-white py-[72px] md:py-[120px]">
      <div
        className="relative select-none"
        onPointerLeave={() => {
          setCursor(null);
          end();
        }}
        onPointerMove={onMove}
        onPointerDown={onDown}
        onPointerUp={end}
      >
        <div
          ref={track}
          tabIndex={0}
          aria-label="Galeri foto, geser ke samping"
          className={`no-scrollbar flex gap-4 overflow-x-auto px-4 sm:gap-6 sm:px-8 lg:pl-[max(2rem,calc((100vw-1376px)/2+2rem))] ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollSnapType: dragging ? 'none' : 'x proximity' }}
        >
          {GALLERY.map((g, i) => (
            <Reveal key={g.title} delay={i * 60} className="shrink-0 snap-start">
              <figure className="relative aspect-[4/3] w-[80vw] overflow-hidden bg-burgundy sm:aspect-[16/10] sm:w-[62vw] lg:w-[min(58vw,800px)]">
                <Img
                  src={g.src}
                  alt={g.title}
                  draggable={false}
                  className="pointer-events-none h-full w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 pt-14 text-white">
                  <p className="label text-white/80">{g.tag}</p>
                  <p className="font-serif text-2xl sm:text-3xl">{g.title}</p>
                </figcaption>
                {i === 0 && !cursor && (
                  <DragBadge className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </figure>
            </Reveal>
          ))}
          <div className="w-px shrink-0 sm:w-4" aria-hidden />
        </div>

        {cursor && (
          <DragBadge
            className="absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:flex"
            style={{ left: cursor.x, top: cursor.y }}
          />
        )}
      </div>
    </section>
  );
};
