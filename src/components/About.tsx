import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../lib/lang';
import { useNav } from '../lib/nav';
import { Eyebrow, PillButton, Reveal } from './ui';

export const About: React.FC = () => {
  const { t } = useLang();
  const { go } = useNav();

  return (
    <section id="tentang" className="bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-[72px] sm:px-8 md:py-[120px] lg:py-[140px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-3">
            <Eyebrow>{t('Tentang Kami', 'About Us')}</Eyebrow>
          </div>

          <div className="lg:col-span-9">
            <Reveal>
              <h2 className="max-w-[26ch] font-serif text-[26px] leading-[1.3] text-burgundy sm:max-w-none sm:text-4xl lg:text-[44px] lg:leading-[1.28]">
                <span className="inline-block w-[1.5em] sm:w-[3em]" aria-hidden />
                {t(
                  'Selamat datang di The Soeds, tempat kopi, makanan, dan ruang bertemu dalam satu atap. Dari kopi single origin Nusantara sampai pizza ala American-Italian, setiap sajian kami hadirkan untuk dinikmati bersama.',
                  'Welcome to The Soeds: coffee, food, and a place to meet under one roof. From Nusantara single-origin coffee to American-Italian style pizza, every dish is made to be shared.',
                )}
              </h2>
              <div className="mt-8">
                <PillButton tone="solid" onClick={() => go('perjalanan')}>
                  {t('Baca selengkapnya', 'Read more')}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </PillButton>
              </div>
            </Reveal>

            <Reveal delay={120} className="mt-14 grid gap-6 text-sm leading-relaxed text-charcoal md:grid-cols-2 md:gap-12 md:text-[14px]">
              <p>
                {t(
                  'Kami percaya cita rasa lokal pantas tampil istimewa. Karena itu kami mengolah rempah, buah, dan biji kopi Nusantara menjadi sajian yang segar dan berkesan.',
                  'We believe local flavor deserves the spotlight. So we turn Nusantara spices, fruit, and coffee beans into fresh, memorable dishes.',
                )}
              </p>
              <p>
                {t(
                  'Tim dapur dan barista kami memadukan resep tradisional dengan teknik modern untuk menonjolkan rasa asli setiap bahan.',
                  'Our kitchen and barista team pair traditional recipes with modern technique to bring out the true flavor of every ingredient.',
                )}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
      <div className="mx-auto h-px max-w-[1376px] bg-hairline" />
    </section>
  );
};
