"use client";
import React from "react";
import { motion } from "framer-motion";

interface PropsType {
  filledCount: number;
  totalCount: number;
}

export default function ProgressDots({ filledCount, totalCount }: PropsType) {
  const dots = Array.from({ length: totalCount });

  return (
    <div className="flex gap-2">
      {dots.map((_, index) => {
        const isFilled = index < filledCount;

        return (
          <motion.div
            key={index}
            className="w-3 h-3 rounded-full"
            initial={false}
            animate={{
              backgroundColor: isFilled ? "#f43f5e" : "#d1d5db",
            }}
            transition={{
              duration: 0.3,
              type: "tween",
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
