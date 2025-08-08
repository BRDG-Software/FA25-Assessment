import React from "react";
import Video from "../atoms/Video";
import Divider from "../atoms/Divider";
import AnimatedBarChart from "../atoms/AnimatedBarChart";
import RadarChart from "../atoms/RadarChart";
import CircularProgressSVG from "../atoms/CircleProgressbar";

type propsType = {
  progress: number;
  values: {
    comfort: number;
    energy: number;
    response: number;
  };
  structurePct: number;
  pegasusPct: number;
  vomeroPct: number;
};

const ChartSection = ({
  progress,
  values,
  structurePct,
  pegasusPct,
  vomeroPct,
}: propsType) => {
  return (
    <div className="flex flex-col w-full pl-8">
      <section
        className="flex items-center justify-center gap-24 pl-8 py-6"
        id="trial-assesment"
      >
        <CircularProgressSVG progress={progress > 100 ? 100 : progress} />
        <Video values={values} />
      </section>
      <Divider height="h-[2px]" width="w-full" />
      <section className="py-8" id="feature-priority">
        <AnimatedBarChart values={values} />
      </section>
      <Divider height="h-[2px]" width="w-full" />
      <section className="py-8" id="calibration-progress">
        <RadarChart
          structurePct={structurePct}
          pegasusPct={pegasusPct}
          vomeroPct={vomeroPct}
        />
      </section>
    </div>
  );
};

export default ChartSection;
