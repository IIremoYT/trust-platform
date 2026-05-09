"use client";

import { useEffect, useState } from "react";
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

import { db } from "@/lib/firebase";

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
          bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.05),transparent_60%)]
          pointer-events-none
        "
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-14">

          <div>

            {/* Badge */}
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
                    size={18}
                    className="
                      fill-yellow-500
                      text-yellow-500
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
              grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
              gap-6
            "
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="
                  h-[280px]
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
            {/* Reviews Grid */}
            <div
              className="
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                gap-6
              "
            >
              {visibleReviews.map((review) => (
                <div
                  key={review.id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[32px]
                    border border-zinc-800
                    bg-[#0B0B0B]
                    p-8
                    hover:border-yellow-500/30
                    hover:-translate-y-2
                    transition-all duration-500
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
                  <div className="flex items-center justify-between mb-6">

                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, index) => (
                        <Star
                          key={index}
                          size={18}
                          className="
                            fill-yellow-500
                            text-yellow-500
                          "
                        />
                      ))}
                    </div>

                    {/* Verified */}
                    <div
                      className="
                        flex items-center gap-1
                        text-green-400
                        text-xs
                        bg-green-500/10
                        border border-green-500/20
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
                      text-zinc-300
                      text-lg
                      leading-9
                      mb-10
                    "
                  >
                    "{review.comment}"
                  </p>

                  {/* User */}
                  <div className="flex items-center gap-4">

                    {/* Avatar */}
                    <div
                      className="
                        w-14 h-14
                        rounded-2xl
                        bg-yellow-500/10
                        border border-yellow-500/20
                        flex items-center justify-center
                        text-yellow-500
                        font-black
                        text-lg
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
                          text-lg
                        "
                      >
                        {review.name}
                      </h3>

                      <p className="text-zinc-500 text-sm">
                        عميل حقيقي
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Main Button */}
            {reviews.length > 0 && (
              <div className="flex justify-center mt-14">
                <Link
                  href="/reviews"
                  className="
                    inline-flex items-center justify-center

                    bg-yellow-500
                    hover:bg-yellow-400

                    text-black
                    font-bold

                    px-10 py-4

                    rounded-2xl

                    transition-all duration-300

                    shadow-[0_0_40px_rgba(250,204,21,0.25)]

                    hover:scale-105
                  "
                >
                  مشاهدة جميع التقييمات
                </Link>
              </div>
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
