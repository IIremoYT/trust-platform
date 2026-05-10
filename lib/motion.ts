/**
 * TRUST Cinematic Motion System
 *
 * Unified animation variants for the entire platform.
 * Philosophy: subtle, expensive, intentional, smooth.
 * No over-animation. No gaming effects.
 */

export const easing = {
  spring: [0.16, 1, 0.3, 1] as const,
  cinematic: [0.25, 0.46, 0.45, 0.94] as const,
  smooth: [0.43, 0.13, 0.23, 0.96] as const,
};

/** Fade up — default entrance for most elements */
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.5, ease: easing.spring },
};

/** Fade in — minimal entrance for overlays */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: easing.cinematic },
};

/** Scale up — for cards and interactive elements */
export const scaleUp = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.4, ease: easing.spring },
};

/** Stagger children — for lists and grids */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/** Slide from right — for RTL drawer */
export const slideRight = {
  initial: { x: "100%", opacity: 0.5 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", damping: 32, stiffness: 280 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { type: "spring", damping: 36, stiffness: 400 },
  },
};

/** Spring config presets */
export const springs = {
  snappy: { type: "spring" as const, damping: 22, stiffness: 300 },
  gentle: { type: "spring" as const, damping: 30, stiffness: 200 },
  heavy: { type: "spring" as const, damping: 40, stiffness: 150 },
};
