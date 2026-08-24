"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type TextRun = { text?: string; break?: true; color?: string; fontWeight?: string; fontStyle?: string; textDecorationLine?: string };
type TextLayer = { x: number; y: number; w: number; h: number; r: number; runs: TextRun[]; style: CSSProperties & { fontSize?: number; lineHeight?: number } };
type ImageLayer = { x: number; y: number; w: number; h: number; r: number; src: string; cropX: number; cropY: number; cropW: number; cropH: number };
type Hotspot = { label: string; target: string; x: number; y: number; w: number; h: number };
type Section = { id: string; label: string; width: number; height: number; images: ImageLayer[]; texts: TextLayer[]; hotspots: Hotspot[] };
type DishesDishKey = "sushi" | "ramen" | "udon" | "tempura" | "yakitori" | "okonomiyaki";
type DishesPage = "first" | "second" | "third";

const HERO_BOARD_SRC = "/sakura-assets/_assets/media/2cccb1d8bca202e0ae7adde1a1d5d489.png";
const HERO_NAV_BAR_SRC = "/sakura-assets/_assets/media/cf0278f8f8782ba0c748d3e016aabe40.png";
const HERO_LOGO_SRC = "/sakura-assets/_assets/media/6c06138391acf332fac3fc3d9be64b42.png";
const HERO_CTA_SRC = "/sakura-assets/_assets/media/d7008c2fca28475fcc4c0217970428fb.png";
const HERO_CTA_ARROW_SRC = "/sakura-assets/_assets/media/30f4682c39416bf4fa425304a1e01229.png";
const HERO_SUSHI_PLATTER_SRC = "/sakura-assets/_assets/media/2cccb1d8bca202e0ae7adde1a1d5d489.png";
const HERO_SUSHI_PLATTER_HQ_SRC = "/sakura-assets/_assets/media/hero-sushi-platter-hq-cutout.png";
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
const renderedSectionIds = new Set(["home", "dishes-1"]);
const initialDishesCornerPositions = {
  top: { x: 1348, y: -42 },
  bottom: { x: -128, y: 842 },
};
const initialDishesDishPositions = {
  sushi: { x: 80, y: 485 },
  ramen: { x: 1088, y: 42 },
  tempura: { x: 80, y: 500 },
  udon: { x: 1088, y: 42 },
  okonomiyaki: { x: 80, y: 500 },
  yakitori: { x: 1088, y: 42 },
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
        "x": 738.197,
        "y": 158.385,
        "w": 457.938,
        "h": 136.578,
        "r": 0,
        "src": "/sakura-assets/_assets/media/d161f7e1781c96c01ab59d000be35a56.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 457.938,
        "cropH": 136.578
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
        "x": 159.532,
        "y": 516.472,
        "w": 389.075,
        "h": 429.245,
        "r": 0,
        "src": "/sakura-assets/_assets/media/515949127f7618a82b5ffae453cbaeaf.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 389.075,
        "cropH": 429.245
      },
      {
        "x": 205.441,
        "y": 562.38,
        "w": 320.213,
        "h": 292.667,
        "r": 0,
        "src": "/sakura-assets/_assets/media/eff5d7758d8f1b4b72f870abaa7d41d6.png",
        "cropX": 0,
        "cropY": 0,
        "cropW": 320.213,
        "cropH": 292.667
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
        "x": 792.3875,
        "y": 192.0301,
        "w": 378.039,
        "h": 44.1691,
        "r": -3.06,
        "runs": [
          {
            "text": "最高の",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          },
          {
            "text": "寿司",
            "color": "rgb(255, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          },
          {
            "text": "盛り合わせ",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "700",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAFdJiHXlcI_0, auto",
          "fontSize": 37.390536932,
          "lineHeight": 51.647400000000005,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "700",
          "textTransform": "none",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 259.062,
        "y": 598.4472678039999,
        "w": 203.412,
        "h": 91.2909,
        "r": 0,
        "runs": [
          {
            "text": "寿司",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "900",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          },
          {
            "break": true
          },
          {
            "text": "盛り合わせ",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "900",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YAFdJiHXlcI_0, auto",
          "fontSize": 40.645470852,
          "lineHeight": 43.61336,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "900",
          "textTransform": "none",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 282.09,
        "y": 679.2369910599999,
        "w": 118.977,
        "h": 143.489,
        "r": 0,
        "runs": [
          {
            "text": "67",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YACgEcYqQ-A_0, auto",
          "fontSize": 120.39008940000001,
          "lineHeight": 167.56712000000002,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "none",
          "letterSpacing": "0em"
        }
      },
      {
        "x": 395.31,
        "y": 714.6837303324,
        "w": 63.3263,
        "h": 54.9496,
        "r": 0,
        "runs": [
          {
            "text": ",90",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YACgEcYqQ-A_0, auto",
          "fontSize": 46.612696676000006,
          "lineHeight": 64.27232000000001,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "none",
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
      },
      {
        "x": 241.791,
        "y": 714.6837303324,
        "w": 38.3796,
        "h": 54.9496,
        "r": 0,
        "runs": [
          {
            "text": "¥",
            "color": "rgb(0, 0, 0)",
            "fontWeight": "400",
            "fontStyle": "normal",
            "textDecorationLine": "none"
          }
        ],
        "style": {
          "fontFamily": "YACgEcYqQ-A_0, auto",
          "fontSize": 46.612696676000006,
          "lineHeight": 64.27232000000001,
          "color": "rgb(0, 0, 0)",
          "fontWeight": "400",
          "textTransform": "none",
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
  }
] satisfies Section[];

function scrollToSection(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }

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
  if (layer.src === HERO_BOARD_SRC) return "sakura-hero-board";
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
    return { ...layer, x: 1410, y: 35, w: 510, h: 345, cropX: 0, cropY: 0, cropW: 510, cropH: 345 };
  }

  if (layer.src === DISHES_SUSHI_PLATTER_SRC) {
    return { ...layer, src: DISHES_SUSHI_PLATTER_HQ_SRC, x: 80, y: 485, w: 595, h: 579, cropX: 0, cropY: 0, cropW: 595, cropH: 579 };
  }

  if (layer.src === DISHES_RAMEN_SRC) {
    return { ...layer, src: DISHES_RAMEN_HQ_SRC, x: 1088, y: 42, w: 640, h: 640, cropX: 0, cropY: 0, cropW: 640, cropH: 640 };
  }

  if (index === 3) {
    return { ...layer, x: 520, y: 720, w: 64, h: 140, cropW: 64, cropH: 140 };
  }

  if (index >= 6) {
    return { ...layer, x: 1580 + (index - 6) * 86, y: 985, w: 70, h: 76, cropW: 70, cropH: 76 };
  }

  return layer;
}

function isDishesBlackBlock(layer: ImageLayer) {
  return [DISHES_BLACK_BLOCK_SRC, DISHES_TOP_BLACK_BLOCK_SRC].includes(layer.src);
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
      x: 95,
      y: 205,
      w: 315,
      h: 380,
      style: { ...layer.style, fontSize: 190, lineHeight: 146 },
    };
  }

  if (text === "01.") return { ...layer, x: 650, y: 205, style: { ...layer.style, fontSize: 64, lineHeight: 64 } };
  if (text === "Tonkotsu Ramen") return { ...layer, x: 650, y: 282, w: 420, style: { ...layer.style, fontSize: 39, lineHeight: 42 } };
  if (text.startsWith("Rich pork-bone")) return { ...layer, x: 650, y: 357, w: 410, h: 190, style: { ...layer.style, fontSize: 33, lineHeight: 42 } };
  if (text === "02.") return { ...layer, x: 1028, y: 690, style: { ...layer.style, fontSize: 64, lineHeight: 64 } };
  if (text === "Sushi Platter") return { ...layer, x: 1028, y: 767, w: 365, style: { ...layer.style, fontSize: 39, lineHeight: 42 } };
  if (text.startsWith("Salmon, tuna")) return { ...layer, x: 1028, y: 842, w: 425, h: 160, style: { ...layer.style, fontSize: 31, lineHeight: 39 } };
  if (text === "Follow US!") return { ...layer, x: 1585, y: 940, w: 180, style: { ...layer.style, fontSize: 33, lineHeight: 36 } };

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

function ImageLayerView({
  layer,
  index,
  className = "",
}: {
  layer: ImageLayer;
  index: number;
  className?: string;
}) {
  return (
    <div
      key={`img-${index}`}
      className={`absolute overflow-hidden ${layerClass(layer)} ${className}`}
      style={{ left: layer.x, top: layer.y, width: layer.w, height: layer.h, transform: layer.r ? `rotate(${layer.r}deg)` : undefined, transformOrigin: "top left" }}
    >
      <img src={layer.src} alt="" draggable={false} className="absolute select-none" style={{ left: layer.cropX, top: layer.cropY, width: layer.cropW, height: layer.cropH }} />
    </div>
  );
}

function TextLayerView({ layer, index, className = "", runs }: { layer: TextLayer; index: number; className?: string; runs?: TextRun[] }) {
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
      style={{ left: layer.x, top: layer.y, width: layer.w, height: layer.h, transform: layer.r ? `rotate(${layer.r}deg)` : undefined, transformOrigin: "top left", ...getTextStyle(layer), ...heroTitleStyle }}
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
      className={`sakura-animated-copy absolute ${className}`}
      style={{ left: layer.x, top: layer.y, width: layer.w, height: layer.h, transform: layer.r ? `rotate(${layer.r}deg)` : undefined, transformOrigin: "top left", ...getTextStyle(layer) }}
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
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transitionDelay: `${baseDelay + visualOrder * 9}ms`,
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

const fixedNavItems = sections[0].hotspots.filter((hotspot) => hotspot.label !== "Order Now");

function FixedSakuraNavbar({ activeNav, setActiveNav }: { activeNav: string; setActiveNav: (id: string) => void }) {
  const underline = navUnderline[activeNav as keyof typeof navUnderline] ?? navUnderline.home;

  return (
    <nav className="sakura-fixed-nav" aria-label="Primary">
      <img src={HERO_NAV_BAR_SRC} alt="" className="sakura-fixed-nav-bg" draggable={false} />
      <div className="sakura-fixed-nav-content">
        <button
          type="button"
          className="sakura-fixed-brand"
          aria-label="Sakura home"
          onClick={() => {
            setActiveNav("home");
            scrollToSection("home");
          }}
        >
          <img src={HERO_LOGO_SRC} alt="" className="sakura-fixed-logo" draggable={false} />
          <span className="sakura-fixed-brand-copy">
            <span>SAKURA</span>
            <small>RESTAURANT</small>
          </span>
        </button>

        <span
          aria-hidden="true"
          className="sakura-fixed-nav-underline"
          style={{ left: navPercent(underline.x), width: `${(underline.w / HERO_NAV_FRAME.w) * 100}%` }}
        />

        <div className="sakura-fixed-links">
          {fixedNavItems.map((hotspot) => {
            const navId = hotspotNavId(hotspot);
            const target = safeScrollTarget(hotspot.target);
            const linkPosition = navUnderline[navId as keyof typeof navUnderline] ?? navUnderline.home;

            return (
              <button
                key={hotspot.label}
                type="button"
                className="sakura-fixed-link"
                style={{ left: navPercent(linkPosition.x), width: `${(linkPosition.w / HERO_NAV_FRAME.w) * 100}%` }}
                onClick={() => {
                  setActiveNav(navId);
                  scrollToSection(target);
                }}
              >
                {hotspot.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="sakura-fixed-cta"
          onClick={() => {
            setActiveNav("dishes-1");
            scrollToSection("dishes-1");
          }}
        >
          <span>ORDER NOW</span>
          <span className="sakura-css-arrow" aria-hidden="true">
            <span />
          </span>
        </button>
      </div>
    </nav>
  );
}

function DesignStage({ section, activeNav, setActiveNav }: { section: Section; activeNav: string; setActiveNav: (id: string) => void }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const wheelAccumulatorRef = useRef(0);
  const wheelGestureLockedRef = useRef(false);
  const wheelQuietTimerRef = useRef<number | null>(null);
  const [scale, setScale] = useState(1);
  const [dishesPage, setDishesPage] = useState<DishesPage>("first");
  const [isDishesAnimating, setIsDishesAnimating] = useState(false);
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

  useLayoutEffect(() => { const shell = shellRef.current; if (!shell) return; const updateScale = () => setScale(shell.clientWidth / stageSize.width); updateScale(); const observer = new ResizeObserver(updateScale); observer.observe(shell); return () => observer.disconnect(); }, [stageSize.width]);

  useEffect(() => {
    if (!showDishesBaseOnly) return;

    function pinDishesFrame(element: HTMLElement) {
      window.scrollTo({ top: element.offsetTop, left: 0, behavior: "auto" });
    }

    function resetWheelGesture() {
      wheelAccumulatorRef.current = 0;
      wheelGestureLockedRef.current = false;
      if (wheelQuietTimerRef.current) window.clearTimeout(wheelQuietTimerRef.current);
      wheelQuietTimerRef.current = null;
    }

    function holdWheelGesture(element: HTMLElement) {
      wheelGestureLockedRef.current = true;
      if (wheelQuietTimerRef.current) window.clearTimeout(wheelQuietTimerRef.current);
      wheelQuietTimerRef.current = window.setTimeout(() => {
        wheelQuietTimerRef.current = null;
        if (!isDishesAnimating) resetWheelGesture();
        pinDishesFrame(element);
      }, 260);
    }

    function onWheel(event: WheelEvent) {
      const element = sectionRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const inDishesFrame = rect.top < window.innerHeight * 0.45 && rect.bottom > window.innerHeight * 0.45;
      if (!inDishesFrame || event.deltaY === 0) return;

      const shouldAdvance = event.deltaY > 0 && dishesPage !== "third";
      const shouldReverse = event.deltaY < 0 && dishesPage !== "first";

      if (!shouldAdvance && !shouldReverse) {
        resetWheelGesture();
        return;
      }

      event.preventDefault();
      pinDishesFrame(element);

      if (isDishesAnimating || wheelGestureLockedRef.current) {
        holdWheelGesture(element);
        return;
      }

      wheelAccumulatorRef.current += event.deltaY;
      if (Math.abs(wheelAccumulatorRef.current) < 90) {
        holdWheelGesture(element);
        return;
      }

      const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
      if ((direction > 0 && !shouldAdvance) || (direction < 0 && !shouldReverse)) {
        resetWheelGesture();
        return;
      }

      if (shouldAdvance || shouldReverse) {
        event.preventDefault();
        pinDishesFrame(element);
        wheelGestureLockedRef.current = true;
        wheelAccumulatorRef.current = 0;
        setIsDishesAnimating(true);
        setDishesPage((current) => {
          if (direction > 0) return current === "first" ? "second" : "third";
          return current === "third" ? "second" : "first";
        });
        [80, 260, 620, 1080, 1450].forEach((delay) => window.setTimeout(() => pinDishesFrame(element), delay));
        window.setTimeout(() => {
          setIsDishesAnimating(false);
          if (!wheelQuietTimerRef.current) resetWheelGesture();
        }, 1650);
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      if (wheelQuietTimerRef.current) window.clearTimeout(wheelQuietTimerRef.current);
      window.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, [dishesPage, isDishesAnimating, showDishesBaseOnly]);

  const showFirstDishes = dishesPage === "first";
  const showSecondDishes = dishesPage === "second";
  const showThirdDishes = dishesPage === "third";
  const topNumberLayer = getDishesTextTemplate(section, "01.");
  const topTitleLayer = getDishesTextTemplate(section, "Tonkotsu Ramen");
  const topDescriptionLayer = getDishesTextTemplate(section, "Rich pork-bone broth,ramen noodles, chashupork, soft-boiled egg,nori, scallions.");
  const bottomNumberLayer = getDishesTextTemplate(section, "02.");
  const bottomTitleLayer = getDishesTextTemplate(section, "Sushi Platter");
  const bottomDescriptionLayer = getDishesTextTemplate(section, "Salmon, tuna & shrimpnigiri, maki rolls, sashimi,pickled ginger, wasabi.");
  const udonLayer = makeDishLayer(DISHES_UDON_HQ_SRC, dishPositions.udon.x, dishPositions.udon.y, 640, 626);
  const tempuraLayer = makeDishLayer(DISHES_TEMPURA_HQ_SRC, dishPositions.tempura.x, dishPositions.tempura.y, 640, 590);
  const yakitoriLayer = makeDishLayer(DISHES_YAKITORI_HQ_SRC, dishPositions.yakitori.x, dishPositions.yakitori.y + 35, 650, 488);
  const okonomiyakiLayer = makeDishLayer(DISHES_OKONOMIYAKI_HQ_SRC, dishPositions.okonomiyaki.x + 12, dishPositions.okonomiyaki.y - 15, 610, 570);

  return (
    <section
      ref={sectionRef}
      id={section.id}
      aria-label={section.label}
      className={`sakura-section relative w-full overflow-hidden ${section.id === "dishes-1" ? "sakura-dishes-section" : ""}`}
      style={{ scrollMarginTop: 0 }}
    >
      <div
        ref={shellRef}
        className={`sakura-stage-shell relative mx-auto w-full ${section.id === "dishes-1" ? "sakura-stage-fit-frame" : ""}`}
        style={{ aspectRatio: `${stageSize.width} / ${stageSize.height}`, "--stage-ratio": stageRatio } as CSSProperties}
      >
        <div className="absolute left-0 top-0 origin-top-left overflow-hidden" style={{ width: stageSize.width, height: stageSize.height, transform: `scale(${scale})` }}>
          {showDishesBaseOnly ? (
            <>
              {baseImages.slice(0, 1).map((layer, index) => (
                <ImageLayerView
                  key={`dishes-bg-${index}`}
                  layer={getDisplayImageLayer(section, layer, index)}
                  index={index}
                />
              ))}
              <div
                aria-hidden="true"
                className="sakura-dishes-band"
                style={{ left: initialDishesCornerPositions.top.x, top: initialDishesCornerPositions.top.y }}
              />
              <div
                aria-hidden="true"
                className="sakura-dishes-band"
                style={{ left: initialDishesCornerPositions.bottom.x, top: initialDishesCornerPositions.bottom.y }}
              />
              {baseImages
                .map((layer, index) => ({ layer, index }))
                .filter(({ layer, index }) => index > 0 && !isDishesBlackBlock(layer) && !dishesDishKey(layer))
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
                  const dishKey = dishesDishKey(layer);
                  const displayLayer = getDisplayImageLayer(section, layer, index);
                  const movableLayer = dishKey ? { ...displayLayer, x: dishPositions[dishKey].x, y: dishPositions[dishKey].y } : displayLayer;
                  const route = dishKey === "ramen" ? "top" : "bottom";

                  return (
                    <ImageLayerView
                      key={`dishes-img-${index}`}
                      layer={movableLayer}
                      index={index}
                      className={dishKey ? `sakura-dish-swap sakura-dish-current sakura-dish-${route} ${showFirstDishes ? "is-home" : "is-away"}` : ""}
                    />
                  );
                })}
              <ImageLayerView
                layer={udonLayer}
                index={90}
                className={`sakura-dish-swap sakura-dish-next sakura-dish-top ${showSecondDishes ? "is-home" : "is-away"}`}
              />
              <ImageLayerView
                layer={tempuraLayer}
                index={91}
                className={`sakura-dish-swap sakura-dish-next sakura-dish-bottom ${showSecondDishes ? "is-home" : "is-away"}`}
              />
              <ImageLayerView
                layer={yakitoriLayer}
                index={92}
                className={`sakura-dish-swap sakura-dish-next sakura-dish-top ${showThirdDishes ? "is-home" : "is-away"}`}
              />
              <ImageLayerView
                layer={okonomiyakiLayer}
                index={93}
                className={`sakura-dish-swap sakura-dish-next sakura-dish-bottom ${showThirdDishes ? "is-home" : "is-away"}`}
              />
              {foregroundTexts
                .filter((layer) => ["TopDishes", "Follow US!"].includes(layerText(layer)))
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
              <AnimatedDishesText layer={topNumberLayer} lines={[dishesCopy.first.top.number]} visible={showFirstDishes} order="ltr" baseDelay={showFirstDishes && isDishesAnimating ? 980 : 0} />
              <AnimatedDishesText layer={topTitleLayer} lines={[dishesCopy.first.top.title]} visible={showFirstDishes} order="ltr" baseDelay={showFirstDishes && isDishesAnimating ? 980 : 0} />
              <AnimatedDishesText layer={topDescriptionLayer} lines={dishesCopy.first.top.description} visible={showFirstDishes} order="rtl" baseDelay={showFirstDishes && isDishesAnimating ? 980 : 0} />
              <AnimatedDishesText layer={bottomNumberLayer} lines={[dishesCopy.first.bottom.number]} visible={showFirstDishes} order="ltr" baseDelay={showFirstDishes && isDishesAnimating ? 980 : 0} />
              <AnimatedDishesText layer={bottomTitleLayer} lines={[dishesCopy.first.bottom.title]} visible={showFirstDishes} order="ltr" baseDelay={showFirstDishes && isDishesAnimating ? 980 : 0} />
              <AnimatedDishesText layer={bottomDescriptionLayer} lines={dishesCopy.first.bottom.description} visible={showFirstDishes} order="rtl" baseDelay={showFirstDishes && isDishesAnimating ? 980 : 0} />
              <AnimatedDishesText layer={topNumberLayer} lines={[dishesCopy.second.top.number]} visible={showSecondDishes} order="rtl" baseDelay={showSecondDishes && isDishesAnimating ? 980 : 0} className="sakura-copy-next" />
              <AnimatedDishesText layer={topTitleLayer} lines={[dishesCopy.second.top.title]} visible={showSecondDishes} order="rtl" baseDelay={showSecondDishes && isDishesAnimating ? 980 : 0} className="sakura-copy-next" />
              <AnimatedDishesText layer={topDescriptionLayer} lines={dishesCopy.second.top.description} visible={showSecondDishes} order="ltr" baseDelay={showSecondDishes && isDishesAnimating ? 980 : 0} className="sakura-copy-next" />
              <AnimatedDishesText layer={bottomNumberLayer} lines={[dishesCopy.second.bottom.number]} visible={showSecondDishes} order="rtl" baseDelay={showSecondDishes && isDishesAnimating ? 980 : 0} className="sakura-copy-next" />
              <AnimatedDishesText layer={bottomTitleLayer} lines={[dishesCopy.second.bottom.title]} visible={showSecondDishes} order="rtl" baseDelay={showSecondDishes && isDishesAnimating ? 980 : 0} className="sakura-copy-next" />
              <AnimatedDishesText layer={bottomDescriptionLayer} lines={dishesCopy.second.bottom.description} visible={showSecondDishes} order="ltr" baseDelay={showSecondDishes && isDishesAnimating ? 980 : 0} className="sakura-copy-next" />
              <AnimatedDishesText layer={topNumberLayer} lines={[dishesCopy.third.top.number]} visible={showThirdDishes} order="rtl" baseDelay={showThirdDishes && isDishesAnimating ? 980 : 0} className="sakura-copy-next" />
              <AnimatedDishesText layer={topTitleLayer} lines={[dishesCopy.third.top.title]} visible={showThirdDishes} order="rtl" baseDelay={showThirdDishes && isDishesAnimating ? 980 : 0} className="sakura-copy-next" />
              <AnimatedDishesText layer={topDescriptionLayer} lines={dishesCopy.third.top.description} visible={showThirdDishes} order="ltr" baseDelay={showThirdDishes && isDishesAnimating ? 980 : 0} className="sakura-copy-next" />
              <AnimatedDishesText layer={bottomNumberLayer} lines={[dishesCopy.third.bottom.number]} visible={showThirdDishes} order="rtl" baseDelay={showThirdDishes && isDishesAnimating ? 980 : 0} className="sakura-copy-next" />
              <AnimatedDishesText layer={bottomTitleLayer} lines={[dishesCopy.third.bottom.title]} visible={showThirdDishes} order="rtl" baseDelay={showThirdDishes && isDishesAnimating ? 980 : 0} className="sakura-copy-next" />
              <AnimatedDishesText layer={bottomDescriptionLayer} lines={dishesCopy.third.bottom.description} visible={showThirdDishes} order="ltr" baseDelay={showThirdDishes && isDishesAnimating ? 980 : 0} className="sakura-copy-next" />
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
                        setActiveNav(hotspotNavId(hotspot));
                        scrollToSection(safeScrollTarget(hotspot.target));
                      }}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {baseImages.map((layer, index) => <ImageLayerView key={`base-img-${index}`} layer={getDisplayImageLayer(section, layer, index)} index={index} />)}
              {heroTitleTexts.map((layer, index) => <TextLayerView key={`hero-title-${index}`} layer={getDisplayTextLayer(section, layer)} index={index} className="sakura-hero-title" />)}
              {overlayImages.map((layer, index) => <ImageLayerView key={`overlay-img-${index}`} layer={getDisplayImageLayer(section, layer, index + baseImages.length)} index={index + baseImages.length} />)}
              {foregroundTexts.map((layer, index) => <TextLayerView key={`text-${index}`} layer={getDisplayTextLayer(section, layer)} index={index} />)}
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

export default function SakuraExperience() {
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    function updateActiveSection() {
      const viewportAnchor = window.innerHeight * 0.42;
      let next = sections[0].id;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= viewportAnchor) next = section.id;
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
  }, []);

  return (
    <main className="w-full bg-black">
      <FixedSakuraNavbar activeNav={activeNav} setActiveNav={setActiveNav} />
      {sections.filter((section) => renderedSectionIds.has(section.id)).map((section) => (
        <DesignStage
          key={section.id}
          section={section}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />
      ))}
    </main>
  );
}
