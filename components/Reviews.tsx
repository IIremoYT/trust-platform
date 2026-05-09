"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  Star,
  ShieldCheck,
} from "lucide-react";

import { db } from "@/lib/firebase";

import { motion } from "framer-motion";

interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  active: boolean;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "reviews")
        );

        const data: Review[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Review, "id">),
        }));

        // Active Only
        const activeReviews = data.filter(
          (item) => item.active
        );

        // Duplicate for infinite slider
        setReviews([
          ...activeReviews,
          ...activeReviews,
        ]);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Loading
  if (loading) {
    return (
      <section
        className="
          py-24
          bg-[#050505]
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-6
          "
        >
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-4
              gap-6
            "
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  h-[250px]
                  rounded-[32px]
                  bg-zinc-900
                  border border-zinc-800
                  animate-pulse
                "
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty
  if (reviews.length === 0) {
    return (
      <section
        id="reviews"
        className="
          py-24
          bg-[#050505]
          text-center
        "
      >
        <h2
          className="
            text-white
            text-4xl
            font-black
            mb-4
          "
        >
          آراء عملائنا
        </h2>

        <p className="text-zinc-500">
          لا توجد تقييمات حالياً
        </p>
      </section>
    );
  }

  return (
    <section
      id="reviews"
      dir="rtl"
      className="
        py-24
        bg-[#050505]
        overflow-hidden
        relative
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.05),transparent_60%)]
          pointer-events-none
        "
      ></div>

      {/* Header */}
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          mb-16
          text-center
          relative z-10
        "
      >
        <div
          className="
            inline-flex items-center gap-2
            mb-5
            text-yellow-500
            bg-yellow-500/10
            border border-yellow-500/20
            px-5 py-2
            rounded-full
            text-sm font-semibold
          "
        >
          <ShieldCheck size={16} />
          VERIFIED REVIEWS
        </div>

        <h2
          className="
            text-white
            text-4xl md:text-5xl
            font-black
            mb-5
          "
        >
          آراء عملائنا
        </h2>

        <p
          className="
            text-zinc-500
            text-lg
          "
        >
          نحن نفخر بثقتكم الدائمة بنا
        </p>
      </div>

{/* Buttons */}
<div
  className="
    flex flex-col sm:flex-row
    items-center justify-center
    gap-4
    mb-14
    relative z-10
  "
>

  {/* Add Review */}
  <a
    href="/reviews"
    className="
      bg-yellow-500
      hover:bg-yellow-400

      text-black
      font-bold

      px-8 py-4
      rounded-2xl

      transition-all duration-300

      shadow-[0_0_30px_rgba(250,204,21,0.2)]
    "
  >
    اكتب رأيك
  </a>

  {/* Show All */}
  <a
    href="/reviews"
    className="
      border border-zinc-700
      hover:border-yellow-500
      hover:text-yellow-500
      hover:bg-yellow-500/5

      text-white
      font-bold

      px-8 py-4
      rounded-2xl

      transition-all duration-300
    "
  >
    عرض كل التقييمات
  </a>

</div>

      {/* Slider */}
      <div className="relative group">

        <motion.div
          className="
            flex gap-6
            w-max
          "
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {reviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="
                w-[340px]
                md:w-[360px]

                group/card
                relative
                overflow-hidden

                bg-[#0B0B0B]
                border border-zinc-800

                rounded-[32px]

                p-8

                hover:border-yellow-500/30
                hover:-translate-y-2

                transition-all duration-500

                shrink-0
              "
            >
              {/* Glow */}
              <div
                className="
                  absolute top-0 right-0
                  w-40 h-40
                  bg-yellow-500/5
                  blur-3xl
                "
              ></div>

              {/* Top */}
              <div className="flex items-center justify-between mb-5">

                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={
                        i < review.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-zinc-700"
                      }
                    />
                  ))}
                </div>

                {/* Verified */}
                <div
                  className="
                    flex items-center gap-1

                    text-[10px]
                    text-green-400

                    bg-green-500/10
                    border border-green-500/20

                    px-3 py-1
                    rounded-full
                  "
                >
                  <ShieldCheck size={10} />
                  <span>موثق</span>
                </div>

              </div>

              {/* Comment */}
              <p
                className="
                  text-zinc-300
                  text-sm
                  leading-8

                  mb-8

                  min-h-[110px]
                "
              >
                "{review.comment}"
              </p>

              {/* User */}
              <div
                className="
                  flex items-center gap-3

                  border-t border-white/5
                  pt-5
                "
              >
                {/* Avatar */}
                <div
                  className="
                    w-12 h-12

                    rounded-2xl

                    bg-yellow-500/10
                    border border-yellow-500/20

                    flex items-center justify-center

                    text-yellow-500
                    font-black
                  "
                >
                  {review.name.charAt(0)}
                </div>

                {/* Info */}
                <div>
                  <h3
                    className="
                      text-white
                      font-bold
                      text-sm
                    "
                  >
                    {review.name}
                  </h3>

                  <p
                    className="
                      text-zinc-500
                      text-xs
                    "
                  >
                    عميل موثق
                  </p>
                </div>
              </div>

            </div>
          ))}
        </motion.div>

        {/* Left Fade */}
        <div
          className="
            absolute inset-y-0 left-0
            w-32
            bg-gradient-to-r
            from-[#050505]
            to-transparent
            z-10
            pointer-events-none
          "
        ></div>

        {/* Right Fade */}
        <div
          className="
            absolute inset-y-0 right-0
            w-32
            bg-gradient-to-l
            from-[#050505]
            to-transparent
            z-10
            pointer-events-none
          "
        ></div>

      </div>
    </section>
  );
}