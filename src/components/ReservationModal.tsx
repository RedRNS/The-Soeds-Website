import React, { useEffect, useRef, useState } from 'react';
import { Check, Minus, Plus, X } from 'lucide-react';
import { useLang } from '../lib/lang';
import { useNav } from '../lib/nav';
import { isPlaceholder, useContent } from '../lib/content';
import { waLink, waNumber } from '../lib/format';
import { IMG } from '../data/images';
import { Img } from './ui';

type Area = 'Indoor' | 'Outdoor' | 'Tidak ada preferensi';
const AREAS: { v: Area; id: string; en: string }[] = [
  { v: 'Indoor', id: 'Indoor', en: 'Indoor' },
  { v: 'Outdoor', id: 'Outdoor', en: 'Outdoor' },
  { v: 'Tidak ada preferensi', id: 'Tidak ada preferensi', en: 'No preference' },
];

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export const ReservationModal: React.FC = () => {
  const { t } = useLang();
  const { reservationOpen, closeReservation } = useNav();
  const { content } = useContent();
  const info = content.info;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [area, setArea] = useState<Area>('Tidak ada preferensi');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);
  const [banner, setBanner] = useState('');
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!reservationOpen) return;
    setSent(null);
    setBanner('');
    setErrors({});
    const id = setTimeout(() => firstField.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeReservation();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', onKey);
    };
  }, [reservationOpen, closeReservation]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t('Nama wajib diisi.', 'Please enter your name.');
    if (!waNumber(phone)) e.phone = t('Masukkan nomor WhatsApp yang valid.', 'Enter a valid WhatsApp number.');
    if (!date) e.date = t('Pilih tanggal.', 'Pick a date.');
    else if (date < todayISO()) e.date = t('Tanggal sudah lewat.', 'That date has passed.');
    if (!time) e.time = t('Pilih jam.', 'Pick a time.');
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setBanner('');
    if (Object.keys(e).length) return;

    const message = `Halo The Soeds Purwokerto, saya ingin reservasi atas nama ${name.trim()} untuk ${guests} orang pada ${formatDate(date)} jam ${time}. Catatan: Area ${area}${note.trim() ? `. ${note.trim()}` : ''}.`;
    const link = waLink(info.whatsapp, message);
    if (!link) {
      setBanner(
        t(
          'Nomor WhatsApp The Soeds belum diatur, jadi pesan belum bisa dikirim. Hubungi kami lewat kontak di bagian bawah halaman.',
          'The Soeds WhatsApp number is not set yet, so the message cannot be sent. Please use the contact details at the bottom of the page.',
        ),
      );
      return;
    }
    window.open(link, '_blank', 'noopener');
    setSent(message);
  };

  const field =
    'mt-2 block h-12 w-full border bg-white px-4 text-[15px] text-charcoal outline-none transition focus:border-crimson focus:ring-1 focus:ring-crimson';
  const err = (k: string) => (errors[k] ? 'border-orange' : 'border-hairline');
  const Err = ({ k }: { k: string }) =>
    errors[k] ? (
      <p role="alert" className="mt-1.5 text-xs font-medium text-orange">
        {errors[k]}
      </p>
    ) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('Reservasi meja', 'Table reservation')}
      aria-hidden={!reservationOpen}
      className={`on-crimson fixed inset-0 z-[60] overflow-y-auto bg-crimson transition-opacity duration-300 ${
        reservationOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <div className="mx-auto flex min-h-full max-w-[1200px] flex-col px-4 py-4 sm:px-8 sm:py-8">
        <div className="flex items-center justify-between text-white">
          <button
            type="button"
            onClick={closeReservation}
            aria-label={t('Tutup', 'Close')}
            className="-ml-2 flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-white/10"
          >
            <X className="h-7 w-7" strokeWidth={1.5} />
          </button>
          <p className="font-script text-3xl text-cream">Coffee, Eats, Spaces</p>
        </div>

        <div className="my-6 grid flex-1 items-stretch gap-0 bg-white shadow-2xl md:grid-cols-[1.35fr_1fr]">
          {/* Form / sukses */}
          <div className="p-6 sm:p-10">
            {sent ? (
              <div className="flex h-full flex-col justify-center py-8">
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-crimson text-white">
                  <Check className="h-7 w-7" />
                </span>
                <h2 className="font-serif text-4xl text-burgundy">{t('Pesan siap dikirim', 'Message ready')}</h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                  {t(
                    'WhatsApp sudah dibuka dengan pesan reservasi yang terisi otomatis. Tekan kirim di WhatsApp untuk menyelesaikan. Reservasi dikonfirmasi oleh tim kami lewat chat.',
                    'WhatsApp opened with your reservation message filled in. Press send there to finish. Our team will confirm by chat.',
                  )}
                </p>
                <blockquote className="mt-5 border-l-2 border-crimson bg-cream p-4 text-[13px] leading-relaxed text-charcoal">
                  {sent}
                </blockquote>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={closeReservation}
                    className="label min-h-12 rounded-full bg-crimson px-7 text-white transition hover:bg-crimson-dark"
                  >
                    {t('Selesai', 'Done')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSent(null)}
                    className="label min-h-12 rounded-full border border-charcoal/30 px-7 text-charcoal transition hover:border-crimson hover:text-crimson"
                  >
                    {t('Ubah data', 'Edit details')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <p className="label text-stone">{t('Reservasi', 'Reservation')}</p>
                <h2 className="mt-2 font-serif text-4xl text-burgundy sm:text-5xl">{t('Pesan meja', 'Book a table')}</h2>

                {banner && (
                  <p role="alert" className="mt-6 border-l-4 border-orange bg-orange/10 p-4 text-sm text-charcoal">
                    {banner}
                  </p>
                )}

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <label className="label block text-charcoal sm:col-span-2">
                    {t('Nama lengkap', 'Full name')}
                    <input
                      ref={firstField}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className={`${field} ${err('name')} normal-case tracking-normal font-normal`}
                    />
                    <Err k="name" />
                  </label>

                  <label className="label block text-charcoal sm:col-span-2">
                    {t('Nomor WhatsApp', 'WhatsApp number')}
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="08xxxxxxxxxx"
                      className={`${field} ${err('phone')} normal-case tracking-normal font-normal`}
                    />
                    <Err k="phone" />
                  </label>

                  <label className="label block text-charcoal">
                    {t('Tanggal', 'Date')}
                    <input
                      type="date"
                      min={todayISO()}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`${field} ${err('date')} normal-case tracking-normal font-normal`}
                    />
                    <Err k="date" />
                  </label>

                  <label className="label block text-charcoal">
                    {t('Jam', 'Time')}
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={`${field} ${err('time')} normal-case tracking-normal font-normal`}
                    />
                    <Err k="time" />
                  </label>

                  <div>
                    <p className="label text-charcoal">{t('Jumlah orang', 'Guests')}</p>
                    <div className="mt-2 flex h-12 w-fit items-center border border-hairline">
                      <button
                        type="button"
                        aria-label={t('Kurangi', 'Decrease')}
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="flex h-12 w-12 items-center justify-center text-charcoal transition hover:text-crimson"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <output aria-live="polite" className="w-12 text-center text-[15px] font-semibold tabular-nums">
                        {guests}
                      </output>
                      <button
                        type="button"
                        aria-label={t('Tambah', 'Increase')}
                        onClick={() => setGuests((g) => Math.min(40, g + 1))}
                        className="flex h-12 w-12 items-center justify-center text-charcoal transition hover:text-crimson"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <fieldset>
                    <legend className="label text-charcoal">{t('Area', 'Area')}</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {AREAS.map((a) => (
                        <label
                          key={a.v}
                          className={`label flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-[10px] transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-crimson ${
                            area === a.v
                              ? 'border-crimson bg-crimson text-white'
                              : 'border-charcoal/30 text-charcoal hover:border-crimson'
                          }`}
                        >
                          <input
                            type="radio"
                            name="area"
                            value={a.v}
                            checked={area === a.v}
                            onChange={() => setArea(a.v)}
                            className="sr-only"
                          />
                          {t(a.id, a.en)}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <label className="label block text-charcoal sm:col-span-2">
                    {t('Catatan tambahan', 'Additional notes')}
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      className="mt-2 block w-full border border-hairline bg-white p-4 text-[15px] font-normal normal-case tracking-normal text-charcoal outline-none transition focus:border-crimson focus:ring-1 focus:ring-crimson"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="label mt-8 flex min-h-[52px] w-full items-center justify-center rounded-full bg-crimson px-8 text-white transition hover:bg-crimson-dark sm:w-auto"
                >
                  {t('Kirim via WhatsApp', 'Send via WhatsApp')}
                </button>
              </form>
            )}
          </div>

          {/* Info samping */}
          <aside className="flex flex-col bg-cream">
            <div className="aspect-[16/10] overflow-hidden bg-burgundy md:aspect-auto md:min-h-[240px] md:flex-1">
              <Img src={IMG.interior} alt={t('Suasana The Soeds', 'Inside The Soeds')} className="h-full w-full object-cover" />
            </div>
            <dl className="space-y-5 p-6 text-sm sm:p-8">
              <div>
                <dt className="label text-stone">{t('Jam buka', 'Opening hours')}</dt>
                <dd className={`mt-1 ${isPlaceholder(info.jam_operasional) ? 'text-stone' : 'text-charcoal'}`}>
                  {info.jam_operasional || '[JAM OPERASIONAL]'}
                </dd>
              </div>
              <div>
                <dt className="label text-stone">{t('Alamat', 'Address')}</dt>
                <dd className={`mt-1 ${isPlaceholder(info.alamat) ? 'text-stone' : 'text-charcoal'}`}>
                  {info.alamat || '[ALAMAT LENGKAP]'}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </div>
  );
};
