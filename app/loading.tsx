export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-brand-gold/10 blur-[80px] rounded-full" />

      <div className="relative flex flex-col items-center gap-6">
        {/* Logo Mark */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.15)]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-brand-gold"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          {/* Spin Ring */}
          <div className="absolute -inset-3 border-2 border-transparent border-t-brand-gold/40 rounded-3xl animate-spin" style={{ animationDuration: '2s' }} />
        </div>

        {/* Brand Text */}
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.4em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-zinc-600 via-white to-zinc-600 animate-[shimmer_2.5s_infinite] bg-[length:200%_auto]">
            TRUST PLATFORM
          </p>
        </div>
      </div>

      {/* Film Grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
        style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')" }}
      />
    </div>
  );
}
