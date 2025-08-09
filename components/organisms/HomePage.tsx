"use client";
import { GoPlus } from "react-icons/go";
import Text from "../atoms/Text";
import { useEffect, useRef, useState } from "react";
import ChartSection from "./ChartSection";
import { questions } from "@/utils/data";
import { homePageTabsEnum, layoutEnum, shoeEnum } from "@/utils/types";
import Divider from "../atoms/Divider";
import DotComponent from "../atoms/DotComponent";
import QuestionareSection from "./QuestionareSection";
import AnimatedText from "../atoms/AnimatedText";
import { findIndex, maximumValue } from "@/utils/helper";
import { useMainContext } from "@/providers/MainContext";

export default function HomePage() {
  // ==================STATES==================

  const [focusedIdx, setFocusedIdx] = useState(0);

  // ==================Hooks==================
  const {
    setSelectedOption,
    setSelectedQuestion,
    selectedQuestion,
    selectedOption,
    selectedHomePageTab,
    setSelectedHomePageTab,
    answers,
    setAnswers,
    questionsLength,
  } = useMainContext();

  // =====================REFS==================

  const buttonRefs = [
    useRef<HTMLButtonElement>(null),
    // useRef<HTMLButtonElement>(null),
    // useRef<HTMLButtonElement>(null),
  ];

  // =====================EFFECTS==================
  useEffect(() => {
    if (buttonRefs) buttonRefs[focusedIdx]?.current?.focus();
  }, [focusedIdx, buttonRefs]);

  useEffect(() => {
    setSelectedQuestion(questions[0]);
  }, [setSelectedQuestion]);

  const handleSelect = (qIdx: number, oIdx: number, quesId: string) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = oIdx;
    setAnswers(newAnswers);
    if (qIdx === 4) {
      setSelectedHomePageTab(homePageTabsEnum.animatedText);
    } else {
      setTimeout(() => {
        setSelectedQuestion(questions[findIndex(selectedQuestion?.id) + 1]);
        setSelectedOption(null);
      }, 1000);
    }
  };

  // Calculate result
  const shoeCount: Record<shoeEnum, number> = {
    Structure: 0,
    Pegasus: 0,
    Vomero: 0,
  };

  answers.forEach((oIdx, qIdx) => {
    if (oIdx !== null) {
      const shoe = questions[qIdx].options[oIdx].shoe as shoeEnum;

      shoeCount[shoe]++;
    }
  });

  const total = answers.filter((a) => a !== null).length;

  const shoePercent: Record<shoeEnum, number> = {
    Structure: total ? Math.round((shoeCount.Structure / total) * 100) : 0,
    Pegasus: total ? Math.round((shoeCount.Pegasus / total) * 100) : 0,
    Vomero: total ? Math.round((shoeCount.Vomero / total) * 100) : 0,
  };

  const progress = Math.round(
    (total / (questionsLength ? 4 : questions.length)) * 100
  );

  return (
    <div className="p-6 w-[92%] flex items-center justify-center h-full m-auto">
      <section
        id="questions-layout"
        className="basis-[55%] h-full p-4 pr-6 flex flex-col justify-between"
      >
        <div className="flex justify-between items-center h-full ">
          <div className="flex items-center gap-4 justify-center">
            <GoPlus size={40} className=" text-white" />
            <Text
              title={
                selectedHomePageTab === homePageTabsEnum.questionareTab
                  ? `Question ${findIndex(selectedQuestion?.id) + 1} / 5`
                  : ""
              }
              fontSize="text-sm"
              fontWeight="font-medium"
              textColor="text-white"
              className="uppercase"
            />
          </div>
          <GoPlus size={40} className=" text-white" />
        </div>
        <div className="h-[600px]">
          {selectedHomePageTab === homePageTabsEnum.questionareTab ? (
            <QuestionareSection
              handleSelect={handleSelect}
              selectedQuestion={selectedQuestion}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              answers={answers}
            />
          ) : (
            <AnimatedText
              selectedShoe={maximumValue({
                comfort: shoePercent.Vomero,
                energy: shoePercent.Pegasus,
                response: shoePercent.Structure,
              })}
              progressChartReading={shoePercent}
              values={{
                comfort: shoePercent.Vomero,
                energy: shoePercent.Pegasus,
                response: shoePercent.Structure,
              }}
            />
          )}
        </div>

        <div className="flex justify-between items-center  ">
          <GoPlus size={40} className=" text-white" />
          <GoPlus size={40} className=" text-white" />
        </div>
        <Divider height="h-[2px]" width="w-full mt-6" />
        <div className="w-full h-10  mt-2 py-8 px-0 flex items-center justify-between">
          <DotComponent total={5} answered={total} />
          <Text
            title="Trial Assessment"
            fontSize="text-sm"
            fontWeight="font-medium"
            textColor="text-white"
            className="uppercase"
          />

          <div className=" w-[40%] h-7 stripes-progress-bar " />
        </div>
      </section>
      <Divider height="h-[48rem]" width="w-[2px] " className="mb-6 bg-white" />
      <section className="basis-[45%] h-full " id="graphs">
        <ChartSection
          progress={progress}
          values={{
            comfort: shoePercent.Vomero,
            energy: shoePercent.Pegasus,
            response: shoePercent.Structure,
          }}
          structurePct={shoePercent.Structure}
          pegasusPct={shoePercent.Pegasus}
          vomeroPct={shoePercent.Vomero}
        />
      </section>
    </div>
  );
}
