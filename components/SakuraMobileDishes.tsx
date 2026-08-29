"use client";

import React, { useState } from "react";

interface DishItem {
  id: string;
  number: string;
  name: string;
  japaneseName: string;
  description: string;
  tag: string;
  price: string;
  imageSrc: string;
}

const DISHES_DATA: { pairLabel: string; pairKey: "first" | "second" | "third"; dishes: DishItem[] }[] = [
  {
    pairLabel: "Pair 01 • Ramen & Sushi",
    pairKey: "first",
    dishes: [
      {
        id: "ramen",
        number: "01.",
        name: "Tonkotsu Ramen",
        japaneseName: "豚骨ラーメン",
        description: "Rich 18-hour pork-bone broth, handcrafted artisanal noodles, tender chashu pork belly, seasoned soft-boiled ajitsuke tamago, roasted nori, and fresh scallions.",
        tag: "Chef's Signature",
        price: "$18.50",
        imageSrc: "/sakura-assets/_assets/media/dishes/ramen-hq-cutout.png",
      },
      {
        id: "sushi",
        number: "02.",
        name: "Artisan Sushi Platter",
        japaneseName: "極上 寿司盛り合わせ",
        description: "Fresh Norwegian salmon, bluefin tuna, sweet botan shrimp nigiri, authentic spicy tuna maki rolls, sashimi selection with aged soy sauce, pickled ginger & fresh wasabi.",
        tag: "Omakase Favorite",
        price: "$34.00",
        imageSrc: "/sakura-assets/_assets/media/dishes/sushi-platter-hq-cutout.png",
      },
    ],
  },
  {
    pairLabel: "Pair 02 • Udon & Tempura",
    pairKey: "second",
    dishes: [
      {
        id: "udon",
        number: "03.",
        name: "Sanuki Udon",
        japaneseName: "讃岐うどん",
        description: "Thick, chewy handcrafted wheat noodles simmered in savory dashi broth, topped with tempura flakes, sweet aburaage tofu, wakame seaweed, and scallions.",
        tag: "Traditional Classic",
        price: "$16.50",
        imageSrc: "/sakura-assets/_assets/media/dishes/udon-hq-cutout.png",
      },
      {
        id: "tempura",
        number: "04.",
        name: "Crispy Ebi Tempura",
        japaneseName: "海老天ぷら",
        description: "Delicately battered wild tiger prawns and seasonal Japanese vegetables, fried to golden crispness and served with warm grated-daikon tentsuyu dipping sauce.",
        tag: "Crispy Delight",
        price: "$22.00",
        imageSrc: "/sakura-assets/_assets/media/dishes/tempura-hq-cutout.png",
      },
    ],
  },
  {
    pairLabel: "Pair 03 • Yakitori & Okonomiyaki",
    pairKey: "third",
    dishes: [
      {
        id: "yakitori",
        number: "05.",
        name: "Charcoal Yakitori",
        japaneseName: "炭火焼き鳥",
        description: "Binchotan charcoal-grilled free-range chicken skewers layered with sweet Tokyo negi scallions, glazed repeatedly with our 30-year aged tare reduction.",
        tag: "Binchotan Grilled",
        price: "$19.00",
        imageSrc: "/sakura-assets/_assets/media/dishes/yakitori-hq-cutout.png",
      },
      {
        id: "okonomiyaki",
        number: "06.",
        name: "Osaka Okonomiyaki",
        japaneseName: "お好み焼き",
        description: "Savory Japanese teppanyaki pancake with shredded cabbage, squid, pork belly, drizzled with sweet okonomi glaze, Japanese kewpie mayo, dancing bonito flakes, and aonori.",
        tag: "Street Food Specialty",
        price: "$21.00",
        imageSrc: "/sakura-assets/_assets/media/dishes/okonomiyaki-hq-cutout.png",
      },
    ],
  },
];

