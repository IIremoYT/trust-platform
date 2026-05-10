import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

import Navbar from "@/components/Navbar";
import AmbientEffects from "@/components/AmbientEffects";
import AnnouncementBar from "@/components/AnnouncementBar";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TRUST PLATFORM — الثقة هي أساسنا",
  description: "منصة Trust الرسمية — أفضل الخدمات بأعلى جودة مع إثباتات حقيقية من عملائنا. تواصل معنا الآن.",
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
      className={`${cairo.variable} ${inter.variable} h-full antialiased`}
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
        <AmbientEffects />

{/* TRUST LICENSE */}
<meta
  name="copyright"
  content="Developed by يوسف - TRUST Platform"
/>

        {/* TRUST Notification System */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0D0D0D',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              color: '#ededed',
              borderRadius: '1rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.04)',
              fontFamily: 'var(--font-cairo), sans-serif',
            },
          }}
        />

        <div className="page-enter">
          {children}
        </div>

        <AnnouncementBar />
      </body>
    </html>
  );
}