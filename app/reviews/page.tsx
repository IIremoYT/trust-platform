"use client";

import { useEffect, useState, useRef } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  Star,
  ShieldCheck,
} from "lucide-react";

import { motion, useInView } from "framer-motion";

import { db } from "@/lib/firebase";
import { trustToast } from "@/components/TrustToast";

interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  active: boolean;
}

// Spam keyword list
const SPAM_KEYWORDS = [
  "http://", "https://", "www.", ".com", ".net",
  "casino", "viagra", "crypto", "bitcoin", "forex",
  "click here", "free money", "earn money",
];

function containsSpam(text: string): boolean {
  const lower = text.toLowerCase();
  return SPAM_KEYWORDS.some(keyword => lower.includes(keyword));
}

// Avatar gradient from name
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

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [honeypot, setHoneypot] = useState(""); // Bot trap

  const [sending, setSending] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0); // Rate limiting

  const formRef = useRef<HTMLDivElement>(null);
  const formInView = useInView(formRef, { once: true, margin: "-60px" });

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
    // Honeypot check
    if (honeypot) return;

    if (!name.trim() || !comment.trim()) {
      trustToast.error("بيانات ناقصة", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // Rate limiting — 30 seconds between submissions
    const now = Date.now();
    if (now - lastSubmit < 30000) {
      trustToast.error("انتظر قليلاً", "يرجى الانتظار قبل إرسال تقييم آخر");
      return;
    }

    // Spam check
    if (containsSpam(name) || containsSpam(comment)) {
      trustToast.error("محتوى غير مسموح", "يرجى إزالة الروابط أو المحتوى المشبوه");
      return;
    }

    let loadingId: string | number | undefined;

    try {
      setSending(true);

      loadingId = trustToast.loading("جاري إرسال تقييمك...");

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, rating, honeypot }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("انتظر قليلاً قبل الإرسال مرة أخرى.");
        }
        if (response.status === 403) {
          throw new Error("محتوى غير مسموح.");
        }
        throw new Error("فشل الإرسال.");
      }

      trustToast.dismiss(loadingId);
      trustToast.success("تم إرسال تقييمك بنجاح ✨", "سيتم مراجعته ونشره قريباً");

      setName("");
      setComment("");
      setRating(5);
      setLastSubmit(Date.now());

    } catch (error: any) {
      console.error(error);
      if (loadingId) trustToast.dismiss(loadingId);
      trustToast.error("حدث خطأ", error.message || "يرجى المحاولة مرة أخرى");
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
              inline-flex items-center gap-2
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
              text-editorial
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
              bg-[#D4AF37]
              hover:bg-[#E8D48B]

              text-black
              font-bold

              px-8 py-4
              rounded-2xl

              transition-all duration-300

              shadow-[0_0_30px_rgba(212,175,55,0.15)]
              touch-feedback
              btn-shimmer
            "
          >
            اكتب رأيك
          </a>

          {/* Back Home */}
          <a
            href="/"
            className="
              border border-zinc-700
              hover:border-[#D4AF37]
              hover:text-[#D4AF37]
              hover:bg-[#D4AF37]/5

              text-white
              font-bold

              px-8 py-4
              rounded-2xl

              transition-all duration-300
              touch-feedback
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
                gap-6
              "
            >
              {reviews.map((review) => {
                const avatarGradient = getAvatarGradient(review.name);
                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
                    "
                  >
                    {/* Quote */}
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
                            className="fill-[#D4AF37] text-[#D4AF37]"
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

                      {/* Avatar */}
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
                        <h3 className="text-white font-bold text-base">
                          {review.name}
                        </h3>
                        <p className="text-zinc-500 text-xs mt-0.5">
                          عميل موثق
                        </p>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty */}
            {reviews.length === 0 && (
              <div className="text-center text-zinc-500 mt-16 text-xl">
                لا توجد تقييمات حالياً
              </div>
            )}
          </>
        )}

        {/* Add Review Form */}
        <section
          id="add-review"
          className="mt-24 max-w-3xl mx-auto"
          ref={formRef}
        >

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="
              bg-[#0B0B0B]
              border border-white/5
              rounded-[2rem]
              p-8 md:p-10
              shadow-[0_4px_24px_rgba(0,0,0,0.4)]
            "
          >
            {/* Header */}
            <div className="mb-10 text-center">

              <div
                className="
                  inline-flex
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

            {/* Honeypot — invisible to users */}
            <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Name */}
            <div className="mb-6">
              <label className="text-white block mb-3 text-sm font-medium">
                الاسم
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اكتب اسمك"
                maxLength={50}
                className="
                  w-full
                  bg-black
                  border border-white/5
                  rounded-2xl
                  px-5 py-4
                  text-white
                  outline-none
                  focus:border-[#D4AF37]/30
                  transition-all duration-300
                  placeholder:text-zinc-600
                "
              />
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="text-white block mb-4 text-sm font-medium">
                التقييم
              </label>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    type="button"
                    className="touch-feedback transition-transform duration-150"
                  >
                    <Star
                      size={28}
                      className={
                        star <= rating
                          ? "fill-[#D4AF37] text-[#D4AF37]"
                          : "text-zinc-700"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-8">
              <label className="text-white block mb-3 text-sm font-medium">
                التعليق
              </label>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب رأيك هنا..."
                rows={5}
                maxLength={500}
                className="
                  w-full
                  bg-black
                  border border-white/5
                  rounded-2xl
                  px-5 py-4
                  text-white
                  outline-none
                  resize-none
                  focus:border-[#D4AF37]/30
                  transition-all duration-300
                  placeholder:text-zinc-600
                "
              ></textarea>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={sending}
              className="
                w-full
                bg-[#D4AF37]
                hover:bg-[#E8D48B]
                disabled:opacity-50
                text-black
                font-black
                py-4
                rounded-2xl
                transition-all duration-300
                shadow-[0_0_30px_rgba(212,175,55,0.15)]
                btn-shimmer
              "
            >
              {sending ? "جاري الإرسال..." : "إرسال التقييم"}
            </motion.button>

          </motion.div>
        </section>

      </div>
    </section>
  );
}