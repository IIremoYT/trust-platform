"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { motion } from "framer-motion";

import { db } from "@/lib/firebase";
import ProofViewer from "@/components/ProofViewer";

interface Proof {
  id: string;
  image: string;
  title?: string;
  active: boolean;
}

export default function ProofsPage() {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerProof, setViewerProof] = useState<Proof | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMobile(window.innerWidth < 1024);
    }, 0);
  }, []);

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
    <>
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
            bg-[#D4AF37]/8
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
                text-[#D4AF37]
                bg-[#D4AF37]/10
                border border-[#D4AF37]/20
                px-5 py-2
                rounded-full
                text-sm font-semibold
                mb-6
                label-luxury
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
                text-editorial
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
                    rounded-[2rem]
                    shimmer-skeleton
                    border border-white/5
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
                  gap-5 sm:gap-6
                "
              >
                {proofs.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.5,
                      delay: (index % 5) * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {isMobile ? (
                      <button
                        onClick={() => setViewerProof(item)}
                        className="
                          group
                          relative
                          overflow-hidden
                          rounded-[2rem]
                          border border-white/5
                          bg-[#0B0B0B]
                          hover:border-[#D4AF37]/20
                          transition-all duration-500
                          w-full text-right
                          touch-feedback
                          shadow-[0_4px_24px_rgba(0,0,0,0.4)]
                        "
                      >
                        <motion.div layoutId={`proof-image-${item.id}`}>
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            className="
                              w-full
                              aspect-[3/4]
                              object-cover
                              group-hover:scale-105
                              transition-all duration-700
                            "
                          />
                        </motion.div>

                        <div
                          className="
                            absolute inset-0
                            bg-gradient-to-t
                            from-black/80
                            via-transparent
                            to-transparent
                          "
                        ></div>

                        <div className="absolute bottom-0 right-0 left-0 p-4">
                          <h3 className="text-white text-sm font-bold mb-1.5">
                            {item.title || "إثبات ناجح"}
                          </h3>
                          <span
                            className="
                              inline-flex text-[#D4AF37] text-xs
                              bg-[#D4AF37]/10 border border-[#D4AF37]/20
                              px-2.5 py-0.5 rounded-full
                            "
                          >
                            موثق
                          </span>
                        </div>
                      </button>
                    ) : (
                      <Link
                        href={`/proofs/${item.id}`}
                        className="
                          group
                          relative
                          overflow-hidden
                          rounded-[2rem]
                          border border-white/5
                          bg-[#0B0B0B]
                          hover:border-[#D4AF37]/20
                          hover:-translate-y-2
                          transition-all duration-500
                          block
                          shadow-[0_4px_24px_rgba(0,0,0,0.4)]
                          hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.06)]
                        "
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="
                            w-full
                            aspect-[3/4]
                            object-cover
                            group-hover:scale-105
                            transition-all duration-700
                          "
                        />

                        <div
                          className="
                            absolute inset-0
                            bg-gradient-to-t
                            from-black/80
                            via-transparent
                            to-transparent
                          "
                        ></div>

                        <div className="absolute bottom-0 right-0 left-0 p-5">
                          <h3 className="text-white text-sm md:text-base font-bold mb-2">
                            {item.title || "إثبات ناجح"}
                          </h3>
                          <span
                            className="
                              inline-flex text-[#D4AF37] text-xs
                              bg-[#D4AF37]/10 border border-[#D4AF37]/20
                              px-3 py-1 rounded-full
                            "
                          >
                            موثق
                          </span>
                        </div>
                      </Link>
                    )}
                  </motion.div>
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

      {/* Fullscreen Viewer */}
      <ProofViewer
        isOpen={!!viewerProof}
        onClose={() => setViewerProof(null)}
        image={viewerProof?.image || ""}
        title={viewerProof?.title}
        layoutId={viewerProof ? `proof-image-${viewerProof.id}` : undefined}
      />
    </>
  );
}