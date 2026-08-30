"use client";

import { useEffect, useRef, useState } from "react";
import AevumAgencyFooter from "./AevumAgencyFooter";
import AevumDisclaimerGate from "./AevumDisclaimerGate";
import AevumLoadingScreen from "./AevumLoadingScreen";
import SakuraHeroAtmosphere from "./SakuraHeroAtmosphere";
import SakuraNavbar from "./SakuraNavbar";
import SakuraZenAudio from "./SakuraZenAudio";
import type { DishesPage } from "./SakuraExperience";

const HERO_PLATTER = "/sakura-assets/_assets/media/hero-sushi-platter-hq-cutout.png";
const FLOAT_LEFT = "/sakura-assets/_assets/media/b04f0772236c0166269f504ed52d6aa2.png";
const FLOAT_RIGHT = "/sakura-assets/_assets/media/93855b7c7aeeca97d67876867446a9b1.png";
const FLOAT_BOTTOM = "/sakura-assets/_assets/media/2036415e6c26b3751795e13146e6af46.png";

const dishPairs = {
  first: {
    top: { no: "01.", title: "Tonkotsu Ramen", text: "Rich pork-bone broth, ramen noodles, chashu pork, soft-boiled egg, nori, scallions.", image: "/sakura-assets/_assets/media/dishes/ramen-hq-cutout.png" },
    bottom: { no: "02.", title: "Sushi Platter", text: "Salmon, tuna & shrimp nigiri, maki rolls, sashimi, pickled ginger, wasabi.", image: "/sakura-assets/_assets/media/dishes/sushi-platter-hq-cutout.png" },
  },
  second: {
    top: { no: "03.", title: "Udon", text: "Thick wheat noodles in savory dashi broth, with tempura and wakame.", image: "/sakura-assets/_assets/media/dishes/udon-hq-cutout.png" },
    bottom: { no: "04.", title: "Tempura", text: "Crispy shrimp and vegetable tempura served with tentsuyu dipping sauce.", image: "/sakura-assets/_assets/media/dishes/tempura-hq-cutout.png" },
  },
  third: {
    top: { no: "05.", title: "Yakitori", text: "Grilled chicken skewers with scallions, glazed with sweet soy tare.", image: "/sakura-assets/_assets/media/dishes/yakitori-hq-cutout.png" },
    bottom: { no: "06.", title: "Okonomiyaki", text: "Savory Japanese pancake with cabbage, seafood, sauce, mayo, bonito and aonori.", image: "/sakura-assets/_assets/media/dishes/okonomiyaki-hq-cutout.png" },
  },
} as const;

const pages: DishesPage[] = ["first", "second", "third"];

