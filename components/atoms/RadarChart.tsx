import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Text from "./Text";

function getPathData(points: { x: number; y: number }[]) {
  return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y} L${points[2].x},${points[2].y} Z`;
}

function getPathLength(points: { x: number; y: number }[]) {
  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);
  return (
    dist(points[0], points[1]) +
    dist(points[1], points[2]) +
    dist(points[2], points[0])
  );
}

function RadarChart({
  structurePct,
  pegasusPct,
  vomeroPct,
}: {
  structurePct: number;
  pegasusPct: number;
  vomeroPct: number;
}) {
  // SVG constants
  const width = 400;
  const height = 250;
  const cx = width / 2;
  const cy = height / 2;
  const r = 75;

  // Angles for axes (degrees)
  const angles = {
    Structure: 45,
    Pegasus: 180,
    Vomero: -45,
  };

  function polarToCartesian(angleDeg: number, pct: number) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    const radius = r * (pct / 100);
    return {
      x: cx + radius * Math.cos(angleRad),
      y: cy + radius * Math.sin(angleRad),
    };
  }

  // Target data points
  const targetPoints = [
    polarToCartesian(angles.Structure, structurePct),
    polarToCartesian(angles.Pegasus, pegasusPct),
    polarToCartesian(angles.Vomero, vomeroPct),
  ];

  // For axis labels
  const labelOffset = 15;
  const labelPositions = {
    Structure: polarToCartesian(
      angles.Structure + 7,
      115 + (labelOffset / r) * 100
    ),
    Pegasus: polarToCartesian(angles.Pegasus, 110 + (labelOffset / r) * 100),
    Vomero: polarToCartesian(angles.Vomero, 106 + (labelOffset / r) * 100),
  };

  // Draw 45° separator lines (full circle)
  const separatorLines = [];
  for (let i = 0; i < 8; i++) {
    const angle = i * 45;
    const { x, y } = polarToCartesian(angle, 100);
    separatorLines.push(
      <line
        key={angle}
        x1={cx}
        y1={cy}
        x2={x}
        y2={y}
        stroke={i % 2 === 0 ? "#807D7D" : "#fff"}
        strokeWidth={1}
      />
    );
  }

  // --- Animation logic ---
  // Animate the path being drawn, then dots appearing at each vertex
  const [pathPoints, setPathPoints] = useState(targetPoints);
  const [pathData, setPathData] = useState(getPathData(targetPoints));
  const [pathLength, setPathLength] = useState(getPathLength(targetPoints));
  const [dotsVisible, setDotsVisible] = useState([false, false, false]);
  const controls = useAnimation();

  // For smooth transition: track previous polygon
  const [prevPath, setPrevPath] = useState<null | {
    points: { x: number; y: number }[];
    data: string;
    length: number;
  }>(null);
  const prevUndrawControls = useAnimation();
  const undrawTimeout = useRef<NodeJS.Timeout | null>(null);
  const DRAW_DURATION = 1.2;

  // When the target points change, animate the old path out and new path in
  useEffect(() => {
    // If this is not the first render, set up the undraw for the previous path
    if (pathData !== getPathData(targetPoints)) {
      setPrevPath({
        points: pathPoints,
        data: pathData,
        length: pathLength,
      });
      prevUndrawControls.set({ strokeDashoffset: 0, opacity: 0.7 });
      // Start undraw and fade out immediately, in parallel with new draw
      prevUndrawControls.start({
        strokeDashoffset: pathLength,
        opacity: 0,
        transition: { duration: DRAW_DURATION, ease: "linear" },
      });
      // Remove the old path after undraw
      if (undrawTimeout.current) clearTimeout(undrawTimeout.current);
      undrawTimeout.current = setTimeout(() => {
        setPrevPath(null);
      }, DRAW_DURATION * 10);
    }
    setPathPoints(targetPoints);
    setPathData(getPathData(targetPoints));
    setPathLength(getPathLength(targetPoints));
    setDotsVisible([false, false, false]);
    controls.set({ strokeDashoffset: getPathLength(targetPoints) });
    controls.start("draw");
    // eslint-disable-next-line
  }, [structurePct, pegasusPct, vomeroPct]);

  // Animate dots appearing after each segment is drawn
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    const totalDuration = DRAW_DURATION;
    const segLens = [
      Math.hypot(
        pathPoints[0].x - pathPoints[1].x,
        pathPoints[0].y - pathPoints[1].y
      ),
      Math.hypot(
        pathPoints[1].x - pathPoints[2].x,
        pathPoints[1].y - pathPoints[2].y
      ),
      Math.hypot(
        pathPoints[2].x - pathPoints[0].x,
        pathPoints[2].y - pathPoints[0].y
      ),
    ];
    const segTimes = segLens.map((l) => (l / pathLength) * totalDuration);
    let acc = 0;
    for (let i = 0; i < 3; i++) {
      acc += segTimes[i];
      timeouts.push(
        setTimeout(() => {
          setDotsVisible((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, acc * 1000)
      );
    }
    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line
  }, [pathData, pathLength]);

  // For shimmer animation (traveling white segment)
  const [shimmerDashOffset, setShimmerDashOffset] = useState(0);
  const shimmerLength = 0.12; // fraction of the path (12% of perimeter)
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const SHIMMER_DURATION = 4; // seconds for a full loop (slower)
    function animate(now: number) {
      if (start === null) start = now;
      const elapsed = ((now - start) / 1000) % SHIMMER_DURATION;
      setShimmerDashOffset(elapsed / SHIMMER_DURATION); // 0 to 1
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Framer-motion variants for path draw
  const pathVariants = {
    initial: { strokeDashoffset: pathLength },
    draw: {
      strokeDashoffset: 0,
      transition: { duration: DRAW_DURATION },
    },
  };

  return (
    <div className="flex justify-between items-center gap-8">
      <svg
        width={420}
        height={230}
        viewBox={`0 10 ${270} ${height}`}
        className="block mx-auto border-2"
        style={{ background: "" }}
      >
        <defs>
          <linearGradient
            id="radar-shimmer-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            {/* shimmerStops removed */}
          </linearGradient>
        </defs>
        {/* Outer circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#fff"
          strokeWidth={1}
        />
        {/* Separator lines */}
        {separatorLines}
        {/* Previous path undrawing */}
        {prevPath && (
          <motion.path
            d={prevPath.data}
            fill="none"
            stroke="#FF0c47"
            strokeWidth={2}
            strokeDasharray={prevPath.length}
            strokeDashoffset={0}
            animate={prevUndrawControls}
            style={{ filter: "drop-shadow(0 0 6px #FF0c47)" }}
          />
        )}
        {/* Main solid red path */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="#FF0c47"
          strokeWidth={2}
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength}
          variants={pathVariants}
          initial="initial"
          animate={controls}
          style={{ filter: "drop-shadow(0 0 6px #FF0c47)" }}
        />
        {/* Traveling shimmer path */}
        <path
          d={pathData}
          fill="none"
          stroke="#FFF"
          strokeWidth={2}
          strokeDasharray={`${pathLength * shimmerLength},${pathLength}`}
          strokeDashoffset={-shimmerDashOffset * pathLength}
          style={{
            opacity: 0.22,
            pointerEvents: "none",
            filter: "blur(0.5px)",
          }}
        />
        {/* Dots at vertices, appear after edge is drawn */}
        {pathPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="#FF0c47"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              dotsVisible[i]
                ? { scale: 1, opacity: 1 }
                : { scale: 0, opacity: 0 }
            }
            transition={{ delay: 0, duration: 0.3, type: "spring" }}
          />
        ))}
        {/* Labels */}
        <text
          x={labelPositions.Structure.x + 30}
          y={labelPositions.Structure.y + 4}
          fill="#fff"
          fontSize={13}
          fontWeight="medium"
          textAnchor="middle"
        >
          STRUCTURE
        </text>
        <text
          x={labelPositions.Pegasus.x - 30}
          y={labelPositions.Pegasus.y + 10}
          fill="#fff"
          fontSize={13}
          fontWeight="medium"
          textAnchor="start"
        >
          PEGASUS
        </text>
        <text
          x={labelPositions.Vomero.x - 25}
          y={labelPositions.Vomero.y + 5}
          fill="#fff"
          fontSize={13}
          fontWeight="medium"
          textAnchor="middle"
        >
          VOMERO
        </text>
        {/* Title */}
        <text
          x={-80}
          y={height - 70}
          fill="#fff"
          fontSize={24}
          fontWeight="medium"
          textAnchor="start"
          style={{ letterSpacing: 1 }}
        >
          RADIAL
          <tspan x={-80} dy={28}>
            METRIC
          </tspan>
          <tspan x={-80} dy={28}>
            GRAPH
          </tspan>
        </text>
      </svg>
      <Text
        title="Calibration In Progress"
        className="uppercase font-medium text-base"
      />
    </div>
  );
}

export default RadarChart;
