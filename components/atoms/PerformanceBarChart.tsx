import React from "react";
import { shoeEnum } from "@/utils/types";

const BAR_HEIGHT = 24;
const BAR_GAP = 2; // Reduced gap for tighter alignment
const BAR_WIDTH = 180;
const LABELS: { key: shoeEnum; label: string }[] = [
  { key: shoeEnum.vomero, label: "Vomero Plus" },
  { key: shoeEnum.pegasus, label: "Pegasus Premium" },
  { key: shoeEnum.structure, label: "Structure 26" },
];

type PerformanceBarChartProps = {
  values: Record<shoeEnum, number>;
};

const PerformanceBarChart: React.FC<PerformanceBarChartProps> = ({
  values,
}) => {
  // Clamp values between 0 and 100
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  const fillWidths = LABELS.map(
    ({ key }) => (BAR_WIDTH * clamp(values[key])) / 100
  );

  return (
    <div className="flex items-center justify-between gap-6 ">
      {/* Text labels */}
      <div
        className="flex flex-col text-lg font-bold leading-tight"
        style={{ minWidth: 120 }}
      >
        {LABELS.map((item, i) => (
          <span
            key={item.key}
            style={{
              height: BAR_HEIGHT,
              display: "flex",
              alignItems: "center",
              marginBottom: i < LABELS.length - 1 ? BAR_GAP : 0,
            }}
          >
            {item.label}
          </span>
        ))}
      </div>
      {/* Bars */}
      <svg
        width={BAR_WIDTH}
        height={BAR_HEIGHT * 3 + BAR_GAP * 2}
        style={{ display: "block" }}
      >
        <defs>
          <pattern
            id="hatch"
            patternUnits="userSpaceOnUse"
            width="4"
            height="6"
            patternTransform="rotate(20)"
          >
            <rect x="0" y="0" width="2" height="6" fill="black" />
          </pattern>
        </defs>
        {LABELS.map((item, i) => {
          const y = i * (BAR_HEIGHT + BAR_GAP);
          return (
            <g key={item.key}>
              {/* Bar background */}
              <rect
                x={0}
                y={y}
                width={BAR_WIDTH}
                height={BAR_HEIGHT}
                fill="white" // Tailwind bg-gray-700
                rx={2}
              />
              {/* Bar border */}
              <rect
                x={0}
                y={y}
                width={BAR_WIDTH}
                height={BAR_HEIGHT}
                fill="none"
                stroke="black"
                strokeWidth={2}
                rx={2}
              />
              {/* Hatched fill */}
              <rect
                x={0}
                y={y}
                width={fillWidths[i]}
                height={BAR_HEIGHT}
                fill="url(#hatch)"
                rx={2}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default PerformanceBarChart;
