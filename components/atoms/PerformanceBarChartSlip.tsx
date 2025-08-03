import React from "react";
import { shoeEnum } from "@/utils/types";

const BAR_HEIGHT = 17;
const BAR_GAP = 2.8; // Slightly increased gap for better spacing
const BAR_WIDTH = 100; // Increased width for better visibility
const LABELS: { key: shoeEnum; label: string }[] = [
  { key: shoeEnum.vomero, label: "Vomero Plus" },
  { key: shoeEnum.pegasus, label: "Pegasus Premium" },
  { key: shoeEnum.structure, label: "Structure 26" },
];

type PerformanceBarChartSlipProps = {
  values: Record<shoeEnum, number>;
};

const PerformanceBarChartSlip: React.FC<PerformanceBarChartSlipProps> = ({
  values,
}) => {
  // Clamp values between 0 and 100
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  const fillWidths = LABELS.map(
    ({ key }) => (BAR_WIDTH * clamp(values[key])) / 100
  );

  return (
    <div className="flex items-center justify-between gap-1">
      {/* Text labels */}
      <div
        className="flex flex-col text-base font-bold leading-none"
        style={{ minWidth: 132, maxWidth: 132 }}
      >
        {LABELS.map((item, i) => (
          <div
            key={item.key}
            style={{
              height: BAR_HEIGHT + BAR_GAP,
              display: "flex",
              paddingBottom: 10,
              alignItems: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
      {/* Bars */}
      <svg
        width={BAR_WIDTH}
        height={BAR_HEIGHT * 3 + BAR_GAP * 2}
        style={{ display: "block", flexShrink: 0 }}
      >
        <defs>
          <pattern
            id="hatch"
            patternUnits="userSpaceOnUse"
            width="3.1"
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
                strokeWidth={1.6}
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

export default PerformanceBarChartSlip;
