"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import AmbientEffects from "@/components/AmbientEffects";
import AnnouncementBar from "@/components/AnnouncementBar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin pages: no navbar, no ambient effects, no announcement bar, no padding
    return (
      <div>
        {children}
      </div>
    );
  }

  // Public pages: full UI
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <AmbientEffects />

      <div className="page-enter pt-28">
        {children}
      </div>
    </>
  );
}
