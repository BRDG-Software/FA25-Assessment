
import { cn } from "@/utils/helper";
import React from "react";

interface Props {
  className?: string;
}
const repeatCount = 2;

function SlipBorderIcon({ className }: Props) {
  return (
    <div className={cn("flex flex-col", className)}>
      {Array.from({ length: repeatCount }).map((_, idx) => (
        <img
          key={idx}
          src={
            "https://res.cloudinary.com/getweys/image/upload/v1752857209/slip-trade-mark_jylvua.svg"
          }
          width={22}
          height={500}
          alt="Trade Mark"
        />
      ))}
    </div>
  );
}

export default React.memo(SlipBorderIcon);