export default function SakuraMobileDishes({
  currentPage = "first",
  onPageChange,
}: {
  currentPage?: "first" | "second" | "third";
  onPageChange?: (page: "first" | "second" | "third") => void;
}) {
  const [selectedPairIndex, setSelectedPairIndex] = useState(
    currentPage === "first" ? 0 : currentPage === "second" ? 1 : 2
  );
  const [orderModalDish, setOrderModalDish] = useState<DishItem | null>(null);

  const activePair = DISHES_DATA[selectedPairIndex];

  const handlePairSelect = (idx: number) => {
    setSelectedPairIndex(idx);
    onPageChange?.(DISHES_DATA[idx].pairKey);
  };

  return (
    <section className="relative w-full min-h-screen bg-[#111115] text-white py-12 px-4 sm:px-6 lg:hidden font-sans select-none flex flex-col justify-between">
      {/* Background Japanese Watermark & Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col items-center text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/30 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase text-red-400 mb-3">
          <span>極上 料理</span>
          <span>•</span>
          <span>Signature Dishes</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase text-white">
          Our Culinary Masterpieces
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mt-2">
          Experience authentic Japanese cuisine crafted with seasonal imports and time-honored techniques.
        </p>

        {/* Pair Navigation Pills */}
        <div className="flex items-center gap-1.5 mt-6 bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto max-w-full">
          {DISHES_DATA.map((p, idx) => (
            <button
              key={p.pairKey}
              type="button"
              onClick={() => handlePairSelect(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedPairIndex === idx ? "bg-red-600 text-white shadow-lg shadow-red-600/40 scale-105" : "text-neutral-400 hover:text-white"}`}
            >
              {p.pairLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Active Pair Dish Cards Grid */}
      <div className="relative z-10 flex flex-col gap-8 w-full max-w-md mx-auto">
        {activePair.dishes.map((dish, i) => (
          <div
            key={dish.id}
            className="bg-neutral-900/90 rounded-3xl border border-white/10 p-6 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden group hover:border-red-500/40 transition-all duration-300"
          >
            {/* Japanese Watermark Text */}
            <span className="absolute -top-4 -right-4 text-7xl font-black text-white/5 pointer-events-none select-none">
              {dish.number}
            </span>

            {/* Dish High-Res Cutout Image with Floating Animation */}
            <div className="relative w-64 h-56 flex items-center justify-center -mt-2 mb-3">
              <img
                src={dish.imageSrc}
                alt={dish.name}
                className={`max-w-full max-h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500 ${i === 0 ? "animate-float-petal-1" : "animate-float-petal-2"}`}
              />
            </div>

            {/* Dish Meta */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-red-500">{dish.number}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-300 font-bold border border-red-500/30">
                {dish.tag}
              </span>
              <span className="text-xs font-serif text-neutral-400">{dish.japaneseName}</span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white uppercase mb-2">
              {dish.name}
            </h3>

            <p className="text-xs leading-relaxed text-neutral-300 mb-4 max-w-xs">
              {dish.description}
            </p>

            {/* Price & Action */}
            <div className="flex items-center justify-between w-full pt-4 border-t border-white/10">
              <span className="text-xl font-mono font-black text-emerald-400">
                {dish.price}
              </span>
              <button
                type="button"
                onClick={() => setOrderModalDish(dish)}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-black tracking-wider uppercase shadow-lg active:scale-95 transition-all"
              >
                Order / Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pair Switcher Footer Buttons */}
      <div className="relative z-10 flex items-center justify-between mt-8 max-w-md mx-auto w-full pt-4 border-t border-white/10 text-xs">
        <button
          type="button"
          disabled={selectedPairIndex === 0}
          onClick={() => handlePairSelect(Math.max(0, selectedPairIndex - 1))}
          className={`flex items-center gap-1.5 font-bold ${selectedPairIndex === 0 ? "opacity-30 cursor-not-allowed text-neutral-500" : "text-white hover:text-red-400"}`}
        >
          ← Previous Dishes
        </button>

        <span className="font-mono text-neutral-400">
          Pair {selectedPairIndex + 1} of 3
        </span>

        <button
          type="button"
          disabled={selectedPairIndex === DISHES_DATA.length - 1}
          onClick={() => handlePairSelect(Math.min(DISHES_DATA.length - 1, selectedPairIndex + 1))}
          className={`flex items-center gap-1.5 font-bold ${selectedPairIndex === DISHES_DATA.length - 1 ? "opacity-30 cursor-not-allowed text-neutral-500" : "text-white hover:text-red-400"}`}
        >
          Next Dishes →
        </button>
      </div>

      {/* Order / Reserve Modal */}
      {orderModalDish && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-5">
          <div className="bg-neutral-900 border border-white/15 rounded-3xl p-6 max-w-sm w-full flex flex-col gap-4 text-left shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-red-400 uppercase font-bold">
                Table Reservation & Order
              </span>
              <button
                type="button"
                onClick={() => setOrderModalDish(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={orderModalDish.imageSrc}
                alt={orderModalDish.name}
                className="w-20 h-20 object-contain"
              />
              <div>
                <h4 className="text-lg font-black text-white">{orderModalDish.name}</h4>
                <span className="text-emerald-400 font-mono font-bold">{orderModalDish.price}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {orderModalDish.description}
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  alert(`Thank you! Order for ${orderModalDish.name} has been placed.`);
                  setOrderModalDish(null);
                }}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 font-black text-xs uppercase tracking-widest text-white shadow-lg"
              >
                Confirm Order ({orderModalDish.price})
              </button>
              <button
                type="button"
                onClick={() => setOrderModalDish(null)}
                className="w-full py-2.5 rounded-xl bg-white/10 text-neutral-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
