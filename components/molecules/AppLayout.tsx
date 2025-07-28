"use client";

import { cn } from "@/utils/helper";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import LogoLight from "../../assets/images/runlogolight.svg";
import { IoArrowBackCircle } from "react-icons/io5";
import { useMainContext } from "@/providers/MainContext";
import { homePageTabsEnum } from "../organisms/HomePage";

interface propsType {
  children: React.ReactNode;
  className?: string;
  Logo?: string | StaticImport;
}

const AppLayout = ({ children, className, Logo = LogoLight }: propsType) => {
  const { handleBack, selectedHomePageTab } = useMainContext();

  return (
    <div className="relative m-0 p-0 ">
      <video
        src={"/assets/White_on_dark_red.mp4"}
        autoPlay
        muted
        loop
        id="myVideo"
        className="h-screen w-screen"
      />
      <div
        className={cn(
          "m-16 border-solid border-2 border-white w-[92%] rounded-4xl  min-h-[85%] max absolute top-0 pt-8 flex flex-col",
          className
        )}
      >
        <div className="w-[90%] mx-auto flex justify-center relative items-center pb-5 border-b-2  border-white">
          {/* {selectedHomePageTab !== homePageTabsEnum.animatedText && (
            <IoArrowBackCircle
              size={50}
              className="absolute left-0 cursor-pointer z-50"
              onClick={() => handleBack()}
            />
          )} */}
          <Image
            src={Logo}
            alt="logo"
            width={109}
            height={56}
            className="flex items-center self-center"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
