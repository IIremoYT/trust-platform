"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { db } from "@/lib/firebase";

interface Proof {
  id: string;
  image: string;
  title?: string;
  active: boolean;
}

export default function Proofs() {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);

  const [startIndex, setStartIndex] = useState(0);

  // Fetch
  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "proofs")
        );

        const data: Proof[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Proof, "id">),
        }));

        setProofs(data.filter((item) => item.active));
      } catch (error) {
        console.error("Error fetching proofs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProofs();
  }, []);

  // Auto Slider
  useEffect(() => {
    if (proofs.length === 0) return;

    const interval = setInterval(() => {
      setStartIndex((prev) =>
        prev + 1 >= proofs.length ? 0 : prev + 1
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [proofs]);

  // Show 5 only
  const visibleProofs = [];

  for (let i = 0; i < Math.min(5, proofs.length); i++) {
    visibleProofs.push(
      proofs[(startIndex + i) % proofs.length]
    );
  }

  return (
    <section
      id="proofs"
      dir="rtl"
      className="
        py-24 px-6
        relative overflow-hidden
      "
    >
      {/* Glow */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.05),transparent_60%)]
          pointer-events-none
        "
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-14">

          <div>
            <div
              className="
                inline-flex items-center gap-2
                mb-4
                text-yellow-500
                bg-yellow-500/10
                border border-yellow-500/20
                px-5 py-2
                rounded-full
                text-sm font-semibold
              "
            >
              <ShieldCheck size={16} />
              VERIFIED PROOFS
            </div>

            <h2
              className="
                text-white
                text-4xl md:text-5xl
                font-black
              "
            >
              إثباتاتنا
            </h2>
          </div>

          {/* Show More */}
          <Link
            href="/proofs"
            className="
              hidden md:flex
              items-center gap-2
              text-yellow-500
              hover:text-yellow-400
              transition-all duration-300
            "
          >
            عرض الكل
            <ArrowLeft size={18} />
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div
            className="
              grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5
              gap-6
            "
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="
                  aspect-[3/4]
                  rounded-[32px]
                  bg-zinc-900
                  border border-zinc-800
                  animate-pulse
                "
              ></div>
            ))}
          </div>
        ) : (
          <>
            {/* Proofs */}
            <div
              className="
                grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5
                gap-6
              "
            >
              {visibleProofs.map((item, index) => (
                <Link
                  key={`${item.id}-${index}`}
                  href={`/proofs/${item.id}`}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[32px]
                    border border-zinc-800
                    bg-[#0B0B0B]
                    hover:border-yellow-500/40
                    hover:-translate-y-2
                    transition-all duration-500
                  "
                >
                  {/* Glow */}
                  <div
                    className="
                      absolute top-0 right-0
                      w-32 h-32
                      bg-yellow-500/5
                      blur-3xl
                    "
                  ></div>

                  {/* Image */}
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.title}
                    className="
                      w-full
                      aspect-[3/4]
                      object-cover
                      group-hover:scale-105
                      transition-all duration-700
                    "
                  />

                  {/* Overlay */}
                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-t
                      from-black/80
                      via-transparent
                      to-transparent
                    "
                  ></div>

                  {/* Bottom */}
                  <div
                    className="
                      absolute bottom-0 right-0 left-0
                      p-5
                    "
                  >
                    <h3
                      className="
                        text-white
                        text-sm md:text-base
                        font-bold
                        mb-2
                      "
                    >
                      {item.title || "إثبات ناجح"}
                    </h3>

                    <span
                      className="
                        inline-flex
                        text-yellow-500
                        text-xs
                        bg-yellow-500/10
                        border border-yellow-500/20
                        px-3 py-1
                        rounded-full
                      "
                    >
                      موثق
                    </span>
                  </div>

                </Link>
              ))}
            </div>

            {/* Mobile Button */}
            {proofs.length > 5 && (
              <div className="flex justify-center mt-10 md:hidden">
                <Link
                  href="/proofs"
                  className="
                    border border-yellow-500/30
                    bg-yellow-500/5
                    hover:bg-yellow-500
                    hover:text-black
                    text-yellow-500
                    font-bold
                    px-8 py-3
                    rounded-2xl
                    transition-all duration-300
                  "
                >
                  عرض كل الإثباتات
                </Link>
              </div>
            )}

            {/* Empty */}
            {proofs.length === 0 && (
              <div className="text-center text-zinc-500 mt-10">
                لا توجد إثباتات حالياً
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}