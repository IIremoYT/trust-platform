"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  ArrowRight,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

import { db } from "@/lib/firebase";

interface ProofPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Proof {
  image: string;
  title?: string;
  description?: string;

  createdAt?: {
    toDate?: () => Date;
  };
}

export default function ProofPage({
  params,
}: ProofPageProps) {
  const [proof, setProof] =
    useState<Proof | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchProof = async () => {
      try {
        const resolvedParams =
          await params;

        const docRef = doc(
          db,
          "proofs",
          resolvedParams.id
        );

        const docSnap =
          await getDoc(docRef);

        if (docSnap.exists()) {
          setProof(
            docSnap.data() as Proof
          );
        }

      } catch (error) {
        console.error(error);

      } finally {
        setLoading(false);
      }
    };

    fetchProof();
  }, [params]);

  // Loading
  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-black
          flex items-center justify-center
        "
      >
        <div
          className="
            w-16 h-16

            border-4
            border-yellow-500/20
            border-t-yellow-500

            rounded-full

            animate-spin
          "
        />
      </div>
    );
  }

  // Not Found
  if (!proof) {
    return (
      <div
        className="
          min-h-screen
          bg-black
          text-white

          flex items-center justify-center

          text-3xl font-bold
        "
      >
        Proof Not Found
      </div>
    );
  }

  return (
    <section
      dir="rtl"
      className="
        min-h-screen
        bg-black
        relative
        overflow-hidden
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute top-0 left-1/2
          -translate-x-1/2

          w-[800px] h-[800px]

          bg-yellow-500/10
          blur-[180px]

          rounded-full

          pointer-events-none
        "
      />

      <div
        className="
          relative z-10

          max-w-7xl
          mx-auto

          px-6 py-16
        "
      >
        {/* Top Bar */}
        <div
          className="
            flex items-center justify-between
            mb-12
          "
        >
          {/* Back */}
          <Link
            href="/proofs"
            className="
              flex items-center gap-2

              text-zinc-400
              hover:text-yellow-500

              transition-all duration-300
            "
          >
            <ArrowRight size={18} />
            الرجوع
          </Link>

          {/* Badge */}
          <div
            className="
              flex items-center gap-2

              bg-yellow-500/10
              border border-yellow-500/20

              text-yellow-500

              px-5 py-2
              rounded-full

              text-sm font-semibold
            "
          >
            <ShieldCheck size={18} />
            VERIFIED PROOF
          </div>
        </div>

        {/* Main Layout */}
        <div
          className="
            grid lg:grid-cols-2
            gap-14
            items-start
          "
        >
          {/* Image */}
          <div
            className="
              relative
              group
            "
          >
            {/* Glow */}
            <div
              className="
                absolute inset-0

                bg-yellow-500/10
                blur-3xl

                scale-110

                rounded-[40px]
              "
            />

            {/* Card */}
            <div
              className="
                relative
                overflow-hidden

                rounded-[40px]

                border border-zinc-800
                bg-[#0B0B0B]

                shadow-[0_0_60px_rgba(0,0,0,0.6)]
              "
            >
              <img
                src={
                  proof.image ||
                  "/placeholder.jpg"
                }
                alt={proof.title}
                className="
                  w-full
                  object-cover

                  group-hover:scale-[1.02]

                  transition-all duration-700
                "
              />

              {/* Overlay */}
              <div
                className="
                  absolute inset-0

                  bg-gradient-to-t
                  from-black/50
                  via-transparent
                  to-transparent
                "
              />
            </div>
          </div>

          {/* Content */}
          <div className="pt-4">

            {/* Small Label */}
            <div
              className="
                inline-flex items-center
                gap-2

                mb-6

                text-yellow-500

                bg-yellow-500/10
                border border-yellow-500/20

                px-4 py-2
                rounded-full

                text-sm
              "
            >
              <ShieldCheck size={16} />
              إثبات موثق
            </div>

            {/* Title */}
            <h1
              className="
                text-white

                text-5xl md:text-6xl
                font-black

                leading-tight

                mb-8
              "
            >
              {proof.title ||
                "إثبات ناجح"}
            </h1>

            {/* Description */}
            <p
              className="
                text-zinc-400
                text-lg

                leading-9

                mb-10
              "
            >
              {proof.description ||
                "هذا إثبات حقيقي من تعاملاتنا الناجحة مع العملاء، نحرص دائماً على تقديم أفضل خدمة بأعلى جودة وموثوقية كاملة."}
            </p>

            {/* Info Cards */}
            <div
              className="
                grid sm:grid-cols-2
                gap-5
                mb-10
              "
            >
              {/* Status */}
              <div
                className="
                  bg-[#0B0B0B]
                  border border-zinc-800

                  rounded-3xl

                  p-6
                "
              >
                <div
                  className="
                    flex items-center gap-3
                    mb-3
                    text-yellow-500
                  "
                >
                  <ShieldCheck size={20} />

                  <span className="font-semibold">
                    الحالة
                  </span>
                </div>

                <p
                  className="
                    text-white
                    text-lg
                    font-bold
                  "
                >
                  ناجح وموثق
                </p>
              </div>

              {/* Date */}
              <div
                className="
                  bg-[#0B0B0B]
                  border border-zinc-800

                  rounded-3xl

                  p-6
                "
              >
                <div
                  className="
                    flex items-center gap-3
                    mb-3
                    text-yellow-500
                  "
                >
                  <CalendarDays size={20} />

                  <span className="font-semibold">
                    التاريخ
                  </span>
                </div>

                <p
                  className="
                    text-white
                    text-lg
                    font-bold
                  "
                >
                  {proof.createdAt?.toDate
                    ? proof.createdAt
                        .toDate()
                        .toLocaleDateString(
                          "ar-EG"
                        )
                    : "حديثاً"}
                </p>
              </div>
            </div>

            {/* Button */}
            <Link
              href="/proofs"
              className="
                inline-flex
                items-center justify-center

                bg-yellow-500
                hover:bg-yellow-400

                text-black
                font-bold

                px-8 py-4

                rounded-2xl

                transition-all duration-300

                shadow-[0_0_40px_rgba(250,204,21,0.25)]
              "
            >
              مشاهدة باقي الإثباتات
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}