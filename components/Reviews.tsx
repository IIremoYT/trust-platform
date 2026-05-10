"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  Star,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import { motion, useInView } from "framer-motion";

import { db } from "@/lib/firebase";

interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  active: boolean;
}

// Generate a consistent avatar gradient from name
function getAvatarGradient(name: string): string {
  const gradients = [
    "from-amber-500/20 to-orange-600/10",
    "from-emerald-500/20 to-teal-600/10",
    "from-violet-500/20 to-purple-600/10",
    "from-rose-500/20 to-pink-600/10",
    "from-cyan-500/20 to-blue-600/10",
    "from-lime-500/20 to-green-600/10",
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

// Animated review card
function ReviewCard({
  review,
  index,
}: {
  review: Review;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px",
  });

  const avatarGradient = getAvatarGradient(review.name);

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
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[2rem]
        border border-white/5
        bg-[#0B0B0B]
        p-8
        hover:border-[#D4AF37]/15
        hover:-translate-y-2
        transition-all duration-500
        touch-feedback-soft
        shadow-[0_4px_24px_rgba(0,0,0,0.4)]
        hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.06)]
      "
    >
      {/* Decorative Quote */}
      <span className="review-quote-mark">&ldquo;</span>

      {/* Glow */}
      <div
        className="
          absolute top-0 right-0
          w-40 h-40
          bg-[#D4AF37]/4
          blur-3xl
        "
      ></div>

      {/* Top */}
      <div className="relative z-10 flex items-center justify-between mb-6">

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[...Array(review.rating)].map((_, index) => (
            <Star
              key={index}
              size={16}
              className="
                fill-[#D4AF37]
                text-[#D4AF37]
              "
            />
          ))}
        </div>

        {/* Verified */}
        <div
          className="
            flex items-center gap-1
            text-emerald-400
            text-xs
            bg-emerald-500/8
            border border-emerald-500/15
            px-3 py-1
            rounded-full
          "
        >
          <ShieldCheck size={12} />
          موثق
        </div>

      </div>

      {/* Comment */}
      <p
        className="
          relative z-10
          text-zinc-300
          text-base
          leading-8
          mb-8
          text-editorial
        "
      >
        &ldquo;{review.comment}&rdquo;
      </p>

      {/* User */}
      <div className="relative z-10 flex items-center gap-4">

        {/* Avatar with gradient */}
        <div
          className={`
            w-12 h-12
            rounded-xl
            bg-gradient-to-br ${avatarGradient}
            border border-white/5
            flex items-center justify-center
            text-white/80
            font-bold
            text-base
          `}
        >
          {review.name.charAt(0)}
        </div>

        {/* Info */}
        <div>
          <h3
            className="
              text-white
              font-bold
              text-base
            "
          >
            {review.name}
          </h3>

          <p className="text-zinc-500 text-xs mt-0.5">
            عميل موثق
          </p>
        </div>

      </div>
    </motion.div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(sectionRef, {
    once: true,
    margin: "-80px",
  });

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

        setReviews(
          data.filter((item) => item.active)
        );

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Show only 6
  const visibleReviews = reviews.slice(0, 6);

  // Average Rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (acc, item) => acc + item.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <section
      id="reviews"
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

            {/* Badge */}
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
              VERIFIED REVIEWS
            </div>

            {/* Title */}
            <h2
              className="
                text-white
                text-4xl md:text-5xl
                font-black
                mb-4
              "
            >
              آراء العملاء
            </h2>

            {/* Average */}
            <div
              className="
                flex items-center gap-3
                text-zinc-400
              "
            >
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className="
                      fill-[#D4AF37]
                      text-[#D4AF37]
                    "
                  />
                ))}
              </div>

              <span className="text-sm">
                {averageRating}/5 بناءً على{" "}
                {reviews.length} تقييم
              </span>
            </div>
          </div>

          {/* Show More */}
          <Link
            href="/reviews"
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
              grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
              gap-6
            "
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="
                  h-[280px]
                  rounded-[2rem]
                  shimmer-skeleton
                  border border-white/5
                "
              ></div>
            ))}
          </div>
        ) : (
          <>
            {/* Reviews Grid */}
            <div
              className="
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                gap-5 sm:gap-6
              "
            >
              {visibleReviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={index}
                />
              ))}
            </div>

            {/* Main Button */}
            {reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  headerInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex justify-center mt-14"
              >
                <Link
                  href="/reviews"
                  className="
                    inline-flex items-center justify-center

                    bg-[#D4AF37]
                    hover:bg-[#E8D48B]

                    text-black
                    font-bold

                    px-10 py-4

                    rounded-2xl

                    transition-all duration-300

                    shadow-[0_0_40px_rgba(212,175,55,0.2)]

                    hover:scale-105
                    touch-feedback
                  "
                >
                  مشاهدة جميع التقييمات
                </Link>
              </motion.div>
            )}

            {/* Empty */}
            {reviews.length === 0 && (
              <div className="text-center text-zinc-500 mt-10">
                لا توجد تقييمات حالياً
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}