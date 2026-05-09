import type { Metadata } from "next";
import { Cairo } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/Navbar";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TRUST",
  description: "Trusted Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
    >
      <body
        className="
          min-h-full
          flex flex-col
          bg-black
          pt-28
        "
      >
        <Navbar />

{/* TRUST LICENSE */}
<meta
  name="copyright"
  content="Developed by يوسف - TRUST Platform"
/>

        {children}
      </body>
    </html>
  );
}