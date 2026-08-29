"use client";

import { useState } from "react";

export default function AevumAgencyFooter() {
  const [guestName, setGuestName] = useState("");
  const [guestGuests, setGuestGuests] = useState("2 Guests");
  const [guestDate, setGuestDate] = useState("");

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = "aevumofficial26@gmail.com";
    const subject = encodeURIComponent("Omakase Table Reservation - SAKURA");
    const bodyText = `Reservation Request for SAKURA (桜処):\n\nGuest Name: ${
      guestName || "Guest"
    }\nParty Size: ${guestGuests}\nRequested Date/Time: ${
      guestDate || "Soonest Available"
    }\n\nSent via SAKURA Digital Atelier`;

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  return (
    <footer
      id="aevum-footer"
      className="relative z-40 bg-[#0a0807] text-[#f1dfcf] pt-20 pb-12 px-6 sm:px-12 border-t border-amber-900/30 overflow-hidden select-none"
    >
      {/* Background Japanese Watermark & Soft Crimson Glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-[#e60012]/[0.08] rounded-full blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-10 w-[400px] h-[250px] bg-amber-600/[0.05] rounded-full blur-[100px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-6 right-8 font-serif text-[18vw] font-black text-white/[0.02] pointer-events-none leading-none select-none"
      >
        桜
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Top Header: Atelier Identity & Philosophy */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border border-[#e60012] bg-[#e60012]/20 flex items-center justify-center text-xs font-serif font-black text-[#e60012] shadow-sm">
                桜
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-[0.28em] uppercase text-white">
                SAKURA <span className="text-[#e60012] font-normal">•</span> 桜処
              </h3>
            </div>
            <p className="font-serif italic text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
              「一期一会の心で、至高の一皿を。」
              <span className="block not-italic text-xs font-sans text-neutral-500 mt-1">
                Honoring 36 years of Michelin-inspired Japanese culinary craftsmanship in Ginza, Tokyo.
              </span>
            </p>
          </div>

          {/* Quick Contact & Direct Booking Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="mailto:aevumofficial26@gmail.com?subject=Dining%20Inquiry%20-%20SAKURA"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-[#e60012]/60 text-xs font-mono tracking-wider text-neutral-300 hover:text-white transition-all duration-300"
            >
              <span className="w-2 h-2 rounded-full bg-[#e60012] animate-pulse" />
              <span>aevumofficial26@gmail.com</span>
            </a>
          </div>
        </div>

        {/* 3-Column Luxury Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {/* Column 1: Location & Hours */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#e60012] flex items-center gap-2">
              <span>❖</span>
              <span>Location &amp; Hours</span>
            </h4>
            <div className="space-y-2 text-xs text-neutral-400 font-sans leading-relaxed">
              <p className="text-white font-medium">
                4-Chome Ginza, Chuo City, Tokyo 104-0061
              </p>
              <div className="pt-2 space-y-1">
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span>昼 / Lunch Omakase:</span>
                  <span className="text-neutral-200">11:30 – 15:00</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span>夜 / Evening Kaiseki:</span>
                  <span className="text-neutral-200">17:30 – 22:30</span>
                </div>
                <div className="flex justify-between py-1 text-neutral-500">
                  <span>定休日 / Closed:</span>
                  <span>Mondays (月曜)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Omakase Heritage & Sourcing */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#e60012] flex items-center gap-2">
              <span>❖</span>
              <span>Atelier Sourcing</span>
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400 leading-relaxed font-sans">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white font-semibold block mb-0.5">豊洲市場直送 / Toyosu Direct</span>
                <span>Wild Bluefin, Hokkaido Uni &amp; King Salmon air-shipped at dawn.</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white font-semibold block mb-0.5">紀州備長炭 / Kishu Bincho-Tan</span>
                <span>Wakayama oak charcoal searing at 1,000°C for deep umami aroma.</span>
              </div>
            </div>
          </div>

          {/* Column 3: Table Reservation / Inquiries */}
          <div className="space-y-4 bg-white/[0.02] border border-white/10 p-5 sm:p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-white">
                Reserve Omakase
              </h4>
              <span className="text-[10px] font-mono text-[#e60012] px-2 py-0.5 rounded bg-[#e60012]/15 border border-[#e60012]/40">
                予約
              </span>
            </div>

            <form onSubmit={handleReservation} className="space-y-2.5">
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Guest Name (お名前)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#e60012] transition-colors"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={guestGuests}
                  onChange={(e) => setGuestGuests(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-[#e60012] transition-colors"
                >
                  <option value="1 Guest">1 Guest</option>
                  <option value="2 Guests">2 Guests</option>
                  <option value="4 Guests">4 Guests</option>
                  <option value="Private Dining">Private Room</option>
                </select>
                <input
                  type="date"
                  value={guestDate}
                  onChange={(e) => setGuestDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-neutral-300 text-xs focus:outline-none focus:border-[#e60012] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#e60012] hover:bg-[#ff1a2d] text-white font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 shadow-[0_4px_16px_rgba(230,0,18,0.4)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                Request Reservation →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          <div>
            © 2026 SAKURA CULINARY ATELIER. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-2">
            <span>ENGINEERED BY</span>
            <span className="text-neutral-300 font-bold tracking-wider">AEVUM STUDIO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
