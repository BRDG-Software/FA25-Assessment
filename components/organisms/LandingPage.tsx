"use client";
import React, { useEffect } from "react";
import { GoPlus } from "react-icons/go";
import Button from "../atoms/Button";
import Text from "../atoms/Text";
import Divider from "../atoms/Divider";
import Image from "next/image";
import Logo from "@/assets/images/runlogolight.svg";

import { cn } from "@/utils/helper";
import { useMainContext } from "@/providers/MainContext";
import { layoutEnum } from "@/utils/types";

type propsType = {
  setSelectedTab: React.Dispatch<React.SetStateAction<layoutEnum>>;
};

const LandingPage = ({ setSelectedTab }: propsType) => {
  const {
    animatingIdx,
    highlightedIdx,
    instructionsBtnRef,
    setAnimatingIdx,
    startBtnRef,
  } = useMainContext();

  // Remove the animation class after the animation duration
  useEffect(() => {
    if (animatingIdx !== null) {
      const timeout = setTimeout(() => setAnimatingIdx(null), 300); // 300ms = animation duration
      return () => clearTimeout(timeout);
    }
  }, [animatingIdx, setAnimatingIdx]);

  const handleTabChange = () => {
    setSelectedTab(layoutEnum.appLayout);
  };

  return (
    <div className={cn(`relative m-0 p-0  h-screen w-screen`)}>
      <video
        src={"/assets/White_on_dark_red.mp4"}
        autoPlay
        muted
        loop
        id="myVideo"
        className="h-screen w-screen"
      />

      <div
        className={`m-16 border-solid border-2  w-[92%] rounded-4xl h-[85%] absolute top-0 p-8 flex flex-col justify-between ${"border-white"}`}
      >
        <div className="flex justify-between items-center">
          <GoPlus size={65} />
          <div>
            <Image src={Logo} height={100} width={100} alt="run" />
          </div>
          <GoPlus size={65} />
        </div>
        <div className="flex flex-col items-center">
          <Text
            title="CHOOSE YOUR RUN"
            fontSize="text-7xl"
            fontWeight="bold"
            textColor={`text-white`}
          />
          <Divider
            height="h-[2px]"
            width="w-[80%]"
            className={cn(`mt-8 mb-6 *:bg-white`)}
          />
          <div className="w-[30%]" tabIndex={-1}>
            <Button
              tabIndex={0}
              ref={startBtnRef}
              title="START"
              className={cn(
                "font-bold mb-6 border-2 border-white text-white text-lg",
                // splashEffect && "border-black hover:bg-black hover:text-white",
                // "focus:border-black focus:text-black ease-in-out duration-200",
                highlightedIdx === 0 &&
                  "border-primary-pink bg-primary-pink text-black scale-110 transition-transform duration-200"
              )}
              onClick={handleTabChange}
            />
            <Button
              tabIndex={0}
              ref={instructionsBtnRef}
              title="INSTRUCTIONS"
              className={cn(
                "font-bold border-2 border-white text-white text-lg",
                // splashEffect && "border-black hover:bg-black hover:text-white",
                // "focus:border-black focus:text-black  ease-in-out duration-200",
                highlightedIdx === 1 &&
                  "bg-primary-pink text-black scale-110 border-primary-pink",
                "transition-transform duration-200"
              )}
              onClick={() => setSelectedTab(layoutEnum.instructionPage)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <GoPlus
            size={65}
            //  color={`${splashEffect && "black"}`}
          />
          <Text
            title="TRIAL ASSESSMENT"
            fontSize="text-lg"
            fontWeight="font-bold"
            // textColor={`${splashEffect && "text-black"}`}
          />
          <GoPlus
            size={65}
            // color={`${splashEffect && "black"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
