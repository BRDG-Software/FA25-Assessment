import { Dispatch, RefObject, SetStateAction } from "react";
import { UseReactToPrintFn } from "react-to-print";

// =========================Enums=====================
export enum shoeEnum {
  structure = "Structure",
  pegasus = "Pegasus",
  vomero = "Vomero",
}

export const enum SocketEventEnum {
  BACK_BUTTON = "back_button",
  NEXT_BUTTON = "next_button",
  KNOB = "knob",
  PRINTING = "printing",
  SCREEN_NUMBER = "screen_number",
  METER1 = "meter_1",
  METER2 = "meter_2",
  METER3 = "meter_3",
}

export enum layoutEnum {
  landingPage = "LandingPage",
  appLayout = "AppLayout",
  instructionPage = "InstructionPage",
}

export enum homePageTabsEnum {
  questionareTab = "QuestionareTab",
  animatedText = "AnimatedText",
}

// =========================Types=====================

export type optionTypes = {
  label: string;
  shoe: shoeEnum;
};

export type questionsTypes = {
  id: string;
  text: string;
  options: optionTypes[];
};

export type shoePercentTypes = {
  comfort: number;
  energy: number;
  response: number;
};

export type videoTypes = {
  id: string;
  link: string;
};

export type TSocketPayload =
  | { event: SocketEventEnum.BACK_BUTTON; value: 1 }
  | { event: SocketEventEnum.NEXT_BUTTON; value: 1 }
  | { event: SocketEventEnum.KNOB; value: 1 | 2 | 3 }
  | null;

export type TStartPageRef = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  btnRefs: React.RefObject<HTMLButtonElement | null>[];
} | null;

// =========================Interfaces=====================

export interface IMainContext {
  // socket: React.RefObject<WebSocket> | null;
  startBtnRef: React.RefObject<HTMLButtonElement | null>;

  instructionsBtnRef: React.RefObject<HTMLButtonElement | null>;

  focusedIdx: number;
  setFocusedIdx: React.Dispatch<React.SetStateAction<number>>;

  animatingIdx: number | null;
  setAnimatingIdx: React.Dispatch<React.SetStateAction<number | null>>;

  highlightedIdx: number;
  setHighlightedIdx: React.Dispatch<React.SetStateAction<number>>;

  questionaireRefs: React.RefObject<HTMLButtonElement | null>[];

  currentScreen: number;
  setCurrentScreen: React.Dispatch<React.SetStateAction<number>>;

  selectedTab: layoutEnum;
  setSelectedTab: React.Dispatch<React.SetStateAction<layoutEnum>>;

  selectedQuestion: questionsTypes;
  setSelectedQuestion: Dispatch<SetStateAction<questionsTypes>>;
  selectedOption: number | null;
  setSelectedOption: Dispatch<SetStateAction<number | null>>;
  handleBack: () => void;
  backHandler: boolean;
  setBackHandler: Dispatch<SetStateAction<boolean>>;
  setSelectedHomePageTab: Dispatch<SetStateAction<homePageTabsEnum>>;
  selectedHomePageTab: homePageTabsEnum;
  printSlipRef: RefObject<null>;
  handlePrint: UseReactToPrintFn;

  showSplash: boolean;
  setShowSplash: Dispatch<SetStateAction<boolean>>;

  wsRef: React.RefObject<WebSocket | null>;

  setAnswers: Dispatch<SetStateAction<(number | null)[]>>;
  answers: (number | null)[];
  removeOption: number | null;
  setRemoveOption: Dispatch<SetStateAction<number | null>>;
  handleRemoveOption: () => number | null;
}
