import "./globals.css";

const CSS_ORDER = [
  "e0aa6fb3a4613e86.ltr.css",
  "static_font_4.ltr.css",
  "06b1e480f5fc0960.ltr.css",
  "28f64f5a77f6500c.ltr.css",
  "45d57664115b802d.ltr.css",
  "a2e74e29f6e1b1c3.ltr.css",
  "bae505f43a7a4075.ltr.css",
  "b01d4b2a8bea66ba.ltr.css",
  "5cb6ee055426edbf.ltr.css",
  "4b869a0c4034a3e7.ltr.css",
  "2f3b114832a90fd5.ltr.css",
  "0140c70838972495.ltr.css",
  "60f0cdc861dbb375.ltr.css",
  "8c7fef8a62d6d0d8.ltr.css",
  "49165a5d963019da.ltr.css",
  "5084a3e3ca4f1ae7.ltr.css",
  "6ef534890ea95fd1.ltr.css",
  "34af9172ab5ea11a.ltr.css",
  "d383e40730784e87.ltr.css",
  "15f963db676e7830.ltr.css",
  "fontface.css",
];

export const metadata = {
  title: "SUSHI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {CSS_ORDER.map((file) => (
          <link key={file} rel="stylesheet" href={`/sakura-assets/_assets/${file}`} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
