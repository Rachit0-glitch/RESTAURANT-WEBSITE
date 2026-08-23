"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type TextRun = { text?: string; break?: true; color?: string; fontWeight?: string; fontStyle?: string; textDecorationLine?: string };
type TextLayer = { x: number; y: number; w: number; h: number; r: number; runs: TextRun[]; style: CSSProperties & { fontSize?: number; lineHeight?: number } };
type ImageLayer = { x: number; y: number; w: number; h: number; r: number; src: string; cropX: number; cropY: number; cropW: number; cropH: number };
type Hotspot = { label: string; target: string; x: number; y: number; w: number; h: number };
type Section = { id: string; label: string; width: number; height: number; images: ImageLayer[]; texts: TextLayer[]; hotspots: Hotspot[] };

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

function getTextStyle(layer: TextLayer): CSSProperties {
  const style: CSSProperties = { ...layer.style };
  if (typeof style.fontSize === "number") style.fontSize = `${style.fontSize}px`;
  if (typeof style.lineHeight === "number") style.lineHeight = `${style.lineHeight}px`;
  return style;
}

function DesignStage({ section }: { section: Section }) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => { const shell = shellRef.current; if (!shell) return; const updateScale = () => setScale(shell.clientWidth / section.width); updateScale(); const observer = new ResizeObserver(updateScale); observer.observe(shell); return () => observer.disconnect(); }, [section.width]);
  return (
    <section id={section.id} aria-label={section.label} className="relative w-full overflow-hidden bg-black">
      <div ref={shellRef} className="relative mx-auto w-full" style={{ aspectRatio: `${section.width} / ${section.height}` }}>
        <div className="absolute left-0 top-0 origin-top-left overflow-hidden" style={{ width: section.width, height: section.height, transform: `scale(${scale})` }}>
          {section.images.map((layer, index) => (
            <div key={`img-${index}`} className="absolute overflow-hidden" style={{ left: layer.x, top: layer.y, width: layer.w, height: layer.h, transform: layer.r ? `rotate(${layer.r}deg)` : undefined, transformOrigin: "top left" }}>
              <img src={layer.src} alt="" draggable={false} className="absolute select-none" style={{ left: layer.cropX, top: layer.cropY, width: layer.cropW, height: layer.cropH }} />
            </div>
          ))}
          {section.texts.map((layer, index) => (
            <div key={`text-${index}`} className="absolute" style={{ left: layer.x, top: layer.y, width: layer.w, height: layer.h, transform: layer.r ? `rotate(${layer.r}deg)` : undefined, transformOrigin: "top left", ...getTextStyle(layer) }}>
              {layer.runs.map((run, runIndex) => run.break ? <br key={runIndex} /> : <span key={runIndex} style={{ color: run.color, fontWeight: run.fontWeight, fontStyle: run.fontStyle, textDecorationLine: run.textDecorationLine }}>{run.text}</span>)}
            </div>
          ))}
          {section.hotspots.map((hotspot) => (
            <button key={hotspot.label} type="button" aria-label={hotspot.label} className="absolute cursor-pointer rounded-full outline-none transition duration-300 hover:bg-white/10 focus-visible:ring-4 focus-visible:ring-white/70" style={{ left: hotspot.x, top: hotspot.y, width: hotspot.w, height: hotspot.h }} onClick={() => scrollToSection(hotspot.target)} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SakuraExperience() { return <main className="w-full bg-black">{sections.map((section) => <DesignStage key={section.id} section={section} />)}</main>; }
