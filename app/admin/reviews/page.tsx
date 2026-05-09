"use client";

import { useEffect, useState } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { Check, Trash2, Star, X, Eye, EyeOff } from "lucide-react";
import { db } from "@/lib/firebase";

interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  active: boolean;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب البيانات - خليتها بنفس اسمك fetchReviews
  const fetchReviews = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reviews"));
      const data: Review[] = querySnapshot.docs.map((docu) => ({
        id: docu.id,
        ...(docu.data() as Omit<Review, "id">),
      }));
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // دمجنا الـ Toggle logic عشان نحدث الـ State فوراً (Optimistic UI)
  const toggleReview = async (id: string, currentStatus: boolean) => {
    try {
      // تحديث في الـ UI أولاً لسرعة الاستجابة
      setReviews(prev => prev.map(r => r.id === id ? { ...r, active: !currentStatus } : r));
      
      // التحديث في Firebase
      await updateDoc(doc(db, "reviews", id), {
        active: !currentStatus,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      fetchReviews(); // لو حصل فشل نرجع الداتا الأصلية
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("هل تريد حذف هذا التقييم نهائياً؟")) return;

    try {
      // تحديث الـ UI فوراً
      setReviews(prev => prev.filter(r => r.id !== id));
      // الحذف من Firebase
      await deleteDoc(doc(db, "reviews", id));
    } catch (error) {
      console.error("Error deleting review:", error);
      fetchReviews();
    }
  };

  return (
    <section dir="rtl" className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - بنفس تصميمك الراقي */}
        <div className="mb-14">
          <div className="inline-flex mb-4 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-5 py-2 rounded-full text-sm font-semibold">
            ADMIN REVIEWS
          </div>
          <h1 className="text-5xl font-black mb-4">إدارة التقييمات</h1>
          <p className="text-zinc-500">مراجعة وقبول أو حذف تقييمات العملاء لضمان جودة المحتوى.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-[#0B0B0B] border border-zinc-800 rounded-[32px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className={`bg-[#0B0B0B] border transition-all duration-500 rounded-[32px] p-6 ${review.active ? 'border-zinc-800' : 'border-red-900/30 opacity-70'}`}>
                
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-800"} />
                    ))}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${review.active ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                    {review.active ? "ظاهر للعامة" : "مخفي حالياً"}
                  </div>
                </div>

                <p className="text-zinc-300 leading-7 mb-8 min-h-[80px]">"{review.comment}"</p>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 font-black text-xl">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{review.name}</h3>
                    <p className="text-zinc-500 text-xs">عميل موثق</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => toggleReview(review.id, review.active)}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${review.active ? "bg-zinc-900 text-zinc-400 hover:bg-zinc-800" : "bg-yellow-500 text-black hover:bg-yellow-400"}`}
                  >
                    {review.active ? <><EyeOff size={18} /> إخفاء</> : <><Eye size={18} /> تفعيل</>}
                  </button>

                  <button
                    onClick={() => deleteReview(review.id)}
                    className="w-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="text-center py-20 bg-[#0B0B0B] rounded-[32px] border border-dashed border-zinc-800 text-zinc-500 font-medium">
            صندوق المراجعات فارغ تماماً..
          </div>
        )}
      </div>
    </section>
  );
}