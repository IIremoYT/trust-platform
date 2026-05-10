import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { Toaster } from "sonner";
import Script from "next/script";

import "./globals.css";

import ClientLayout from "@/components/ClientLayout";

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
      data-scroll-behavior="smooth"
      className={`${cairo.variable} ${inter.variable} h-full antialiased`}
    >
      <body
        className="
          min-h-full
          flex flex-col
          bg-black
        "
      >
        <Script 
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="beforeInteractive"
        />

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

        <ClientLayout>
          {children}
        </ClientLayout>

      </body>
    </html>
  );
}