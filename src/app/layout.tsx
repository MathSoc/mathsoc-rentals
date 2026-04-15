import type { Metadata } from "next";
import { Fustat } from "next/font/google";
import { Navigation } from "./components/navbar/navbar";
import "./globals.scss";
import { Providers } from "./providers";

const titleFont = Fustat({
  variable: "--primary-font",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "MATHSOC | Rentals",
  description: "khajit has wares if you have the coin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${titleFont.variable}`}>
      <head>
        <link rel="icon" href="/img/icons/favicon.svg" sizes="any" />
      </head>
      <body>
        <Providers>
          {/* root needed for baseUI drawers */}
          <div className="root">
            <Navigation />
            <div id="body-contents">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
