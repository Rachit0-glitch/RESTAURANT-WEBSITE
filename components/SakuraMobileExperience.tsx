"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AevumAgencyFooter from "./AevumAgencyFooter";
import SakuraZenAudio from "./SakuraZenAudio";

const HERO_BG = "/sakura-assets/_assets/media/ba78b4a30520331745a674cd7d48884f.png";
const HERO_PLATTER = "/sakura-assets/_assets/media/hero-sushi-platter-hq-cutout.png";
const FLOAT_LEFT = "/sakura-assets/_assets/media/b04f0772236c0166269f504ed52d6aa2.png";
const FLOAT_RIGHT = "/sakura-assets/_assets/media/93855b7c7aeeca97d67876867446a9b1.png";

const dishes = [
  {
    topNo: "01.",
    topTitle: "Tonkotsu Ramen",
    topText: "Rich pork-bone broth, ramen noodles, chashu pork, soft-boiled egg, nori and scallions.",
    topImage: "/sakura-assets/_assets/media/dishes/ramen-hq-cutout.png",
    bottomNo: "02.",
    bottomTitle: "Sushi Platter",
    bottomText: "Salmon, tuna and shrimp nigiri, maki rolls, sashimi, pickled ginger and wasabi.",
    bottomImage: "/sakura-assets/_assets/media/dishes/sushi-platter-hq-cutout.png",
  },
  {
    topNo: "03.",
    topTitle: "Udon",
    topText: "Thick wheat noodles in savory dashi broth, finished with tempura and wakame.",
    topImage: "/sakura-assets/_assets/media/dishes/udon-hq-cutout.png",
    bottomNo: "04.",
    bottomTitle: "Tempura",
    bottomText: "Crispy shrimp and vegetable tempura served with a light tentsuyu dipping sauce.",
    bottomImage: "/sakura-assets/_assets/media/dishes/tempura-hq-cutout.png",
  },
  {
    topNo: "05.",
    topTitle: "Yakitori",
    topText: "Grilled chicken skewers with scallions, glazed with sweet soy tare.",
    topImage: "/sakura-assets/_assets/media/dishes/yakitori-hq-cutout.png",
    bottomNo: "06.",
    bottomTitle: "Okonomiyaki",
    bottomText: "Savory Japanese pancake with cabbage and seafood, finished with sauce, mayo and bonito.",
    bottomImage: "/sakura-assets/_assets/media/dishes/okonomiyaki-hq-cutout.png",
  },
];

function MobileNav({ onMenu }: { onMenu: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-[80] px-4 pt-[max(14px,env(safe-area-inset-top))] pointer-events-none">
      <nav className="pointer-events-auto mx-auto flex w-full max-w-[520px] items-center justify-between rounded-full border border-white/20 bg-black/55 px-4 py-2.5 text-white shadow-2xl backdrop-blur-xl">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e60012]" />
          <span className="text-sm font-black tracking-[0.22em]">SAKURA</span>
        </button>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onMenu} className="rounded-full bg-[#e60012] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em]">Menu</button>
          <button type="button" aria-label="Toggle navigation" onClick={() => setOpen((v) => !v)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
            <span className="relative block h-3.5 w-4">
              <span className={`absolute left-0 top-0 h-[1.5px] w-4 bg-white transition ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
              <span className={`absolute left-0 top-[6px] h-[1.5px] w-4 bg-white transition ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-[12px] h-[1.5px] w-4 bg-white transition ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </nav>
      {open && (
        <div className="pointer-events-auto mx-auto mt-2 w-full max-w-[520px] overflow-hidden rounded-[26px] border border-white/15 bg-black/80 p-2 text-white backdrop-blur-xl">
          <button className="w-full rounded-2xl px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.15em] hover:bg-white/10" onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</button>
          <button className="w-full rounded-2xl px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.15em] hover:bg-white/10" onClick={() => { setOpen(false); onMenu(); }}>Top Dishes</button>
          <button className="w-full rounded-2xl px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.15em] hover:bg-white/10" onClick={() => { setOpen(false); document.getElementById('aevum-footer')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</button>
        </div>
      )}
    </header>
  );
}

function Hero({ onMenu }: { onMenu: () => void }) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#f1dfcf] px-5 pb-8 pt-24">
      <div className="absolute inset-0 opacity-28" style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: '240%', backgroundPosition: '68% 8%' }} />
      <div className="absolute inset-x-[-22%] top-[29%] h-48 rotate-[-8deg] bg-black" />
      <div className="absolute -left-14 top-[19%] h-28 w-28 rounded-full bg-[#e60012]/10 blur-2xl" />
      <div className="absolute -right-10 top-[17%] h-32 w-32 rounded-full bg-pink-400/20 blur-3xl" />

      <img src={FLOAT_LEFT} alt="" className="pointer-events-none absolute -left-14 top-[31%] z-10 w-36 rotate-12 drop-shadow-xl animate-float-petal-1" />
      <img src={FLOAT_RIGHT} alt="" className="pointer-events-none absolute -right-9 top-[25%] z-10 w-32 -rotate-12 drop-shadow-xl animate-float-petal-2" />

      <div className="relative z-20 mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-[520px] flex-col">
        <div className="flex items-start justify-between gap-4 pt-4">
          <div className="max-w-[280px]">
            <p className="mb-3 inline-flex rotate-[-2deg] items-center gap-2 rounded-full border border-black/15 bg-[#f6eee6]/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] shadow-sm">最高の鮨 • Tokyo spirit</p>
            <h1 className="text-[clamp(43px,13vw,68px)] font-black uppercase leading-[0.87] tracking-[-0.065em] text-black">Authentic<br />Japanese<br /><span className="text-[#e60012]">Dining.</span></h1>
          </div>
          <div className="mt-6 flex h-20 w-9 items-center justify-center rounded-sm border-2 border-[#b91820]/60 bg-[#b91820]/5 text-[10px] font-black tracking-[0.25em] text-[#b91820] [writing-mode:vertical-rl]">極上鮨処</div>
        </div>

        <div className="relative mt-1 flex flex-1 items-end justify-center pb-28">
          <div className="absolute left-1/2 top-[14%] z-0 -translate-x-1/2 text-[29vw] font-black uppercase leading-none tracking-[-0.08em] text-[#e60012] opacity-95 [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif] sm:text-[150px]">SUSHI</div>
          <img src={HERO_PLATTER} alt="Sakura sushi platter" className="relative z-20 w-[138%] max-w-none translate-y-7 drop-shadow-[0_24px_38px_rgba(0,0,0,0.22)] animate-platter-entrance" />
        </div>

        <div className="absolute inset-x-0 bottom-2 z-30 flex items-end justify-between gap-5 rounded-[28px] border border-black/10 bg-[#f6eee6]/88 p-4 shadow-[0_20px_55px_rgba(60,28,17,0.16)] backdrop-blur-md">
          <p className="max-w-[250px] text-[12px] font-medium leading-relaxed text-neutral-700">Fresh sashimi, handcrafted nigiri and seasonal Japanese plates, presented with a modern Sakura edge.</p>
          <button type="button" onClick={onMenu} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-black text-white shadow-lg active:scale-95" aria-label="Explore menu">↘</button>
        </div>
      </div>
    </section>
  );
}

