"use client";

import Link from "next/link";

import {
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

export default function Navbar() {

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const navItems = [
    { name: "الرئيسية", href: "/" },
    { name: "طرق الدفع", href: "#payments" },
    { name: "الإثباتات", href: "#proofs" },
    { name: "آراء العملاء", href: "#reviews" },
    { name: "تواصل معنا", href: "#contact" },
  ];

  return (
    <>
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
            className="
              flex items-center gap-3 group
            "
          >
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
              <div
                className="
                  absolute inset-0
                  bg-yellow-500/10
                  blur-xl
                "
              />

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
            {navItems.map(
              (item, index) => (
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
              )
            )}
          </div>

          {/* Right */}
          <div
            className="
              flex items-center gap-3
            "
          >
            {/* Contact */}
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

            {/* Mobile Button */}
            <button
              onClick={() =>
                setMobileOpen(
                  !mobileOpen
                )
              }
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
              {mobileOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`
          fixed inset-0 z-40

          lg:hidden

          transition-all duration-300

          ${
            mobileOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      >
        {/* Overlay */}
        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="
            absolute inset-0
            bg-black/70
            backdrop-blur-sm
          "
        />

        {/* Menu */}
        <div
          className={`
            absolute top-0 right-0

            w-[85%]
            max-w-[320px]

            h-full

            bg-[#0A0A0A]

            border-l border-white/10

            p-6

            transition-transform duration-300

            ${
              mobileOpen
                ? "translate-x-0"
                : "translate-x-full"
            }
          `}
        >
          {/* Top */}
          <div
            className="
              flex items-center justify-between
              mb-10
            "
          >
            <h2
              className="
                text-white
                text-xl
                font-black
              "
            >
              القائمة
            </h2>

            <button
              onClick={() =>
                setMobileOpen(false)
              }
              className="
                text-zinc-400
              "
            >
              <X size={24} />
            </button>
          </div>

          {/* Links */}
          <div className="space-y-3">
            {navItems.map(
              (item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="
                    flex items-center

                    w-full

                    px-5 py-4

                    rounded-2xl

                    bg-white/[0.03]

                    border border-white/5

                    text-zinc-300

                    hover:bg-yellow-500/10
                    hover:text-yellow-500
                    hover:border-yellow-500/20

                    transition-all duration-300
                  "
                >
                  {item.name}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
