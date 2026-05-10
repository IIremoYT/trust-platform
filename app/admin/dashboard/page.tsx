"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { db } from "@/lib/firebase";

import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getCountFromServer,
  doc,
  getDoc,
} from "firebase/firestore";

import {
  ImageIcon,
  Star,
  CreditCard,
  Users,
  PlusCircle,
  Eye,
  Trash2,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function DashboardHome() {
  // Stats
  const [stats, setStats] = useState({
    proofs: 0,
    reviews: 0,
    payments: 0,
    visitors: 0,
  });

  interface Proof {
    id: string;
    image?: string;
    title?: string;
    createdAt?: { toDate?: () => Date };
    active?: boolean;
    status?: "draft" | "published" | "archived";
  }

  // Recent Proofs
  const [recentProofs, setRecentProofs] =
    useState<Proof[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    // Fetch Stats
    const fetchStatsData = async () => {
      try {
        const proofsCol =
          collection(db, "proofs");

        const reviewsCol =
          collection(db, "reviews");

        const paymentsCol =
          collection(db, "payments");

        const visitorsDocRef = doc(
          db,
          "analytics",
          "stats"
        );

        const [
          proofsSnap,
          reviewsSnap,
          paymentsSnap,
          visitorsSnap,
        ] = await Promise.all([
          getCountFromServer(proofsCol),
          getCountFromServer(reviewsCol),
          getCountFromServer(paymentsCol),
          getDoc(visitorsDocRef),
        ]);

        setStats({
          proofs:
            proofsSnap.data().count,

          reviews:
            reviewsSnap.data().count,

          payments:
            paymentsSnap.data().count,

          visitors:
            visitorsSnap.exists()
              ? visitorsSnap.data()
                .totalViews || 0
              : 0,
        });

      } catch (error) {
        console.error(
          "Stats Error:",
          error
        );
      }
    };

    // Real-time Proofs
    const proofsQuery = query(
      collection(db, "proofs"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe =
      onSnapshot(
        proofsQuery,
        (snapshot) => {
          const proofsData =
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Proof[];

          setRecentProofs(
            proofsData
          );

          setLoading(false);
        }
      );

    fetchStatsData();

    return () => unsubscribe();
  }, []);

  // Cards
  const statsCards = [
    {
      name: "إجمالي الإثباتات",
      value: stats.proofs,
      sub: "كل الإثباتات",
      icon: <ImageIcon size={24} />,
      color:
        "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },

    {
      name: "آراء العملاء",
      value: stats.reviews,
      sub: "كل التقييمات",
      icon: <Star size={24} />,
      color:
        "bg-green-500/10 text-green-500 border-green-500/20",
    },

    {
      name: "طرق الدفع",
      value: stats.payments,
      sub: "وسائل الدفع",
      icon: (
        <CreditCard size={24} />
      ),
      color:
        "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },

    {
      name: "الزوار",
      value: stats.visitors,
      sub: "إجمالي الزيارات",
      icon: <Users size={24} />,
      color:
        "bg-brand-gold/10 text-brand-gold border-brand-gold/20",
    },
  ];

  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        text-white
        space-y-8
      "
    >
      {/* Header */}
      <div
        className="
          flex flex-col md:flex-row
          items-start md:items-center
          justify-between
          gap-6
        "
      >
        <div>
          <div
            className="
              inline-flex items-center gap-2

              mb-4

              text-brand-gold

              bg-brand-gold/10
              border border-brand-gold/20

              px-5 py-2
              rounded-full

              text-sm font-semibold
            "
          >
            <ShieldCheck size={16} />
            TRUST ADMIN PANEL
          </div>

          <h1
            className="
              text-4xl md:text-5xl
              font-black
              mb-3
            "
          >
            لوحة التحكم
          </h1>

          <p className="text-gray-400">
            إدارة كاملة للموقع
            والإثباتات والتقييمات
          </p>
        </div>

        {/* Quick Action */}
        <Link
          href="/admin/proofs"
          className="
            bg-brand-gold
            hover:bg-brand-gold

            text-black
            font-bold

            px-8 py-4

            rounded-2xl

            transition-all duration-300

            shadow-[0_0_30px_rgba(212,175,55,0.3)]
          "
        >
          إدارة الإثباتات
        </Link>
      </div>

      {/* Stats */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >
        {statsCards.map(
          (stat, index) => (
            <div
              key={index}
              className="
                bg-[#0A0A0A]/50
                backdrop-blur-sm
                border border-white/10

                rounded-[28px]

                p-6

                hover:border-white/20
                hover:shadow-2xl hover:shadow-brand-gold/5

                transition-all duration-300
              "
            >
              <div
                className="
                  flex items-start
                  justify-between
                  mb-6
                "
              >
                <div>
                  <p
                    className="
                      text-gray-400
                      text-sm
                      font-medium
                      mb-2
                    "
                  >
                    {stat.name}
                  </p>

                  <h3
                    className="
                      text-4xl
                      font-black
                    "
                  >
                    {stat.value.toLocaleString()}
                  </h3>
                </div>

                <div
                  className={`
                    p-4
                    rounded-2xl
                    border

                    ${stat.color}
                  `}
                >
                  {stat.icon}
                </div>
              </div>

              <p
                className="
                  text-gray-500
                "
              >
                {stat.sub}
              </p>
            </div>
          )
        )}
      </div>

      {/* Main Grid */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-8
        "
      >
        {/* Recent Proofs */}
        <div className="xl:col-span-2">

          <section
            className="
              bg-[#0A0A0A]/50
              backdrop-blur-sm
              border border-white/10

              rounded-[32px]

              overflow-hidden

              shadow-2xl
            "
          >
            {/* Header */}
            <div
              className="
                flex items-center justify-between

                p-6

                border-b border-white/5
              "
            >
              <div>
                <h2
                  className="
                    text-2xl
                    font-black
                    mb-2
                  "
                >
                  أحدث الإثباتات
                </h2>

                <p className="text-gray-400 text-sm font-medium">
                  آخر الإثباتات المضافة
                </p>
              </div>

              <Link
                href="/admin/proofs"
                className="
                  text-brand-gold
                  hover:text-brand-gold

                  text-sm
                  font-bold

                  transition-all
                "
              >
                عرض الكل
              </Link>
            </div>

            {/* Loading */}
            {loading ? (
              <div
                className="
                  flex items-center justify-center
                  py-24
                "
              >
                <Loader2
                  className="
                    animate-spin
                    text-brand-gold
                  "
                />
              </div>
            ) : (
              <>
                {/* Empty */}
                {recentProofs.length ===
                  0 ? (
                  <div
                    className="
                      text-gray-400
                      py-24
                      font-medium
                    "
                  >
                    لا توجد إثباتات حالياً
                  </div>
                ) : (
                  <div className="overflow-x-auto">

                    <table
                      className="
                        w-full
                        text-right
                      "
                    >
                      <thead>
                        <tr
                          className="
                            border-b border-white/10
                            text-gray-400
                            text-sm
                            font-medium
                          "
                        >
                          <th className="p-6">
                            الصورة
                          </th>

                          <th className="p-6">
                            العنوان
                          </th>

                          <th className="p-6">
                            التاريخ
                          </th>

                          <th className="p-6">
                            الحالة
                          </th>

                          <th className="p-6 text-center">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {recentProofs.map(
                          (proof) => (
                            <tr
                              key={
                                proof.id
                              }
                              className="
                                border-b border-white/10
                                last:border-0

                                hover:bg-white/[0.04]

                                transition-all
                              "
                            >
                              {/* Image */}
                              <td className="p-6">
                                <div
                                  className="
                                    w-14 h-14

                                    rounded-2xl
                                    overflow-hidden

                                    bg-[#050505]
                                    border border-white/10
                                  "
                                >
                                  {proof.image ? (
                                    <img
                                      src={
                                        proof.image
                                      }
                                      alt=""
                                      className="
                                        w-full h-full
                                        object-cover
                                      "
                                    />
                                  ) : (
                                    <div
                                      className="
                                        w-full h-full
                                        flex items-center justify-center
                                        text-gray-500
                                        font-bold
                                      "
                                    >
                                      صورة
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Title */}
                              <td className="p-6 font-semibold">
                                {proof.title ||
                                  "بدون عنوان"}
                              </td>

                              {/* Date */}
                              <td
                                className="
                                  p-6
                                  text-gray-400
                                  text-sm
                                  font-medium
                                "
                              >
                                {proof.createdAt
                                  ?.toDate
                                  ? proof.createdAt
                                    .toDate()
                                    .toLocaleDateString(
                                      "ar-EG"
                                    )
                                  : "حديثاً"}
                              </td>

                              {/* Status */}
                              <td className="p-6">
                                {(() => {
                                  const s = proof.status || (proof.active ? "published" : "draft");
                                  const cfg: Record<string, { label: string; cls: string }> = {
                                    draft: { label: "مسودة", cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
                                    published: { label: "منشور", cls: "bg-green-500/10 text-green-500 border-green-500/20" },
                                    archived: { label: "مؤرشف", cls: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
                                  };
                                  const c = cfg[s] || cfg.draft;
                                  return (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${c.cls}`}>
                                      {c.label}
                                    </span>
                                  );
                                })()}
                              </td>

                              {/* Actions */}
                              <td className="p-6">
                                <div
                                  className="
                                    flex items-center justify-center
                                    gap-2
                                  "
                                >
                                  {/* View */}
                                  <Link
                                    href={`/proofs/${proof.id}`}
                                    className="
                                      p-2

                                      rounded-xl

                                      bg-white/5
                                      hover:bg-white/10

                                      text-zinc-400
                                      hover:text-white

                                      transition-all
                                    "
                                  >
                                    <Eye size={16} />
                                  </Link>

                                  {/* Delete */}
                                  <button
                                    className="
                                      p-2

                                      rounded-xl

                                      bg-red-500/10
                                      hover:bg-red-500

                                      text-red-500
                                      hover:text-white

                                      transition-all
                                    "
                                  >
                                    <Trash2
                                      size={
                                        16
                                      }
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>

                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">

          {/* Quick Actions */}
          <section
            className="
              bg-[#0A0A0A]
              border border-white/5

              rounded-[32px]

              p-8

              shadow-2xl
            "
          >
            <h3
              className="
                text-2xl
                font-black
                mb-8
              "
            >
              إجراءات سريعة
            </h3>

            <div className="space-y-4">

              {/* Proofs */}
              <Link
                href="/admin/proofs"
                className="
                  flex items-center gap-4

                  p-5

                  rounded-2xl

                  bg-purple-500/5
                  border border-purple-500/10

                  text-purple-500

                  hover:bg-purple-500/10

                  transition-all
                "
              >
                <PlusCircle size={20} />

                <div>
                  <h4 className="font-bold">
                    إضافة إثبات
                  </h4>

                  <p className="text-xs opacity-70">
                    رفع إثبات جديد
                  </p>
                </div>
              </Link>

              {/* Reviews */}
              <Link
                href="/admin/reviews"
                className="
                  flex items-center gap-4

                  p-5

                  rounded-2xl

                  bg-green-500/5
                  border border-green-500/10

                  text-green-500

                  hover:bg-green-500/10

                  transition-all
                "
              >
                <Star size={20} />

                <div>
                  <h4 className="font-bold">
                    إدارة الآراء
                  </h4>

                  <p className="text-xs opacity-70">
                    التحكم في التقييمات
                  </p>
                </div>
              </Link>

              {/* Payments */}
              <Link
                href="/admin/payments"
                className="
                  flex items-center gap-4

                  p-5

                  rounded-2xl

                  bg-blue-500/5
                  border border-blue-500/10

                  text-blue-500

                  hover:bg-blue-500/10

                  transition-all
                "
              >
                <CreditCard size={20} />

                <div>
                  <h4 className="font-bold">
                    طرق الدفع
                  </h4>

                  <p className="text-xs opacity-70">
                    تعديل وسائل الدفع
                  </p>
                </div>
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
