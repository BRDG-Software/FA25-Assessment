import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { Animate } from "react-move";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";
import { useEffect, useState, useRef } from "react";
import Text from "./Text";

type ProgressChartProps = {
  progress: number;
  repeat?: boolean;
  duration?: number; // in seconds
};

const ProgressChart = ({
  progress,
  repeat = false,
  duration = 1.4,
}: ProgressChartProps) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle animation toggling logic
  useEffect(() => {
    if (repeat) {
      intervalRef.current = setInterval(() => {
        setIsAnimated((prev) => !prev);
      }, duration * 1000);
    } else {
      setIsAnimated(true);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [repeat, duration, progress]);

  // Reset animation when progress changes (if not repeating)
  useEffect(() => {
    if (!repeat) {
      setIsAnimated(false);
      // Animate to true on next tick
      const timeout = setTimeout(() => setIsAnimated(true), 0);
      return () => clearTimeout(timeout);
    }
  }, [progress, repeat]);

  return (
    <Animate
      start={{ value: 0 }}
      update={{
        value: [isAnimated ? progress : 0],
        timing: { duration: duration * 1000, ease: easeQuadInOut },
      }}
    >
      {({ value }) => (
        <div
          style={{
            height: 200,
            width: 200,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text title="Trial Assessment" className="uppercase mb-4 font-bold" />
          <CircularProgressbar
            value={value}
            text={`${Math.round(value)}%`}
            strokeWidth={14}
            styles={buildStyles({
              strokeLinecap: "butt",
              textSize: "16px",
              pathTransitionDuration: 0,
              pathColor: `#EE2751`,
              textColor: "#fff",
              trailColor: "#343433",
            })}
          />
          <Text
            title={`${Math.round(value)}% Complete`}
            className="uppercase mt-2 font-bold"
          />
        </div>
      )}
    </Animate>
  );
};

export default ProgressChart;
