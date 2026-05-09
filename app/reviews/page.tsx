"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  Star,
  ShieldCheck,
} from "lucide-react";

import { db } from "@/lib/firebase";

interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  active: boolean;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

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

        // Active only
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

  // Submit Review
  const handleSubmit = async () => {
    if (!name || !comment) return;

    try {
      setSending(true);

      await addDoc(collection(db, "reviews"), {
        name,
        comment,
        rating,
        active: false,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);

      setName("");
      setComment("");
      setRating(5);

    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

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
              inline-flex items-center gap-2
              text-yellow-500
              bg-yellow-500/10
              border border-yellow-500/20
              px-5 py-2
              rounded-full
              text-sm font-semibold
              mb-6
            "
          >
            <ShieldCheck size={16} />
            VERIFIED REVIEWS
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
            آراء العملاء
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
            جميع تقييمات العملاء الحقيقية وتجاربهم معنا.
          </p>
        </div>

        {/* Buttons */}
        <div
          className="
            flex flex-col sm:flex-row
            items-center justify-center
            gap-4
            mb-14
          "
        >

          {/* Add Review */}
          <a
            href="#add-review"
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

          {/* Back Home */}
          <a
            href="/"
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
            العودة للرئيسية
          </a>

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
              {reviews.map((review) => (
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

            {/* Empty */}
            {reviews.length === 0 && (
              <div className="text-center text-zinc-500 mt-16 text-xl">
                لا توجد تقييمات حالياً
              </div>
            )}
          </>
        )}

        {/* Add Review */}
        <section
          id="add-review"
          className="mt-24 max-w-3xl mx-auto"
        >

          <div
            className="
              bg-[#0B0B0B]
              border border-zinc-800
              rounded-[40px]
              p-8 md:p-10
            "
          >
            {/* Header */}
            <div className="mb-10 text-center">

              <div
                className="
                  inline-flex
                  mb-4
                  text-yellow-500
                  bg-yellow-500/10
                  border border-yellow-500/20
                  px-5 py-2
                  rounded-full
                  text-sm font-semibold
                "
              >
                ADD REVIEW
              </div>

              <h2
                className="
                  text-white
                  text-4xl
                  font-black
                  mb-4
                "
              >
                أضف تقييمك
              </h2>

              <p className="text-zinc-500">
                سيتم مراجعة التقييم قبل نشره
              </p>
            </div>

            {/* Name */}
            <div className="mb-6">
              <label className="text-white block mb-3">
                الاسم
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اكتب اسمك"
                className="
                  w-full
                  bg-black
                  border border-zinc-800
                  rounded-2xl
                  px-5 py-4
                  text-white
                  outline-none
                  focus:border-yellow-500/40
                  transition-all duration-300
                "
              />
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="text-white block mb-4">
                التقييم
              </label>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    type="button"
                  >
                    <Star
                      size={28}
                      className={
                        star <= rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-zinc-700"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-8">
              <label className="text-white block mb-3">
                التعليق
              </label>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب رأيك هنا..."
                rows={5}
                className="
                  w-full
                  bg-black
                  border border-zinc-800
                  rounded-2xl
                  px-5 py-4
                  text-white
                  outline-none
                  resize-none
                  focus:border-yellow-500/40
                  transition-all duration-300
                "
              ></textarea>
            </div>

            {/* Success */}
            {success && (
              <div
                className="
                  mb-6
                  bg-green-500/10
                  border border-green-500/20
                  text-green-400
                  rounded-2xl
                  px-5 py-4
                "
              >
                تم إرسال تقييمك بنجاح ✨
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={sending}
              className="
                w-full
                bg-yellow-500
                hover:bg-yellow-400
                disabled:opacity-50
                text-black
                font-black
                py-4
                rounded-2xl
                transition-all duration-300
                shadow-[0_0_30px_rgba(250,204,21,0.2)]
              "
            >
              {sending ? "جاري الإرسال..." : "إرسال التقييم"}
            </button>

          </div>
        </section>

      </div>
    </section>
  );
}