"use client";

import { useRef } from "react";
import {
  Users,
  ShoppingCart,
  ShieldCheck,
  Clock3,
} from "lucide-react";

import { motion, useInView } from "framer-motion";

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-40px",
  });

  const stats = [
    {
      icon: <Users size={28} />,
      number: "+1,250",
      label: "عميل سعيد",
    },
    {
      icon: <ShoppingCart size={28} />,
      number: "+3,500",
      label: "عملية ناجحة",
    },
    {
      icon: <ShieldCheck size={28} />,
      number: "99%",
      label: "نسبة رضا العملاء",
    },
    {
      icon: <Clock3 size={28} />,
      number: "24/7",
      label: "دعم فني متاح",
    },
  ];

  return (
    <section dir="rtl" className="px-6 -mt-8 relative z-20" ref={sectionRef}>
      <div
        className="
          max-w-7xl mx-auto
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
          gap-5
        "
      >
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 30, scale: 0.95 }
            }
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              bg-[#0B0B0B]
              border border-white/5
              rounded-[2rem]
              px-8 py-8
              flex items-center justify-between
              hover:border-[#D4AF37]/15
              transition-all duration-500
              group
              touch-feedback-soft
              shadow-[0_4px_24px_rgba(0,0,0,0.4)]
              hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.06)]
            "
          >
            {/* Text */}
            <div>
              <h3
                className="
                  text-white
                  text-3xl
                  font-black
                  mb-2
                "
              >
                {item.number}
              </h3>

              <p
                className="
                  text-zinc-400
                  text-sm
                "
              >
                {item.label}
              </p>
            </div>

            {/* Icon */}
            <div
              className="
                text-[#D4AF37]
                bg-[#D4AF37]/10
                border border-[#D4AF37]/15
                p-4
                rounded-2xl
                shadow-[0_0_25px_rgba(212,175,55,0.06)]
                group-hover:scale-110
                transition-all duration-300
              "
            >
              {item.icon}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}