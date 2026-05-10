"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { motion, useInView } from "framer-motion";

import { db } from "@/lib/firebase";
import ProofViewer from "./ProofViewer";

interface Proof {
  id: string;
  image: string;
  title?: string;
  active: boolean;
}

// Animated card wrapper
function ProofCard({
  item,
  index,
  onOpenViewer,
}: {
  item: Proof;
  index: number;
  onOpenViewer: (proof: Proof) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-60px",
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMobile(window.innerWidth < 1024);
    }, 0);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      onOpenViewer(item);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 50, scale: 0.92 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/proofs/${item.id}`}
        onClick={handleClick}
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
          touch-feedback
          shadow-[0_4px_24px_rgba(0,0,0,0.4)]
          hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.06)]
        "
      >
        {/* Glow */}
        <div
          className="
            absolute top-0 right-0
            w-32 h-32
            bg-[#D4AF37]/5
            blur-3xl
          "
        ></div>

        {/* Image */}
        <motion.div layoutId={`proof-image-${item.id}`}>
          <img
            src={item.image || "/placeholder.jpg"}
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
              text-[#D4AF37]
              text-xs
              bg-[#D4AF37]/10
              border border-[#D4AF37]/20
              px-3 py-1
              rounded-full
            "
          >
            موثق
          </span>
        </div>

      </Link>
    </motion.div>
  );
}

export default function Proofs() {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);

  const [startIndex, setStartIndex] = useState(0);

  // Viewer state
  const [viewerProof, setViewerProof] = useState<Proof | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(sectionRef, {
    once: true,
    margin: "-80px",
  });

  const openViewer = useCallback((proof: Proof) => {
    setViewerProof(proof);
  }, []);

  const closeViewer = useCallback(() => {
    setViewerProof(null);
  }, []);

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
    <>
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
            bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04),transparent_60%)]
            pointer-events-none
          "
        ></div>

        <div ref={sectionRef} className="relative z-10 max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              headerInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between mb-14"
          >

            <div>
              <div
                className="
                  inline-flex items-center gap-2
                  mb-4
                  text-[#D4AF37]
                  bg-[#D4AF37]/10
                  border border-[#D4AF37]/20
                  px-5 py-2
                  rounded-full
                  text-sm font-semibold
                  label-luxury
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
                text-[#D4AF37]
                hover:text-[#E8D48B]
                transition-all duration-300
              "
            >
              عرض الكل
              <ArrowLeft size={18} />
            </Link>
          </motion.div>

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
              {/* Proofs */}
              <div
                className="
                  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5
                  gap-5 sm:gap-6
                "
              >
                {visibleProofs.map((item, index) => (
                  <ProofCard
                    key={`${item.id}-${index}`}
                    item={item}
                    index={index}
                    onOpenViewer={openViewer}
                  />
                ))}
              </div>

              {/* Mobile Button */}
              {proofs.length > 5 && (
                <div className="flex justify-center mt-10 md:hidden">
                  <Link
                    href="/proofs"
                    className="
                      border border-[#D4AF37]/30
                      bg-[#D4AF37]/5
                      hover:bg-[#D4AF37]
                      hover:text-black
                      text-[#D4AF37]
                      font-bold
                      px-8 py-3
                      rounded-2xl
                      transition-all duration-300
                      touch-feedback
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

      {/* Fullscreen Cinematic Viewer */}
      <ProofViewer
        isOpen={!!viewerProof}
        onClose={closeViewer}
        image={viewerProof?.image || ""}
        title={viewerProof?.title}
        layoutId={viewerProof ? `proof-image-${viewerProof.id}` : undefined}
      />
    </>
  );
}