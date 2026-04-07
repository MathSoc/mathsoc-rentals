import type { Metadata } from "next";
import { Electrolize } from "next/font/google";
import "./globals.scss";
import { Providers } from "./providers";
import { Navigation } from "./components/navbar/navbar";

const titleFont = Electrolize({
  variable: "--primary-font",
  // subsets: ["latin"],
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
          <Navigation />
          <div id="body-contents">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
