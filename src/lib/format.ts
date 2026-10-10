export const rupiah = (n?: number) => (n === undefined ? '' : `Rp ${n.toLocaleString('id-ID')}`);

/** Nomor WhatsApp valid -> hanya digit berawalan 62; selain itu null (masih placeholder). */
export function waNumber(raw?: string): string | null {
  if (!raw) return null;
  let d = raw.replace(/[^\d]/g, '');
  if (d.length < 9) return null;
  if (d.startsWith('0')) d = '62' + d.slice(1);
  return d;
}

export const waLink = (raw: string | undefined, text?: string) => {
  const n = waNumber(raw);
  if (!n) return null;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
};
