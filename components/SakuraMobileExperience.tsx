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
  const [heroStage, setHeroStage] = useState(0);
  const [outgoingPage, setOutgoingPage] = useState<DishesPage | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<1 | -1>(1);
  const [dishTransitioning, setDishTransitioning] = useState(false);
  const touchStart = useRef<number | null>(null);
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("aevum_disclaimer_accepted");
    if (stored === "true") {
      setAccepted(true);
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (!heroRevealed) {
      setHeroStage(0);
      return;
    }
    const timers = [
      window.setTimeout(() => setHeroStage(1), 40),
      window.setTimeout(() => setHeroStage(2), 210),
      window.setTimeout(() => setHeroStage(3), 430),
      window.setTimeout(() => setHeroStage(4), 660),
      window.setTimeout(() => setHeroStage(5), 900),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [heroRevealed]);

  useEffect(() => () => {
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
  }, []);

  const accept = () => {
    window.localStorage.setItem("aevum_disclaimer_accepted", "true");
    setAccepted(true);
    setLoading(true);
  };

  const goMenu = () => {
    setActiveNav("dishes-1");
    if (dishesPage !== "first") changePage("first");
    document.getElementById("dishes-1")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const changePage = (page: DishesPage) => {
    if (page === dishesPage || dishTransitioning) return;
    const direction: 1 | -1 = pages.indexOf(page) > pages.indexOf(dishesPage) ? 1 : -1;
    setTransitionDirection(direction);
    setOutgoingPage(dishesPage);
    setDishTransitioning(true);
    setDishesPage(page);
    setActiveNav(page === "first" ? "dishes-1" : page === "second" ? "dishes-2" : "dishes-3");
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => {
      setOutgoingPage(null);
      setDishTransitioning(false);
    }, 920);
  };

  const step = (direction: 1 | -1) => {
    const i = pages.indexOf(dishesPage);
    const next = Math.min(pages.length - 1, Math.max(0, i + direction));
    if (next !== i) changePage(pages[next]);
  };

  const renderPair = (page: DishesPage, mode: "current" | "outgoing") => {
    const pair = dishPairs[page];
    const dirClass = transitionDirection > 0 ? "is-forward" : "is-backward";
    const stateClass = mode === "outgoing" ? "is-exiting" : dishTransitioning ? "is-entering" : "is-settled";
    return (
      <div key={`${page}-${mode}`} className={`sakura-mobile-dish-pair ${stateClass} ${dirClass}`} aria-hidden={mode === "outgoing"}>
        <article className="sakura-mobile-dish sakura-mobile-dish-top">
          <img src={pair.top.image} alt={pair.top.title} />
          <div className="sakura-mobile-dish-copy">
            <strong>{pair.top.no}</strong>
            <h3>{pair.top.title}</h3>
            <p>{pair.top.text}</p>
          </div>
        </article>
        <article className="sakura-mobile-dish sakura-mobile-dish-bottom">
          <img src={pair.bottom.image} alt={pair.bottom.title} />
          <div className="sakura-mobile-dish-copy">
            <strong>{pair.bottom.no}</strong>
            <h3>{pair.bottom.title}</h3>
            <p>{pair.bottom.text}</p>
          </div>
        </article>
      </div>
    );
  };

  return (
    <main className="sakura-mobile-root bg-[#f1dfcf]">
      {!accepted && <AevumDisclaimerGate onAccept={accept} />}
      {loading && <AevumLoadingScreen onComplete={() => { setLoading(false); setHeroRevealed(true); }} />}

      <SakuraNavbar activeNav={activeNav} setActiveNav={setActiveNav} dishesPage={dishesPage} setDishesPage={changePage} />
      <SakuraZenAudio />

      <section id="home" className={`sakura-mobile-hero hero-stage-${heroStage}`} aria-label="Sakura hero">
        <SakuraHeroAtmosphere isRevealed={heroRevealed} onExploreScroll={goMenu} />
        <div className={`sakura-mobile-pattern ${heroStage >= 1 ? "is-in" : ""}`} aria-hidden="true" />
        <div className={`sakura-mobile-kicker ${heroStage >= 3 ? "is-in" : ""}`}>最高の寿司盛り合わせ</div>
        <div className={`sakura-mobile-sushi-word ${heroStage >= 2 ? "is-in" : ""}`} aria-hidden="true">SUSHI</div>

        <div className={`sakura-mobile-copy ${heroStage >= 4 ? "is-in" : ""}`}>
          <p className="sakura-mobile-eyebrow">SAKURA CULINARY · TOKYO</p>
          <h1><span className="hero-copy-line hero-copy-line-1">Authentic</span><br /><span className="hero-copy-line hero-copy-line-2">Japanese</span><br /><span className="hero-copy-line hero-copy-line-3 hero-copy-accent">Dining.</span></h1>
          <p className="sakura-mobile-description">Fresh sashimi, handcrafted nigiri, and traditional seasonal dishes.</p>
          <button type="button" onClick={goMenu} className="sakura-mobile-cta">
            <span>Explore Menu</span><span className="sakura-mobile-cta-arrow" aria-hidden="true">→</span>
          </button>
        </div>

        <div className={`sakura-mobile-platter ${heroStage >= 1 ? "is-in" : ""}`}>
          <img src={HERO_PLATTER} alt="Sakura sushi platter" />
        </div>
        <img className={`sakura-mobile-float sakura-mobile-float-a ${heroStage >= 5 ? "is-in" : ""}`} src={FLOAT_LEFT} alt="" />
        <img className={`sakura-mobile-float sakura-mobile-float-b ${heroStage >= 5 ? "is-in" : ""}`} src={FLOAT_RIGHT} alt="" />
        <img className={`sakura-mobile-float sakura-mobile-float-c ${heroStage >= 5 ? "is-in" : ""}`} src={FLOAT_BOTTOM} alt="" />
        <div className={`sakura-mobile-seal ${heroStage >= 5 ? "is-in" : ""}`} aria-hidden="true"><span>極上</span><span>鮨処</span></div>
        <button type="button" onClick={goMenu} className={`sakura-mobile-scroll-cue ${heroStage >= 5 ? "is-in" : ""}`} aria-label="Scroll to dishes"><span>SCROLL</span><i /></button>
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

        {outgoingPage && renderPair(outgoingPage, "outgoing")}
        {renderPair(dishesPage, "current")}

        <div className="sakura-mobile-pagination" aria-label="Dish pages">
          {pages.map((page, i) => <button key={page} type="button" onClick={() => changePage(page)} className={page === dishesPage ? "is-active" : ""} aria-label={`Show dish pair ${i + 1}`}>{String(i + 1).padStart(2, "0")}</button>)}
        </div>
        <div className="sakura-mobile-swipe-label">SWIPE TO EXPLORE <span>↔</span></div>
      </section>

      <AevumAgencyFooter />
    </main>
  );
}
