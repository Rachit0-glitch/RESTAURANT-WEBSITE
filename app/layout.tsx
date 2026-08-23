import "./globals.css";

export const metadata = { title: "SAKURA" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><link rel="stylesheet" href="/sakura-assets/_assets/fontface.css" /></head>
      <body>{children}</body>
    </html>
  );
}