function DishCard({ number, title, text, image, align }: { number: string; title: string; text: string; image: string; align: 'left' | 'right' }) {
  return (
    <article className={`relative min-h-[330px] overflow-hidden rounded-[36px] border border-black/10 bg-[#f7eadf] p-5 shadow-[0_22px_55px_rgba(73,31,17,0.12)] ${align === 'right' ? 'text-right' : ''}`}>
      <div className={`absolute top-0 h-24 w-24 rounded-full bg-[#e60012]/10 blur-2xl ${align === 'right' ? '-left-4' : '-right-4'}`} />
      <div className={`relative z-10 max-w-[52%] ${align === 'right' ? 'ml-auto' : ''}`}>
        <div className="text-[34px] font-black tracking-[-0.06em]">{number}</div>
        <h3 className="mt-1 text-[26px] font-black leading-[0.95] tracking-[-0.04em]">{title}</h3>
        <p className="mt-3 text-[11px] font-medium leading-relaxed text-neutral-600">{text}</p>
      </div>
      <img src={image} alt={title} className={`absolute bottom-[-5%] z-20 w-[67%] max-w-none drop-shadow-[0_22px_30px_rgba(0,0,0,0.18)] ${align === 'right' ? '-left-[10%]' : '-right-[10%]'}`} />
    </article>
  );
}

function Dishes() {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const item = dishes[index];
  const dots = useMemo(() => dishes.map((_, i) => i), []);

  const change = (next: number) => setIndex((next + dishes.length) % dishes.length);

  return (
    <section id="mobile-menu" className="relative overflow-hidden bg-[#f1dfcf] px-4 py-20">
      <div className="absolute -left-36 top-[16%] h-44 w-[540px] rotate-[-31deg] bg-black" />
      <div className="absolute -right-40 bottom-[15%] h-44 w-[540px] rotate-[-31deg] bg-black" />
      <div className="relative z-10 mx-auto w-full max-w-[520px]">
        <div className="mb-8 flex items-end justify-between gap-4 px-1">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#e60012]">Swipe to explore</p>
            <h2 className="mt-2 text-[58px] font-black leading-[0.78] tracking-[-0.075em]">Top<br />Dishes</h2>
          </div>
          <div className="flex items-center gap-2 pb-1">
            <button onClick={() => change(index - 1)} className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-[#f7eadf] text-xl">←</button>
            <button onClick={() => change(index + 1)} className="grid h-10 w-10 place-items-center rounded-full bg-black text-xl text-white">→</button>
          </div>
        </div>

        <div
          className="space-y-4 touch-pan-y"
          onTouchStart={(e) => { startX.current = e.touches[0]?.clientX ?? null; }}
          onTouchEnd={(e) => {
            if (startX.current == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? startX.current) - startX.current;
            startX.current = null;
            if (Math.abs(dx) < 45) return;
            change(index + (dx < 0 ? 1 : -1));
          }}
        >
          <DishCard number={item.topNo} title={item.topTitle} text={item.topText} image={item.topImage} align="left" />
          <DishCard number={item.bottomNo} title={item.bottomTitle} text={item.bottomText} image={item.bottomImage} align="right" />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {dots.map((dot) => (
            <button key={dot} aria-label={`Show dish pair ${dot + 1}`} onClick={() => setIndex(dot)} className={`h-2 rounded-full transition-all ${index === dot ? 'w-9 bg-[#e60012]' : 'w-2 bg-black/20'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SakuraMobileExperience() {
  useEffect(() => {
    document.documentElement.style.scrollSnapType = "none";
    return () => { document.documentElement.style.scrollSnapType = ""; };
  }, []);

  const goMenu = () => document.getElementById("mobile-menu")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="w-full overflow-x-hidden bg-[#f1dfcf] text-neutral-950">
      <MobileNav onMenu={goMenu} />
      <SakuraZenAudio />
      <Hero onMenu={goMenu} />
      <Dishes />
      <AevumAgencyFooter />
    </main>
  );
}
