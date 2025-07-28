"use client";

import { cn } from "@/utils/helper";
import React, { HTMLAttributes } from "react";
import { motion } from "motion/react";

interface propsType extends HTMLAttributes<HTMLButtonElement> {
  title: string;
  paddingHorizontal?: string;
  guidetext?: boolean;
  onClick?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, propsType>(
  (
    {
      title,
      className,
      paddingHorizontal = "px-16",
      guidetext = false,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
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
            className
          )}
          {...props}
        >
          {title}
          {guidetext && <span className="text-sm">Press Enter to Select</span>}
        </button>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;

const box = {
  width: "100%",
};
