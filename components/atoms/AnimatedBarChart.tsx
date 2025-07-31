import React from "react";
import { motion } from "framer-motion";
import Text from "./Text";

const BAR_HEIGHT = 40;
const BAR_GAP = 10;
const BAR_WIDTH = 420;
const STRIPE_COLOR = "#FF0c47";
const STRIPE_BG = "#111";
const BORDER_COLOR = "#fff";

const TRAITS = [
  { key: "comfort", label: "COMFORT" },
  { key: "energy", label: "ENERGY" },
  { key: "response", label: "RESPONSE" },
];

type AnimatedBarChartProps = {
  values: {
    comfort: number;
    energy: number;
    response: number;
  };
};

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({ values }) => {
  const patternWidth = 12;
  const shimmerWidth = 10;
  // Calculate fill widths for all bars

  const fillWidths = TRAITS.map((trait) => {
    const value = Math.max(
      0,
      Math.min(100, values[trait.key as keyof typeof values])
    );

    let fillWidth = (BAR_WIDTH - 4) * (value / 100);
    if (fillWidth > 0) {
      fillWidth = Math.ceil(fillWidth / patternWidth) * patternWidth;
      fillWidth += patternWidth;
      if (fillWidth > BAR_WIDTH - 4) fillWidth = BAR_WIDTH - 4;
    }
    return fillWidth;
  });

  return (
    <div
      className="flex flex-row items-center w-full gap-6"
      style={{ maxWidth: 650, minWidth: 0 }}
    >
      {/* Labels */}
      <div>
        <Text title="Feature Priority" className="uppercase font-medium mb-4" />
        <div
          className="flex flex-col justify-between h-full mr-6"
          style={{ height: BAR_HEIGHT * 3 + BAR_GAP * 2, minWidth: 120 }}
        >
          {TRAITS.map((trait, i) => (
            <div
              key={trait.key}
              className="flex items-center"
              style={{
                height: BAR_HEIGHT,
                marginBottom: i < TRAITS.length - 1 ? BAR_GAP : 0,
              }}
            >
              <span
                className="font-medium text-white text-4xl leading-none tracking-tight"
                style={{ fontFamily: "inherit", letterSpacing: "-0.04em" }}
              >
                {trait.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Bars */}
      <div>
        <Text title="scale" className="uppercase  font-medium mb-4" />
        <svg
          width={BAR_WIDTH}
          height={BAR_HEIGHT * 3 + BAR_GAP * 2}
          style={{ display: "block" }}
        >
          <defs>
            <pattern
              id="animated-stripes"
              patternUnits="userSpaceOnUse"
              x="1"
              width="12"
              height="24"
              patternTransform="skewX(-15)"
            >
              <rect x="0" y="0" width="" height="24" fill={STRIPE_BG} />
              <rect x="0" y="0" width="5" height="24" fill={STRIPE_COLOR} />
            </pattern>
          </defs>
          {TRAITS.map((trait, i) => {
            const y = i * (BAR_HEIGHT + BAR_GAP);
            const fillWidth = fillWidths[i];
            return (
              <g key={trait.key} className="flex flex-col gap-6">
                {/* Bar border */}
                <rect
                  x={0}
                  y={y}
                  width={BAR_WIDTH}
                  height={BAR_HEIGHT}
                  fill="none"
                  stroke={BORDER_COLOR}
                  strokeWidth={3}
                  rx={4}
                />
                {/* Bar background */}
                <rect
                  x={2}
                  y={y + 2}
                  width={BAR_WIDTH - 4}
                  height={BAR_HEIGHT - 4}
                  fill={STRIPE_BG}
                  rx={2}
                />
                {/* Animated filled portion */}
                <motion.rect
                  x={3}
                  y={y + 2}
                  height={BAR_HEIGHT - 4}
                  rx={6}
                  initial={false}
                  animate={{
                    width:
                      i === 0
                        ? fillWidth + 0.5
                        : i === 1
                        ? fillWidth
                        : fillWidth - 1.7,

                    x: [-1],
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  fill="url(#animated-stripes)"
                  // style={{ overflow: "hidden" }}
                />
                {/* Lighting bar overlay - shimmer on all bars if filled */}
                {fillWidth > 0 && (
                  <g transform="skewX(-20)">
                    <motion.rect
                      y={y + 2}
                      height={BAR_HEIGHT - 4}
                      rx={2}
                      width={shimmerWidth}
                      fill="#fff"
                      opacity={0.22}
                      filter="blur(2px)"
                      pointerEvents="none"
                      initial={{ x: 2 }}
                      animate={{ x: [2, fillWidth - 10] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "linear",
                      }}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default AnimatedBarChart;
