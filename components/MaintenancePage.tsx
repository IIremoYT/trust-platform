"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-brand-gold/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-20 rounded-3xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(212,175,55,0.15)]"
        >
          <ShieldCheck size={36} className="text-brand-gold" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          تحت الصيانة
        </h1>

        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent rounded-full mb-6" />

        <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10">
          نعمل حالياً على تحسين المنصة لتقديم تجربة أفضل.
          <br />
          سنعود قريباً إن شاء الله.
        </p>

        {/* Pulse indicator */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-brand-gold rounded-full" />
            <div className="absolute inset-0 w-3 h-3 bg-brand-gold rounded-full animate-ping opacity-50" />
          </div>
          <span className="text-xs text-zinc-500 tracking-widest uppercase font-bold">
            Maintenance in progress
          </span>
        </div>
      </motion.div>

      {/* Film Grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay z-0"
        style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')" }}
      />
    </div>
  );
}
