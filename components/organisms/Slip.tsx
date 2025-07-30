import SlipBorderIcon from "../atoms/SlipBorderIcon";
import Image from "next/image";
import Logo from "@/public/assets/icons/SVG/logo.svg";
import Divider from "../atoms/Divider";
import React from "react";
import TripleDotGraph from "../atoms/TripleDotGraph";
import DotsSvg from "@/icons/dots-svg";
import PerformanceBarChart from "../atoms/PerformanceBarChart";
import { shoeEnum } from "@/utils/types";
import { cn } from "@/utils/helper";
import Text from "../atoms/Text";
import VomeroSvg from "@/assets/images/Vomero.svg";
import PegasusSvg from "@/assets/images/Pegasus.svg";
import StructureSvg from "@/assets/images/Structure.svg";

interface Props {
  shoeName: shoeEnum;
  progressChartReading: Record<shoeEnum, number>;
}
export default function Slip({ shoeName, progressChartReading }: Props) {
  console.log({ progressChartReading });

  const entries = Object.entries(progressChartReading || {}) as [
    shoeEnum,
    number
  ][];

  const maxValue = Math.max(...entries.map(([, val]) => val));
  const topEntries = entries.filter(([, val]) => val === maxValue);

  // const selectedShoe: shoeEnum[] =
  //   topEntries.length >= 2
  //     ? [topEntries[0][0], topEntries[1][0]]
  //     : [topEntries[0][0]];

  return (
    <div
      id="slip-pdf"
      className="w-[464px] h-[787px] flex justify-between px-2 overflow-hidden "
    >
      {/* //left part */}
      <SlipBorderIcon />

      {/* center part */}
      <div className="w-full flex flex-col  px-5 ">
        <div className="flex flex-col h-full gap-y-7 overflow-hidden">
          <div className="flex flex-col  gap-x-3 items-start justify-start mt-4">
            <Text
              title="Nike Soho Assessment # : 000"
              fontSize="text-sm"
              fontWeight="font-medium"
              className="uppercase"
              textColor="text-black"
            />
            <div className="flex justify-between items-center w-full">
              <div className=" flex flex-col gap-0">
                <Text
                  title="RUN PEGASUS."
                  fontWeight="font-bold"
                  textColor="text-black"
                  className="leading-2 mt-4"
                />
                <Text
                  title="RUN VOMERO."
                  fontWeight="font-bold"
                  textColor="text-black"
                />
                <Text
                  title="RUN STRUCTURE."
                  fontWeight="font-bold"
                  textColor="text-black"
                  className="leading-2"
                />
                <Text
                  title="Your Choice"
                  className="mt-3 uppercase"
                  fontWeight="font-bold"
                  textColor="text-black"
                />
              </div>
              <img src={Logo} alt="logo" width={100} height={100} />
            </div>
          </div>
          {/* calibration bar */}
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-col ">
              <Divider height="h-[2px]" width="w-full" className="bg-black" />
              <p className="text-xs font-semibold text-black">
                CALIBRATION COMPLETE
              </p>
            </div>
            {/* graph */}
            <div className="flex items-center justify-center">
              {/* <TripleDotGraph
                structurePct={progressChartReading.Structure}
                pegasusPct={progressChartReading.Pegasus}
                vomeroPct={progressChartReading.Vomero}
              /> */}

              {shoeName === shoeEnum.vomero ? (
                <img src={VomeroSvg} height={100} width={100} alt="vomero" />
              ) : shoeName === shoeEnum.pegasus ? (
                <img src={PegasusSvg} height={100} width={100} alt="pagasus" />
              ) : (
                <img
                  src={StructureSvg}
                  height={100}
                  width={100}
                  alt="structure"
                />
              )}
            </div>
            {/* result bar */}
            <div className="flex flex-col ">
              <Divider height="h-[2px]" width="w-full" className="bg-black" />
              <p className="text-xs font-semibold text-black">RESULT</p>
            </div>
          </div>

          <div className="flex flex-col">
            {/* HERE WOULD COME THE NAME OF THE SHOE */}
            {/* <h1
              className={cn(
                "text-wrap font-semibold uppercase",
                selectedShoe.length === 2
                  ? "text-3xl tracking-wider"
                  : "text-6xl"
              )}
            >
              {selectedShoe.length > 1
                ? selectedShoe.join(" & ")
                : selectedShoe[0]}
            </h1> */}
            <h1 className="text-black font-bold text-3xl -mt-4 mb-4">
              {shoeName === shoeEnum.vomero
                ? "VOMERO PLUS"
                : shoeName === shoeEnum.pegasus
                ? "PEGASUS PREMIUM"
                : "STRUCTURE 26"}
            </h1>
            <div className="flex flex-col ">
              <Divider height="h-[2px]" width="w-full" className="bg-black" />
              <p className="text-xs font-semibold text-black">
                MATCH PERCENTAGES
              </p>
            </div>
          </div>

          {/* HERE IS THE SHOE NAMES AND PERFORMANCE GRAPHS ON SOME VALUES */}

          {/* here i need the performance chart can you use the same animated bar chart here */}
          <PerformanceBarChart values={progressChartReading} />

          <div className="flex flex-col gap-y-2">
            <Divider height="h-[2px]" width="w-full" className="bg-black" />
            <div className="flex items-center justify-between">
              <DotsSvg />
              <p className="text-[10px] font-semibold text-black">
                TRY ALL THREE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* right part */}
      <SlipBorderIcon />
    </div>
  );
}
