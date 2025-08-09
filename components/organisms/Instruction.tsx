import React from "react";
import Text from "../atoms/Text";
import { GoPlus } from "react-icons/go";
import Divider from "../atoms/Divider";
import DotComponent from "../atoms/DotComponent";

const Instruction = () => {
  return (
    <div className="p-6 w-[92%] flex flex-col items-center h-full m-auto">
      <div className="flex justify-between items-center h-full w-full ">
        <div className="flex items-center gap-4 ">
          <GoPlus size={50} className=" text-white" />
          <Text
            title={"instructions"}
            fontSize="text-sm"
            fontWeight="font-medium leading-10"
            textColor="text-white"
            className="uppercase"
          />
        </div>
        <GoPlus size={50} className=" text-white" />
      </div>
      <div>
        <div className="flex justify-between ">
          <section
            id="instructions-layout"
            className="basis-[55%] p-4  flex flex-col justify-between pt-16 "
          >
            <div className="px-4 py-6">
              <Text
                title={"Complete The Assessment."}
                fontSize="text-4xl"
                fontWeight="font-medium leading-10"
                textColor="text-white"
                className="uppercase"
              />
              <Text
                title={"Bring your print to a trial Staff member."}
                fontSize="text-4xl"
                fontWeight="font-medium leading-10"
                textColor="text-white"
                className="uppercase w-[70%]"
              />
              <Text
                title={"Activate The Trial Experience."}
                fontSize="text-4xl"
                fontWeight="font-medium leading-10"
                textColor="text-white"
                className="uppercase"
              />
              <div className="mt-16">
                <Text
                  title={"Run With your Results Or Experience the"}
                  fontSize="text-4xl"
                  fontWeight="font-medium leading-10"
                  textColor="text-white"
                  className="uppercase w-[150%]"
                />
                <Text
                  title={"Route using One"}
                  fontSize="text-4xl"
                  fontWeight="font-medium leading-10"
                  textColor="text-white"
                  className="uppercase w-[100%]"
                />
                <Text
                  title={"of two other shoes"}
                  fontSize="text-4xl"
                  fontWeight="font-medium leading-10"
                  textColor="text-white"
                  className="uppercase w-[100%]"
                />
              </div>
            </div>
          </section>
          <Divider height="h-[38rem]" width="w-[2px] " className=" bg-white " />
          <section
            className="basis-[45%]  p-4  flex flex-col justify-between pl-16"
            id="guide-controls"
          >
            <div className="flex flex-col gap-8">
              <Text
                title="How to use controls:"
                className="uppercase text-4xl font-medium"
              />
              <div>
                <Text
                  title="LEFT ARROW:"
                  className="uppercase text-4xl font-medium leading-14"
                />
                <Text
                  title="Go back to previous question. "
                  className="text-4xl font-medium"
                />
              </div>
              <div>
                <Text
                  title="RIGHT ARROW:"
                  className="uppercase text-4xl font-medium leading-14"
                />
                <Text
                  title="Proceed to next question. "
                  className="text-4xl font-medium"
                />
              </div>
              <div>
                <Text
                  title="DIAL:"
                  className="uppercase text-4xl font-medium leading-14"
                />
                <Text title="Scroll through answers." className="text-4xl" />
              </div>

              <Text
                title={`PRESS ANY BUTTON TO RETURN TO MENU.`}
                className="text-4xl w-[70%] mt-14 font-medium  text-primary-pink"
              />
            </div>
          </section>
        </div>
        <div className="flex justify-between items-center h-full w-full -mt-12 mb-8">
          <GoPlus size={50} className=" text-white" />

          <GoPlus size={50} className=" text-white" />
        </div>
      </div>
      <section id="footer" className="w-full">
        <Divider height="h-[2px]" width="w-full" className="bg-white" />
        <div className="w-full h-10 mt-2 flex items-center justify-between">
          <div className="flex items-center gap-24">
            <DotComponent total={5} answered={-1} />
            <Text
              title="Trial Assessment"
              fontSize="text-sm"
              fontWeight="font-bold"
              textColor="text-white"
              className="uppercase"
            />
          </div>
          <div className=" w-[30%] h-7 stripes-progress-bar " />
        </div>
      </section>
    </div>
  );
};

export default Instruction;
