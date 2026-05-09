"use client";

export default function HeroSection() {
  return (
    <section
      id="home"
      dir="rtl"
      className="
        relative overflow-hidden
        border-b border-zinc-900
        bg-[#050505]
        before:absolute
        before:inset-0
        before:bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08),transparent_60%)]
        before:pointer-events-none
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32 relative z-10">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-right">

            {/* Badge */}
            <span
              className="
                inline-flex items-center
                mb-6
                text-sm
                text-yellow-500
                border border-yellow-500/20
                bg-yellow-500/10
                px-5 py-2
                rounded-full
                backdrop-blur-md
              "
            >
              TRUST PLATFORM
            </span>

            {/* Heading */}
            <h1
              className="
                text-white
                text-5xl md:text-7xl
                font-black
                leading-[1.2]
                tracking-tight
                mb-8
              "
            >
              الثقة هي أساسنا
              <br />
              والأدلة هي{" "}
              <span className="text-yellow-500">
                برهاننا
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                text-zinc-400
                text-lg md:text-xl
                leading-9
                mb-10
                max-w-2xl
                mx-auto lg:mx-0
              "
            >
              نقدم أفضل الخدمات بأعلى جودة وأسعار مناسبة
              مع إثباتات حقيقية من عملائنا
            </p>

            {/* Buttons */}
            <div
              className="
                flex flex-col sm:flex-row
                gap-5
                justify-center lg:justify-start
              "
            >

              {/* WhatsApp */}
              <a
                href="#contact"
                className="
                  bg-yellow-500
                  hover:bg-yellow-400
                  transition-all duration-300
                  text-black
                  font-bold
                  px-10 py-4
                  rounded-2xl
                  shadow-[0_0_40px_rgba(250,204,21,0.25)]
                  hover:scale-[1.03]
                "
              >
                تواصل عبر واتساب
              </a>

              {/* Proofs */}
              <a
                href="#proofs"
                className="
                  border border-zinc-700
                  hover:border-yellow-500
                  hover:text-yellow-500
                  hover:bg-yellow-500/5
                  transition-all duration-300
                  text-white
                  px-10 py-4
                  rounded-2xl
                  backdrop-blur-sm
                "
              >
                عرض الإثباتات
              </a>

            </div>
          </div>

          {/* Shield Image */}
          <div className="order-1 lg:order-2 flex justify-center">

            <div className="relative">

              {/* Glow */}
              <div
                className="
                  absolute inset-0
                  bg-yellow-500/10
                  blur-2xl
                  rounded-full
                  scale-125
                "
              ></div>

              {/* Decorative Rings */}
              <div
                className="
                  absolute inset-0
                  rounded-full
                  border border-yellow-500/10
                  scale-110
                "
              ></div>

              {/* Image */}
              <img
                src="/shield.webp"
                alt="Trust Shield"
                className="
                  relative
                  w-[420px] md:w-[620px]
                  object-contain
                  drop-shadow-[0_0_50px_rgba(250,204,21,0.35)]
                  hover:scale-[1.02]
                  transition-all duration-500
                "
              />

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}