import type { Metadata } from "next";
import "./globals.css";
import { ibmPlexMono, inter } from "./fonts";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Daily Brew",
  description: "Coffee shop inventory management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}