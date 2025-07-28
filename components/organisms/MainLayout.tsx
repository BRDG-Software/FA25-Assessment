"use client";

import React from "react";
import LandingPage from "./LandingPage";
import AppLayout from "../molecules/AppLayout";
import Instruction from "./Instruction";
import { useMainContext } from "@/providers/MainContext";
import { layoutEnum } from "@/utils/types";

type propsType = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: propsType) => {
  const { selectedTab, setSelectedTab } = useMainContext();

  return (
    <div>
      {selectedTab === layoutEnum.landingPage ? (
        <LandingPage setSelectedTab={setSelectedTab} />
      ) : selectedTab === "AppLayout" ? (
        <AppLayout>{children}</AppLayout>
      ) : (
        <AppLayout>
          <Instruction />
        </AppLayout>
      )}
    </div>
  );
};

export default MainLayout;
