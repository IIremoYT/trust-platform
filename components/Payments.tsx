"use client";

import { useEffect, useState, useRef } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  Copy,
  Check,
} from "lucide-react";

import { motion, useInView } from "framer-motion";

import { db } from "@/lib/firebase";
import { trustToast } from "./TrustToast";

interface PaymentMethod {
  id: string;
  name: string;
  image: string;
  value: string;
  active: boolean;
}

// Animated payment card
function PaymentCard({
  item,
  index,
  copiedId,
  onCopy,
}: {
  item: PaymentMethod;
  index: number;
  copiedId: string | null;
  onCopy: (value: string, id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 45, scale: 0.93 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 45, scale: 0.93 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[2rem]
        border border-white/5
        bg-[#0B0B0B]
        p-7
        hover:border-[#D4AF37]/15
        hover:-translate-y-2
        transition-all duration-500
        touch-feedback
        shadow-[0_4px_24px_rgba(0,0,0,0.4)]
        hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.06)]
      "
    >
      {/* Shimmer glow */}
      <div
        className="
          absolute top-0 right-0
          w-32 h-32
          bg-[#D4AF37]/5
          blur-3xl
          group-hover:bg-[#D4AF37]/8
          transition-all duration-700
        "
      ></div>

      {/* Logo */}
      <div
        className="
          relative
          h-[90px]
          flex items-center justify-center
          mb-8
        "
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="
            max-h-[52px]
            object-contain
            group-hover:scale-110
            transition-all duration-500
          "
        />
      </div>

      {/* Name */}
      <h3
        className="
          text-white
          text-center
          text-lg
          font-black
          mb-4
        "
      >
        {item.name}
      </h3>

      {/* Value */}
      <div
        className="
          bg-black/50
          border border-white/5
          rounded-2xl
          px-4 py-3
          mb-6
        "
      >
        <p
          className="
            text-zinc-300
            text-sm
            text-center
            break-all
            leading-7
          "
        >
          {item.value}
        </p>
      </div>

      {/* Copy Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() =>
          onCopy(item.value, item.id)
        }
        className="
          w-full
          bg-[#D4AF37]/10
          hover:bg-[#D4AF37]
          border border-[#D4AF37]/20
          hover:border-[#D4AF37]
          text-[#D4AF37]
          hover:text-black
          font-bold
          py-3
          rounded-2xl
          flex items-center justify-center gap-2
          transition-all duration-300
          btn-shimmer
        "
      >
        {copiedId === item.id ? (
          <>
            <Check size={18} />
            تم النسخ
          </>
        ) : (
          <>
            <Copy size={18} />
            نسخ البيانات
          </>
        )}
      </motion.button>

    </motion.div>
  );
}

export default function PaymentMethods() {
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(sectionRef, {
    once: true,
    margin: "-80px",
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "payments")
        );

        const data: PaymentMethod[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<PaymentMethod, "id">),
        }));

        setPayments(data.filter((item) => item.active));
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Copy with TRUST toast
  const handleCopy = async (
    value: string,
    id: string
  ) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopiedId(id);
      trustToast.copied();

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);

    } catch (error) {
      console.error(error);
      trustToast.error("فشل النسخ", "حاول مرة أخرى");
    }
  };

  return (
    <section
      id="payments"
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
          className="text-center mb-16"
        >

          <div
            className="
              inline-flex
              mb-5
              text-[#D4AF37]
              bg-[#D4AF37]/10
              border border-[#D4AF37]/20
              px-5 py-2
              rounded-full
              text-sm font-semibold
              label-luxury
            "
          >
            PAYMENT METHODS
          </div>

          <h2
            className="
              text-white
              text-5xl md:text-6xl
              font-black
              mb-6
            "
          >
            طرق الدفع المتاحة
          </h2>

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
            جميع وسائل الدفع المتاحة لدينا لتحويل الأموال بسهولة وأمان.
          </p>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div
            className="
              grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5
              gap-6
            "
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="
                  h-[250px]
                  rounded-[2rem]
                  shimmer-skeleton
                  border border-white/5
                "
              ></div>
            ))}
          </div>
        ) : (
          <>
            {/* Cards */}
            <div
              className="
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5
                gap-5 sm:gap-6
              "
            >
              {payments.map((item, index) => (
                <PaymentCard
                  key={item.id}
                  item={item}
                  index={index}
                  copiedId={copiedId}
                  onCopy={handleCopy}
                />
              ))}
            </div>

            {/* Empty */}
            {payments.length === 0 && (
              <div className="text-center text-zinc-500 mt-16 text-xl">
                لا توجد طرق دفع حالياً
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}