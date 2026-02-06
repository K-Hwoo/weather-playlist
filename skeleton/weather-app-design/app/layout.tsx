import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const _inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather Vibes - Weather, Style & Music",
  description:
    "Real-time weather dashboard with outfit recommendations and weather-based YouTube music playlists",
};

export const viewport: Viewport = {
  themeColor: "#151b26",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
