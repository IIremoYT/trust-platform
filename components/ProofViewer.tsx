"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useState } from "react";

interface ProofViewerProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  title?: string;
  layoutId?: string;
}

export default function ProofViewer({
  isOpen,
  onClose,
  image,
  title,
  layoutId,
}: ProofViewerProps) {
  const [dragY, setDragY] = useState(0);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (Math.abs(info.offset.y) > 100 || Math.abs(info.velocity.y) > 500) {
        onClose();
      }
      setDragY(0);
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="proof-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={onClose}
            className="viewer-backdrop"
          />

          {/* Content */}
          <motion.div
            key="proof-content"
            className="viewer-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
                delay: 0.15,
              }}
              onClick={onClose}
              className="
                fixed top-6 left-6 z-[99995]
                w-11 h-11
                rounded-full
                bg-white/5
                border border-white/10
                backdrop-blur-xl
                flex items-center justify-center
                text-white/70
                hover:text-white
                hover:bg-white/10
                transition-colors duration-200
              "
              aria-label="Close viewer"
            >
              <X size={20} />
            </motion.button>

            {/* Security Watermark */}
            <div className="viewer-watermark">
              <span className="viewer-watermark-text">
                TRUST • VERIFIED SESSION • LICENSED ACCESS • TRUST • VERIFIED SESSION • LICENSED ACCESS
              </span>
              <span className="viewer-watermark-text">
                TRUST • VERIFIED SESSION • LICENSED ACCESS • TRUST • VERIFIED SESSION • LICENSED ACCESS
              </span>
              <span className="viewer-watermark-text">
                TRUST • VERIFIED SESSION • LICENSED ACCESS • TRUST • VERIFIED SESSION • LICENSED ACCESS
              </span>
              <span className="viewer-watermark-text">
                TRUST • VERIFIED SESSION • LICENSED ACCESS • TRUST • VERIFIED SESSION • LICENSED ACCESS
              </span>
            </div>

            {/* Image with drag-to-close */}
            <motion.div
              layoutId={layoutId}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.4}
              onDrag={(_, info) => setDragY(info.offset.y)}
              onDragEnd={handleDragEnd}
              style={{
                opacity: 1 - Math.abs(dragY) / 400,
                scale: 1 - Math.abs(dragY) / 2000,
              }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
              className="
                relative z-[99992]
                max-w-[92vw] max-h-[85vh]
                cursor-grab active:cursor-grabbing
              "
            >
              <img
                src={image}
                alt={title || "Proof"}
                loading="lazy"
                className="
                  max-w-full max-h-[85vh]
                  object-contain
                  rounded-[2rem]
                  shadow-[0_20px_80px_rgba(0,0,0,0.7)]
                  select-none
                  pointer-events-none
                "
                draggable={false}
              />

              {/* Title overlay */}
              {title && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="
                    absolute bottom-0 left-0 right-0
                    p-6
                    bg-gradient-to-t from-black/70 via-black/20 to-transparent
                    rounded-b-[2rem]
                  "
                >
                  <p className="text-white/80 text-sm font-semibold">
                    {title}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Swipe indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="
                fixed bottom-8 left-1/2 -translate-x-1/2
                z-[99993]
                flex flex-col items-center gap-2
              "
            >
              <div className="w-8 h-1 rounded-full bg-white/20" />
              <span className="text-white/20 text-xs label-luxury">
                اسحب للإغلاق
              </span>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
