"use client";

import { cn } from "@/utils/helper";
import React, { HTMLAttributes } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import ForwardIconSvg from "@/assets/images/forwardIcon.svg";
import DarkForwardIconSvg from "@/assets/images/forwardIconBlack.svg";

interface propsType extends HTMLAttributes<HTMLButtonElement> {
  title: string;
  paddingHorizontal?: string;
  guidetext?: boolean;
  onClick?: () => void;
  selectedAnswer?: boolean;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, propsType>(
  (
    {
      title,
      className,
      paddingHorizontal = "px-16",
      guidetext = false,
      onClick,
      selectedAnswer,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.8 }}
        style={box}
        onClick={onClick}
      >
        <button
          ref={ref}
          className={cn(
            "border-solid border-2 border-white w-full py-2 rounded-full hover:bg-primary-pink hover:text-black hover:border-primary-pink  hover:duration-500",
            paddingHorizontal,
            className,
            disabled && "opacity-50 cursor-not-allowed"
          )}
          {...props}
        >
          {title}
          {guidetext && (
            <span className="text-sm flex  gap-2 w-[19%]">
              Press
              {selectedAnswer ? (
                <Image
                  src={DarkForwardIconSvg}
                  width={11}
                  height={11}
                  alt="forwardIcon"
                />
              ) : (
                <Image
                  src={ForwardIconSvg}
                  width={10}
                  height={10}
                  alt="forwardIcon"
                />
              )}
              to Select
            </span>
          )}
        </button>
      </motion.div>
    );
  }
);

Button.displayName = "Button";

export default Button;

const box = {
  width: "100%",
};
