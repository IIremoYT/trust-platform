import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Payments from "../components/Payments";
import Proofs from "../components/Proofs";
import Reviews from "../components/Reviews";

import {
  MessageCircle,
  BadgeInfo,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* Hero */}
      <Hero />

      {/* Stats */}
      <div id="stats">
        <Stats />
      </div>

      {/* Payments */}
      <div id="payments">
        <Payments />
      </div>

      {/* Proofs */}
      <div id="proofs">
        <Proofs />
      </div>

      {/* Reviews */}
      <div id="reviews">
        <Reviews />
      </div>

      {/* Contact Section */}
      <section
        id="contact"
        dir="rtl"
        className="
          relative
          py-28 px-6
          overflow-hidden
        "
      >
        {/* Glow */}
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08),transparent_60%)]
            pointer-events-none
          "
        ></div>

        <div
          className="
            relative z-10
            max-w-7xl mx-auto
          "
        >
          <div
            className="
              bg-[#0B0B0B]
              border border-zinc-800

              rounded-[40px]

              p-10 md:p-16

              flex flex-col lg:flex-row
              items-center justify-between

              gap-12
            "
          >
            {/* Left */}
            <div className="text-center lg:text-right max-w-2xl">

              <div
                className="
                  inline-flex

                  mb-5

                  text-yellow-500

                  bg-yellow-500/10
                  border border-yellow-500/20

                  px-5 py-2

                  rounded-full

                  text-sm font-semibold
                "
              >
                CONTACT US
              </div>

              <h2
                className="
                  text-white

                  text-4xl md:text-5xl

                  font-black

                  leading-tight

                  mb-6
                "
              >
                تواصل معنا الآن
              </h2>

              <p
                className="
                  text-zinc-400
                  text-lg
                  leading-9
                "
              >
                نحن متاحون دائماً للرد على جميع استفساراتك
                وتقديم أفضل خدمة بأعلى جودة واحترافية.
              </p>
            </div>

            {/* Buttons */}
            <div
              className="
                flex flex-col sm:flex-row
                gap-5
                w-full lg:w-auto
              "
            >
              {/* WhatsApp */}
              <a
                href="https://wa.me/201095528915"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group

                  bg-[#111]
                  hover:bg-[#171717]

                  border border-green-500/20
                  hover:border-green-500/40

                  px-8 py-5

                  rounded-3xl

                  flex items-center gap-4

                  transition-all duration-300

                  min-w-[240px]

                  hover:-translate-y-1
                "
              >
                <div
                  className="
                    w-14 h-14

                    rounded-2xl

                    bg-green-500/10

                    flex items-center justify-center

                    text-green-500

                    group-hover:scale-110

                    transition-all duration-300
                  "
                >
                  <MessageCircle size={28} />
                </div>

                <div className="text-right">
                  <p className="text-white font-bold text-lg">
                    واتساب
                  </p>

                  <p className="text-zinc-500 text-sm">
                    تواصل سريع ومباشر
                  </p>
                </div>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group

                  bg-[#111]
                  hover:bg-[#171717]

                  border border-blue-500/20
                  hover:border-blue-500/40

                  px-8 py-5

                  rounded-3xl

                  flex items-center gap-4

                  transition-all duration-300

                  min-w-[240px]

                  hover:-translate-y-1
                "
              >
                <div
                  className="
                    w-14 h-14

                    rounded-2xl

                    bg-blue-500/10

                    flex items-center justify-center

                    text-blue-500

                    group-hover:scale-110

                    transition-all duration-300
                  "
                >
                 <BadgeInfo size={26} />
                </div>

                <div className="text-right">
                  <p className="text-white font-bold text-lg">
                    فيسبوك
                  </p>

                  <p className="text-zinc-500 text-sm">
                    صفحتنا الرسمية
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="
          border-t border-zinc-900
          py-10 px-6
        "
      >
        <div
          className="
            max-w-7xl mx-auto

            flex flex-col md:flex-row
            items-center justify-between

            gap-6
          "
        >
          {/* Logo */}
          <div className="flex items-center gap-3">

            <div
              className="
                w-11 h-11

                rounded-2xl

                bg-yellow-500/10
                border border-yellow-500/20

                flex items-center justify-center

                text-yellow-500
                font-black
              "
            >
              T
            </div>

            <div>
              <p className="text-white font-black text-lg">
                TRUST
              </p>

              <p className="text-zinc-500 text-xs tracking-[3px]">
                PLATFORM
              </p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-zinc-500 text-sm text-center">
            © 2026 TRUST PLATFORM — جميع الحقوق محفوظة
          </p>
        </div>
      </footer>

    </main>
  );
}