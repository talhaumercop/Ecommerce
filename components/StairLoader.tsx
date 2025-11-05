"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  panelCount?: number;
  loadDuration?: number;
  delayStep?: number;
  duration?: number;
  onComplete?: () => void;
};

export default function StairColumnsReveal({
  panelCount = 5,
  loadDuration = 1200,
  delayStep = 0.25,
  duration = 0.7,
  onComplete,
}: Props) {
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(true);

  // Black → Slight Gray → White tone ramp
  const panelColors = ["#000000", "#111111", "#872E28", "#760E16", "#27070A"];

  useEffect(() => {
    const t = setTimeout(() => {
      setStarted(true);
      const total = (delayStep * (panelCount - 1) + duration) * 1000 + 400;
      setTimeout(() => {
        setVisible(false);
        onComplete && onComplete();
      }, total);
    }, loadDuration);
    return () => clearTimeout(t);
  }, [loadDuration, panelCount, delayStep, duration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black" />

          {/* Stacked Vertical Panels */}
          <div className="relative w-full h-full flex">
            {Array.from({ length: panelCount }).map((_, idx) => {
              const delay = idx * delayStep;
              const color = panelColors[idx % panelColors.length];
              return (
                <motion.div
                  key={idx}
                  className="flex-1 h-full"
                  initial={{ y: "0%", backgroundColor: "#000" }}
                  animate={
                    started
                      ? { y: "-100%", backgroundColor: color }
                      : { y: "0%", backgroundColor: "#000" }
                  }
                  transition={{
                    y: { duration, delay, ease: [0.65, 0, 0.35, 1] },
                    backgroundColor: {
                      delay: delay / 1.5,
                      duration: duration / 1.2,
                      ease: "easeInOut",
                    },
                  }}
                />
              );
            })}
          </div>

          {/* Brand Minimal Loading UI */}
          {!started && (
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
              <motion.h1
                className="text-white uppercase tracking-[0.3em] text-xl md:text-2xl"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                Loading
              </motion.h1>

              {/* Progress Bar */}
              <div className="mt-6 w-[55%] md:w-[35%] h-[3px] bg-white/20 overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: loadDuration / 1000,
                    ease: [0.45, 0, 0.55, 1],
                  }}
                />
              </div>

              <motion.p
                className="mt-4 text-white/40 text-xs uppercase tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: loadDuration / 1000,
                  ease: "easeInOut",
                  times: [0, 0.1, 0.9, 1],
                }}
              >
                ThreadHeist®
              </motion.p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
