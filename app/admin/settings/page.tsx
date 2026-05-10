"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { trustToast } from "@/components/TrustToast";
import { Settings, Save, LayoutTemplate, Link as LinkIcon, Power, MessageSquare } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings State
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);
  const [announcementText, setAnnouncementText] = useState("Designed & Developed by Youssef Elkhouly");
  const [showAnnouncementButton, setShowAnnouncementButton] = useState(true);
  const [announcementButtonText, setAnnouncementButtonText] = useState("");
  const [announcementButtonLink, setAnnouncementButtonLink] = useState("https://wa.me/201095528015");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "global"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.showAnnouncementBar !== undefined) setShowAnnouncementBar(data.showAnnouncementBar);
        if (data.announcementText !== undefined) setAnnouncementText(data.announcementText);
        if (data.showAnnouncementButton !== undefined) setShowAnnouncementButton(data.showAnnouncementButton);
        if (data.announcementButtonText !== undefined) setAnnouncementButtonText(data.announcementButtonText);
        if (data.announcementButtonLink !== undefined) setAnnouncementButtonLink(data.announcementButtonLink);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const loadingId = trustToast.loading("جاري حفظ الإعدادات...");

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showAnnouncementBar,
          announcementText,
          showAnnouncementButton,
          announcementButtonText,
          announcementButtonLink,
        }),
      });

      if (!res.ok) throw new Error("فشل في حفظ الإعدادات");

      trustToast.dismiss(loadingId);
      trustToast.success("تم الحفظ بنجاح", "تم تحديث إعدادات الموقع");
    } catch (error) {
      console.error(error);
      trustToast.error("حدث خطأ", "لم يتم حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center text-brand-gold">
        جاري تحميل الإعدادات...
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-4 md:p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-4 text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-5 py-2 rounded-full text-sm font-semibold">
            <Settings size={16} />
            إعدادات المنصة
          </div>
          <h1 className="text-4xl font-black mb-3 text-white">إعدادات الموقع</h1>
          <p className="text-gray-400">التحكم في الشريط الإعلاني والإعدادات العامة</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-gold hover:bg-yellow-600 text-black px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>

      {/* Announcement Bar Settings Card */}
      <div className="bg-[#0A0A0A]/50 backdrop-blur-sm border border-white/10 rounded-[28px] p-6 md:p-8 space-y-8">
        <div className="flex items-center gap-3 text-brand-gold mb-6 border-b border-white/5 pb-6">
          <LayoutTemplate size={24} />
          <h2 className="text-2xl font-bold text-white">الشريط الإعلاني (Announcement Bar)</h2>
        </div>

        {/* Global Toggle */}
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
          <div>
            <h3 className="text-lg font-bold text-white">إظهار الشريط الإعلاني</h3>
            <p className="text-sm text-gray-400">تشغيل أو إيقاف الشريط أعلى الموقع بالكامل</p>
          </div>
          <button
            onClick={() => setShowAnnouncementBar(!showAnnouncementBar)}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${showAnnouncementBar ? 'bg-brand-gold' : 'bg-gray-700'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full transition-transform ${showAnnouncementBar ? 'translate-x-0' : '-translate-x-6'}`} />
          </button>
        </div>

        <div className={`space-y-6 transition-opacity duration-300 ${!showAnnouncementBar ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Announcement Text */}
          <div>
            <label className="flex items-center gap-2 text-white font-bold mb-3">
              <MessageSquare size={18} className="text-brand-gold" />
              نص الإعلان
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full bg-black/50 border border-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-gold/50"
              placeholder="مثال: خصم 20٪ بمناسبة الافتتاح..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            {/* Button Toggle */}
            <div className="col-span-1 md:col-span-2 flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
              <div>
                <h3 className="text-lg font-bold text-white">إظهار زر الأكشن</h3>
                <p className="text-sm text-gray-400">إظهار زر بجوار النص (مثل زر الواتساب)</p>
              </div>
              <button
                onClick={() => setShowAnnouncementButton(!showAnnouncementButton)}
                className={`w-14 h-8 rounded-full p-1 transition-colors ${showAnnouncementButton ? 'bg-brand-gold' : 'bg-gray-700'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform ${showAnnouncementButton ? 'translate-x-0' : '-translate-x-6'}`} />
              </button>
            </div>

            {/* Button Text */}
            <div className={`transition-opacity ${!showAnnouncementButton ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="block text-white font-bold mb-3">النص داخل الزر (اختياري)</label>
              <input
                type="text"
                value={announcementButtonText}
                onChange={(e) => setAnnouncementButtonText(e.target.value)}
                className="w-full bg-black/50 border border-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-gold/50"
                placeholder="اترك فارغاً لإظهار أيقونة واتساب فقط"
              />
            </div>

            {/* Button Link */}
            <div className={`transition-opacity ${!showAnnouncementButton ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="flex items-center gap-2 text-white font-bold mb-3">
                <LinkIcon size={18} className="text-brand-gold" />
                رابط الزر
              </label>
              <input
                type="text"
                value={announcementButtonLink}
                onChange={(e) => setAnnouncementButtonLink(e.target.value)}
                className="w-full bg-black/50 border border-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-gold/50 text-left"
                dir="ltr"
                placeholder="https://wa.me/..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
