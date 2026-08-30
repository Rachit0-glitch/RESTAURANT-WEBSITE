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
type DishPhase = "settled" | "exiting" | "preenter" | "entering";

export default function SakuraMobileExperience() {
  const [activeNav, setActiveNav] = useState("home");
  const [dishesPage, setDishesPage] = useState<DishesPage>("first");
  const [displayPage, setDisplayPage] = useState<DishesPage>("first");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [heroStage, setHeroStage] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<1 | -1>(1);
  const [dishPhase, setDishPhase] = useState<DishPhase>("settled");
  const touchStart = useRef<number | null>(null);
  const transitionTimers = useRef<number[]>([]);

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
      window.setTimeout(() => setHeroStage(1), 60),
      window.setTimeout(() => setHeroStage(2), 560),
      window.setTimeout(() => setHeroStage(3), 820),
      window.setTimeout(() => setHeroStage(4), 1040),
      window.setTimeout(() => setHeroStage(5), 1320),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [heroRevealed]);

  useEffect(() => () => {
    transitionTimers.current.forEach(window.clearTimeout);
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

  const clearDishTimers = () => {
    transitionTimers.current.forEach(window.clearTimeout);
    transitionTimers.current = [];
  };

  const changePage = (page: DishesPage) => {
    if (page === dishesPage || dishPhase !== "settled") return;
    clearDishTimers();

    const direction: 1 | -1 = pages.indexOf(page) > pages.indexOf(dishesPage) ? 1 : -1;
    setTransitionDirection(direction);
    setDishesPage(page);
    setActiveNav(page === "first" ? "dishes-1" : page === "second" ? "dishes-2" : "dishes-3");
    setDishPhase("exiting");

    transitionTimers.current.push(window.setTimeout(() => {
      setDisplayPage(page);
      setDishPhase("preenter");
    }, 520));

    transitionTimers.current.push(window.setTimeout(() => {
      setDishPhase("entering");
    }, 590));

    transitionTimers.current.push(window.setTimeout(() => {
      setDishPhase("settled");
    }, 1260));
  };

  const step = (direction: 1 | -1) => {
    const i = pages.indexOf(dishesPage);
    const next = Math.min(pages.length - 1, Math.max(0, i + direction));
    if (next !== i) changePage(pages[next]);
  };

  const pair = dishPairs[displayPage];
  const dirClass = transitionDirection > 0 ? "is-forward" : "is-backward";
  const phaseClass = dishPhase === "exiting" ? "is-exiting" : dishPhase === "preenter" ? "is-preenter" : dishPhase === "entering" ? "is-entering" : "is-settled";

  return (
    <main className="sakura-mobile-root bg-[#f1dfcf]">
      <style jsx global>{`
        @media (max-width: 767px) {
          .sakura-mobile-sushi-word {
            z-index: 8 !important;
            transform: translate(-50%, 46%) scale(.72);
            opacity: 0;
            filter: blur(8px);
            transform-origin: 50% 100%;
          }
          .sakura-mobile-sushi-word.is-in {
            animation: mobile-sushi-emerge 1.08s cubic-bezier(.12,.98,.2,1) both;
          }
          .sakura-mobile-platter { z-index: 14 !important; }

          @keyframes mobile-sushi-emerge {
            0% { opacity:0; transform:translate(-50%,46%) scale(.72); filter:blur(8px); }
            20% { opacity:.28; }
            58% { opacity:.98; transform:translate(-50%,-42%) scale(1.045); filter:blur(0); }
            100% { opacity:.97; transform:translate(-50%,-50%) scale(1); filter:blur(0); }
          }

          .sakura-mobile-dishes-title {
            top: 74px !important;
            left: 16px !important;
            font-size: clamp(62px, 18.5vw, 86px) !important;
            line-height: .72 !important;
            z-index: 10 !important;
          }
          .sakura-mobile-dish-pair { z-index: 12 !important; }
          .sakura-mobile-dish-top img {
            width: min(58vw, 238px) !important;
            right: -3vw !important;
            top: 20.5% !important;
          }
          .sakura-mobile-dish-top .sakura-mobile-dish-copy {
            left: 17px !important;
            top: 42.5% !important;
            width: min(42vw, 165px) !important;
          }
          .sakura-mobile-dish-bottom img {
            width: min(62vw, 258px) !important;
            left: -8vw !important;
            bottom: 8.5% !important;
          }
          .sakura-mobile-dish-bottom .sakura-mobile-dish-copy {
            right: 17px !important;
            bottom: 17.5% !important;
            width: min(42vw, 165px) !important;
          }
          .sakura-mobile-dish-copy strong {
            font-size: clamp(28px, 7.6vw, 36px) !important;
            line-height: .92 !important;
          }
          .sakura-mobile-dish-copy h3 {
            font-size: clamp(17px, 4.7vw, 21px) !important;
            line-height: 1 !important;
          }
          .sakura-mobile-dish-copy p {
            max-width: 158px !important;
            font-size: 9.5px !important;
            line-height: 1.38 !important;
          }

          /* Every dish now moves on the same -31deg rails as the black bands. */
          .sakura-mobile-dish-pair.is-exiting.is-forward .sakura-mobile-dish-top { animation: rail-exit-top-forward .52s cubic-bezier(.4,0,.2,1) both !important; }
          .sakura-mobile-dish-pair.is-exiting.is-forward .sakura-mobile-dish-bottom { animation: rail-exit-bottom-forward .52s cubic-bezier(.4,0,.2,1) .035s both !important; }
          .sakura-mobile-dish-pair.is-exiting.is-backward .sakura-mobile-dish-top { animation: rail-exit-top-backward .52s cubic-bezier(.4,0,.2,1) both !important; }
          .sakura-mobile-dish-pair.is-exiting.is-backward .sakura-mobile-dish-bottom { animation: rail-exit-bottom-backward .52s cubic-bezier(.4,0,.2,1) .035s both !important; }
          .sakura-mobile-dish-pair.is-exiting .sakura-mobile-dish-copy { animation: mobile-copy-out .3s ease both !important; }

          .sakura-mobile-dish-pair.is-preenter .sakura-mobile-dish,
          .sakura-mobile-dish-pair.is-preenter .sakura-mobile-dish-copy {
            transition: none !important;
          }

          /* Forward: top rail travels up-right; bottom rail travels down-left. */
          .sakura-mobile-dish-pair.is-preenter.is-forward .sakura-mobile-dish-top {
            opacity: 0;
            transform: translate3d(-38vw, 23vw, 0);
          }
          .sakura-mobile-dish-pair.is-preenter.is-forward .sakura-mobile-dish-bottom {
            opacity: 0;
            transform: translate3d(38vw, -23vw, 0);
          }

          /* Backward is the exact inverse on those same rails. */
          .sakura-mobile-dish-pair.is-preenter.is-backward .sakura-mobile-dish-top {
            opacity: 0;
            transform: translate3d(38vw, -23vw, 0);
          }
          .sakura-mobile-dish-pair.is-preenter.is-backward .sakura-mobile-dish-bottom {
            opacity: 0;
            transform: translate3d(-38vw, 23vw, 0);
          }
          .sakura-mobile-dish-pair.is-preenter .sakura-mobile-dish-copy {
            opacity:0;
            transform:translateY(10px);
          }

          .sakura-mobile-dish-pair.is-entering .sakura-mobile-dish {
            opacity: 1;
            transform: translate3d(0,0,0);
            filter: none !important;
            transition: transform .64s cubic-bezier(.12,.98,.22,1), opacity .36s ease !important;
          }
          .sakura-mobile-dish-pair.is-entering .sakura-mobile-dish-bottom {
            transition-delay: .045s !important;
          }
          .sakura-mobile-dish-pair.is-entering .sakura-mobile-dish-copy {
            opacity:1;
            transform:translateY(0);
            filter:none !important;
            transition:transform .45s cubic-bezier(.16,1,.3,1) .10s, opacity .34s ease .10s !important;
          }

          @keyframes rail-exit-top-forward {
            from { opacity:1; transform:translate3d(0,0,0); }
            to { opacity:0; transform:translate3d(38vw,-23vw,0); }
          }
          @keyframes rail-exit-bottom-forward {
            from { opacity:1; transform:translate3d(0,0,0); }
            to { opacity:0; transform:translate3d(-38vw,23vw,0); }
          }
          @keyframes rail-exit-top-backward {
            from { opacity:1; transform:translate3d(0,0,0); }
            to { opacity:0; transform:translate3d(-38vw,23vw,0); }
          }
          @keyframes rail-exit-bottom-backward {
            from { opacity:1; transform:translate3d(0,0,0); }
            to { opacity:0; transform:translate3d(38vw,-23vw,0); }
          }
          @keyframes mobile-copy-out {
            to { opacity:0; transform:translateY(8px); }
          }

          .sakura-mobile-dish-pair.is-settled .sakura-mobile-dish-top img { animation: sakura-mobile-dish-float 5.8s ease-in-out infinite !important; }
          .sakura-mobile-dish-pair.is-settled .sakura-mobile-dish-bottom img { animation: sakura-mobile-dish-float 6.2s ease-in-out .38s infinite reverse !important; }

          @media (max-height: 720px) {
            .sakura-mobile-dishes-title { top: 62px !important; font-size: 60px !important; }
            .sakura-mobile-dish-top img { width: 52vw !important; top: 18.5% !important; }
            .sakura-mobile-dish-top .sakura-mobile-dish-copy { top: 39% !important; }
            .sakura-mobile-dish-bottom img { width: 56vw !important; bottom: 5.5% !important; }
            .sakura-mobile-dish-bottom .sakura-mobile-dish-copy { bottom: 15% !important; }
          }
        }
      `}</style>

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
        className={`sakura-mobile-dishes ${dishPhase !== "settled" ? "is-transitioning" : ""}`}
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

        <div key={`${displayPage}-${dishPhase}`} className={`sakura-mobile-dish-pair ${phaseClass} ${dirClass}`}>
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

        <div className="sakura-mobile-pagination" aria-label="Dish pages">
          {pages.map((page, i) => <button key={page} type="button" disabled={dishPhase !== "settled"} onClick={() => changePage(page)} className={page === dishesPage ? "is-active" : ""} aria-label={`Show dish pair ${i + 1}`}>{String(i + 1).padStart(2, "0")}</button>)}
        </div>
        <div className="sakura-mobile-swipe-label">SWIPE TO EXPLORE <span>↔</span></div>
      </section>

      <AevumAgencyFooter />
    </main>
  );
}
