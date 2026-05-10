import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";

/**
 * TRUST Platform Notification System
 * Premium toast notifications with luxury styling
 */

export const trustToast = {
  success: (message: string, description?: string) => {
    toast(message, {
      description,
      icon: <CheckCircle2 size={18} className="text-emerald-400" />,
      style: {
        background: '#0D0D0D',
        border: '1px solid rgba(52, 211, 153, 0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(52, 211, 153, 0.04)',
      },
    });
  },

  error: (message: string, description?: string) => {
    toast(message, {
      description,
      icon: <XCircle size={18} className="text-red-400" />,
      style: {
        background: '#0D0D0D',
        border: '1px solid rgba(239, 68, 68, 0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(239, 68, 68, 0.04)',
      },
    });
  },

  loading: (message: string) => {
    return toast(message, {
      icon: <Loader2 size={18} className="text-[#D4AF37] animate-spin" />,
      duration: Infinity,
      style: {
        background: '#0D0D0D',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.04)',
      },
    });
  },

  dismiss: (id: string | number) => {
    toast.dismiss(id);
  },

  info: (message: string, description?: string) => {
    toast(message, {
      description,
      icon: <ShieldCheck size={18} className="text-[#D4AF37]" />,
      style: {
        background: '#0D0D0D',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.04)',
      },
    });
  },

  copied: () => {
    toast("تم النسخ بنجاح", {
      icon: <CheckCircle2 size={18} className="text-[#D4AF37]" />,
      duration: 1500,
      style: {
        background: '#0D0D0D',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.04)',
      },
    });
  },
};
