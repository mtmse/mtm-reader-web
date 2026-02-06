import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@edrlab/thorium-web/core/styles";
import "@edrlab/thorium-web/epub/styles";
import "@edrlab/thorium-web/misc/styles";
import "./globals.css";
import "@/src/theme/reader.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MTM Reader",
  description: "En tillgänglig EPUB-läsare byggd med Thorium Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || "sv"}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
