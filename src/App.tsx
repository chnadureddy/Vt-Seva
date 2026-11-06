import { useEffect, useState } from "react";
import { AdminBoard } from "./components/AdminBoard";
import { CardDeck } from "./components/CardDeck";
import { Gap } from "./components/Gap";
import { Hero } from "./components/Hero";
import { Perspectives } from "./components/Perspectives";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { Survey } from "./components/Survey";
import { AppTabBar } from "./components/AppTabBar";

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return hash;
}

function usePhone() {
  const query = "(max-width: 767px)";
  const [phone, setPhone] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => setPhone(media.matches);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return phone;
}

function phoneScreen(hash: string) {
  if (hash === "#admin") return "admin";
  if (hash === "#deck") return "deck";
  if (hash === "#perspectives") return "perspectives";
  if (hash === "#survey") return "survey";
  return "home";
}

export default function App() {
  const hash = useHash();
  const phone = usePhone();
  const screen = phoneScreen(hash);

  useEffect(() => {
    if (!phone) return;
    window.scrollTo(0, 0);
  }, [phone, screen]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className={phone ? "min-h-[calc(100dvh-5rem)]" : undefined}>
        {phone ? (
          <>
            {screen === "admin" ? <AdminBoard /> : null}
            {screen === "deck" ? <CardDeck /> : null}
            {screen === "perspectives" ? <Perspectives /> : null}
            {screen === "survey" ? <Survey /> : null}
            {screen === "home" ? (
              <>
                <Hero />
                <Gap />
              </>
            ) : null}
          </>
        ) : hash === "#admin" ? (
          <AdminBoard />
        ) : (
          <>
            <Hero />
            <Gap />
            <CardDeck />
            <Perspectives />
            <Survey />
          </>
        )}
      </main>
      <SiteFooter />
      <AppTabBar />
    </>
  );
}
