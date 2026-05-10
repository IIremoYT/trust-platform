"use client";

import { useEffect, useRef } from "react";

export default function AmbientEffects() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable cursor spotlight on desktop
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    if (!mediaQuery.matches) return;

    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    let rafId: number;
    let mouseX = -1000;
    let mouseY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      spotlight.style.opacity = "1";
    };

    const handleMouseLeave = () => {
      spotlight.style.opacity = "0";
    };

    const animate = () => {
      // Smooth interpolation
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      spotlight.style.left = `${currentX}px`;
      spotlight.style.top = `${currentY}px`;

      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Ambient Floating Particles */}
      <div className="ambient-particles" aria-hidden="true">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      {/* Cursor Spotlight (desktop only) */}
      <div
        ref={spotlightRef}
        className="cursor-spotlight"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />
    </>
  );
}
