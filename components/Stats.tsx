import {
  Users,
  ShoppingCart,
  ShieldCheck,
  Clock3,
} from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      icon: <Users size={30} />,
      number: "+1,250",
      label: "عميل سعيد",
    },
    {
      icon: <ShoppingCart size={30} />,
      number: "+3,500",
      label: "عملية ناجحة",
    },
    {
      icon: <ShieldCheck size={30} />,
      number: "99%",
      label: "نسبة رضا العملاء",
    },
    {
      icon: <Clock3 size={30} />,
      number: "24/7",
      label: "دعم فني متاح",
    },
  ];

  return (
    <section dir="rtl" className="px-6 -mt-8 relative z-20">
      <div
        className="
          max-w-7xl mx-auto
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
          gap-5
        "
      >
        {stats.map((item, index) => (
          <div
            key={index}
            className="
              bg-[#0B0B0B]
              border border-zinc-800
              rounded-3xl
              px-8 py-8
              flex items-center justify-between
              hover:border-yellow-500/40
              transition-all duration-300
              group
            "
          >
            {/* Text */}
            <div>
              <h3
                className="
                  text-white
                  text-3xl
                  font-black
                  mb-2
                "
              >
                {item.number}
              </h3>

              <p
                className="
                  text-zinc-400
                  text-sm
                "
              >
                {item.label}
              </p>
            </div>

            {/* Icon */}
            <div
              className="
                text-yellow-500
                bg-yellow-500/10
                border border-yellow-500/20
                p-4
                rounded-2xl
                shadow-[0_0_25px_rgba(250,204,21,0.08)]
                group-hover:scale-110
                transition-all duration-300
              "
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}