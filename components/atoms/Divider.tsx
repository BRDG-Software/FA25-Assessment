import { cn } from "@/utils/helper";
import React from "react";

type propsType = {
  height: string;
  width: string;
  className?: string;
};

const Divider = ({ height, width, className }: propsType) => {
  return <div className={cn("bg-white", height, width, className)}></div>;
};

export default Divider;
