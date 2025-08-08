"use client";

import { calibrationSteps, runSteps } from "@/utils/data";
import { cn } from "@/utils/helper";
import { TypeAnimation } from "react-type-animation";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import { shoeEnum } from "@/utils/types";
import Text from "./Text";
import Slip from "../organisms/Slip";
import { useMainContext } from "@/providers/MainContext";

type propsType = {
  selectedShoe: string[];
  progressChartReading: Record<string, number>; // Add this
  values: {
    comfort: number;
    energy: number;
    response: number;
  };
};

export default function AnimatedText({
  selectedShoe,
  progressChartReading,
  values,
}: propsType) {
  const {
    printSlipRef,
    handlePrint,
    preRenderPrintContent,
    showSplash,
    handleReset,
    isPrinting,
    setIsPrinting,
  } = useMainContext();
  const [phase, setPhase] = useState<"calibration" | "run">("calibration");
  const [showPrintButton, setShowPrintButton] = useState(false);
  const [showChoiceText, setShowChoiceText] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [startPrinting, setStartPrinting] = useState<boolean>(false);

  //================== Animation durations ==================
  const calibrationDuration = calibrationSteps.length * 1300; // 1.2s per step
  const runStepDuration = 1200;
  const runStepsArray = Object.values(shoeEnum);

  useEffect(() => {
    if (phase === "calibration") {
      const timer = setTimeout(() => setPhase("run"), calibrationDuration);
      return () => clearTimeout(timer);
    }
    if (phase === "run") {
      const textTimer = setTimeout(
        () => setShowChoiceText(true),
        runStepsArray.length * (runStepDuration + 500)
      );

      const resultTimer = setTimeout(
        () => setShowResult(true),
        runStepsArray.length * (runStepDuration + 550)
      );

      const timer = setTimeout(
        () => setShowPrintButton(true),
        runStepsArray.length * (runStepDuration + 800)
      );

      const printingTimer = setTimeout(
        () => setStartPrinting(true),
        runStepsArray.length * (runStepDuration + 400)
      );

      const resetTimer = setTimeout(
        () => handleReset(),
        runStepsArray.length * (runStepDuration + 3000) // Reduced from 6000 to 3000 since print is faster
      );

      return () => {
        clearTimeout(timer);
        clearTimeout(textTimer);
        clearTimeout(resultTimer);
        clearTimeout(printingTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [phase, calibrationDuration]);

  // Trigger pre-rendering when run animations start
  useEffect(() => {
    if (phase === "run" && !showResult) {
      // Start pre-rendering when the shoe animations begin
      const preRenderTimer = setTimeout(() => {
        preRenderPrintContent();
      }, 500); // Small delay to let animations start

      return () => clearTimeout(preRenderTimer);
    }
  }, [phase, showResult, preRenderPrintContent]);

  useEffect(() => {
    if (startPrinting) {
      handlePrint();
    }
    return () => {
      setStartPrinting(false);
    };
  }, [startPrinting]);

  // useEffect(() => {
  //   setIsPrinting(true);
  //   if (showPrintButton && isPrinting) {
  //     handlePrint();
  //   }
  //   return () => {
  //     setIsPrinting(false);
  //   };
  // }, [isPrinting, showPrintButton]);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center w-full h-screen">
        <div className="text-white text-2xl">
          Printing complete! Returning...
        </div>
      </div>
    );
  }

  if (phase === "calibration") {
    return (
      <div className="h-full flex flex-col mt-4 space-y-2  pl-5 py-6">
        <h2 className="text-white uppercase text-xs">QUESTIONS COMPLETE</h2>
        {calibrationSteps.map((text, index) => (
          <TypeAnimation
            key={index}
            sequence={[index * 1200, text]}
            wrapper="div"
            className={cn(
              "uppercase",
              index === 0
                ? "text-white text-4xl font-medium"
                : "text-primary-pink text-2xl font-normal uppercase"
            )}
            cursor={false}
          />
        ))}
      </div>
    );
  }

  //================== phase === "run" ==================
  return (
    <div className="h-full flex flex-col mt-10 items-start space-y-6 pl-5 py-6">
      <div className="space-y-6 w-full">
        {
          // animationEnded &&
          showResult &&
            runStepsArray.map((shoe) => {
              return (
                <Text
                  key={shoe}
                  title={`${runSteps[shoe]}.`}
                  className={cn(
                    `text-6xl font-bold uppercase text-white leading-12`,
                    selectedShoe[0] === shoe && "text-primary-pink"
                  )}
                />
              );
            })
        }
        {
          // !animationEnded &&
          !showResult &&
            runStepsArray.map((shoe, index) => {
              return (
                <TypeAnimation
                  key={shoe}
                  sequence={[index * runStepDuration, `${runSteps[shoe]}.`]}
                  wrapper="div"
                  className={cn(
                    "text-6xl font-bold uppercase text-white leading-12"
                  )}
                  cursor={false}
                />
              );
            })
        }
        <Text
          title="Your Choice."
          className={cn(
            "text-primary-pink text-6xl font-bold uppercase mt-16 transition-all duration-700",
            showChoiceText
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-32 pointer-events-none"
          )}
        />
      </div>
      {/*================== Slide-in PRINT button ==================*/}
      <div
        className={cn(
          "transition-all duration-700",
          showPrintButton
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-32 pointer-events-none"
        )}
      >
        <Button
          title={"Printing in Progress..."}
          disabled={isPrinting}
          className="mt-4 px-8 w-[320px] h-11 border-none py-2 rounded-full bg-primary-pink text-lg font-semibold shadow transition"
          // onClick={handlePrinting}
        />
      </div>

      {/*================== Hidden Slip component for pre-rendering ==================*/}
      <div className="hidden">
        <div ref={printSlipRef}>
          <Slip
            shoeName={selectedShoe[0]}
            progressChartReading={progressChartReading}
            values={values}
          />
        </div>
      </div>
    </div>
  );
}
