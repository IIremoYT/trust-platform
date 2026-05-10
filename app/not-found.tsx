import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Cinematic Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h1 className="text-8xl md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-6 drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-500 mb-4">
          الصفحة غير موجودة
        </h2>
        
        <p className="text-zinc-500 max-w-md mx-auto mb-12 text-sm md:text-base leading-relaxed">
          عذراً، يبدو أنك تبحث عن صفحة غير موجودة أو تم نقلها. يرجى التأكد من الرابط أو العودة للصفحة الرئيسية.
        </p>

        <Link
          href="/"
          className="group relative inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 backdrop-blur-md active:scale-95 shadow-[0_0_40px_rgba(212,175,55,0.1)]"
        >
          <span className="text-white">العودة للرئيسية</span>
          <ArrowRight size={18} className="text-yellow-500 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay z-0"
        style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')" }}
      />
    </div>
  );
}
