"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import SakuraNavbar from "./SakuraNavbar";
import AevumDisclaimerGate from "./AevumDisclaimerGate";
import AevumLoadingScreen from "./AevumLoadingScreen";
import AevumAgencyFooter from "./AevumAgencyFooter";
import SakuraHeroAtmosphere from "./SakuraHeroAtmosphere";
import SakuraDishesEffects from "./SakuraDishesEffects";
import SakuraTransitionBanner from "./SakuraTransitionBanner";
import SakuraZenAudio from "./SakuraZenAudio";
import MobileDraggableWrapper from "./MobileDraggableWrapper";

type TextRun = { text?: string; break?: true; color?: string; fontWeight?: string; fontStyle?: string; textDecorationLine?: string };
type TextLayer = { x: number; y: number; w: number; h: number; r: number; runs: TextRun[]; style: CSSProperties & { fontSize?: number; lineHeight?: number } };
type ImageLayer = { x: number; y: number; w: number; h: number; r: number; src: string; cropX: number; cropY: number; cropW: number; cropH: number };
type Hotspot = { label: string; target: string; x: number; y: number; w: number; h: number };
type Section = { id: string; label: string; width: number; height: number; images: ImageLayer[]; texts: TextLayer[]; hotspots: Hotspot[] };
type DishesDishKey = "sushi" | "ramen" | "udon" | "tempura" | "yakitori" | "okonomiyaki";
export type DishesPage = "first" | "second" | "third";

const HERO_BOARD_SRC = "/sakura-assets/_assets/media/2cccb1d8bca202e0ae7adde1a1d5d489.png";
const HERO_NAV_BAR_SRC = "/sakura-assets/_assets/media/cf0278f8f8782ba0c748d3e016aabe40.png";
const HERO_LOGO_SRC = "/sakura-assets/_assets/media/6c06138391acf332fac3fc3d9be64b42.png";
const HERO_CTA_SRC = "/sakura-assets/_assets/media/d7008c2fca28475fcc4c0217970428fb.png";
const HERO_CTA_ARROW_SRC = "/sakura-assets/_assets/media/30f4682c39416bf4fa425304a1e01229.png";
const HERO_SUSHI_PLATTER_SRC = "/sakura-assets/_assets/media/2cccb1d8bca202e0ae7adde1a1d5d489.png";
const HERO_SUSHI_PLATTER_HQ_SRC = "/sakura-assets/_assets/media/hero-sushi-platter-hq-cutout.png";
const MOBILE_HERO_SUSHI_PLATTER_SRC = "/sakura-assets/_assets/media/hero-sushi-platter-new.png";
const DISHES_BLACK_BLOCK_SRC = "/sakura-assets/_assets/media/dishes/328fb685432d62976b0179f561f987bf.png";
const DISHES_TOP_BLACK_BLOCK_SRC = "/sakura-assets/_assets/media/dishes/c2d746e5094a5d523e58dfbfefe4d7f7.png";
const DISHES_SUSHI_PLATTER_SRC = "/sakura-assets/_assets/media/dishes/4bb926cd437f06f219ac808e624af238.png";
const DISHES_RAMEN_SRC = "/sakura-assets/_assets/media/dishes/bac4a56380ea691e5dd17fa59a382553.png";
const DISHES_SUSHI_PLATTER_HQ_SRC = "/sakura-assets/_assets/media/dishes/sushi-platter-hq-cutout.png";
const DISHES_RAMEN_HQ_SRC = "/sakura-assets/_assets/media/dishes/ramen-hq-cutout.png";
const DISHES_UDON_HQ_SRC = "/sakura-assets/_assets/media/dishes/udon-hq-cutout.png";
const DISHES_TEMPURA_HQ_SRC = "/sakura-assets/_assets/media/dishes/tempura-hq-cutout.png";
const DISHES_YAKITORI_HQ_SRC = "/sakura-assets/_assets/media/dishes/yakitori-hq-cutout.png";
const DISHES_OKONOMIYAKI_HQ_SRC = "/sakura-assets/_assets/media/dishes/okonomiyaki-hq-cutout.png";
const HERO_TITLE_POSITION = { x: 278, y: 105 };
const HERO_TITLE_SIZE = { width: 1420, height: 737, fontSize: "548px", lineHeight: "690px" };
const HERO_NAV_FRAME = { x: 20.6589, y: -6.65675, w: 1875.37, h: 158.385 };
const WIDESCREEN_STAGE = { width: 1920, height: 1080 };
// All three dish pairs are now reachable via scroll/keys/swipe.
const DISHES_MAX_REACHABLE_PAGE: DishesPage = "third";
const DISHES_PAGE_ORDER: DishesPage[] = ["first", "second", "third"];
function canAdvanceDishesPage(current: DishesPage) {
  return DISHES_PAGE_ORDER.indexOf(current) < DISHES_PAGE_ORDER.indexOf(DISHES_MAX_REACHABLE_PAGE);
}
// Require a section to cover most of the viewport before hijacking scroll —
// otherwise a scroll that's still arriving gets swallowed before the user
// has actually finished entering it. Coverage degrades smoothly as the
// section scrolls in/out, giving a wide window of scroll positions that
// qualify (unlike a dual-edge check, which only qualifies inside a razor-
// thin scroll range a single real wheel/swipe tick can jump clean over).
function dishesSectionCoverage(rect: DOMRect) {
  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, window.innerHeight);
  return Math.max(0, visibleBottom - visibleTop) / window.innerHeight;
}
const renderedSectionIds = new Set(["home", "dishes-1"]);
// Band is 880x280 rotated -32deg around its own center (see .sakura-dishes-band
// in globals.css). Anchoring left/top so the band's CENTER sits exactly on the
// stage corner guarantees the shape touches that corner regardless of rotation.
const DISHES_BAND_SIZE = { width: 880, height: 280 };
const initialDishesCornerPositions = {
  top: {
    x: WIDESCREEN_STAGE.width - DISHES_BAND_SIZE.width / 2,
    y: 0 - DISHES_BAND_SIZE.height / 2,
  },
  bottom: {
    x: 0 - DISHES_BAND_SIZE.width / 2,
    y: WIDESCREEN_STAGE.height - DISHES_BAND_SIZE.height / 2,
  },
};
// Centered on the point where each black corner band reaches furthest into
// the canvas (the band's inward tip), so each dish sits centered against
// that edge instead of floating at an arbitrary spot.
const initialDishesDishPositions = {
  sushi: { x: 137, y: 523 },
  ramen: { x: 1301, y: 32 },
  tempura: { x: 141, y: 556 },
  udon: { x: 1301, y: 32 },
  okonomiyaki: { x: 148, y: 552 },
  yakitori: { x: 1301, y: 32 },
};

const dishesCopy = {
  first: {
    top: {
      number: "01.",
      title: "Tonkotsu Ramen",
      description: ["Rich pork-bone broth,", "ramen noodles, chashu", "pork, soft-boiled egg,", "nori, scallions."],
    },
    bottom: {
      number: "02.",
      title: "Sushi Platter",
      description: ["Salmon, tuna & shrimp", "nigiri, maki rolls, sashimi,", "pickled ginger, wasabi."],
    },
  },
  second: {
    top: {
      number: "03.",
      title: "Udon",
      description: ["Thick wheat noodles", "in savory dashi broth,", "with tempura and wakame."],
    },
    bottom: {
      number: "04.",
      title: "Tempura",
      description: ["Crispy shrimp and vegetable", "tempura served with tentsuyu", "dipping sauce."],
    },
  },
  third: {
    top: {
      number: "05.",
      title: "Yakitori",
      description: ["Grilled chicken skewers with", "scallions, glazed with sweet", "soy sauce (tare)."],
    },
    bottom: {
      number: "06.",
      title: "Okonomiyaki",
      description: ["Savory Japanese pancake", "with cabbage, seafood,", "sauce, mayo, bonito, aonori."],
    },
  },
};

const navUnderline = {
  home: { x: 493, w: 72 },
  "dishes-1": { x: 719, w: 84 },
  "dishes-2": { x: 887, w: 116 },
  "dishes-3": { x: 1088, w: 91 },
  contact: { x: 1253, w: 126 },
};

