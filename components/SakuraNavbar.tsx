"use client";

import { useState, useEffect } from "react";
import type { DishesPage } from "./SakuraExperience";

interface NavItem {
  id: string;
  label: string;
  target: string;
  page?: DishesPage;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", target: "home" },
  { id: "dishes-1", label: "Menu", target: "dishes-1", page: "first" },
  { id: "contact", label: "Contact", target: "dishes-1", page: "third" },
];

export default function SakuraNavbar({
  activeNav,
  setActiveNav,
  dishesPage,
  setDishesPage,
}: {
  activeNav: string;
  setActiveNav: (id: string) => void;
  dishesPage: DishesPage;
  setDishesPage: (page: DishesPage) => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 35);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeroMode = !isScrolled || activeNav === "home";

  const handleNavClick = (item: NavItem) => {
    setMobileMenuOpen(false);
    setActiveNav(item.id);

    if (item.id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (item.id === "contact") {
      const footerEl = document.getElementById("aevum-footer");
      if (footerEl) {
        footerEl.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "mailto:aevumofficial26@gmail.com?subject=Inquiry%20for%20AEVUM%20Agency";
      }
      return;
    }

    const dishesEl = document.getElementById("dishes-1");
    if (item.page) {
      setDishesPage(item.page);
    }

    if (dishesEl) {
      const top = dishesEl.offsetTop;
      const total = Math.max(1, dishesEl.offsetHeight - window.innerHeight);
      if (item.page === "first") {
        window.scrollTo({ top: top + 10, behavior: "smooth" });
      } else if (item.page === "second") {
        window.scrollTo({ top: top + total * 0.45, behavior: "smooth" });
      } else if (item.page === "third") {
        window.scrollTo({ top: top + total * 0.85, behavior: "smooth" });
      } else {
        dishesEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleOrderClick = () => {
    // Navigate to dishes selection and trigger email checkout inquiry
    setActiveNav("dishes-1");
    setDishesPage("first");
    const dishesEl = document.getElementById("dishes-1");
    if (dishesEl) {
      window.scrollTo({ top: dishesEl.offsetTop + 10, behavior: "smooth" });
    }
    
    // Launch pre-populated AEVUM order email
    const subject = encodeURIComponent("AEVUM Order Inquiry");
    const body = encodeURIComponent(
      "Hello AEVUM Team,\n\nI would like to place an order inquiry from the Sakura web engineering showcase.\n\nSelected Dish: Tonkotsu Ramen / Sushi Platter\nQuantity: 1\nSpecial Notes: Fresh seasonal preparation\n\nThank you!"
    );
    window.location.href = `mailto:aevumofficial26@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none transition-all duration-300">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto w-full max-w-4xl rounded-full transition-all duration-500 backdrop-blur-xl bg-black/40 border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.25)] text-white py-2 sm:py-2.5 px-5 sm:px-7"
      >
        <div className="flex items-center justify-between">
          {/* Brand Wordmark with subtle signature dot */}
          <button
            type="button"
            onClick={() => handleNavClick(NAV_ITEMS[0])}
            className="flex items-center gap-3 group focus:outline-none cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 group-hover:scale-125 transition-transform duration-300" />
            <span className="font-black text-base sm:text-lg tracking-[0.22em] uppercase leading-none text-white transition-colors duration-300">
              SAKURA
            </span>
          </button>

          {/* Clean Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`relative py-1 text-xs font-bold tracking-[0.16em] uppercase transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e60012] rounded-full transition-all duration-300" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Attractive Solid Crimson CTA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOrderClick}
              style={{ backgroundColor: "#e60012" }}
              className="group relative flex items-center gap-2.5 bg-[#e60012] hover:bg-[#ff1a2d] text-white font-extrabold text-xs sm:text-sm tracking-[0.16em] uppercase px-6 py-2 sm:py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-[0_4px_16px_rgba(230,0,18,0.35)]"
            >
              <span>Order Now</span>
              <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                <svg
                  className="w-3 h-3 stroke-current stroke-2 fill-none"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              aria-label="Toggle Menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/15 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`text-left text-sm font-bold tracking-wider uppercase py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "text-red-500 font-bold"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleOrderClick();
              }}
              className="mt-2 w-full py-2.5 rounded-full bg-[#e60012] text-white font-bold text-xs uppercase tracking-widest text-center cursor-pointer shadow-[0_4px_16px_rgba(230,0,18,0.4)]"
            >
              Order Now
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