export default function SakuraMobileExperience() {
  const [activeNav, setActiveNav] = useState("home");
  const [dishesPage, setDishesPage] = useState<DishesPage>("first");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("aevum_disclaimer_accepted");
    if (stored === "true") {
      setAccepted(true);
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (!loading && accepted) {
      const id = window.setTimeout(() => setHeroRevealed(true), 80);
      return () => window.clearTimeout(id);
    }
  }, [loading, accepted]);

  const accept = () => {
    window.localStorage.setItem("aevum_disclaimer_accepted", "true");
    setAccepted(true);
    setLoading(true);
  };

  const goMenu = () => {
    setActiveNav("dishes-1");
    setDishesPage("first");
    document.getElementById("dishes-1")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setPage = (page: DishesPage) => {
    setDishesPage(page);
    setActiveNav(page === "first" ? "dishes-1" : page === "second" ? "dishes-2" : "dishes-3");
  };

  const step = (direction: 1 | -1) => {
    const i = pages.indexOf(dishesPage);
    const next = Math.min(pages.length - 1, Math.max(0, i + direction));
    setPage(pages[next]);
  };

  const pair = dishPairs[dishesPage];

  return (
    <main className="sakura-mobile-root bg-[#f1dfcf]">
      {!accepted && <AevumDisclaimerGate onAccept={accept} />}
      {loading && <AevumLoadingScreen onComplete={() => { setLoading(false); setHeroRevealed(true); }} />}

      <SakuraNavbar activeNav={activeNav} setActiveNav={setActiveNav} dishesPage={dishesPage} setDishesPage={setDishesPage} />
      <SakuraZenAudio />

      <section id="home" className="sakura-mobile-hero" aria-label="Sakura hero">
        <SakuraHeroAtmosphere isRevealed={heroRevealed} onExploreScroll={goMenu} />
        <div className="sakura-mobile-pattern" aria-hidden="true" />
        <div className={`sakura-mobile-kicker ${heroRevealed ? "is-in" : ""}`}>最高の寿司盛り合わせ</div>
        <div className={`sakura-mobile-sushi-word ${heroRevealed ? "is-in" : ""}`} aria-hidden="true">SUSHI</div>

        <div className={`sakura-mobile-copy ${heroRevealed ? "is-in" : ""}`}>
          <p className="sakura-mobile-eyebrow">SAKURA CULINARY · TOKYO</p>
          <h1>Authentic<br />Japanese<br /><span>Dining.</span></h1>
          <p className="sakura-mobile-description">Fresh sashimi, handcrafted nigiri, and traditional seasonal dishes.</p>
          <button type="button" onClick={goMenu} className="sakura-mobile-cta">
            <span>Explore Menu</span><span aria-hidden="true">→</span>
          </button>
        </div>

        <div className={`sakura-mobile-platter ${heroRevealed ? "is-in" : ""}`}>
          <img src={HERO_PLATTER} alt="Sakura sushi platter" />
        </div>
        <img className={`sakura-mobile-float sakura-mobile-float-a ${heroRevealed ? "is-in" : ""}`} src={FLOAT_LEFT} alt="" />
        <img className={`sakura-mobile-float sakura-mobile-float-b ${heroRevealed ? "is-in" : ""}`} src={FLOAT_RIGHT} alt="" />
        <img className={`sakura-mobile-float sakura-mobile-float-c ${heroRevealed ? "is-in" : ""}`} src={FLOAT_BOTTOM} alt="" />
        <div className="sakura-mobile-seal" aria-hidden="true"><span>極上</span><span>鮨処</span></div>
        <button type="button" onClick={goMenu} className="sakura-mobile-scroll-cue" aria-label="Scroll to dishes"><span>SCROLL</span><i /></button>
      </section>

      <section
        id="dishes-1"
        className="sakura-mobile-dishes"
        aria-label="Top dishes"
        onTouchStart={(e) => { touchStart.current = e.touches[0]?.clientX ?? null; }}
        onTouchEnd={(e) => {
          if (touchStart.current == null) return;
          const dx = (e.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
          touchStart.current = null;
          if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
        }}
      >
        <div className="sakura-mobile-dishes-pattern" aria-hidden="true" />
        <div className="sakura-mobile-black-band sakura-mobile-black-band-top" aria-hidden="true" />
        <div className="sakura-mobile-black-band sakura-mobile-black-band-bottom" aria-hidden="true" />
        <h2 className="sakura-mobile-dishes-title"><span>Top</span><span>Dishes</span></h2>

        <article key={`${dishesPage}-top`} className="sakura-mobile-dish sakura-mobile-dish-top">
          <img src={pair.top.image} alt={pair.top.title} />
          <div className="sakura-mobile-dish-copy">
            <strong>{pair.top.no}</strong>
            <h3>{pair.top.title}</h3>
            <p>{pair.top.text}</p>
          </div>
        </article>

        <article key={`${dishesPage}-bottom`} className="sakura-mobile-dish sakura-mobile-dish-bottom">
          <img src={pair.bottom.image} alt={pair.bottom.title} />
          <div className="sakura-mobile-dish-copy">
            <strong>{pair.bottom.no}</strong>
            <h3>{pair.bottom.title}</h3>
            <p>{pair.bottom.text}</p>
          </div>
        </article>

        <div className="sakura-mobile-pagination" aria-label="Dish pages">
          {pages.map((page, i) => <button key={page} type="button" onClick={() => setPage(page)} className={page === dishesPage ? "is-active" : ""} aria-label={`Show dish pair ${i + 1}`}>{String(i + 1).padStart(2, "0")}</button>)}
        </div>
        <div className="sakura-mobile-swipe-label">SWIPE TO EXPLORE <span>↔</span></div>
      </section>

      <AevumAgencyFooter />
    </main>
  );
}
