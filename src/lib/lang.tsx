import React, { createContext, useCallback, useContext, useState } from 'react';

export type Lang = 'id' | 'en';

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  /** t('teks indonesia', 'english text') */
  t: (id: string, en: string) => string;
}

const Ctx = createContext<LangCtx | null>(null);

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('id');
  const toggle = useCallback(() => setLang((l) => (l === 'id' ? 'en' : 'id')), []);
  const t = useCallback((id: string, en: string) => (lang === 'id' ? id : en), [lang]);
  return <Ctx.Provider value={{ lang, toggle, t }}>{children}</Ctx.Provider>;
};

export const useLang = (): LangCtx => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLang harus di dalam LangProvider');
  return v;
};
