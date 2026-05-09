"use client";

import { useEffect, useState } from "react";

import { auth } from "@/lib/firebase";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  useRouter,
  usePathname,
} from "next/navigation";

import Link from "next/link";

import {
  LayoutDashboard,
  Image as ImageIcon,
  Star,
  CreditCard,
  LogOut,
  Bell,
  Users,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const pathname =
    usePathname();

  const [authorized, setAuthorized] =
    useState(false);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  /* =========================
     AUTH CHECK
  ========================= */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
          // لو مش مسجل دخول
          if (
            !user &&
            pathname !== "/admin"
          ) {
            router.push("/admin");
          } else {
            setAuthorized(true);
          }

          setCheckingAuth(false);
        }
      );

    return () => unsubscribe();
  }, [pathname, router]);

  /* =========================
     MENU ITEMS
  ========================= */

  const menuItems = [
    {
      name: "لوحة التحكم",
      icon: (
        <LayoutDashboard size={20} />
      ),
      href: "/admin/dashboard",
    },

    {
      name: "الإثباتات",
      icon: (
        <ImageIcon size={20} />
      ),
      href: "/admin/proofs",
    },

    {
      name: "آراء العملاء",
      icon: (
        <Star size={20} />
      ),
      href: "/admin/reviews",
    },

    {
      name: "طرق الدفع",
      icon: (
        <CreditCard size={20} />
      ),
      href: "/admin/payments",
    },
  ];

  /* =========================
     CURRENT PAGE
  ========================= */

  const currentPage =
    menuItems.find(
      (item) =>
        pathname === item.href
    )?.name || "لوحة التحكم";

  /* =========================
     LOADING SCREEN
  ========================= */

  if (
    checkingAuth &&
    pathname !== "/admin"
  ) {
    return (
      <div
        className="
          min-h-screen
          bg-[#050505]
          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            w-14 h-14

            border-4
            border-yellow-500/20
            border-t-yellow-500

            rounded-full

            animate-spin
          "
        ></div>
      </div>
    );
  }

  /* =========================
     LOGIN PAGE ONLY
  ========================= */

  if (pathname === "/admin") {
    return <>{children}</>;
  }

  /* =========================
     BLOCK UNAUTHORIZED
  ========================= */

  if (!authorized) {
    return null;
  }

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout =
    async () => {
      try {
        await signOut(auth);

        router.push("/admin");

      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div
      dir="rtl"
      className="
        flex
        h-screen

        bg-[#050505]

        text-gray-300

        overflow-hidden
      "
    >
      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className="
          w-72

          bg-[#0A0A0A]

          border-l border-white/5

          flex flex-col

          p-6

          overflow-y-auto

          custom-scrollbar
        "
      >
        {/* Logo */}
        <div
          className="
            flex items-center gap-3

            mb-12

            px-2
          "
        >
          <div
            className="
              w-11 h-11

              bg-brand-yellow

              rounded-2xl

              flex items-center justify-center

              text-black
              font-black
              text-lg

              shadow-[0_0_25px_rgba(212,175,55,0.25)]
            "
          >
            T
          </div>

          <div>
            <h1
              className="
                text-white
                font-black
                text-xl
                tracking-tight
              "
            >
              TRUST
            </h1>

            <p
              className="
                text-[10px]
                text-gray-500
                tracking-[0.2em]
              "
            >
              ADMIN PANEL
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex
                  items-center
                  gap-3

                  px-4 py-4

                  rounded-2xl

                  transition-all duration-300

                  group

                  ${
                    active
                      ? `
                        bg-gradient-to-l
                        from-brand-yellow/10
                        to-transparent

                        border-r-4
                        border-brand-yellow

                        text-brand-yellow
                      `
                      : `
                        hover:bg-white/5
                        hover:text-white
                      `
                  }
                `}
              >
                <span
                  className={`
                    transition-all

                    ${
                      active
                        ? "text-brand-yellow"
                        : `
                          text-gray-500
                          group-hover:text-white
                        `
                    }
                  `}
                >
                  {item.icon}
                </span>

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-3

            px-4 py-4

            mt-10

            rounded-2xl

            text-red-500

            hover:bg-red-500/10

            border border-transparent
            hover:border-red-500/20

            transition-all duration-300
          "
        >
          <LogOut size={20} />

          <span className="font-bold">
            تسجيل الخروج
          </span>
        </button>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main
        className="
          flex-1

          flex flex-col

          overflow-hidden
        "
      >
        {/* =========================
            NAVBAR
        ========================= */}

        <header
          className="
            h-20

            border-b border-white/5

            bg-[#0A0A0A]/60

            backdrop-blur-xl

            flex items-center justify-between

            px-8

            shrink-0
          "
        >
          {/* Title */}
          <div>
            <h2
              className="
                text-white
                text-xl
                font-black
              "
            >
              {currentPage}
            </h2>

            <p
              className="
                text-xs
                text-gray-500
                mt-1
              "
            >
              إدارة محتوى الموقع
            </p>
          </div>

          {/* Right */}
          <div
            className="
              flex items-center gap-6
            "
          >
            {/* Notifications */}
            <button
              className="
                relative

                text-gray-400
                hover:text-white

                transition-all
              "
            >
              <Bell size={22} />

              <span
                className="
                  absolute
                  -top-1 -right-1

                  w-4 h-4

                  bg-red-500

                  rounded-full

                  text-[10px]
                  text-white

                  flex items-center justify-center

                  border-2 border-[#0A0A0A]
                "
              >
                3
              </span>
            </button>

            {/* Admin */}
            <div
              className="
                flex items-center gap-3

                pr-6

                border-r border-white/10
              "
            >
              <div className="text-left">
                <p
                  className="
                    text-white
                    text-sm
                    font-bold
                  "
                >
                  Admin
                </p>

                <p
                  className="
                    text-gray-500
                    text-[10px]
                    mt-1
                  "
                >
                  مسؤول النظام
                </p>
              </div>

              <div
                className="
                  w-11 h-11

                  rounded-full

                  bg-gradient-to-br
                  from-gray-700
                  to-gray-900

                  border border-white/10

                  flex items-center justify-center
                "
              >
                <Users
                  size={20}
                  className="
                    text-gray-400
                  "
                />
              </div>
            </div>
          </div>
        </header>

        {/* =========================
            PAGE CONTENT
        ========================= */}

        <section
          className="
            flex-1

            overflow-y-auto

            custom-scrollbar

            p-8
          "
        >
          {children}
        </section>
      </main>
    </div>
  );
}