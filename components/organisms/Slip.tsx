import Logo from "@/public/assets/icons/SVG/logo.svg";
import Divider from "../atoms/Divider";
import React from "react";
import DotsSvg from "@/icons/dots-svg";
import { shoeEnum, TLocalStorageCount } from "@/utils/types";
import Text from "../atoms/Text";
import VomeroIcon from "@/icons/vomero-svg";
import StructureIcon from "@/icons/structure-svg";
import NikeCornorIcon from "@/icons/nike-cornor.icon";
import PegasusSvg from "@/icons/pegasus-svg";
import RunLogoDark from "@/icons/run-logo-dark";
import PerformanceBarChartSlip from "../atoms/PerformanceBarChartSlip";
import { getFromLocalStorage } from "@/utils/localstorage.util";
import { SLIP_COUNT_KEY } from "@/utils/data";
interface Props {
  shoeName: string;
  progressChartReading: Record<shoeEnum, number>;
}
export default function Slip({ shoeName, progressChartReading }: Props) {
  const slipCount: TLocalStorageCount | null =
    getFromLocalStorage(SLIP_COUNT_KEY);

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
      className="w-[300px] h-[787px] flex justify-between px-2 overflow-hidden "
    >
      {/* //left part */}
      {/* <SlipBorderIcon /> */}
      {/* <NikeCornorIcon /> */}

      {/* center part */}
      <div className="w-full flex flex-col  px-5 ">
        <div className="flex flex-col h-full gap-y-7 overflow-hidden">
          <div className="flex flex-col  gap-x-3 items-start justify-start mt-4">
            <Text
              title={`Nike Soho Assessment # : ${slipCount?.value
                .toString()
                .padStart(3, "0")}`}
              fontSize="!text-[10px]"
              fontWeight="font-medium"
              className="uppercase"
              textColor="text-black"
            />
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col gap-0">
                <Text
                  title="RUN IN PEGASUS."
                  fontWeight="font-bold"
                  textColor="text-black"
                  className="leading-none !mt-2 !mb-0 !p-0"
                  fontSize="!text-sm"
                />
                <Text
                  title="RUN IN VOMERO."
                  fontWeight="font-bold"
                  textColor="text-black"
                  className="leading-none !m-0 !p-0"
                  fontSize="!text-sm"
                />
                <Text
                  title="RUN IN STRUCTURE."
                  fontWeight="font-bold"
                  textColor="text-black"
                  className="leading-none !mb-0 !p-0"
                  fontSize="!text-sm"
                />
                <Text
                  title="Your Choice"
                  className="mt-1 uppercase"
                  fontWeight="font-bold"
                  textColor="text-black"
                  fontSize="!text-sm"
                />
              </div>
              <div className="mt-[-10px]">
                <RunLogoDark />
              </div>
            </div>
          </div>
          {/* calibration bar */}
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-col ">
              <Divider height="h-[2px]" width="w-full" className="bg-black" />
              <p className="!text-[10px] !font-bold text-black">
                CALIBRATION COMPLETE
              </p>
            </div>
            {/* graph */}
            <div className="flex items-center justify-center mb-4">
              {/* <TripleDotGraph
                structurePct={progressChartReading.Structure}
                pegasusPct={progressChartReading.Pegasus}
                vomeroPct={progressChartReading.Vomero}
              /> */}

              {shoeName === shoeEnum.vomero ? (
                // <img
                //   src={VomeroSvg}
                //   height={100}
                //   width={100}
                //   crossOrigin="anonymous"
                //   alt="vomero"
                // />
                <VomeroIcon />
              ) : shoeName === shoeEnum.pegasus ? (
                // <img
                //   src={PegasusSvg}
                //   height={100}
                //   width={100}
                //   crossOrigin="anonymous"
                //   alt="pagasus"
                // />
                <PegasusSvg />
              ) : (
                // <img
                //   src={StructureSvg}
                //   height={100}
                //   width={100}
                //   alt="structure"
                //   crossOrigin="anonymous"
                // />
                <StructureIcon />
              )}
            </div>
            {/* result bar */}
            <div className="flex flex-col ">
              <Divider height="h-[2px]" width="w-full" className="bg-black" />
              <p className="!text-[10px] font-semibold text-black">RESULT</p>
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
            <h1 className="text-black font-bold !text-4xl !-mt-4 !mb-12 !p-0">
              {shoeName === shoeEnum.vomero
                ? "VOMERO PLUS"
                : shoeName === shoeEnum.pegasus
                ? "PEGASUS PREMIUM"
                : "STRUCTURE 26"}
            </h1>
            <div className="flex flex-col !mt-4">
              <Divider height="h-[2px]" width="w-full" className="bg-black" />
              <p className="!text-[10px] font-semibold text-black">
                MATCH PERCENTAGES
              </p>
            </div>
          </div>

          {/* HERE IS THE SHOE NAMES AND PERFORMANCE GRAPHS ON SOME VALUES */}

          {/* here i need the performance chart can you use the same animated bar chart here */}
          <PerformanceBarChartSlip values={progressChartReading} />

          <div className="flex flex-col gap-y-2">
            <Divider height="h-[2px]" width="w-full" className="bg-black" />
            <div className="flex items-center justify-between">
              <DotsSvg />
              <p className="!text-[6px] font-semibold text-black">
                TRY ALL THREE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* right part */}
      {/* <NikeCornorIcon /> */}
    </div>
  );
}
