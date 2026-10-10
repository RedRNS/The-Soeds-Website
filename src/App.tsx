import React from 'react';
import { ContentProvider } from './lib/content';
import { LangProvider } from './lib/lang';
import { NavProvider, useNav } from './lib/nav';
import { Navbar } from './components/Navbar';
import { NavOverlay } from './components/NavOverlay';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { MenuPreview } from './components/MenuPreview';
import { Gallery } from './components/Gallery';
import { Timeline } from './components/Timeline';
import { Events } from './components/Events';
import { Footer } from './components/Footer';
import { MenuPage } from './components/MenuPage';
import { ReservationModal } from './components/ReservationModal';

const Pages: React.FC = () => {
  const { page } = useNav();
  return (
    <>
      <Navbar />
      {page === 'menu' ? (
        <MenuPage />
      ) : (
        <main>
          <Hero />
          <About />
          <MenuPreview />
          <Gallery />
          <Timeline />
          <Events />
        </main>
      )}
      <Footer />
      <NavOverlay />
      <ReservationModal />
    </>
  );
};

export default function App() {
  return (
    <LangProvider>
      <ContentProvider>
        <NavProvider>
          <Pages />
        </NavProvider>
      </ContentProvider>
    </LangProvider>
  );
}
