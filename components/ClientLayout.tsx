"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import AmbientEffects from "@/components/AmbientEffects";
import AnnouncementBar from "@/components/AnnouncementBar";
import MaintenancePage from "@/components/MaintenancePage";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [maintenance, setMaintenance] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Only check for public routes, admin always accessible
    if (isAdmin) {
      setChecked(true);
      return;
    }

    const check = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "global"));
        if (snap.exists() && snap.data().maintenanceMode === true) {
          setMaintenance(true);
        }
      } catch {
        // If we can't read settings, don't block the site
      }
      setChecked(true);
    };

    check();
  }, [isAdmin]);

  if (isAdmin) {
    return <div>{children}</div>;
  }

  // Wait for check before rendering
  if (!checked) return null;

  // Maintenance mode: cinematic page for visitors
  if (maintenance) {
    return <MaintenancePage />;
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
