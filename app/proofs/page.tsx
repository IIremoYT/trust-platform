"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface Proof {
  id: string;
  image: string;
  title?: string;
  active: boolean;
}

export default function ProofsPage() {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProofs();
  }, []);

  return (
    <section
      dir="rtl"
      className="
        min-h-screen
        bg-black
        relative
        overflow-hidden
        py-24 px-6
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute top-0 left-1/2
          -translate-x-1/2
          w-[900px] h-[900px]
          bg-yellow-500/10
          blur-[200px]
          rounded-full
          pointer-events-none
        "
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">

          <div
            className="
              inline-flex items-center
              gap-2
              text-yellow-500
              bg-yellow-500/10
              border border-yellow-500/20
              px-5 py-2
              rounded-full
              text-sm font-semibold
              mb-6
            "
          >
            VERIFIED PROOFS
          </div>

          <h1
            className="
              text-white
              text-5xl md:text-7xl
              font-black
              leading-tight
              mb-6
            "
          >
            جميع الإثباتات
          </h1>

          <p
            className="
              text-zinc-400
              text-lg
              max-w-2xl
              mx-auto
              leading-9
            "
          >
            جميع الإثباتات الحقيقية والموثقة من تعاملاتنا الناجحة مع العملاء.
          </p>
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
            {/* Proofs Grid */}
            <div
              className="
                grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5
                gap-6
              "
            >
              {proofs.map((item) => (
                <Link
                  key={item.id}
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
                  {/* Image */}
                  <img
                    src={item.image}
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

                  {/* Bottom Content */}
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

            {/* Empty */}
            {proofs.length === 0 && (
              <div className="text-center text-zinc-500 mt-16 text-xl">
                لا توجد إثباتات حالياً
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}