import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "AEVUM — Premium Web Engineering & Design Showcase",
  description: "Immersive interactive web experience engineered by AEVUM.",
  keywords: ["AEVUM", "Web Engineering", "UI/UX Design", "Next.js", "Creative Development", "Interactive Showcase"],
  authors: [{ name: "AEVUM°" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <link rel="stylesheet" href="/sakura-assets/_assets/fontface.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
