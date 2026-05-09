"use client";

import Link from "next/link";
import { ShieldCheck, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header
      dir="rtl"
      className="
        fixed top-0 left-0 w-full z-50
        px-4 md:px-8 pt-5
      "
    >
      <nav
        className="
          max-w-7xl mx-auto
          flex items-center justify-between
          px-6 py-4
          rounded-2xl
          border border-white/5
          bg-black/40
          backdrop-blur-2xl
          shadow-[0_0_40px_rgba(0,0,0,0.35)]
        "
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
        >
          {/* Icon */}
          <div
            className="
              relative
              w-11 h-11
              rounded-2xl
              bg-yellow-500/10
              border border-yellow-500/20
              flex items-center justify-center
              overflow-hidden
            "
          >
            {/* Glow */}
            <div
              className="
                absolute inset-0
                bg-yellow-500/10
                blur-xl
              "
            ></div>

            <ShieldCheck
              size={22}
              className="
                relative
                text-yellow-500
                group-hover:scale-110
                transition-all duration-300
              "
            />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-none">
            <span
              className="
                text-white
                text-lg
                font-black
                tracking-wide
              "
            >
              TRUST
            </span>

            <span
              className="
                text-zinc-500
                text-[11px]
                tracking-[3px]
              "
            >
              PLATFORM
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div
          className="
            hidden lg:flex
            items-center gap-8
          "
        >
          {[
            { name: "الرئيسية", href: "/" },
            { name: "طرق الدفع", href: "#payments" },
            { name: "الإثباتات", href: "#proofs" },
            { name: "آراء العملاء", href: "#reviews" },
            { name: "تواصل معنا", href: "#contact" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="
                relative
                text-sm
                text-zinc-400
                hover:text-white
                transition-all duration-300
                after:absolute
                after:right-0
                after:-bottom-2
                after:h-[2px]
                after:w-0
                after:bg-yellow-500
                after:transition-all
                after:duration-300
                hover:after:w-full
              "
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">

          {/* Contact Button */}
          <Link
            href="#contact"
            className="
              hidden md:flex
              items-center justify-center
              bg-yellow-500
              hover:bg-yellow-400
              text-black
              font-bold
              text-sm
              px-5 py-3
              rounded-xl
              transition-all duration-300
              shadow-[0_0_30px_rgba(250,204,21,0.18)]
            "
          >
            تواصل الآن
          </Link>

          {/* Mobile Menu */}
          <button
            className="
              lg:hidden
              w-11 h-11
              rounded-xl
              border border-white/10
              bg-white/5
              flex items-center justify-center
              text-white
            "
          >
            <Menu size={20} />
          </button>

        </div>
      </nav>
    </header>
  );
}