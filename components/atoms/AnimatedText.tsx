"use client";

import { calibrationSteps, runSteps } from "@/utils/data";
import { cn } from "@/utils/helper";
import { TypeAnimation } from "react-type-animation";
import React, { useEffect, useMemo, useState } from "react";
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
  const { printSlipRef, handlePrint, showSplash, isPrinting, setIsPrinting } =
    useMainContext();
  const [phase, setPhase] = useState<"calibration" | "run">("calibration");
  const [showPrintButton, setShowPrintButton] = useState(false);
  const [showChoiceText, setShowChoiceText] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [hideText1, setHideText1] = useState<boolean>(false);
  const [hideText2, setHideText2] = useState<boolean>(false);
  const [animationEnded, setAnimationEnded] = useState<boolean>(false);

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
      // Show print button after all run step animations are done
      const timer = setTimeout(
        () => setShowPrintButton(true),
        runStepsArray.length * (runStepDuration + 1300)
      );
      const textTimer = setTimeout(
        () => setShowChoiceText(true),
        runStepsArray.length * (runStepDuration + 900)
      );
      const resultTimer = setTimeout(
        () => setShowResult(true),
        runStepsArray.length * (runStepDuration + 1050)
      );
      const hideText1Timer = setTimeout(
        () => setHideText1(true),
        runStepsArray.length * (runStepDuration + 500)
      );
      const hideText2Timer = setTimeout(
        () => setHideText2(true),
        runStepsArray.length * (runStepDuration + 800)
      );
      const typeAnimationEndedTimer = setTimeout(
        () => setAnimationEnded(true),
        runStepsArray.length * runStepDuration
      );

      return () => {
        clearTimeout(timer);
        clearTimeout(textTimer);
        clearTimeout(resultTimer);
        clearTimeout(hideText1Timer);
        clearTimeout(hideText2Timer);
        clearTimeout(typeAnimationEndedTimer);
      };
    }
  }, [phase, calibrationDuration]);

  // console.log({ hasReturnedFromPrint });
  // useEffect(() => {
  //   const handleFocus = () => {
  //     if (isPrinting) {
  //       setIsPrinting(false);
  //       setHasReturnedFromPrint(true);
  //       setShowSplash(true); // Add this line
  //     }
  //   };

  //   window.addEventListener("focus", handleFocus);
  //   return () => window.removeEventListener("focus", handleFocus);
  // }, [isPrinting]);

  // Add this new useEffect

  // console.log({ showSplash });
  // useEffect(() => {
  //   if (showPrintButton) {
  //     setTimeout(() => {
  //       setSelectedTab(layoutEnum.landingPage);
  //     }, 45000);
  //   }
  // }, [showPrintButton]);

  // const unSelectedShoe = useMemo(() => {
  //   const unSelected = runStepsArray.filter(
  //     (item) => !selectedShoe.includes(item)
  //   );
  //   return unSelected;
  // }, [runStepsArray, selectedShoe]);

  // const selectedWinnerShoe = useMemo(() => {
  //   const selectedArray: shoeEnum[] = [];
  //   runStepsArray.forEach((shoe) => {
  //     selectedShoe.forEach((item) => {
  //       if (item === shoe) {
  //         selectedArray.push(shoe);
  //       }
  //     });
  //   });
  //   return selectedArray;
  // }, [runStepsArray, selectedShoe]);

  useEffect(() => {
    setIsPrinting(true);
    if (showPrintButton && isPrinting) {
      handlePrint();
    }
    return () => {
      setIsPrinting(false);
    };
  }, [isPrinting, showPrintButton]);

  // const handlePrinting = () => {
  //   setIsPrinting(true);
  //   if (isPrinting) {
  //     return;
  //   } else {
  //     handlePrint();
  //   }
  //   // setTimeout(() => {
  //   //   setIsPrinting(false);
  //   // }, 10000);
  // };

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
        {/* {animationEnded &&
          selectedWinnerShoe.map((item) => {
            return (
              <Text
                key={item}
                title={`${runSteps[item]}.`}
                className={cn(
                  `text-6xl font-bold uppercase text-white leading-12 ${
                    showResult && "text-primary-pink"
                  }`
                )}
              />
            );
          })} */}

        {/* these are the styling below done earlier */}
        {/* ${
                    hideText1 &&
                    index === 1 &&
                    "opacity-0 duration-700 -translate-x-32"
                  } */}
        {/* ${hideText2 && index === 0 && "opacity-0 duration-700 -translate-x-32"} */}
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
                    // (selectedShoe.length > 1
                    //   ? selectedShoe[index] === shoe
                    //   : selectedShoe[0] === shoe)
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
    </div>
  );
}