const sections = [
  {
    "id": "home",
    "label": "Hero",
    "width": 1920,
    "height": 1080,
    "images": [
      {
        "x": 0,
        "y": 0,
        "w": 1918.98,
        "h": 1080,
        "r": 0,
        "src": "/sakura-assets/_assets/media/ba78b4a30520331745a674cd7d48884f.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 1918.98,
        "cropH": 1080
      },
      {
        "x": 20.6589,
        "y": -6.65675,
        "w": 1875.37,
        "h": 158.385,
        "r": 0,
        "src": "/sakura-assets/_assets/media/cf0278f8f8782ba0c748d3e016aabe40.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 1875.37,
        "cropH": 158.385
      },
      {
        "x": 67.7152,
        "y": 21.8066,
        "w": 115.919,
        "h": 113.624,
        "r": 0,
        "src": "/sakura-assets/_assets/media/6c06138391acf332fac3fc3d9be64b42.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 115.919,
        "cropH": 113.624
      },
      {
        "x": 1501.49,
        "y": 28.3826,
        "w": 328.731,
        "h": 96.2053,
        "r": 0,
        "src": "/sakura-assets/_assets/media/d7008c2fca28475fcc4c0217970428fb.png",
        "cropX": 0,
        "cropY": -0.332494,
        "cropW": 328.731,
        "cropH": 108.207
      },
      {
        "x": 1689.44,
        "y": 37.7582,
        "w": 86.8298,
        "h": 86.8298,
        "r": 0,
        "src": "/sakura-assets/_assets/media/30f4682c39416bf4fa425304a1e01229.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 86.8298,
        "cropH": 86.8298
      },
      {
        "x": -50.4995,
        "y": 156.663,
        "w": 297.258,
        "h": 315.622,
        "r": 0,
        "src": "/sakura-assets/_assets/media/b04f0772236c0166269f504ed52d6aa2.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 297.258,
        "cropH": 315.622
      },
      {
        "x": 1689.44,
        "y": 280.53,
        "w": 229.543,
        "h": 361.53,
        "r": 0,
        "src": "/sakura-assets/_assets/media/93855b7c7aeeca97d67876867446a9b1.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 229.543,
        "cropH": 361.53
      },
      {
        "x": 0,
        "y": 876.854,
        "w": 366.121,
        "h": 203.146,
        "r": 0,
        "src": "/sakura-assets/_assets/media/2036415e6c26b3751795e13146e6af46.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 366.121,
        "cropH": 203.146
      },
      {
        "x": 367.333,
        "y": 494.665,
        "w": 1234.94,
        "h": 585.335,
        "r": 0,
        "src": "/sakura-assets/_assets/media/2cccb1d8bca202e0ae7adde1a1d5d489.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 1234.94,
        "cropH": 585.335
      }
    ],
    "texts": [
      {
        "x": 188.06,
        "y": 40.763930332399994,
        "w": 193.817,
        "h": 54.9496,
        "r": 0,
        "runs": [
          {
            "text": "SAKURA",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAFdJsyuOPM_0, auto",
          "fontSize": 46.612696676000006,
          "lineHeight": 64.27232000000001,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "uppercase",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 494,
        "y": 55.745884,
        "w": 150.5,
        "h": 38.3307,
        "r": 0,
        "runs": [
          {
            "text": "HOME",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YACgEcYqQ-A_0, auto",
          "fontSize": 32.136160000000004,
          "lineHeight": 44.76108,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "uppercase",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 719.101,
        "y": 58.830484,
        "w": 84.2866,
        "h": 38.3307,
        "r": 0,
        "runs": [
          {
            "text": "MENU",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YACgEcYqQ-A_0, auto",
          "fontSize": 32.136160000000004,
          "lineHeight": 44.76108,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "uppercase",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 887.171,
        "y": 58.830484,
        "w": 116.704,
        "h": 38.3307,
        "r": 0,
        "runs": [
          {
            "text": "COMBOS",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YACgEcYqQ-A_0, auto",
          "fontSize": 32.136160000000004,
          "lineHeight": 44.76108,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "uppercase",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 1541.66,
        "y": 49.1148704924,
        "w": 176.865,
        "h": 45.1465,
        "r": 0,
        "runs": [
          {
            "text": "ORDER NOW",
            "color": "rgb(255, 255, 255)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YACgEcYqQ-A_0, auto",
          "fontSize": 38.257295076000005,
          "lineHeight": 52.795120000000004,
          "color": "rgb(255, 255, 255)",
          "fontWeight": "400",
          "textTransform": "uppercase",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 42.9086,
        "y": 56.26884591900001,
        "w": 1805.23,
        "h": 737.27,
        "r": 0,
        "runs": [
          {
            "text": "SUSHI",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEzv44m-7M_0, auto",
          "fontSize": 615.09154081,
          "lineHeight": 860.29547,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "uppercase",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 188.06,
        "y": 95.341314054,
        "w": 201.493,
        "h": 22.4997,
        "r": 0,
        "runs": [
          {
            "text": "RESTAURANT",
            "color": "rgb(255, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAFdJsyuOPM_0, auto",
          "fontSize": 19.48885946,
          "lineHeight": 26.397560000000002,
          "color": "rgb(255, 0, 0)",
          "fontWeight": "700",
          "textTransform": "uppercase",
          "letterSpacing": "0.3em"
        }
      },
      {
        "x": 1088.01,
        "y": 56.874184,
        "w": 90.7701,
        "h": 38.3307,
        "r": 0,
        "runs": [
          {
            "text": "ABOUT",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YACgEcYqQ-A_0, auto",
          "fontSize": 32.136160000000004,
          "lineHeight": 44.76108,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "uppercase",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 1253.41,
        "y": 58.794084,
        "w": 126.43,
        "h": 38.3307,
        "r": 0,
        "runs": [
          {
            "text": "CONTACT",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YACgEcYqQ-A_0, auto",
          "fontSize": 32.136160000000004,
          "lineHeight": 44.76108,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "uppercase",
          "letterSpacing": "0em"
        }
      }
    ],
    "hotspots": [
      {
        "label": "Home",
        "target": "home",
        "x": 467,
        "y": 42,
        "w": 92,
        "h": 70
      },
      {
        "label": "Menu",
        "target": "dishes-1",
        "x": 657,
        "y": 42,
        "w": 98,
        "h": 70
      },
      {
        "label": "Combos",
        "target": "dishes-2",
        "x": 835,
        "y": 42,
        "w": 140,
        "h": 70
      },
      {
        "label": "About",
        "target": "dishes-3",
        "x": 1070,
        "y": 42,
        "w": 120,
        "h": 70
      },
      {
        "label": "Contact",
        "target": "dishes-3",
        "x": 1295,
        "y": 42,
        "w": 145,
        "h": 70
      },
      {
        "label": "Order Now",
        "target": "dishes-1",
        "x": 1504,
        "y": 30,
        "w": 326,
        "h": 94
      }
    ]
  },
  {
    "id": "dishes-1",
    "label": "Dishes 1",
    "width": 1527.58,
    "height": 1080,
    "images": [
      {
        "x": 0,
        "y": 0,
        "w": 1527.58,
        "h": 1080,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/6181f4becb4875aa7f77c4a4a886a7ed.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 1527.58,
        "cropH": 1080
      },
      {
        "x": 0,
        "y": 665.262,
        "w": 616.307,
        "h": 414.738,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/328fb685432d62976b0179f561f987bf.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 616.307,
        "cropH": 414.738
      },
      {
        "x": 1083.44,
        "y": -39.9294,
        "w": 444.144,
        "h": 497.44,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/c2d746e5094a5d523e58dfbfefe4d7f7.png",
        "cropX": -12.6038,
        "cropY": 0,
        "cropW": 456.748,
        "cropH": 497.44
      },
      {
        "x": 324.611,
        "y": 581.245,
        "w": 57.2843,
        "h": 125.262,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/1c8a48fe519798d973bed8fe9d09f5f6.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 57.2843,
        "cropH": 125.262
      },
      {
        "x": 238.685,
        "y": 432.587,
        "w": 630.127,
        "h": 644.639,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/4bb926cd437f06f219ac808e624af238.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 630.127,
        "cropH": 644.639
      },
      {
        "x": 898.982,
        "y": 27.4965,
        "w": 496.464,
        "h": 540.764,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/bac4a56380ea691e5dd17fa59a382553.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 496.464,
        "cropH": 540.764
      }
    ],
    "texts": [
      {
        "x": 70.2687,
        "y": 131.9921887053,
        "w": 288.713,
        "h": 375.248,
        "r": 0,
        "runs": [
          {
            "text": "Top",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400"
          },
          {
            "break": true
          },
          {
            "text": "Dishes",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400"
          }
        ],
        "style": {
          "fontFamily": "YAEDY2nKVw0_0, auto",
          "fontSize": 190.58647685699998,
          "lineHeight": 146.647872,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 520.905,
        "y": 96.10366602354,
        "w": 65.686,
        "h": 60.5853,
        "r": 0,
        "runs": [
          {
            "text": "01.",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 50.8756602354,
          "lineHeight": 50.410206,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 520.905,
        "y": 159.91116399999999,
        "w": 320.792,
        "h": 36.662,
        "r": 0,
        "runs": [
          {
            "text": "Tonkotsu Ramen",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 30.55164,
          "lineHeight": 30.55164,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 520.905,
        "y": 210.60601245402998,
        "w": 320.792,
        "h": 128.81,
        "r": 0,
        "runs": [
          {
            "text": "Rich pork-bone broth,ramen noodles, chashupork, soft-boiled egg,",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          },
          {
            "break": true
          },
          {
            "text": "nori, scallions.",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 25.4596745403,
          "lineHeight": 32.843013,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "none",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 985.29,
        "y": 670.81887740349,
        "w": 82.4894,
        "h": 66.1067,
        "r": 0,
        "runs": [
          {
            "text": "02.",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 55.5687740349,
          "lineHeight": 54.992952,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 988.345,
        "y": 739.631164,
        "w": 271.554,
        "h": 36.662,
        "r": 0,
        "runs": [
          {
            "text": "Sushi Platter",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 30.55164,
          "lineHeight": 30.55164,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 989.873,
        "y": 781.51201245403,
        "w": 314.682,
        "h": 95.9711,
        "r": 0,
        "runs": [
          {
            "text": "Salmon, tuna & shrimpnigiri, maki rolls, sashimi,",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          },
          {
            "break": true
          },
          {
            "text": "pickled ginger, wasabi.",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 25.4596745403,
          "lineHeight": 32.843013,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "none",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 1303.77102483492,
        "y": 935.6375915215101,
        "w": 131.372,
        "h": 30.3983,
        "r": 0,
        "runs": [
          {
            "text": "Follow US!",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 25.965915215099997,
          "lineHeight": 25.205103,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      }
    ],
    "hotspots": []
  },
  {
    "id": "dishes-2",
    "label": "Dishes 2",
    "width": 1527.58,
    "height": 1080,
    "images": [
      {
        "x": 0,
        "y": 0,
        "w": 1527.58,
        "h": 1080,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/6181f4becb4875aa7f77c4a4a886a7ed.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 1527.58,
        "cropH": 1080
      },
      {
        "x": 0,
        "y": 643.112,
        "w": 649.222,
        "h": 436.888,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/328fb685432d62976b0179f561f987bf.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 649.222,
        "cropH": 436.888
      },
      {
        "x": 1107.5,
        "y": 0,
        "w": 420.085,
        "h": 457.511,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/c2d746e5094a5d523e58dfbfefe4d7f7.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 420.085,
        "cropH": 457.511
      },
      {
        "x": 1279.35,
        "y": 976.124,
        "w": 57.2843,
        "h": 62.6308,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/c265f1a62fd8f7b6bfbd4bff02245bb9.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 57.2843,
        "cropH": 62.6308
      },
      {
        "x": 1355.73,
        "y": 976.124,
        "w": 57.2843,
        "h": 62.6308,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/43d8b1af182cd3dabf32cbe69ebbe7a7.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 57.2843,
        "cropH": 62.6308
      },
      {
        "x": 1432.11,
        "y": 976.124,
        "w": 57.2843,
        "h": 62.6308,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/3294b8df9be9d0bec5e1a6748b5d4033.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 57.2843,
        "cropH": 62.6308
      },
      {
        "x": 841.697,
        "y": 64.0246,
        "w": 547.339,
        "h": 538.611,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/9a2dd789e385cb3eb61ef2c4ee6e2349.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 547.339,
        "cropH": 538.611
      },
      {
        "x": 281.558,
        "y": 484.595,
        "w": 608.258,
        "h": 568.135,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/8873acfb1044eb4d5abfbff3d7c3e436.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 608.258,
        "cropH": 568.135
      }
    ],
    "texts": [
      {
        "x": 70.2687,
        "y": 131.9921887053,
        "w": 288.713,
        "h": 375.248,
        "r": 0,
        "runs": [
          {
            "text": "Top",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400"
          },
          {
            "break": true
          },
          {
            "text": "Dishes",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400"
          }
        ],
        "style": {
          "fontFamily": "YAEDY2nKVw0_0, auto",
          "fontSize": 190.58647685699998,
          "lineHeight": 146.647872,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 520.905,
        "y": 144.71556602354,
        "w": 121.715,
        "h": 60.5873,
        "r": 0,
        "runs": [
          {
            "text": "03.",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 50.8756602354,
          "lineHeight": 50.410206,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 520.905,
        "y": 208.52316399999998,
        "w": 200.113,
        "h": 36.662,
        "r": 0,
        "runs": [
          {
            "text": "Udon",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 30.55164,
          "lineHeight": 30.55164,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 520.905,
        "y": 259.21701245403,
        "w": 320.792,
        "h": 128.81,
        "r": 0,
        "runs": [
          {
            "text": "Thick wheat noodles in a savory",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400"
          },
          {
            "break": true
          },
          {
            "text": "dashi broth, topped with tempura,",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400"
          },
          {
            "break": true
          },
          {
            "text": "fish cake, scallions, and wakame.",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 25.4596745403,
          "lineHeight": 32.843013,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "none",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 985.29,
        "y": 620.77887740349,
        "w": 82.4894,
        "h": 66.1107,
        "r": 0,
        "runs": [
          {
            "text": "04.",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 55.5687740349,
          "lineHeight": 54.992952,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 988.345,
        "y": 689.5911639999999,
        "w": 171.089,
        "h": 67.2136,
        "r": 0,
        "runs": [
          {
            "text": "Tempura",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 30.55164,
          "lineHeight": 30.55164,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 989.873,
        "y": 731.47301245403,
        "w": 314.682,
        "h": 128.81,
        "r": 0,
        "runs": [
          {
            "text": "Crispy shrimp andvegetable tempura servedwith tentsuyu dippingsauce.",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 25.4596745403,
          "lineHeight": 32.843013,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "none",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 1303.77102483492,
        "y": 935.6375915215101,
        "w": 131.372,
        "h": 30.3983,
        "r": 0,
        "runs": [
          {
            "text": "Follow US!",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 25.965915215099997,
          "lineHeight": 25.205103,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      }
    ],
    "hotspots": []
  },
  {
    "id": "dishes-3",
    "label": "Dishes 3",
    "width": 1527.58,
    "height": 1080,
    "images": [
      {
        "x": 0,
        "y": 0,
        "w": 1527.58,
        "h": 1080,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/6181f4becb4875aa7f77c4a4a886a7ed.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 1527.58,
        "cropH": 1080
      },
      {
        "x": 0,
        "y": 643.112,
        "w": 649.222,
        "h": 436.888,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/328fb685432d62976b0179f561f987bf.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 649.222,
        "cropH": 436.888
      },
      {
        "x": 1107.5,
        "y": 0,
        "w": 420.085,
        "h": 457.511,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/c2d746e5094a5d523e58dfbfefe4d7f7.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 420.085,
        "cropH": 457.511
      },
      {
        "x": 1279.35,
        "y": 976.124,
        "w": 57.2843,
        "h": 62.6308,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/c265f1a62fd8f7b6bfbd4bff02245bb9.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 57.2843,
        "cropH": 62.6308
      },
      {
        "x": 1355.73,
        "y": 976.124,
        "w": 57.2843,
        "h": 62.6308,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/43d8b1af182cd3dabf32cbe69ebbe7a7.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 57.2843,
        "cropH": 62.6308
      },
      {
        "x": 1432.11,
        "y": 976.124,
        "w": 57.2843,
        "h": 62.6308,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/3294b8df9be9d0bec5e1a6748b5d4033.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 57.2843,
        "cropH": 62.6308
      },
      {
        "x": 831.617,
        "y": 29.5262,
        "w": 660.338,
        "h": 557.899,
        "r": -17.2354,
        "src": "/sakura-assets/_assets/media/dishes/ee96a1b5393e3e2618997df4641d4d0b.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 660.338,
        "cropH": 557.899
      },
      {
        "x": 251.155,
        "y": 488.668,
        "w": 619.697,
        "h": 518.772,
        "r": 0,
        "src": "/sakura-assets/_assets/media/dishes/7bba989af898dcd8a0d703b10e3ff818.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 619.697,
        "cropH": 518.772
      }
    ],
    "texts": [
      {
        "x": 70.2687,
        "y": 131.9921887053,
        "w": 288.713,
        "h": 375.248,
        "r": 0,
        "runs": [
          {
            "text": "Top",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400"
          },
          {
            "break": true
          },
          {
            "text": "Dishes",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400"
          }
        ],
        "style": {
          "fontFamily": "YAEDY2nKVw0_0, auto",
          "fontSize": 190.58647685699998,
          "lineHeight": 146.647872,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 518.973,
        "y": 175.31056602354002,
        "w": 121.715,
        "h": 60.5873,
        "r": 0,
        "runs": [
          {
            "text": "03.",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 50.8756602354,
          "lineHeight": 50.410206,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 518.973,
        "y": 239.11816399999998,
        "w": 200.113,
        "h": 67.2136,
        "r": 0,
        "runs": [
          {
            "text": "Yakitori",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 30.55164,
          "lineHeight": 30.55164,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 518.973,
        "y": 289.81301245403,
        "w": 320.792,
        "h": 95.9711,
        "r": 0,
        "runs": [
          {
            "text": "Grilled chicken skewerswith scallions, glazed withsweet soy sauce (tare).",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 25.4596745403,
          "lineHeight": 32.843013,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "none",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 985.29,
        "y": 620.77887740349,
        "w": 82.4894,
        "h": 66.1107,
        "r": 0,
        "runs": [
          {
            "text": "04.",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 55.5687740349,
          "lineHeight": 54.992952,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 988.345,
        "y": 689.5911639999999,
        "w": 230.982,
        "h": 36.662,
        "r": 0,
        "runs": [
          {
            "text": "Okonomiyaki",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 30.55164,
          "lineHeight": 30.55164,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "-0.03em"
        }
      },
      {
        "x": 989.873,
        "y": 731.47301245403,
        "w": 429.709,
        "h": 128.81,
        "r": 0,
        "runs": [
          {
            "text": "Savory Japanese pancake withcabbage, meat or seafood, toppedwith okonomiyaki sauce, mayo,bonito flakes, and aonori.",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAEnXEEs5-Q_0, auto",
          "fontSize": 25.4596745403,
          "lineHeight": 32.843013,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "none",
          "letterSpacing": "0em"
        }
      }
    ],
    "hotspots": []
  }
] satisfies Section[];

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Native `behavior: "smooth"` scrolling finishes in ~300-500ms in most
// browsers, which feels abrupt for full-section jumps. This drives the same
// scroll with a slower, explicitly-timed easing curve instead. `html` has
// `scroll-behavior: smooth` globally (see globals.css) — every per-frame
// scrollTo below must force "auto", otherwise each step re-triggers the CSS
// smooth animation and the two fight, sometimes stalling entirely.
function smoothScrollTo(targetY: number, duration = 2400) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 1) return;
  const startTime = performance.now();
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      root.style.scrollBehavior = previousScrollBehavior;
    }
  }
  requestAnimationFrame(step);
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const targetY = el.getBoundingClientRect().top + window.scrollY;
  smoothScrollTo(targetY);
}

function safeScrollTarget(id: string) {
  return renderedSectionIds.has(id) ? id : "dishes-1";
}

function getTextStyle(layer: TextLayer): CSSProperties {
  const style: CSSProperties = { ...layer.style };
  if (typeof style.fontSize === "number") style.fontSize = `${style.fontSize}px`;
  if (typeof style.lineHeight === "number") style.lineHeight = `${style.lineHeight}px`;
  return style;
}

function isHeroSushiTitle(layer: TextLayer) {
  return layer.runs.some((run) => run.text === "SUSHI");
}

function layerClass(layer: ImageLayer) {
  if (layer.src === HERO_BOARD_SRC || layer.src === HERO_SUSHI_PLATTER_HQ_SRC) return "sakura-hero-board";
  if (layer.src === HERO_CTA_SRC) return "sakura-cta-plate";
  if (layer.src === HERO_CTA_ARROW_SRC) return "sakura-cta-arrow";
  return "";
}

function navPercent(value: number) {
  return `${((value - HERO_NAV_FRAME.x) / HERO_NAV_FRAME.w) * 100}%`;
}

function getStageSize(section: Section) {
  return section.id === "dishes-1" ? WIDESCREEN_STAGE : { width: section.width, height: section.height };
}

function getDisplayImageLayer(section: Section, layer: ImageLayer, index: number): ImageLayer {
  if (section.id === "home" && layer.src === HERO_SUSHI_PLATTER_SRC) {
    return { ...layer, src: HERO_SUSHI_PLATTER_HQ_SRC };
  }

  if (section.id === "home" && index === 0) {
    return {
      ...layer,
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      cropX: 0,
      cropY: 0,
      cropW: 1920,
      cropH: 1080,
    };
  }

  if (section.id !== "dishes-1") return layer;

  if (index === 0) {
    return {
      ...layer,
      x: 0,
      w: WIDESCREEN_STAGE.width,
      cropW: WIDESCREEN_STAGE.width,
    };
  }

  if (layer.src === DISHES_BLACK_BLOCK_SRC) {
    return { ...layer, x: 0, y: 805, w: 720, h: 275, cropX: 0, cropY: 0, cropW: 720, cropH: 275 };
  }

  if (layer.src === DISHES_TOP_BLACK_BLOCK_SRC) {
    return { ...layer, x: 1410, y: 50, w: 510, h: 345, cropX: 0, cropY: 0, cropW: 510, cropH: 345 };
  }

  if (layer.src === DISHES_SUSHI_PLATTER_SRC) {
    return { ...layer, src: DISHES_SUSHI_PLATTER_HQ_SRC, x: 80, y: 485, w: 595, h: 579, cropX: 0, cropY: 0, cropW: 595, cropH: 579 };
  }

  if (layer.src === DISHES_RAMEN_SRC) {
    return { ...layer, src: DISHES_RAMEN_HQ_SRC, x: 1088, y: 60, w: 640, h: 640, cropX: 0, cropY: 0, cropW: 640, cropH: 640 };
  }

  if (index === 3) {
    return { ...layer, x: 520, y: 720, w: 64, h: 140, cropW: 64, cropH: 140 };
  }

  return layer;
}

function isDishesBlackBlock(layer: ImageLayer) {
  return [DISHES_BLACK_BLOCK_SRC, DISHES_TOP_BLACK_BLOCK_SRC].includes(layer.src);
}

// Orphaned drop-shadow asset from the original Canva layout — with the dishes
// repositioned it no longer sits under anything and just floats as a stray
// dark smudge in the empty lower-left area. Hidden, not deleted from the data.
const DISHES_STRAY_SHADOW_SRC = "/sakura-assets/_assets/media/dishes/1c8a48fe519798d973bed8fe9d09f5f6.png";
function isDishesStrayShadow(layer: ImageLayer) {
  return layer.src === DISHES_STRAY_SHADOW_SRC;
}

function dishesDishKey(layer: ImageLayer): DishesDishKey | null {
  if (layer.src === DISHES_SUSHI_PLATTER_SRC) return "sushi";
  if (layer.src === DISHES_RAMEN_SRC) return "ramen";
  if (layer.src === DISHES_UDON_HQ_SRC) return "udon";
  if (layer.src === DISHES_TEMPURA_HQ_SRC) return "tempura";
  return null;
}

function makeDishLayer(src: string, x: number, y: number, w: number, h: number): ImageLayer {
  return { src, x, y, w, h, r: 0, cropX: 0, cropY: 0, cropW: w, cropH: h };
}

function getDishesTextTemplate(section: Section, text: string) {
  return getDisplayTextLayer(
    section,
    section.texts.find((layer) => layerText(layer) === text) ??
      section.texts.find((layer) => layerText(layer).startsWith(text.slice(0, 20))) ??
      section.texts[0],
  );
}

function getDisplayTextLayer(section: Section, layer: TextLayer): TextLayer {
  if (section.id !== "dishes-1") return layer;
  const text = layerText(layer);

  if (text === "TopDishes") {
    return {
      ...layer,
      x: -25,
      y: 120,
      w: 471,
      h: 552,
      style: { ...layer.style, fontSize: 285, lineHeight: 218 },
    };
  }

  if (text === "01.") return { ...layer, x: 650, y: 205, style: { ...layer.style, fontSize: 64, lineHeight: 64 } };
  if (text === "Tonkotsu Ramen") return { ...layer, x: 650, y: 282, w: 420, style: { ...layer.style, fontSize: 39, lineHeight: 42 } };
  if (text.startsWith("Rich pork-bone")) return { ...layer, x: 650, y: 357, w: 410, h: 190, style: { ...layer.style, fontSize: 33, lineHeight: 42 } };
  if (text === "02.") return { ...layer, x: 1028, y: 690, style: { ...layer.style, fontSize: 64, lineHeight: 64 } };
  if (text === "Sushi Platter") return { ...layer, x: 1028, y: 767, w: 365, style: { ...layer.style, fontSize: 39, lineHeight: 42 } };
  if (text.startsWith("Salmon, tuna")) return { ...layer, x: 1028, y: 842, w: 425, h: 160, style: { ...layer.style, fontSize: 31, lineHeight: 39 } };

  return layer;
}

function getDishesTextRuns(layer: TextLayer): TextRun[] {
  const text = layerText(layer);

  if (text.startsWith("Rich pork-bone")) {
    return [
      { text: "Rich pork-bone broth,", color: "rgb(0, 0, 0)", fontWeight: "400" },
      { break: true },
      { text: "ramen noodles, chashu", color: "rgb(0, 0, 0)", fontWeight: "400" },
      { break: true },
      { text: "pork, soft-boiled egg,", color: "rgb(0, 0, 0)", fontWeight: "400" },
      { break: true },
      { text: "nori, scallions.", color: "rgb(0, 0, 0)", fontWeight: "400" },
    ];
  }

  if (text.startsWith("Salmon, tuna")) {
    return [
      { text: "Salmon, tuna & shrimp", color: "rgb(0, 0, 0)", fontWeight: "400" },
      { break: true },
      { text: "nigiri, maki rolls, sashimi,", color: "rgb(0, 0, 0)", fontWeight: "400" },
      { break: true },
      { text: "pickled ginger, wasabi.", color: "rgb(0, 0, 0)", fontWeight: "400" },
    ];
  }

  return layer.runs;
}

function getDisplayHotspot(section: Section, hotspot: Hotspot): Hotspot {
  if (section.id !== "dishes-1") return hotspot;
  return hotspot;
}

function isHeroNavImage(layer: ImageLayer) {
  return [HERO_NAV_BAR_SRC, HERO_LOGO_SRC, HERO_CTA_SRC, HERO_CTA_ARROW_SRC].includes(layer.src);
}

function layerText(layer: TextLayer) {
  return layer.runs.map((run) => run.text ?? "").join("").trim();
}

function isHeroNavText(layer: TextLayer) {
  return ["SAKURA", "RESTAURANT", "HOME", "MENU", "COMBOS", "ABOUT", "CONTACT", "ORDER NOW"].includes(layerText(layer));
}

function HeroTaglineCTA({
  onExploreMenu,
}: {
  onExploreMenu: () => void;
}) {
  return (
    <div className="sakura-hero-cta-card absolute z-30 pointer-events-auto select-none">
      {/* Desktop Layout View */}
      <div className="hidden min-[1025px]:flex flex-col text-left w-[450px]">
        <h2 className="text-7xl lg:text-[74px] font-black tracking-tight text-neutral-950 uppercase leading-[1.0]">
          Authentic <br />
          Japanese <br />
          <span className="text-[#e60012]">Dining.</span>
        </h2>

        <p className="text-lg text-neutral-700 font-medium leading-relaxed mt-5 max-w-[420px]">
          Fresh sashimi, handcrafted nigiri, and traditional seasonal dishes.
        </p>

        <div className="pt-7">
          <button
            type="button"
            onClick={onExploreMenu}
            className="inline-flex items-center gap-3 bg-neutral-950 hover:bg-[#e60012] text-white text-base font-bold tracking-[0.16em] uppercase px-9 py-4 rounded-full transition-all duration-300 cursor-pointer shadow-lg shadow-black/10 hover:shadow-red-600/30 hover:scale-105 active:scale-95"
          >
            <span>Explore Menu</span>
            <svg
              className="w-5 h-5 stroke-current stroke-2 fill-none"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tablet 2-Column Split Card View Matching tablet vie.png */}
      <div className="hidden md:flex min-[1025px]:hidden items-center justify-center gap-8 lg:gap-10 py-3 mx-auto">
        {/* Left Heading */}
        <div className="flex-shrink-0 text-left">
          <h2 className="text-4xl lg:text-[44px] font-black tracking-tighter text-neutral-950 uppercase leading-[0.88]">
            Authentic <br />
            Japanese <br />
            <span className="text-[#e60012]">Dining.</span>
          </h2>
        </div>

        {/* Center Vertical Separator */}
        <div className="w-[1.5px] h-24 bg-neutral-300 flex-shrink-0 self-center" />

        {/* Right Description & Button */}
        <div className="flex flex-col items-start gap-3.5 text-left max-w-[310px]">
          <p className="text-sm text-neutral-800 font-medium leading-snug">
            Fresh sashimi, handcrafted nigiri, and traditional seasonal dishes.
          </p>
          <button
            type="button"
            onClick={onExploreMenu}
            className="inline-flex items-center gap-2.5 bg-black hover:bg-[#e60012] text-white text-xs font-bold tracking-[0.16em] uppercase px-7 py-3 rounded-full transition-all duration-300 cursor-pointer shadow-[0_6px_18px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-95"
          >
            <span>Explore Menu</span>
            <span className="text-sm font-bold">→</span>
          </button>
        </div>
      </div>

      {/* Mobile Stacked Card View Matching mobile vie.png */}
      <div className="flex md:hidden flex-col items-start text-left w-full px-2 py-1 select-none">
        <h2 className="text-[34px] font-black tracking-tight text-neutral-950 uppercase leading-[0.90]">
          Authentic <br />
          Japanese <br />
          <span className="text-[#e60012]">Dining.</span>
        </h2>
        <p className="text-[13px] text-neutral-800 font-medium leading-snug mt-3 max-w-[270px]">
          Fresh sashimi, handcrafted nigiri, and traditional seasonal dishes.
        </p>
        <button
          type="button"
          onClick={onExploreMenu}
          className="inline-flex items-center gap-2.5 bg-black hover:bg-[#e60012] text-white text-xs font-bold tracking-[0.16em] uppercase px-6 py-3 rounded-full transition-all duration-300 cursor-pointer shadow-[0_6px_18px_rgba(0,0,0,0.35)] mt-4 active:scale-95"
        >
          <span>EXPLORE MENU</span>
          <span className="text-sm font-bold">→</span>
        </button>
      </div>
    </div>
  );
}

function ImageLayerView({
  layer,
  index,
  className = "",
  style = {},
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: {
  layer: ImageLayer;
  index: number;
  className?: string;
  style?: CSSProperties;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
  onPointerCancel?: (e: React.PointerEvent) => void;
}) {
  const isBackground = layer.src.includes("ba78b4a3") || layer.src.includes("bg.png");
  const isDishesBackground = (layer.src.includes("328fb685") || layer.src.includes("c2d746e5") || index === 0) && (layer.w >= 1200 || layer.cropW >= 1200);

  if (isBackground) {
    return (
      <div
        key={`img-${index}`}
        className="sakura-hero-responsive-bg absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
      >
        {/* Laptop / Desktop Background: Perfectly fitted 16:9 */}
        <img
          src="/sakura-assets/_assets/media/ba78b4a30520331745a674cd7d48884f.png"
          alt="Sakura Desktop Background"
          draggable={false}
          className="hidden min-[1025px]:block absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
        />

        {/* Tablet Background: Dedicated 1086x1448 image fitting tablet perfectly */}
        <img
          src="/sakura-assets/_assets/media/tab-bg.png"
          alt="Sakura Tablet Background"
          draggable={false}
          className="hidden min-[769px]:max-[1024px]:block absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
        />

        {/* Mobile Background: Dedicated 899x1750 image fitting phone perfectly */}
        <img
          src="/sakura-assets/_assets/media/mobile-bg.png"
          alt="Sakura Mobile Background"
          draggable={false}
          className="block max-[768px]:block min-[769px]:hidden absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
        />
      </div>
    );
  }

  if (isDishesBackground) {
    return (
      <div
        key={`img-${index}`}
        className="sakura-dishes-responsive-bg absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
      >
        <img
          src={layer.src}
          alt="Sakura Dishes Carousel Background"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
        />
      </div>
    );
  }

  return (
    <div
      key={`img-${index}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      className={`absolute overflow-hidden ${layerClass(layer)} ${className}`}
      style={{
        left: layer.x,
        top: layer.y,
        width: layer.w,
        height: layer.h,
        transform: layer.r ? `rotate(${layer.r}deg)` : undefined,
        transformOrigin: "top left",
        ...style,
      }}
    >
      <img
        src={layer.src}
        alt=""
        draggable={false}
        className="absolute select-none pointer-events-none"
        style={{ left: layer.cropX, top: layer.cropY, width: layer.cropW, height: layer.cropH }}
      />
    </div>
  );
}

function TextLayerView({
  layer,
  index,
  className = "",
  runs,
  style = {},
}: {
  layer: TextLayer;
  index: number;
  className?: string;
  runs?: TextRun[];
  style?: CSSProperties;
}) {
  const isCenteredHeroTitle = isHeroSushiTitle(layer);
  const displayRuns = runs ?? layer.runs;
  const heroTitleStyle: CSSProperties = isCenteredHeroTitle
      ? {
        left: HERO_TITLE_POSITION.x,
        top: HERO_TITLE_POSITION.y,
        width: HERO_TITLE_SIZE.width,
        height: HERO_TITLE_SIZE.height,
        fontSize: HERO_TITLE_SIZE.fontSize,
        lineHeight: HERO_TITLE_SIZE.lineHeight,
        textAlign: "center",
      }
    : {};

  return (
    <div
      key={`text-${index}`}
      className={`absolute ${className}`}
      style={{
        left: layer.x,
        top: layer.y,
        width: layer.w,
        height: layer.h,
        transform: layer.r ? `rotate(${layer.r}deg)` : undefined,
        transformOrigin: isCenteredHeroTitle ? "center center" : "top left",
        ...getTextStyle(layer),
        ...heroTitleStyle,
        ...style,
      }}
    >
      {displayRuns.map((run, runIndex) => run.break ? <br key={runIndex} /> : <span key={runIndex} style={{ color: run.color, fontWeight: run.fontWeight, fontStyle: run.fontStyle, textDecorationLine: run.textDecorationLine }}>{run.text}</span>)}
    </div>
  );
}

function AnimatedDishesText({
  layer,
  lines,
  visible,
  order,
  baseDelay = 0,
  className = "",
}: {
  layer: TextLayer;
  lines: string[];
  visible: boolean;
  order: "ltr" | "rtl";
  baseDelay?: number;
  className?: string;
}) {
  const chars = lines.flatMap((line, lineIndex) => [
    ...line.split("").map((char) => ({ char, lineBreak: false })),
    ...(lineIndex < lines.length - 1 ? [{ char: "", lineBreak: true }] : []),
  ]);
  const letterCount = chars.filter((item) => !item.lineBreak).length;
  let letterIndex = 0;

  return (
    <div
      className={`sakura-animated-copy absolute ${visible ? "is-visible" : "is-hidden"} ${className}`}
      style={{
        left: layer.x,
        top: layer.y,
        width: layer.w,
        height: layer.h,
        transform: layer.r ? `rotate(${layer.r}deg)` : undefined,
        transformOrigin: "top left",
        ...getTextStyle(layer),
      }}
      aria-hidden={!visible}
    >
      {chars.map((item, index) => {
        if (item.lineBreak) return <br key={`br-${index}`} />;

        const indexForDelay = letterIndex++;
        const visualOrder = order === "ltr" ? indexForDelay : letterCount - indexForDelay - 1;

        return (
          <span
            key={`${item.char}-${index}`}
            className="sakura-animated-letter"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transitionDelay: visible ? `${baseDelay + visualOrder * 8}ms` : "0ms",
              width: item.char === " " ? "0.34em" : undefined,
            }}
          >
            {item.char === " " ? "\u00a0" : item.char}
          </span>
        );
      })}
    </div>
  );
}

function hotspotNavId(hotspot: Hotspot) {
  if (hotspot.label === "Contact") return "contact";
  return hotspot.target;
}

function DesignStage({
  section,
  activeNav,
  setActiveNav,
  dishesPage,
  setDishesPage,
  isHeroRevealed,
}: {
  section: Section;
  activeNav: string;
  setActiveNav: (id: string) => void;
  dishesPage: DishesPage;
  setDishesPage: React.Dispatch<React.SetStateAction<DishesPage>>;
  isHeroRevealed: boolean;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isTransitioningRef = useRef(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (section.id !== "home" && section.id !== "dishes-1") return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      if (shellRef.current) {
        shellRef.current.style.setProperty("--mx", `${currentX.toFixed(4)}`);
        shellRef.current.style.setProperty("--my", `${currentY.toFixed(4)}`);
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [section.id]);

  const dishPositions = initialDishesDishPositions;
  const visibleImages = section.id === "home" ? section.images.filter((layer) => !isHeroNavImage(layer)) : section.images;
  const visibleTexts = section.id === "home" ? section.texts.filter((layer) => !isHeroNavText(layer)) : section.texts;
  const baseImages = section.id === "home" ? visibleImages.slice(0, 1) : visibleImages;
  const overlayImages = section.id === "home" ? visibleImages.slice(1) : [];
  const heroTitleTexts = section.id === "home" ? visibleTexts.filter(isHeroSushiTitle) : [];
  const foregroundTexts = section.id === "home" ? visibleTexts.filter((layer) => !isHeroSushiTitle(layer)) : visibleTexts;
  const stageSize = getStageSize(section);
  const stageRatio = stageSize.width / stageSize.height;
  const showDishesBaseOnly = section.id === "dishes-1";

  useLayoutEffect(() => {
    const updateScale = () => {
      const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
      const vh = typeof window !== "undefined" ? window.innerHeight : 900;
      const scaleX = vw / stageSize.width;
      const scaleY = vh / stageSize.height;
      const aspect = vw / Math.max(1, vh);

      if (section.id === "dishes-1") {
        if (vw <= 768) {
          setScale(Math.min(scaleX, scaleY) * 0.95);
        } else if (vw <= 1024) {
          setScale(Math.min(scaleX, scaleY) * 0.85);
        } else {
          setScale(Math.min(scaleX, scaleY) * 0.96);
        }
      } else {
        if (vw <= 768) {
          setScale(scaleX * 0.96);
        } else if (vw <= 1024 || aspect < 1.55) {
          setScale(Math.min(scaleX, scaleY) * 1.02);
        } else {
          setScale(Math.max(scaleX, scaleY));
        }
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [stageSize.width, stageSize.height]);

  const switchPage = (target: DishesPage) => {
    if (isTransitioningRef.current || dishesPage === target) return;
    isTransitioningRef.current = true;
    setDishesPage(target);

    if (target === "first") setActiveNav("dishes-1");
    else if (target === "second") setActiveNav("dishes-2");
    else if (target === "third") setActiveNav("dishes-3");

    if (sectionRef.current) {
      const topPos = sectionRef.current.offsetTop;
      if (Math.abs(window.scrollY - topPos) > 4) {
        smoothScrollTo(topPos);
      }
    }

    // Freeze all scrolling for the duration of the dish-swap transition —
    // regardless of input device (mouse wheel, trackpad, touchscreen drag,
    // keyboard) — so momentum/inertia from one gesture can't fight the
    // animation or queue up a second jump the instant it ends. Locking both
    // html and body covers iOS Safari's tendency to still rubber-band body
    // scroll when only the html element is locked.
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Matches .sakura-dish-swap's transform transition duration in globals.css
    // — keep them in sync so the lock doesn't release mid-animation.
    window.setTimeout(() => {
      isTransitioningRef.current = false;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }, 1900);
  };

  const navigateDishes = (direction: 1 | -1): boolean => {
    if (isTransitioningRef.current) return true;
    if (direction > 0) {
      if (dishesPage === "first" && canAdvanceDishesPage("first")) {
        switchPage("second");
        return true;
      }
      if (dishesPage === "second" && canAdvanceDishesPage("second")) {
        switchPage("third");
        return true;
      }
      return false;
    } else {
      if (dishesPage === "third") {
        switchPage("second");
        return true;
      }
      if (dishesPage === "second") {
        switchPage("first");
        return true;
      }
      return false;
    }
  };

  // Screen perfectly locked until all dishes explored, then smoothly unlocks to other sections
  useEffect(() => {
    if (!showDishesBaseOnly) return;

    let accumulatedDelta = 0;
    let wheelDebounceTimer: number | null = null;

    function onWheel(event: WheelEvent) {
      const element = sectionRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const inDishesFrame = dishesSectionCoverage(rect) >= 0.7;
      if (!inDishesFrame) return;

      const primaryDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(primaryDelta) < 3) return;

      const direction: 1 | -1 = primaryDelta > 0 ? 1 : -1;

      // Lock all scroll momentum while dishes are actively transitioning
      if (isTransitioningRef.current) {
        event.preventDefault();
        return;
      }

      // If scrolling DOWN and not yet at the final reachable pair: lock and step carousel
      if (direction > 0 && canAdvanceDishesPage(dishesPage)) {
        event.preventDefault();
        accumulatedDelta += primaryDelta;
        if (wheelDebounceTimer) window.clearTimeout(wheelDebounceTimer);
        wheelDebounceTimer = window.setTimeout(() => {
          accumulatedDelta = 0;
        }, 220);

        if (accumulatedDelta >= 70) {
          accumulatedDelta = 0;
          navigateDishes(1);
        }
        return;
      }

      // If scrolling UP and not yet at the start pair (Pair 1): lock and step carousel back
      if (direction < 0 && dishesPage !== "first") {
        event.preventDefault();
        accumulatedDelta += primaryDelta;
        if (wheelDebounceTimer) window.clearTimeout(wheelDebounceTimer);
        wheelDebounceTimer = window.setTimeout(() => {
          accumulatedDelta = 0;
        }, 220);

        if (accumulatedDelta <= -70) {
          accumulatedDelta = 0;
          navigateDishes(-1);
        }
        return;
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      const element = sectionRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const inDishesFrame = dishesSectionCoverage(rect) >= 0.7;
      if (!inDishesFrame) return;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        if (canAdvanceDishesPage(dishesPage)) {
          if (navigateDishes(1)) event.preventDefault();
        } else {
          scrollToSection("aevum-footer");
        }
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        if (dishesPage !== "first") {
          if (navigateDishes(-1)) event.preventDefault();
        } else {
          scrollToSection("home");
        }
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (wheelDebounceTimer) window.clearTimeout(wheelDebounceTimer);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dishesPage, showDishesBaseOnly]);

  const handleTouchStart = (e: React.TouchEvent | React.PointerEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
  };

  const handleTouchEnd = (e: React.TouchEvent | React.PointerEvent) => {
    if (!touchStartRef.current) return;
    const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
    const deltaX = clientX - touchStartRef.current.x;
    const deltaY = clientY - touchStartRef.current.y;
    const elapsed = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    if (elapsed > 800) return;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        if (canAdvanceDishesPage(dishesPage)) navigateDishes(1);
        else scrollToSection("aevum-footer");
      } else {
        if (dishesPage !== "first") navigateDishes(-1);
        else scrollToSection("home");
      }
    } else if (Math.abs(deltaY) > 45) {
      if (deltaY < 0) {
        if (canAdvanceDishesPage(dishesPage)) navigateDishes(1);
        else scrollToSection("aevum-footer");
      } else {
        if (dishesPage !== "first") navigateDishes(-1);
        else scrollToSection("home");
      }
    }
  };

  const showFirstDishes = dishesPage === "first";
  const showSecondDishes = dishesPage === "second";
  const showThirdDishes = dishesPage === "third";
  const topNumberLayer = getDishesTextTemplate(section, "01.");
  const topTitleLayer = getDishesTextTemplate(section, "Tonkotsu Ramen");
  const topDescriptionLayer = getDishesTextTemplate(section, "Rich pork-bone broth,ramen noodles, chashupork, soft-boiled egg,nori, scallions.");
  const bottomNumberLayer = getDishesTextTemplate(section, "02.");
  const bottomTitleLayer = getDishesTextTemplate(section, "Sushi Platter");
  const bottomDescriptionLayer = getDishesTextTemplate(section, "Salmon, tuna & shrimpnigiri, maki rolls, sashimi,pickled ginger, wasabi.");
  const ramenBaseLayer = baseImages.find((layer) => dishesDishKey(layer) === "ramen");
  const sushiBaseLayer = baseImages.find((layer) => dishesDishKey(layer) === "sushi");
  const ramenLayer = ramenBaseLayer ? { ...getDisplayImageLayer(section, ramenBaseLayer, 0), x: dishPositions.ramen.x, y: dishPositions.ramen.y } : makeDishLayer(DISHES_RAMEN_HQ_SRC, dishPositions.ramen.x, dishPositions.ramen.y, 640, 536);
  const sushiLayer = sushiBaseLayer ? { ...getDisplayImageLayer(section, sushiBaseLayer, 0), x: dishPositions.sushi.x, y: dishPositions.sushi.y } : makeDishLayer(DISHES_SUSHI_PLATTER_HQ_SRC, dishPositions.sushi.x, dishPositions.sushi.y, 700, 520);
  const udonLayer = makeDishLayer(DISHES_UDON_HQ_SRC, dishPositions.udon.x, dishPositions.udon.y, 640, 626);
  const tempuraLayer = makeDishLayer(DISHES_TEMPURA_HQ_SRC, dishPositions.tempura.x, dishPositions.tempura.y, 640, 590);
  const yakitoriLayer = makeDishLayer(DISHES_YAKITORI_HQ_SRC, dishPositions.yakitori.x, dishPositions.yakitori.y, 650, 488);
  const okonomiyakiLayer = makeDishLayer(DISHES_OKONOMIYAKI_HQ_SRC, dishPositions.okonomiyaki.x, dishPositions.okonomiyaki.y, 610, 570);

  return (
    <section
      ref={sectionRef}
      id={section.id}
      aria-label={section.label}
      className={`sakura-section relative w-full overflow-hidden ${section.id === "dishes-1" ? "sakura-dishes-section" : ""}`}
      style={{ scrollMarginTop: 0 }}
      onTouchStart={showDishesBaseOnly ? handleTouchStart : undefined}
      onTouchEnd={showDishesBaseOnly ? handleTouchEnd : undefined}
      onPointerDown={showDishesBaseOnly ? handleTouchStart : undefined}
      onPointerUp={showDishesBaseOnly ? handleTouchEnd : undefined}
    >
      {section.id === "home" && (
        <SakuraHeroAtmosphere
          isRevealed={isHeroRevealed}
          onExploreScroll={() => {
            setActiveNav("dishes-1");
            setDishesPage("first");
            scrollToSection("dishes-1");
          }}
        />
      )}
      {section.id === "dishes-1" && (
        <div className="sakura-dishes-clean-bg absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
          <img
            src="/sakura-assets/_assets/media/dishes-clean-bg.png"
            alt="Sakura Dishes Background"
            className="w-full h-full object-cover object-center select-none"
            draggable={false}
          />
        </div>
      )}
      <div
        ref={shellRef}
        className="sakura-stage-shell relative mx-auto w-full h-full flex items-center justify-center overflow-hidden"
      >
        <div
          data-stage-width={stageSize.width}
          className={`absolute ${section.id === "home" || section.id === "dishes-1" ? "overflow-visible" : "overflow-hidden"}`}
          style={{
            width: stageSize.width,
            height: stageSize.height,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            left: "50%",
            top: "50%",
            marginLeft: -stageSize.width / 2,
            marginTop: -stageSize.height / 2,
          }}
        >
          {showDishesBaseOnly ? (
            <>
              <div
                aria-hidden="true"
                className="sakura-dishes-band sakura-dishes-band-top"
                style={{ left: initialDishesCornerPositions.top.x, top: initialDishesCornerPositions.top.y }}
              />
              <div
                aria-hidden="true"
                className="sakura-dishes-band sakura-dishes-band-bottom"
                style={{ left: initialDishesCornerPositions.bottom.x, top: initialDishesCornerPositions.bottom.y }}
              />
              {baseImages
                .map((layer, index) => ({ layer, index }))
                .filter(({ layer, index }) => index > 0 && !isDishesBlackBlock(layer) && !isDishesStrayShadow(layer) && !dishesDishKey(layer))
                .map(({ layer, index }) => {
                  return (
                    <ImageLayerView
                      key={`dishes-static-img-${index}`}
                      layer={getDisplayImageLayer(section, layer, index)}
                      index={index}
                    />
                  );
                })}
              {baseImages
                .map((layer, index) => ({ layer, index }))
                .filter(({ layer, index }) => index > 0 && !isDishesBlackBlock(layer) && dishesDishKey(layer))
                .map(({ layer, index }) => {
                  // Sushi Platter's final position is locked in via
                  // initialDishesDishPositions.sushi — it no longer follows
                  // the drag tool (that's now on the Tempura dish, frame 2).
                  const dishKey = dishesDishKey(layer);
                  const displayLayer = getDisplayImageLayer(section, layer, index);
                  const positionedLayer = dishKey
                    ? { ...displayLayer, x: dishPositions[dishKey].x, y: dishPositions[dishKey].y }
                    : displayLayer;
                  const route = dishKey === "ramen" ? "top" : "bottom";
                  const dragId = dishKey === "ramen" ? "dishes-ramen-dish" : "dishes-platter-dish";
                  const dragLabel = dishKey === "ramen" ? "Tonkotsu Ramen" : "Sushi Platter";

                  return (
                    <MobileDraggableWrapper key={`dishes-img-${index}`} id={dragId} label={dragLabel}>
                      <ImageLayerView
                        layer={positionedLayer}
                        index={index}
                        className={dishKey ? `sakura-dish-swap sakura-dish-top ${route === "bottom" ? "sakura-dish-bottom" : ""} ${showFirstDishes ? "is-home" : "is-away"}` : ""}
                      />
                    </MobileDraggableWrapper>
                  );
                })}
              <MobileDraggableWrapper id="dishes-udon-dish" label="Udon Bowl">
                <ImageLayerView
                  layer={udonLayer}
                  index={90}
                  className={`sakura-dish-swap sakura-dish-top ${showSecondDishes ? "is-home" : "is-away"}`}
                />
              </MobileDraggableWrapper>
              <MobileDraggableWrapper id="dishes-tempura-dish" label="Tempura Plate">
                <ImageLayerView
                  layer={tempuraLayer}
                  index={91}
                  className={`sakura-dish-swap sakura-dish-bottom ${showSecondDishes ? "is-home" : "is-away"}`}
                />
              </MobileDraggableWrapper>
              <MobileDraggableWrapper id="dishes-yakitori-dish" label="Yakitori Skewers">
                <ImageLayerView
                  layer={yakitoriLayer}
                  index={92}
                  className={`sakura-dish-swap sakura-dish-top ${showThirdDishes ? "is-home" : "is-away"}`}
                  style={showThirdDishes ? {
                    transform: "translate3d(calc(var(--mx, 0) * 32px), calc(var(--my, 0) * 24px), 0)",
                    willChange: "transform",
                  } : undefined}
                />
              </MobileDraggableWrapper>
              <MobileDraggableWrapper id="dishes-okonomiyaki-dish" label="Okonomiyaki Dish">
                <ImageLayerView
                  layer={okonomiyakiLayer}
                  index={93}
                  className={`sakura-dish-swap sakura-dish-bottom ${showThirdDishes ? "is-home" : "is-away"}`}
                  style={showThirdDishes ? {
                    transform: "translate3d(calc(var(--mx, 0) * -24px), calc(var(--my, 0) * -18px), 0)",
                    willChange: "transform",
                  } : undefined}
                />
              </MobileDraggableWrapper>
              {foregroundTexts
                .filter((layer) => layerText(layer) === "TopDishes")
                .map((layer, index) => {
                  const displayLayer = getDisplayTextLayer(section, layer);
                  return (
                    <TextLayerView
                      key={`dishes-static-text-${index}`}
                      layer={displayLayer}
                      index={index}
                      runs={getDishesTextRuns(layer)}
                    />
                  );
                })}
              <MobileDraggableWrapper id="dishes-top-card" label="Top Dish Info">
                <div className="sakura-dishes-top-card-wrap">
                  <AnimatedDishesText layer={topNumberLayer} lines={[dishesCopy.first.top.number]} visible={showFirstDishes} order="ltr" baseDelay={0} />
                  <AnimatedDishesText layer={topTitleLayer} lines={[dishesCopy.first.top.title]} visible={showFirstDishes} order="ltr" baseDelay={0} />
                  <AnimatedDishesText layer={topDescriptionLayer} lines={dishesCopy.first.top.description} visible={showFirstDishes} order="rtl" baseDelay={0} />
                  <AnimatedDishesText layer={topNumberLayer} lines={[dishesCopy.second.top.number]} visible={showSecondDishes} order="rtl" baseDelay={0} className="sakura-copy-next" />
                  <AnimatedDishesText layer={topTitleLayer} lines={[dishesCopy.second.top.title]} visible={showSecondDishes} order="rtl" baseDelay={0} className="sakura-copy-next" />
                  <AnimatedDishesText layer={topDescriptionLayer} lines={dishesCopy.second.top.description} visible={showSecondDishes} order="ltr" baseDelay={0} className="sakura-copy-next" />
                  <AnimatedDishesText layer={topNumberLayer} lines={[dishesCopy.third.top.number]} visible={showThirdDishes} order="rtl" baseDelay={0} className="sakura-copy-next" />
                  <AnimatedDishesText layer={topTitleLayer} lines={[dishesCopy.third.top.title]} visible={showThirdDishes} order="rtl" baseDelay={0} className="sakura-copy-next" />
                  <AnimatedDishesText layer={topDescriptionLayer} lines={dishesCopy.third.top.description} visible={showThirdDishes} order="ltr" baseDelay={0} className="sakura-copy-next" />
                </div>
              </MobileDraggableWrapper>

              <MobileDraggableWrapper id="dishes-bottom-card" label="Bottom Dish Info">
                <div className="sakura-dishes-bottom-card-wrap">
                  <AnimatedDishesText layer={bottomNumberLayer} lines={[dishesCopy.first.bottom.number]} visible={showFirstDishes} order="ltr" baseDelay={0} />
                  <AnimatedDishesText layer={bottomTitleLayer} lines={[dishesCopy.first.bottom.title]} visible={showFirstDishes} order="ltr" baseDelay={0} />
                  <AnimatedDishesText layer={bottomDescriptionLayer} lines={dishesCopy.first.bottom.description} visible={showFirstDishes} order="rtl" baseDelay={0} />
                  <AnimatedDishesText layer={bottomNumberLayer} lines={[dishesCopy.second.bottom.number]} visible={showSecondDishes} order="rtl" baseDelay={0} className="sakura-copy-next" />
                  <AnimatedDishesText layer={bottomTitleLayer} lines={[dishesCopy.second.bottom.title]} visible={showSecondDishes} order="rtl" baseDelay={0} className="sakura-copy-next" />
                  <AnimatedDishesText layer={bottomDescriptionLayer} lines={dishesCopy.second.bottom.description} visible={showSecondDishes} order="ltr" baseDelay={0} className="sakura-copy-next" />
                  <AnimatedDishesText layer={bottomNumberLayer} lines={[dishesCopy.third.bottom.number]} visible={showThirdDishes} order="rtl" baseDelay={0} className="sakura-copy-next" />
                  <AnimatedDishesText layer={bottomTitleLayer} lines={[dishesCopy.third.bottom.title]} visible={showThirdDishes} order="rtl" baseDelay={0} className="sakura-copy-next" />
                  <AnimatedDishesText layer={bottomDescriptionLayer} lines={dishesCopy.third.bottom.description} visible={showThirdDishes} order="ltr" baseDelay={0} className="sakura-copy-next" />
                </div>
              </MobileDraggableWrapper>

              <SakuraDishesEffects
                page={dishesPage}
                onSelectPage={(newPage) => setDishesPage(newPage)}
              />

              <div className="sakura-hidden-dishes-content" aria-hidden="true">
                {section.hotspots.map((hotspot) => {
                  const displayHotspot = getDisplayHotspot(section, hotspot);
                  return (
                    <button
                      key={`hidden-${hotspot.label}`}
                      type="button"
                      tabIndex={-1}
                      aria-label={hotspot.label}
                      className="sakura-hotspot absolute cursor-pointer rounded-full outline-none transition duration-300 hover:bg-white/10 focus-visible:ring-4 focus-visible:ring-white/70"
                      style={{ left: displayHotspot.x, top: displayHotspot.y, width: displayHotspot.w, height: displayHotspot.h }}
                      onClick={() => {
                        const navId = hotspotNavId(hotspot);
                        setActiveNav(navId);
                        if (navId === "dishes-1") switchPage("first");
                        else if (navId === "dishes-2") switchPage("second");
                        else if (navId === "dishes-3") switchPage("third");
                        scrollToSection(safeScrollTarget(hotspot.target));
                      }}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {baseImages.map((layer, index) => (
                <ImageLayerView
                  key={`base-img-${index}`}
                  layer={getDisplayImageLayer(section, layer, index)}
                  index={index}
                />
              ))}
              {heroTitleTexts.map((layer, index) => (
                <div
                  key={`hero-title-wrap-${index}`}
                  className="absolute inset-0 pointer-events-none"
                >
                  <MobileDraggableWrapper id="hero-title" label="SAKURA Title" className="pointer-events-auto">
                    <TextLayerView
                      key={`hero-title-${index}`}
                      layer={getDisplayTextLayer(section, layer)}
                      index={index}
                      className={`sakura-hero-title ${isHeroRevealed ? "hero-animate-title" : "opacity-0"}`}
                    />
                  </MobileDraggableWrapper>
                </div>
              ))}
              {overlayImages.map((layer, index) => {
                const isPlatter = index === overlayImages.length - 1 || layer.src.includes("2cccb1d8") || layer.src.includes("sushi-platter");
                const isFloating1 = index === 1;
                const isFloating2 = index === 2;
                const isFloating3 = index === 3;

                let animationClass = isHeroRevealed ? "" : "opacity-0";
                let parallaxStyle: CSSProperties = {};

                if (isHeroRevealed) {
                  if (isPlatter) {
                    animationClass = "hero-animate-platter";
                    parallaxStyle = {
                      transform: "translate3d(calc(var(--mx, 0) * 24px), calc(var(--my, 0) * 18px), 0)",
                      transformOrigin: "center center",
                    };
                  } else if (isFloating1) {
                    animationClass = "hero-floating-1";
                    parallaxStyle = {
                      transform: "translate3d(calc(var(--mx, 0) * 38px), calc(var(--my, 0) * 28px), 0)",
                    };
                  } else if (isFloating2) {
                    animationClass = "hero-floating-2";
                    parallaxStyle = {
                      transform: "translate3d(calc(var(--mx, 0) * -32px), calc(var(--my, 0) * -24px), 0)",
                    };
                  } else if (isFloating3) {
                    animationClass = "hero-floating-3";
                    parallaxStyle = {
                      transform: "translate3d(calc(var(--mx, 0) * 42px), calc(var(--my, 0) * 32px), 0)",
                    };
                  } else {
                    parallaxStyle = {
                      transform: "translate3d(calc(var(--mx, 0) * -6px), calc(var(--my, 0) * -4px), 0)",
                    };
                  }
                }

                if (isPlatter) {
                  return (
                    <MobileDraggableWrapper key={`overlay-img-${index}`} id="hero-sushi-platter" label="Hero Sushi Platter">
                      <ImageLayerView
                        layer={getDisplayImageLayer(section, layer, index + baseImages.length)}
                        index={index + baseImages.length}
                        className={animationClass}
                        style={parallaxStyle}
                      />
                    </MobileDraggableWrapper>
                  );
                }

                return (
                  <ImageLayerView
                    key={`overlay-img-${index}`}
                    layer={getDisplayImageLayer(section, layer, index + baseImages.length)}
                    index={index + baseImages.length}
                    className={animationClass}
                    style={parallaxStyle}
                  />
                );
              })}
              {foregroundTexts.map((layer, index) => (
                <TextLayerView
                  key={`text-${index}`}
                  layer={getDisplayTextLayer(section, layer)}
                  index={index}
                />
              ))}
              {section.id === "home" && (
                <div
                  className={isHeroRevealed ? "hero-animate-tagline" : "opacity-0"}
                  style={{
                    transform: isHeroRevealed ? "translate3d(calc(var(--mx, 0) * 12px), calc(var(--my, 0) * 10px), 0)" : undefined,
                  }}
                >
                  <MobileDraggableWrapper id="hero-cta-button" label="Explore Menu CTA Card">
                    <HeroTaglineCTA
                      onExploreMenu={() => {
                        setActiveNav("dishes-1");
                        setDishesPage("first");
                        scrollToSection("dishes-1");
                      }}
                    />
                  </MobileDraggableWrapper>
                </div>
              )}
            </>
          )}
          {!showDishesBaseOnly && section.id !== "home" ? section.hotspots.map((hotspot) => {
            const displayHotspot = getDisplayHotspot(section, hotspot);
            return (
            <button
              key={hotspot.label}
              type="button"
              aria-label={hotspot.label}
              className={`sakura-hotspot absolute cursor-pointer rounded-full outline-none transition duration-300 hover:bg-white/10 focus-visible:ring-4 focus-visible:ring-white/70 ${hotspot.label === "Order Now" ? "sakura-cta-hotspot" : ""}`}
              style={{ left: displayHotspot.x, top: displayHotspot.y, width: displayHotspot.w, height: displayHotspot.h }}
              onClick={() => {
                setActiveNav(hotspotNavId(hotspot));
                scrollToSection(safeScrollTarget(hotspot.target));
              }}
            />
          )}) : null}
        </div>
      </div>
    </section>
  );
}

// Mobile-only hero and dishes layouts. The desktop/tablet views above render
// a fixed 16:9 canvas and scale it down to fit any viewport via a CSS
// transform — great for wide screens, but on a tall narrow phone that same
// transform shrinks EVERYTHING (including text/buttons that already have
// their own mobile-tailored styles) down to a tiny strip in the middle of
// the screen, since the transform can't tell the difference between a
// background and a button. So instead of reusing that scaled canvas, these
// two components build the mobile composition directly with normal
// percentage-based CSS inside a locked 9:16 box (same fixed-aspect-canvas
// idea as the desktop 16:9 stage, just portrait) — mirroring how the AEVUM
// project's MobileOurWorkSection is a separate hand-laid-out component
// rather than a scaled-down copy of its desktop counterpart.
function MobileHeroSection({ onExploreMenu }: { onExploreMenu: () => void }) {
  return (
    <div className="relative w-full h-dvh md:hidden flex items-center justify-center overflow-hidden bg-[#f1dfcf]">
      <div className="relative mx-auto h-full max-h-dvh w-full max-w-[56.25dvh] aspect-[9/16] overflow-hidden">
        <img
          src="/sakura-assets/_assets/media/mobile-bg.png"
          alt="Sakura Hero Background"
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none select-none"
          draggable={false}
        />

        <div className="absolute left-[6%] top-[9%] z-20 whitespace-nowrap rounded-sm bg-white px-[4%] py-[1.6%] text-[4vw] font-bold shadow-[0_6px_16px_rgba(0,0,0,0.15)]">
          <span className="text-black">最高の</span>
          <span className="text-[#e60012]">寿司</span>
          <span className="text-black">盛り合わせ</span>
        </div>

        <div className="absolute right-[5%] top-[7.5%] z-10 flex flex-col items-center gap-[1%] rounded-md border border-[#e60012]/70 px-[2.4%] py-[3%]">
          {["極", "上", "鮨", "処"].map((ch) => (
            <span key={ch} className="text-[3.6vw] font-bold leading-none text-[#e60012]">
              {ch}
            </span>
          ))}
        </div>
        <div className="absolute right-[5%] top-[21%] z-10 text-[2.5vw] font-semibold tracking-[0.25em] text-neutral-500">
          EST. 1988
        </div>

        <h1
          className="pointer-events-none absolute left-1/2 top-[33%] z-0 w-full -translate-x-1/2 -translate-y-1/2 select-none text-center uppercase text-black"
          style={{ fontFamily: "YAEzv44m-7M_0, sans-serif", fontWeight: 400, fontSize: "34.5vw", lineHeight: 0.82 }}
        >
          SUSHI
        </h1>

        <img
          src={MOBILE_HERO_SUSHI_PLATTER_SRC}
          alt="Sakura sushi platter"
          className="pointer-events-none absolute left-1/2 top-[45%] z-10 w-[92%] -translate-x-1/2 -translate-y-1/2 select-none object-contain"
          draggable={false}
        />

        <div className="absolute inset-x-0 top-[68%] z-20 px-[7%] text-left">
          <h2 className="text-[7.6vw] font-black uppercase leading-[0.9] tracking-tight text-neutral-950">
            Authentic <br />
            Japanese <br />
            <span className="text-[#e60012]">Dining.</span>
          </h2>
          <p className="mt-[3%] max-w-[85%] text-[3.2vw] font-medium leading-snug text-neutral-800">
            Fresh sashimi, handcrafted nigiri, and traditional seasonal dishes.
          </p>
          <button
            type="button"
            onClick={onExploreMenu}
            className="mt-[3.5%] inline-flex items-center gap-2.5 rounded-full bg-black px-[6%] py-[2.6%] text-[3vw] font-bold uppercase tracking-[0.16em] text-white shadow-[0_6px_18px_rgba(0,0,0,0.35)] active:scale-95"
          >
            <span>Explore Menu</span>
            <span className="text-[3.4vw] font-bold">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Final mobile layout — percentages of the box's own rendered size, plus a
// uniform CSS transform `scale` per item, both tuned interactively via the
// (now removed) Canva-style drag/resize tool and reported back as final
// coordinates. Bands are shared across all 3 dish pairs; dish image/text
// slots keep the same position for every pair, only their content swaps.
const MOBILE_DISHES_LAYOUT = {
  bandTop: { x: 72.4, y: 17.4, scale: 1.25 },
  bandBottom: { x: 29.8, y: 75.4, scale: 1.28 },
  headingText: { x: 4.7, y: 16, scale: 1.77 },
  dishTopImage: { x: 47.4, y: 22.2, scale: 1.23 },
  dishTopText: { x: 2.5, y: 40, scale: 0.94 },
  dishBottomImage: { x: 2.5, y: 60.1, scale: 1.28 },
  dishBottomText: { x: 50, y: 60.8, scale: 1 },
} as const;

const MOBILE_DISHES_BASE_SIZE: Record<keyof typeof MOBILE_DISHES_LAYOUT, { width: string; height?: string }> = {
  bandTop: { width: "60%", height: "16%" },
  bandBottom: { width: "60%", height: "16%" },
  dishTopImage: { width: "48%" },
  dishBottomImage: { width: "48%" },
  headingText: { width: "auto" },
  dishTopText: { width: "88%" },
  dishBottomText: { width: "46%" },
};

function mobilePositioned(id: keyof typeof MOBILE_DISHES_LAYOUT): CSSProperties {
  const item = MOBILE_DISHES_LAYOUT[id];
  const base = MOBILE_DISHES_BASE_SIZE[id];
  return { position: "absolute", left: `${item.x}%`, top: `${item.y}%`, width: base.width, height: base.height, transform: `scale(${item.scale})`, transformOrigin: "top left" };
}

function MobileDishesSection({
  dishesPage,
  setDishesPage,
}: {
  dishesPage: DishesPage;
  setDishesPage: React.Dispatch<React.SetStateAction<DishesPage>>;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef(false);

  const pairs = [
    { page: "first" as const, topSrc: DISHES_RAMEN_HQ_SRC, bottomSrc: DISHES_SUSHI_PLATTER_HQ_SRC, top: dishesCopy.first.top, bottom: dishesCopy.first.bottom },
    { page: "second" as const, topSrc: DISHES_UDON_HQ_SRC, bottomSrc: DISHES_TEMPURA_HQ_SRC, top: dishesCopy.second.top, bottom: dishesCopy.second.bottom },
    { page: "third" as const, topSrc: DISHES_YAKITORI_HQ_SRC, bottomSrc: DISHES_OKONOMIYAKI_HQ_SRC, top: dishesCopy.third.top, bottom: dishesCopy.third.bottom },
  ];
  const active = pairs.find((p) => p.page === dishesPage) ?? pairs[0];

  // Entering the section scrolls through it completely normally — nothing
  // is hijacked until it's FULLY in view. Once fully visible, scrolling
  // steps through the 3 dish pairs in place (short lock, matching the
  // in-place fade); only past the last pair does a further scroll leave for
  // the footer (or back up to the hero from the first pair), using the same
  // eased scroll + whole-page lock as desktop.
  useEffect(() => {
    let accumulatedDelta = 0;
    let wheelDebounceTimer: number | null = null;
    let touchStart: { x: number; y: number; time: number } | null = null;

    function goToSection(id: string) {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      const el = document.getElementById(id);
      if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      window.setTimeout(() => {
        isTransitioningRef.current = false;
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }, 2400);
    }

    function switchFrame(target: DishesPage) {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setDishesPage(target);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      window.setTimeout(() => {
        isTransitioningRef.current = false;
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }, 600);
    }

    function onWheel(event: WheelEvent) {
      const box = boxRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      if (dishesSectionCoverage(rect) < 0.99) return;

      const primaryDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(primaryDelta) < 3) return;
      const direction: 1 | -1 = primaryDelta > 0 ? 1 : -1;

      if (isTransitioningRef.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      accumulatedDelta += primaryDelta;
      if (wheelDebounceTimer) window.clearTimeout(wheelDebounceTimer);
      wheelDebounceTimer = window.setTimeout(() => {
        accumulatedDelta = 0;
      }, 220);

      if (direction > 0 && accumulatedDelta >= 70) {
        accumulatedDelta = 0;
        if (canAdvanceDishesPage(dishesPage)) switchFrame(dishesPage === "first" ? "second" : "third");
        else goToSection("aevum-footer");
      } else if (direction < 0 && accumulatedDelta <= -70) {
        accumulatedDelta = 0;
        if (dishesPage !== "first") switchFrame(dishesPage === "third" ? "second" : "first");
        else goToSection("home");
      }
    }

    function onTouchStart(e: TouchEvent) {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
    }
    function onTouchEnd(e: TouchEvent) {
      if (!touchStart) return;
      const box = boxRef.current;
      const start = touchStart;
      touchStart = null;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      if (dishesSectionCoverage(rect) < 0.99) return;

      const dy = e.changedTouches[0].clientY - start.y;
      const dx = e.changedTouches[0].clientX - start.x;
      const elapsed = Date.now() - start.time;
      if (elapsed > 800 || Math.abs(dy) < 45 || Math.abs(dy) < Math.abs(dx)) return;
      if (dy < 0) {
        if (canAdvanceDishesPage(dishesPage)) switchFrame(dishesPage === "first" ? "second" : "third");
        else goToSection("aevum-footer");
      } else {
        if (dishesPage !== "first") switchFrame(dishesPage === "third" ? "second" : "first");
        else goToSection("home");
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      if (wheelDebounceTimer) window.clearTimeout(wheelDebounceTimer);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [dishesPage, setDishesPage]);

  return (
    <div className="relative w-full h-dvh md:hidden flex items-center justify-center overflow-hidden bg-[#f1dfcf]">
      <div ref={boxRef} className="relative mx-auto h-full max-h-dvh w-full max-w-[56.25dvh] aspect-[9/16] overflow-hidden">
        <img
          src="/sakura-assets/_assets/media/dishes-clean-bg.png"
          alt="Sakura Dishes Background"
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none select-none"
          draggable={false}
        />

        <div style={mobilePositioned("bandTop")} className="z-[5]">
          <div className="h-full w-full bg-black" style={{ transform: "rotate(-32deg)" }} />
        </div>
        <div style={mobilePositioned("bandBottom")} className="z-[5]">
          <div className="h-full w-full bg-black" style={{ transform: "rotate(-32deg)" }} />
        </div>

        <h2
          style={mobilePositioned("headingText")}
          className="z-10 select-none whitespace-nowrap uppercase leading-[0.95] text-black"
        >
          <span style={{ fontFamily: "YAEzv44m-7M_0, sans-serif", fontWeight: 400, fontSize: "12.5vw" }}>
            Top
            <br />
            Dishes
          </span>
        </h2>

        <img key={`${active.page}-top-img`} src={active.topSrc} alt={active.top.title} style={mobilePositioned("dishTopImage")} className="sakura-mobile-dish-fade z-10 select-none object-contain" draggable={false} />
        <div key={`${active.page}-top-text`} style={mobilePositioned("dishTopText")} className="sakura-mobile-dish-fade z-10 select-none text-left">
          <div className="text-[5.6vw] font-black leading-tight text-black">{active.top.number}</div>
          <div className="text-[5.6vw] font-black uppercase leading-tight text-black">{active.top.title}</div>
        </div>

        <img key={`${active.page}-bottom-img`} src={active.bottomSrc} alt={active.bottom.title} style={mobilePositioned("dishBottomImage")} className="sakura-mobile-dish-fade z-10 select-none object-contain" draggable={false} />
        <div key={`${active.page}-bottom-text`} style={mobilePositioned("dishBottomText")} className="sakura-mobile-dish-fade z-10 select-none text-left">
          <div className="text-[5.6vw] font-black leading-tight text-black">{active.bottom.number}</div>
          <div className="text-[5.6vw] font-black uppercase leading-tight text-black">{active.bottom.title}</div>
        </div>
      </div>
    </div>
  );
}

export default function SakuraExperience() {
  const [activeNav, setActiveNav] = useState("home");
  const [dishesPage, setDishesPage] = useState<DishesPage>("first");
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(true);
  const [isLoadingActive, setIsLoadingActive] = useState(true);
  const [isHeroRevealed, setIsHeroRevealed] = useState(false);

  useEffect(() => {
    // Disable browser automatic scroll restoration to ensure fresh start at Hero
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);

      // Clear any URL hashes that might jump down the page
      if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname);
      }

      // Always trigger loading screen on every fresh mount / refresh
      setIsLoadingActive(true);
      setIsHeroRevealed(false);

      const handleBeforeUnload = () => {
        window.scrollTo(0, 0);
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, []);

  const handleDisclaimerAccept = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    setIsDisclaimerAccepted(true);
    setIsLoadingActive(true);
  };

  const handleLoadingComplete = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    setIsLoadingActive(false);
    setIsHeroRevealed(true);
  };

  useEffect(() => {
    function updateActiveSection() {
      const viewportAnchor = window.innerHeight * 0.42;
      let next = sections[0].id;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= viewportAnchor) next = section.id;
      }

      if (next === "dishes-1") {
        if (dishesPage === "first") next = "dishes-1";
        else if (dishesPage === "second") next = "dishes-2";
        else if (dishesPage === "third") next = "dishes-3";
      }

      setActiveNav(next);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [dishesPage]);

  return (
    <main className="w-full bg-[#f1dfcf]">
      {!isDisclaimerAccepted && (
        <AevumDisclaimerGate onAccept={handleDisclaimerAccept} />
      )}
      {isLoadingActive && (
        <AevumLoadingScreen onComplete={handleLoadingComplete} />
      )}
      <SakuraNavbar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        dishesPage={dishesPage}
        setDishesPage={setDishesPage}
      />
      {sections.filter((section) => renderedSectionIds.has(section.id)).map((section) => (
        <div key={section.id} id={section.id}>
          <div className="hidden md:block h-full w-full">
            <DesignStage
              section={section}
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              dishesPage={dishesPage}
              setDishesPage={setDishesPage}
              isHeroRevealed={isHeroRevealed}
            />
          </div>
          {section.id === "home" && (
            <MobileHeroSection
              onExploreMenu={() => {
                setActiveNav("dishes-1");
                setDishesPage("first");
                scrollToSection("dishes-1");
              }}
            />
          )}
          {section.id === "dishes-1" && (
            <MobileDishesSection dishesPage={dishesPage} setDishesPage={setDishesPage} />
          )}
        </div>
      ))}
      <SakuraZenAudio />
      <AevumAgencyFooter />
    </main>
  );
}

