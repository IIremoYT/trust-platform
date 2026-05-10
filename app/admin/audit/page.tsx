"use client";

import { useState, useEffect } from "react";
import { Clock, FileEdit, Globe, Trash2, Settings, ShieldAlert, Star, CreditCard, Archive } from "lucide-react";

interface AuditEvent {
  id: string;
  action: string;
  details?: Record<string, unknown>;
  timestamp?: { _seconds: number };
}

const actionConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  proof_created: { label: "إثبات جديد", icon: Globe, color: "text-green-400" },
  proof_status_changed: { label: "تغيير حالة إثبات", icon: FileEdit, color: "text-yellow-400" },
  proof_deleted: { label: "حذف إثبات", icon: Trash2, color: "text-red-400" },
  review_approved: { label: "قبول تقييم", icon: Star, color: "text-green-400" },
  review_deleted: { label: "حذف تقييم", icon: Trash2, color: "text-red-400" },
  payment_created: { label: "إضافة طريقة دفع", icon: CreditCard, color: "text-blue-400" },
  payment_deleted: { label: "حذف طريقة دفع", icon: Trash2, color: "text-red-400" },
  settings_updated: { label: "تحديث الإعدادات", icon: Settings, color: "text-brand-gold" },
  admin_login_failed: { label: "محاولة دخول فاشلة", icon: ShieldAlert, color: "text-red-500" },
};

function formatTime(seconds: number): string {
  const date = new Date(seconds * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 7) return `منذ ${days} يوم`;
  return date.toLocaleDateString("ar-EG", { day: "numeric", month: "short", year: "numeric" });
}

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const res = await fetch("/api/admin/audit");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (e) {
        console.error("Audit fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, []);

  return (
    <div dir="rtl" className="p-4 md:p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-4 text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-5 py-2 rounded-full text-sm font-semibold">
          <Clock size={16} />
          سجل العمليات
        </div>
        <h1 className="text-4xl font-black text-white mb-3">سجل النشاط</h1>
        <p className="text-gray-400">آخر 50 عملية تمت في لوحة التحكم</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-zinc-500 py-20">
          لا توجد عمليات مسجلة حتى الآن
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute right-5 top-0 bottom-0 w-px bg-white/5" />

          <div className="space-y-1">
            {events.map((event) => {
              const cfg = actionConfig[event.action] || {
                label: event.action,
                icon: Clock,
                color: "text-zinc-400",
              };
              const Icon = cfg.icon;

              return (
                <div key={event.id} className="relative flex items-start gap-4 pr-2 py-3 group">
                  {/* Dot */}
                  <div className={`relative z-10 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/20 transition-colors ${cfg.color}`}>
                    <Icon size={16} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">{cfg.label}</p>

                    {event.details && Object.keys(event.details).length > 0 && (
                      <p className="text-zinc-500 text-xs mt-1">
                        {(() => {
                          const d = event.details!;
                          // If there's a summary field, show it directly
                          if (d.summary) return String(d.summary);
                          // If there's a title, show it
                          if (d.title) return String(d.title);
                          // If there's a status change, describe it
                          if (d.status) {
                            const statusLabels: Record<string, string> = { draft: "مسودة", published: "منشور", archived: "مؤرشف" };
                            return `الحالة: ${statusLabels[String(d.status)] || d.status}`;
                          }
                          // Fallback: show clean key-value
                          return Object.entries(d)
                            .filter(([k]) => k !== "id")
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" • ");
                        })()}
                      </p>
                    )}
                  </div>

                  {/* Time */}
                  <span className="text-xs text-zinc-600 shrink-0 pt-0.5">
                    {event.timestamp?._seconds
                      ? formatTime(event.timestamp._seconds)
                      : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
