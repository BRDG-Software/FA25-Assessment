import React from "react";

type CircularProgressSVGProps = {
  progress: number; // 0-100
  size?: number; // diameter in px
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
};

const CircularProgressSVG: React.FC<CircularProgressSVGProps> = ({
  progress,
  size = 120,
  strokeWidth = 16,
  color = "#FF0c47",
  bgColor = "#343433",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <div
      style={{
        width: size,
        height: size + 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "inherit",
      }}
    >
      <div
        className="whitespace-nowrap"
        style={{
          fontWeight: "medium",
          marginBottom: 12,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        TRIAL ASSESSMENT
      </div>
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.45,0,0.55,1)",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
        {/* Percentage text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.35em"
          fontSize={size * 0.18}
          fontWeight="bold"
          fill="#fff"
        >
          {`${Math.round(progress)}%`}
        </text>
      </svg>
      <div
        className="whitespace-nowrap"
        style={{
          fontWeight: "medium",
          marginTop: 12,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {`${Math.round(progress)}% COMPLETE`}
      </div>
    </div>
  );
};

export default CircularProgressSVG;
