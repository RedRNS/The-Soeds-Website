import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../lib/lang';

/** Gambar dengan cadangan: bila URL gagal dimuat, tampil blok crimson bertuliskan nama. */
export const Img: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { alt: string; eager?: boolean }
> = ({ alt, className = '', eager, ...rest }) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [rest.src]);
  if (failed || !rest.src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} flex items-center justify-center bg-burgundy p-3 text-center font-serif text-sm text-cream/80`}
      >
        {alt}
      </div>
    );
  }
  return (
    <img
      {...rest}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

/** Fade-up halus saat elemen masuk layar. */
export const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

/** Tombol bulat putih khas The Soeds (PESAN MEJA). */
export const RoundCta: React.FC<{
  onClick: () => void;
  className?: string;
  size?: 'md' | 'lg';
}> = ({ onClick, className = '', size = 'lg' }) => {
  const { t } = useLang();
  const dim = size === 'lg' ? 'h-[110px] w-[110px] md:h-[130px] md:w-[130px]' : 'h-[110px] w-[110px]';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex ${dim} flex-col items-center justify-center rounded-full bg-white text-crimson shadow-xl transition duration-300 hover:scale-110 hover:bg-crimson hover:text-white hover:ring-2 hover:ring-white focus-visible:ring-4 focus-visible:ring-white ${className}`}
    >
      <span className="label leading-tight">{t('Pesan', 'Book a')}</span>
      <span className="label flex items-center gap-0.5 leading-tight">
        {t('Meja', 'Table')}
        <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </button>
  );
};

export const PillButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'outline' | 'solid' | 'light' }
> = ({ tone = 'outline', className = '', children, ...rest }) => {
  const tones = {
    outline:
      'border border-charcoal/40 text-charcoal hover:border-crimson hover:bg-crimson hover:text-white',
    solid: 'border border-crimson bg-crimson text-white hover:bg-crimson-dark',
    light: 'border border-white/60 text-white hover:bg-white hover:text-crimson',
  };
  return (
    <button
      type="button"
      {...rest}
      className={`label inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 transition ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <span className={`label tracking-[0.12em] text-stone ${className}`}>{children}</span>;

/** Ikon sosial media garis tipis (inline agar tidak tergantung versi lucide). */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};
export const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);
export const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke} aria-hidden>
    <path d="M3.5 20.5l1.3-4.3A8.5 8.5 0 1 1 8 19.3z" />
    <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-.9-.4-1.8-1.3-2.2-2.2l.8-1-1-2z" />
  </svg>
);
