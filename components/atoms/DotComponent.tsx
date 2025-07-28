import React from "react";
import { motion } from "framer-motion";

interface DotComponentProps {
  total?: number;
  answered: number;
}

const DOT_SIZE = 30;
const DOT_GAP = 2;
const DOT_RADIUS = DOT_SIZE / 2 - 6;

const DotComponent: React.FC<DotComponentProps> = ({ total = 5, answered }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: DOT_GAP,
        justifyContent: "center",
        alignItems: "center",
        width: total * DOT_SIZE + (total - 1) * DOT_GAP,
      }}
    >
      {Array.from({ length: total }).map((_, idx) => {
        let fill = "none";
        let stroke = "#fff";
        let isCurrent = false;
        if (idx < answered) {
          fill = "#fff";
          stroke = "#fff";
        } else if (idx === answered && answered < total) {
          fill = "#FF0c47"; // Nike red
          stroke = "#fff";
          isCurrent = true;
        }
        return (
          <motion.svg
            key={idx}
            width={DOT_SIZE}
            height={DOT_SIZE}
            viewBox={`0 0 ${DOT_SIZE} ${DOT_SIZE}`}
            style={{ display: "block" }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            {/* Circular glow for current dot */}
            {isCurrent && (
              <circle
                cx={DOT_SIZE / 2}
                cy={DOT_SIZE / 2}
                r={DOT_RADIUS}
                fill="#FF0c47"
                opacity={0.18}
                filter="url(#blur)"
              />
            )}
            {/* SVG blur filter definition */}
            {isCurrent && (
              <defs>
                <filter id="blur" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>
            )}
            <motion.circle
              cx={DOT_SIZE / 2}
              cy={DOT_SIZE / 2}
              r={DOT_RADIUS}
              fill={fill}
              stroke={stroke}
              strokeWidth={2}
              animate={{
                fill: fill,
                stroke: stroke,
                scale: isCurrent ? 1.15 : 1,
              }}
              transition={{
                fill: { duration: 0.35 },
                stroke: { duration: 0.35 },
                scale: { type: "spring", stiffness: 400, damping: 18 },
              }}
            />
          </motion.svg>
        );
      })}
    </div>
  );
};

export default DotComponent;
