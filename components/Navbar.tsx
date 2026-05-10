"use client";

import Link from "next/link";

import {
  ShieldCheck,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Navbar() {

  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navItems = [
    { name: "الرئيسية", href: "/" },
    { name: "طرق الدفع", href: "#payments" },
    { name: "الإثباتات", href: "#proofs" },
    { name: "آراء العملاء", href: "#reviews" },
    { name: "تواصل معنا", href: "#contact" },
  ];

  // Drawer animation variants — premium spring
  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const drawerVariants: Variants = {
    hidden: {
      x: "100%",
      opacity: 0.5,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 32,
        stiffness: 280,
        mass: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.06,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        damping: 36,
        stiffness: 400,
        when: "afterChildren",
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  };

  const linkVariants: Variants = {
    hidden: {
      x: 60,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 22,
        stiffness: 250,
      },
    },
    exit: {
      x: 40,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
  };

  const headerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        type: "spring",
        damping: 22,
        stiffness: 200,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.15 },
    },
  };

  return (
    <>
      {/* ============ NAVBAR ============ */}
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
            mobile-glass-nav
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
                bg-[#D4AF37]/10
                border border-[#D4AF37]/20
                flex items-center justify-center
                overflow-hidden
              "
            >
              <div
                className="
                  absolute inset-0
                  bg-[#D4AF37]/10
                  blur-xl
                "
              />

              <ShieldCheck
                size={22}
                className="
                  relative
                  text-[#D4AF37]
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
                    after:bg-[#D4AF37]
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
            {/* Contact - Desktop only */}
            <Link
              href="#contact"
              className="
                hidden md:flex
                items-center justify-center

                bg-[#D4AF37]
                hover:bg-[#E8D48B]

                text-black
                font-bold
                text-sm

                px-5 py-3

                rounded-xl

                transition-all duration-300

                shadow-[0_0_30px_rgba(212,175,55,0.15)]
                btn-shimmer
              "
            >
              تواصل الآن
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.9 }}
              className="
                lg:hidden

                w-11 h-11

                rounded-xl

                border border-white/10
                bg-white/5

                flex items-center justify-center

                text-white

                transition-colors duration-200
              "
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </header>

      {/* ============ MOBILE DRAWER ============ */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden">
            {/* Overlay — z-[60] above navbar */}
            <motion.div
              key="drawer-overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              onClick={closeMobile}
              className="
                fixed inset-0 z-[60]
                bg-black/60
                backdrop-blur-md
              "
            />

            {/* Drawer Panel — z-[70] above overlay */}
            <motion.div
              key="drawer-panel"
              dir="rtl"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                fixed top-0 right-0
                z-[70]

                w-[82%]
                max-w-[340px]

                h-full

                mobile-drawer-glass

                border-l border-white/[0.06]

                shadow-[-20px_0_80px_rgba(0,0,0,0.6)]

                flex flex-col

                overflow-y-auto
              "
            >
              {/* Drawer Header */}
              <motion.div
                variants={headerVariants}
                className="
                  flex items-center justify-between
                  px-6 pt-7 pb-6
                  border-b border-white/[0.04]
                "
              >
                {/* Logo in drawer */}
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-10 h-10
                      rounded-xl
                      bg-[#D4AF37]/10
                      border border-[#D4AF37]/20
                      flex items-center justify-center
                    "
                  >
                    <ShieldCheck
                      size={18}
                      className="text-[#D4AF37]"
                    />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-white text-base font-black tracking-wide">
                      TRUST
                    </span>
                    <span className="text-zinc-600 text-[9px] tracking-[3px]">
                      PLATFORM
                    </span>
                  </div>
                </div>

                <motion.button
                  onClick={closeMobile}
                  whileTap={{ scale: 0.85, rotate: 90 }}
                  className="
                    w-9 h-9
                    rounded-lg
                    bg-white/[0.04]
                    border border-white/[0.06]
                    flex items-center justify-center
                    text-zinc-400
                    hover:text-white
                    transition-colors duration-200
                  "
                  aria-label="Close menu"
                >
                  <X size={18} />
                </motion.button>
              </motion.div>

              {/* Navigation Links */}
              <div className="flex-1 px-5 py-6">
                <div className="space-y-2">
                  {navItems.map(
                    (item, index) => (
                      <motion.div
                        key={index}
                        variants={linkVariants}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMobile}
                          className="
                            group
                            drawer-link-glow

                            flex items-center justify-between

                            w-full

                            px-5 py-4

                            rounded-2xl

                            bg-white/[0.02]

                            border border-white/[0.04]

                            text-zinc-300
                            text-[15px]
                            font-medium

                            hover:bg-[#D4AF37]/[0.07]
                            hover:text-[#D4AF37]
                            hover:border-[#D4AF37]/20

                            active:scale-[0.98]

                            transition-all duration-300
                          "
                        >
                          <span>{item.name}</span>
                          <ChevronLeft
                            size={16}
                            className="
                              text-zinc-600
                              transition-transform duration-300
                              group-hover:-translate-x-1
                            "
                          />
                        </Link>
                      </motion.div>
                    )
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <motion.div
                variants={linkVariants}
                className="px-5 pb-8"
              >
                <Link
                  href="#contact"
                  onClick={closeMobile}
                  className="
                    flex items-center justify-center
                    w-full
                    bg-[#D4AF37]
                    hover:bg-[#E8D48B]
                    text-black
                    font-bold
                    text-sm
                    py-4
                    rounded-2xl
                    transition-all duration-300
                    shadow-[0_0_40px_rgba(212,175,55,0.15)]
                    active:scale-[0.97]
                    btn-shimmer
                  "
                >
                  تواصل الآن
                </Link>

                <p className="text-zinc-700 text-xs text-center mt-4 tracking-wider">
                  TRUST PLATFORM © 2026
                </p>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}