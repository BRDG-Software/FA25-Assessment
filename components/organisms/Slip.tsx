import Divider from "../atoms/Divider";
import React from "react";
import DotsSvg from "@/icons/dots-svg";
import { shoeEnum, TLocalStorageCount } from "@/utils/types";
import Text from "../atoms/Text";
import VomeroIcon from "@/icons/vomero-svg";
import StructureIcon from "@/icons/structure-svg";
import PegasusSvg from "@/icons/pegasus-svg";
import RunLogoDark from "@/icons/run-logo-dark";
import PerformanceBarChartSlip from "../atoms/PerformanceBarChartSlip";
import { getFromLocalStorage } from "@/utils/localstorage.util";
import { SLIP_COUNT_KEY } from "@/utils/data";

interface Props {
  shoeName: string;
  progressChartReading: Record<shoeEnum, number>;
  values: {
    comfort: number;
    energy: number;
    response: number;
  };
}
export default function Slip({ shoeName, progressChartReading }: Props) {
  const slipCount: TLocalStorageCount | null =
    getFromLocalStorage(SLIP_COUNT_KEY);

  return (
    <div
      id="slip-pdf"
      className="w-[270px] h-[787px] flex justify-between px-2 overflow-hidden "
    >
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
              className="uppercase w-max text-center"
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
                  title="Your Choice."
                  className="mt-1 uppercase"
                  fontWeight="font-bold"
                  textColor="text-black"
                  fontSize="!text-sm"
                />
              </div>
              <div className="mt-[-13px]">
                <RunLogoDark />
              </div>
            </div>
          </div>
          {/* calibration bar */}
          <div className="flex flex-col gap-y-3 -mt-2">
            <div className="flex flex-col gap-y-1 ">
              <Divider height="h-[2px]" width="w-full" className="bg-black" />
              <p className="!text-[10px] text-black w-max text-center ">
                CALIBRATION COMPLETE
              </p>
            </div>
            {/* graph */}
            <div className="flex items-center justify-center mb-4 mt-[-10px]">
              {shoeName === shoeEnum.vomero ? (
                <VomeroIcon />
              ) : shoeName === shoeEnum.pegasus ? (
                <PegasusSvg />
              ) : (
                <StructureIcon />
              )}
            </div>
            {/* result bar */}
            <div className="flex flex-col gap-y-1">
              <Divider height="h-[2px]" width="w-full" className="bg-black" />
              <p className="text-[10px] text-black w-max text-center">RESULT</p>
            </div>
          </div>

          <div className="flex flex-col">
            {/* HERE WOULD COME THE NAME OF THE SHOE */}

            <div className="w-max pr-2 -mt-2">
              <p
                className="text-black  w-max m-0"
                style={{
                  fontWeight: 400,
                  fontSize: "40px",
                  lineHeight: "34px",
                }}
              >
                {shoeName === shoeEnum.vomero
                  ? "VOMERO"
                  : shoeName === shoeEnum.pegasus
                  ? "PEGASUS"
                  : "STRUCTURE"}
              </p>

              <p
                className="text-black w-max m-0"
                style={{
                  fontWeight: 400,
                  fontSize: "40px",
                  lineHeight: "34px",
                  marginTop: "-15px",
                }}
              >
                {shoeName === shoeEnum.vomero
                  ? "PLUS"
                  : shoeName === shoeEnum.pegasus
                  ? "PREMIUM"
                  : "26"}
              </p>
            </div>
            <div className="flex flex-col gap-y-1 !mt-4">
              <Divider height="h-[2px]" width="w-full" className="bg-black" />
              <p className="!text-[10px] text-black w-max text-center">
                MATCH PERCENTAGES
              </p>
            </div>
          </div>

          {/* HERE IS THE SHOE NAMES AND PERFORMANCE GRAPHS ON SOME VALUES */}

          {/* here i need the performance chart can you use the same animated bar chart here */}
          <PerformanceBarChartSlip values={progressChartReading} />
          <div className="flex flex-col gap-y-2 -mt-2">
            <Divider height="h-[2px]" width="w-full" className="bg-black" />
            <div className="flex items-center justify-between">
              <div className="mt-[-13px]">
                <DotsSvg />
              </div>
              <p className="!text-[6px] font-semibold text-black">
                TRY ALL THREE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
