import { cn } from "@/utils/helper";
import React from "react";

type propsType = {
  title: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  className?: string;
};

const Text = ({
  title,
  textColor = "text-white",
  fontSize = "text-lg",
  fontWeight = "font-400",
  className,
}: propsType) => {
  return (
    <p className={cn(textColor, fontSize, fontWeight, className)}>{title}</p>
  );
};

export default Text;
