"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Lock, User, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        // Force a hard refresh to let the middleware detect the cookie
        window.location.href = "/admin/dashboard";
      } else {
        throw new Error("Failed to create session");
      }
    } catch (err: unknown) {
      console.error(err);
      setError("بيانات الدخول غير صحيحة يا يوسف، راجع الإيميل والباسورد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md bg-card-bg border border-white/5 p-10 rounded-[32px] relative overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-yellow/10 blur-[80px]"></div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-white text-2xl font-black">لوحة التحكم</h1>
          <p className="text-gray-500 text-sm mt-2">برجاء تسجيل الدخول للمتابعة</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2 mr-1">البريد الإلكتروني</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white focus:border-brand-yellow/50 outline-none transition-all"
                placeholder="admin@trust.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 mr-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white focus:border-brand-yellow/50 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-yellow hover:bg-yellow-500 text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-brand-yellow/10 disabled:opacity-50"
          >
            {loading ? "جاري التحقق..." : "دخول المنطقة الآمنة"}
          </button>
        </form>
      </div>
    </main>
  );
}
