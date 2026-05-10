export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-500/20 blur-[60px] rounded-full" />
        
        {/* Loader Ring */}
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-yellow-500 animate-spin mb-4 relative z-10 shadow-[0_0_30px_rgba(212,175,55,0.3)]" />
        
        {/* Text Shimmer */}
        <div className="relative z-10 text-xs font-bold tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-white to-zinc-500 animate-[shimmer_2s_infinite] bg-[length:200%_auto]">
          TRUST PLATFORM
        </div>
      </div>
    </div>
  );
}
