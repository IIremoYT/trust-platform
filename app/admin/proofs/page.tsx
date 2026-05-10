"use client";

import { useState, useEffect } from "react";

import { db } from "@/lib/firebase";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import {
  Loader2,
  Trash2,
  Image as ImageIcon,
  Plus,
  Check,
  X,
} from "lucide-react";

export default function AdminProofs() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  interface Proof {
    id: string;
    title?: string;
    image?: string;
    imageUrl?: string;
    active?: boolean;
    createdAt?: { toDate?: () => Date };
  }

  const [proofs, setProofs] = useState<Proof[]>([]);
  const [fetching, setFetching] = useState(true);

  const [inputKey, setInputKey] = useState(() => Date.now());

  // Fetch Proofs
  const fetchProofs = async () => {
    setFetching(true);

    try {
      const q = query(
        collection(db, "proofs"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Proof[];

      setProofs(data);

    } catch (error) {
      console.error(
        "Error fetching proofs:",
        error
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchProofs();
    }, 0);
  }, []);

  // Upload
  const handleUpload = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!file || !title) {
      return alert(
        "من فضلك كمل البيانات واختار صورة!"
      );
    }

    setLoading(true);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64String = reader.result;

      try {
        // Upload to API
        const res = await fetch(
          "/api/upload",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              image: base64String,
            }),
          }
        );

        const uploadData = await res.json();

        if (!uploadData.url) {
          throw new Error(
            uploadData.error ||
              "فشل الرفع"
          );
        }

        // Save to Firestore via Secure API
        const apiRes = await fetch("/api/admin/proofs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, image: uploadData.url }),
        });

        if (!apiRes.ok) throw new Error("API Error");

        // Reset
        setTitle("");
        setFile(null);
        setInputKey(Date.now());

        fetchProofs();

        alert("تم الرفع بنجاح ✨");

      } catch (error: unknown) {
        console.error(
          "Upload error:",
          error
        );

        alert(
          "خطأ في الرفع: " +
            (error instanceof Error ? error.message : "يرجى المحاولة مرة أخرى")
        );
      } finally {
        setLoading(false);
      }
    };
  };

  // Delete
  const handleDelete = async (
    id: string
  ) => {
    if (
      !confirm(
        "متأكد إنك عايز تمسح الإثبات ده؟"
      )
    )
      return;

    try {
      const res = await fetch("/api/admin/proofs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("API Error");

      setProofs(
        proofs.filter(
          (p) => p.id !== id
        )
      );

    } catch (error) {
      console.error(error);

      alert("خطأ في الحذف");
    }
  };

  // Toggle Active
  const toggleActive = async (
    id: string,
    current: boolean
  ) => {
    try {
      const res = await fetch("/api/admin/proofs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !current }),
      });

      if (!res.ok) throw new Error("API Error");

      fetchProofs();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      dir="rtl"
      className="
        p-8
        space-y-12
        max-w-6xl
        mx-auto
        min-h-screen
        text-white
      "
    >
      {/* Upload Form */}
      <section
        className="
          bg-[#0A0A0A]
          border border-white/5
          rounded-[32px]
          p-8
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="mb-8">

          <div
            className="
              inline-flex items-center gap-2

              text-yellow-500
              bg-yellow-500/10
              border border-yellow-500/20

              px-5 py-2
              rounded-full

              text-sm font-semibold

              mb-5
            "
          >
            <Plus size={16} />
            ADD PROOF
          </div>

          <h1
            className="
              text-4xl
              font-black
              mb-3
            "
          >
            إضافة إثبات جديد
          </h1>

          <p className="text-zinc-500">
            قم برفع صور الإثباتات
            الخاصة بالخدمات
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleUpload}
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
            items-end
          "
        >
          {/* Title */}
          <div className="space-y-3">

            <label
              className="
                text-sm
                text-zinc-400
              "
            >
              عنوان الإثبات
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="
                w-full

                bg-white/[0.03]
                border border-white/10

                rounded-2xl

                px-6 py-4

                text-white

                focus:outline-none
                focus:border-yellow-500/40

                transition-all
              "
              placeholder="مثال: تحويل ناجح"
            />
          </div>

          {/* Upload */}
          <div className="flex gap-4">

            {/* File Input */}
            <div
              className="
                flex-1
                relative

                bg-white/[0.03]
                border border-white/10

                rounded-2xl

                px-6 py-4

                text-gray-400
                text-sm

                flex items-center gap-3

                cursor-pointer

                hover:bg-white/[0.05]

                transition-all
              "
            >
              <ImageIcon size={18} />

              <span className="truncate">
                {file
                  ? file.name
                  : "اختر صورة الإثبات"}
              </span>

              <input
                key={inputKey}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] ||
                      null
                  )
                }
                className="
                  absolute inset-0
                  opacity-0
                  cursor-pointer
                "
              />
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className="
                bg-yellow-500
                hover:bg-yellow-400

                text-black
                font-bold

                px-10

                rounded-2xl

                transition-all duration-300

                disabled:opacity-50

                flex items-center justify-center

                min-w-[130px]
              "
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "رفع"
              )}
            </button>

          </div>
        </form>
      </section>

      {/* Proofs */}
      <section>

        {/* Header */}
        <div
          className="
            flex justify-between
            items-center
            mb-8
          "
        >
          <h2
            className="
              text-3xl
              font-black
            "
          >
            الإثباتات الحالية

            <span className="text-yellow-500">
              {" "}
              ({proofs.length})
            </span>
          </h2>
        </div>

        {/* Loading */}
        {fetching ? (
          <div
            className="
              flex justify-center
              py-20
            "
          >
            <Loader2
              className="
                animate-spin
                text-yellow-500
                w-10 h-10
              "
            />
          </div>
        ) : (
          <>
            {/* Grid */}
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-8
              "
            >
              {proofs.map((proof) => (
                <div
                  key={proof.id}
                  className="
                    group
                    relative

                    bg-[#0A0A0A]
                    border border-white/5

                    rounded-[2rem]
                    overflow-hidden

                    hover:border-yellow-500/30

                    transition-all duration-500

                    shadow-xl
                  "
                >
                  {/* Image */}
                  <div
                    className="
                      relative
                      h-64
                      overflow-hidden
                    "
                  >
                    <img
                      src={
                        proof.image ||
                        proof.imageUrl ||
                        "/placeholder.jpg"
                      }
                      alt={proof.title}
                      className="
                        w-full
                        h-full
                        object-cover

                        opacity-70

                        group-hover:opacity-100
                        group-hover:scale-110

                        transition-all duration-700
                      "
                    />
                  </div>

                  {/* Bottom */}
                  <div
                    className="
                      p-6

                      flex justify-between
                      items-center

                      bg-[#0D0D0D]/80
                      backdrop-blur-xl

                      border-t border-white/5
                    "
                  >
                    <div>
                      <span
                        className="
                          text-white
                          text-sm
                          font-semibold

                          block
                          mb-2
                        "
                      >
                        {proof.title}
                      </span>

                      <span
                        className={`
                          text-xs
                          px-3 py-1
                          rounded-full
                          border

                          ${
                            proof.active
                              ? "bg-green-500/10 border-green-500/20 text-green-400"
                              : "bg-red-500/10 border-red-500/20 text-red-400"
                          }
                        `}
                      >
                        {proof.active
                          ? "ظاهر"
                          : "مخفي"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">

                      {/* Toggle */}
                      <button
                        onClick={() =>
                          toggleActive(
                            proof.id,
                            !!proof.active
                          )
                        }
                        className={`
                          p-2
                          rounded-xl
                          transition-all

                          ${
                            proof.active
                              ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                              : "bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white"
                          }
                        `}
                      >
                        {proof.active ? (
                          <X size={18} />
                        ) : (
                          <Check size={18} />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          handleDelete(
                            proof.id
                          )
                        }
                        className="
                          p-2

                          bg-red-500/10
                          text-red-500

                          hover:bg-red-500
                          hover:text-white

                          rounded-xl

                          transition-all
                        "
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Empty */}
            {proofs.length === 0 && (
              <div
                className="
                  text-center
                  text-zinc-500
                  py-20
                "
              >
                لا توجد إثباتات حالياً
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}