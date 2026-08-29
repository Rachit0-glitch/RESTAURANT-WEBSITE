import type { Metadata } from "next";
import "./globals.css";

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
        <link rel="stylesheet" href="/sakura-assets/_assets/fontface.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
