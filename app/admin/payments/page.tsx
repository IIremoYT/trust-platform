"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  Loader2,
  Trash2,
  Plus,
  CreditCard,
  Check,
  X,
  Copy,
} from "lucide-react";

interface PaymentMethod {
  id?: string;
  name: string;
  image: string;
  value: string;
  active: boolean;
}

export default function AdminPayments() {
  const [payments, setPayments] =
    useState<PaymentMethod[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  // Form
  const [name, setName] =
    useState("");

  const [image, setImage] =
    useState("");

  const [value, setValue] =
    useState("");

  /* =========================
     FETCH PAYMENTS
  ========================= */

  const fetchPayments = async () => {
    setFetching(true);

    try {
      const querySnapshot =
        await getDocs(
          collection(db, "payments")
        );

      const data =
        querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as PaymentMethod[];

      setPayments(data);

    } catch (error) {
      console.error(error);

    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchPayments();
    }, 0);
  }, []);

  /* =========================
     ADD PAYMENT
  ========================= */

  const handleAddPayment =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (
        !name ||
        !image ||
        !value
      ) {
        return alert(
          "من فضلك كمل البيانات"
        );
      }

      setLoading(true);

      try {
        const apiRes = await fetch("/api/admin/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, image, value }),
        });

        if (!apiRes.ok) throw new Error("API Error");

        // Reset
        setName("");
        setImage("");
        setValue("");

        fetchPayments();

        alert(
          "تم إضافة طريقة الدفع ✨"
        );

      } catch (error) {
        console.error(error);

        alert(
          "حدث خطأ أثناء الإضافة"
        );

      } finally {
        setLoading(false);
      }
    };

  /* =========================
     DELETE
  ========================= */

  const handleDelete =
    async (id: string) => {
      if (
        !confirm(
          "متأكد إنك عايز تمسح طريقة الدفع؟"
        )
      )
        return;

      try {
        const res = await fetch("/api/admin/payments", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) throw new Error("API Error");

        setPayments(
          payments.filter(
            (item) =>
              item.id !== id
          )
        );

      } catch (error) {
        console.error(error);

        alert(
          "خطأ في الحذف"
        );
      }
    };

  /* =========================
     TOGGLE ACTIVE
  ========================= */

  const toggleActive =
    async (
      id: string,
      current: boolean
    ) => {
      try {
        const res = await fetch("/api/admin/payments", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, active: !current }),
        });

        if (!res.ok) throw new Error("API Error");

        fetchPayments();

      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        text-white

        max-w-7xl
        mx-auto

        p-8

        space-y-12
      "
    >
      {/* Header */}
      <div>
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
          <CreditCard size={16} />
          PAYMENT METHODS
        </div>

        <h1
          className="
            text-4xl md:text-5xl
            font-black
            mb-3
          "
        >
          إدارة طرق الدفع
        </h1>

        <p className="text-zinc-500">
          إضافة وتعديل وسائل الدفع
          الخاصة بالموقع
        </p>
      </div>

      {/* Add Form */}
      <section
        className="
          bg-[#0A0A0A]
          border border-white/5

          rounded-[32px]

          p-8

          shadow-2xl
        "
      >
        <div
          className="
            flex items-center gap-2
            mb-8

            text-yellow-500
          "
        >
          <Plus size={18} />

          <h2
            className="
              text-2xl
              font-black
            "
          >
            إضافة طريقة دفع
          </h2>
        </div>

        <form
          onSubmit={
            handleAddPayment
          }
          className="
            grid
            grid-cols-1
            lg:grid-cols-4
            gap-5
          "
        >
          {/* Name */}
          <input
            type="text"
            placeholder="اسم الطريقة"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="
              bg-white/[0.03]
              border border-white/10

              rounded-2xl

              px-5 py-4

              text-white

              focus:outline-none
              focus:border-yellow-500/40
            "
          />

          {/* Upload Logo */}
          <div
            className="
              relative

              bg-white/[0.03]
              border border-white/10

              rounded-2xl

              px-5 py-4

              text-gray-400

              flex items-center gap-3

              cursor-pointer

              hover:bg-white/[0.05]

              transition-all
            "
          >
            <CreditCard size={18} />

            <span className="truncate">
              {image
                ? "تم اختيار اللوجو"
                : "اختر لوجو طريقة الدفع"}
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (!file) return;

                const reader =
                  new FileReader();

                reader.readAsDataURL(file);

                reader.onloadend =
                  () => {
                    setImage(
                      reader.result as string
                    );
                  };
              }}
              className="
                absolute inset-0
                opacity-0
                cursor-pointer
              "
            />
          </div>

          {/* Value */}
          <input
            type="text"
            placeholder="رقم / رابط / ID"
            value={value}
            onChange={(e) =>
              setValue(
                e.target.value
              )
            }
            className="
              bg-white/[0.03]
              border border-white/10

              rounded-2xl

              px-5 py-4

              text-white

              focus:outline-none
              focus:border-yellow-500/40
            "
          />

          {/* Button */}
          <button
            disabled={loading}
            className="
              bg-yellow-500
              hover:bg-yellow-400

              text-black
              font-bold

              rounded-2xl

              transition-all duration-300

              flex items-center justify-center
              gap-2

              disabled:opacity-50
            "
          >
            {loading ? (
              <Loader2
                className="
                  animate-spin
                "
              />
            ) : (
              <>
                <Plus size={18} />
                إضافة
              </>
            )}
          </button>
        </form>
      </section>

      {/* Payments */}
      <section>
        <div
          className="
            flex items-center justify-between
            mb-8
          "
        >
          <h2
            className="
              text-3xl
              font-black
            "
          >
            طرق الدفع الحالية

            <span className="text-yellow-500">
              {" "}
              ({payments.length})
            </span>
          </h2>
        </div>

        {/* Loading */}
        {fetching ? (
          <div
            className="
              flex items-center justify-center
              py-24
            "
          >
            <Loader2
              className="
                animate-spin
                text-yellow-500
              "
            />
          </div>
        ) : (
          <>
            {/* Empty */}
            {payments.length ===
            0 ? (
              <div
                className="
                  text-center
                  text-zinc-500
                  py-24
                "
              >
                لا توجد طرق دفع حالياً
              </div>
            ) : (
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-3
                  gap-6
                "
              >
                {payments.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="
                        bg-[#0A0A0A]
                        border border-white/5

                        rounded-[28px]

                        overflow-hidden

                        hover:border-yellow-500/20

                        transition-all duration-300
                      "
                    >
                      {/* Top */}
                      <div
                        className="
                          p-6

                          flex items-center justify-between
                        "
                      >
                        {/* Logo */}
                        <div
                          className="
                            w-14 h-14

                            rounded-2xl

                            bg-white/[0.03]

                            border border-white/5

                            flex items-center justify-center

                            overflow-hidden
                          "
                        >
                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              className="
                                w-10 h-10
                                object-contain
                              "
                            />
                          ) : (
                            <CreditCard
                              size={
                                22
                              }
                              className="text-zinc-600"
                            />
                          )}
                        </div>

                        {/* Status */}
                        <span
                          className={`
                            px-3 py-1

                            rounded-full

                            text-xs
                            font-bold

                            border

                            ${
                              item.active
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                            }
                          `}
                        >
                          {item.active
                            ? "مفعل"
                            : "مخفي"}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="px-6 pb-6">
                        <h3
                          className="
                            text-2xl
                            font-black
                            mb-3
                          "
                        >
                          {item.name}
                        </h3>

                        <div
                          className="
                            bg-white/[0.03]
                            border border-white/5

                            rounded-2xl

                            p-4

                            text-sm
                            text-zinc-400

                            break-all
                          "
                        >
                          {item.value}
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        className="
                          border-t border-white/5

                          p-5

                          flex items-center justify-between
                        "
                      >
                        {/* Copy */}
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              item.value
                            )
                          }
                          className="
                            flex items-center gap-2

                            text-zinc-400
                            hover:text-white

                            transition-all
                          "
                        >
                          <Copy size={16} />
                          نسخ
                        </button>

                        {/* Right */}
                        <div className="flex gap-2">

                          {/* Toggle */}
                          <button
                            onClick={() =>
                              toggleActive(
                                item.id!,
                                item.active
                              )
                            }
                            className={`
                              p-2

                              rounded-xl

                              transition-all

                              ${
                                item.active
                                  ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                                  : "bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white"
                              }
                            `}
                          >
                            {item.active ? (
                              <X
                                size={
                                  16
                                }
                              />
                            ) : (
                              <Check
                                size={
                                  16
                                }
                              />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() =>
                              handleDelete(
                                item.id!
                              )
                            }
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
                              size={16}
                            />
                          </button>

                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}