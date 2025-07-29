import { layoutEnum, optionTypes, questionsTypes } from "@/utils/types";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "../atoms/Button";
import Text from "../atoms/Text";
import { cn, findIndex } from "@/utils/helper";
import { motion } from "motion/react";
import { questions } from "@/utils/data";
import { useMainContext } from "@/providers/MainContext";
import { homePageTabsEnum } from "./HomePage";

type propsType = {
  handleSelect: (qIdx: number, oIdx: number, quesId: string) => void;
  selectedQuestion: questionsTypes;
  selectedOption: number | null;
  setSelectedOption: Dispatch<SetStateAction<number | null>>;
  answers: (number | null)[];
};

const QuestionareSection = ({
  handleSelect,
  selectedQuestion,
  selectedOption,
  setSelectedOption,
  answers,
}: propsType) => {
  const {
    highlightedIdx,
    questionaireRefs,
    setHighlightedIdx,
    setCurrentScreen,
  } = useMainContext();
  const [hoverOption, setHoverOption] = useState<number | null>(null);
  const [removeOption, setRemoveOption] = useState<number | null>(null);

  const { setSelectedTab, setSelectedHomePageTab } = useMainContext();

  const triggerHover = (oIdx: number) => {
    setHoverOption(oIdx);
    setHighlightedIdx(oIdx);
  };

  const handleButtonClick = (qIdx: number, oIdx: number, quesId: string) => {
    setSelectedOption(oIdx);
    handleSelect(qIdx, oIdx, quesId);
  };

  // useEffect(() => {
  //   const questionareTimer = setTimeout(() => {
  //     setSelectedTab(layoutEnum.landingPage);
  //   }, 90000);

  //   return () => {
  //     clearTimeout(questionareTimer);
  //   };
  // }, [setSelectedTab]);

  useEffect(() => {
    const filteredAnswers = answers.filter((item) => item !== null);

    if (filteredAnswers.length > 3) {
      const duplicates: number[] = [];
      filteredAnswers.forEach((item, index) => {
        if (
          filteredAnswers.indexOf(item) !== index &&
          !duplicates.includes(item)
        ) {
          duplicates.push(item);
        }
      });

      if (duplicates.length > 1) {
        const options = [0, 1, 2];
        const removeOption = options.find((item) => !duplicates.includes(item));
        setRemoveOption(removeOption as number);
      }

      const check = filteredAnswers.filter(
        (item) => !duplicates.includes(item)
      );

      if (
        duplicates.length === 1 &&
        removeOption === null &&
        check.length > 1
      ) {
        setSelectedHomePageTab(homePageTabsEnum.animatedText);
      }
    }
  }, [answers, selectedOption]);

  return (
    <motion.div
      key={selectedQuestion.id}
      whileFocus={{
        transition: {
          duration: 0.8,
          delay: 0.8,
          ease: [0, 0.71, 0.2, 1.01],
        },
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("px-4 py-6")}
    >
      <Text
        title={selectedQuestion?.text}
        fontSize="text-6xl"
        fontWeight="font-medium "
        textColor="text-white"
        className={`uppercase mt-4 leading-15`}
      />
      {selectedQuestion.options.map((opt: optionTypes, oIdx) => {
        return (
          <div key={oIdx} className="flex flex-col mt-12 gap-8 justify-between">
            {oIdx === removeOption && selectedQuestion?.id === "q5" ? (
              <></>
            ) : (
              <Button
                ref={questionaireRefs[oIdx]}
                title={opt.label}
                className={cn(
                  "flex text-white justify-between items-center px-4 text-3xl py-4 border-0 rounded-xl hover:!border-2 w-[95%] hover:!border-white hover:!bg-transparent hover:!text-white font-medium transition-all duration-300",
                  selectedOption === oIdx &&
                    selectedQuestion?.id ===
                      questions[findIndex(selectedQuestion?.id)].id &&
                    "!bg-primary-pink !text-white !border-primary-pink hover:!bg-primary-pink hover:!text-black hover:!border-primary-pink",
                  highlightedIdx === oIdx &&
                    "border-4 border-white text-white scale-110",

                  answers[findIndex(selectedQuestion?.id)] === oIdx &&
                    "!bg-primary-pink !text-white !border-primary-pink"
                )}
                guidetext={hoverOption === oIdx || highlightedIdx === oIdx}
                onClick={() => {
                  handleButtonClick(
                    findIndex(selectedQuestion?.id),
                    oIdx,
                    selectedQuestion?.id
                  );
                }}
                onMouseOver={() => triggerHover(oIdx)}
                onMouseLeave={() => setHoverOption(null)}
              />
            )}
          </div>
        );
      })}
    </motion.div>
  );
};

export default QuestionareSection;
