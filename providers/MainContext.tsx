"use client";
import { homePageTabsEnum } from "@/components/organisms/HomePage";
import { questions } from "@/utils/data";
import { findIndex } from "@/utils/helper";
import {
  IMainContext,
  SocketEventEnum,
  TSocketPayload,
  layoutEnum,
  questionsTypes,
} from "@/utils/types";
import {
  createContext,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReactToPrint } from "react-to-print";

const MAX_HIGHLIGHT_INDEX = 3;

export const MainContext = createContext<IMainContext>({
  // socket: null,
  instructionsBtnRef: {} as React.RefObject<HTMLButtonElement | null>,
  focusedIdx: 0,
  setFocusedIdx: () => {},
  animatingIdx: null,
  setAnimatingIdx: () => {},
  highlightedIdx: 0,
  setHighlightedIdx: () => {},
  startBtnRef: {} as React.RefObject<HTMLButtonElement>,
  questionaireRefs: [] as React.RefObject<HTMLButtonElement | null>[],
  currentScreen: 0,
  setCurrentScreen: () => {},
  selectedTab: layoutEnum.landingPage,
  setSelectedTab: () => {},
  selectedOption: null,
  setSelectedOption: () => {},
  setSelectedQuestion: () => {},
  selectedQuestion: questions[0],
  handleBack: () => {},
  backHandler: false,
  setBackHandler: () => {},
  selectedHomePageTab: homePageTabsEnum.questionareTab,
  setSelectedHomePageTab: () => {},
  printSlipRef: {} as RefObject<null>,
  handlePrint: () => {},
  showSplash: false,
  setShowSplash: () => {},
});
export const useMainContext = () => useContext(MainContext);

export default function MainContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [focusedIdx, setFocusedIdx] = useState(0); // 0: START, 1: INSTRUCTIONS
  const [animatingIdx, setAnimatingIdx] = useState<number | null>(null);
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const [currentScreen, setCurrentScreen] = useState(0);
  const currentScreenRef = useRef(currentScreen);
  const socketRef = useRef<WebSocket | null>(null);
  const instructionsBtnRef = useRef<HTMLButtonElement>(null);
  const startBtnRef = useRef<HTMLButtonElement>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<questionsTypes>(
    questions[0]
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showSplash, setShowSplash] = useState(false);

  const questionaireRefs = Array.from({ length: MAX_HIGHLIGHT_INDEX }, () =>
    useRef<HTMLButtonElement>(null)
  );
  const printSlipRef = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: "",
    contentRef: printSlipRef,
    onAfterPrint: () => {
      setShowSplash(true);
      setCurrentScreen(0);
    },
  });

  const [backHandler, setBackHandler] = useState<boolean>(false);
  const visitedRef = useRef<number>(0);

  const [selectedTab, setSelectedTab] = useState<layoutEnum>(
    layoutEnum.landingPage
  );

  const [selectedHomePageTab, setSelectedHomePageTab] =
    useState<homePageTabsEnum>(homePageTabsEnum.questionareTab);
  // Keep the ref in sync with the state
  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setCurrentScreen(0);
        setSelectedTab(layoutEnum.landingPage);
        setSelectedHomePageTab(homePageTabsEnum.questionareTab);
        setHighlightedIdx(0);
        setSelectedOption(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSplash, setCurrentScreen]);

  useEffect(() => {
    if (selectedHomePageTab === homePageTabsEnum.animatedText) {
      setCurrentScreen(3);
      visitedRef.current = 3;
    }
  }, [selectedHomePageTab, visitedRef]);

  console.log({ selectedHomePageTab, currentScreen, showSplash });
  // =================Socket Initialization====================

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL as string);
    //   socketRef.current = ws;
    console.log({ current: visitedRef.current });
    ws.onopen = () => {
      console.log("Connected to WebSocket");
      ws.send("Hello, WebSocket!");
    };

    const handleStartScreen = (event: MessageEvent) => {
      try {
        const data: TSocketPayload = JSON.parse(event.data);

        // Place this block at the top
        if (currentScreenRef.current === 2 && visitedRef.current === 2) {
          if (
            data?.event === SocketEventEnum.NEXT_BUTTON ||
            data?.event === SocketEventEnum.BACK_BUTTON ||
            data?.event === SocketEventEnum.KNOB
          ) {
            setCurrentScreen(0);
            // visitedRef.current = 0;
            setSelectedTab(layoutEnum.landingPage);
            return;
          }
        }

        if (data?.event === SocketEventEnum.KNOB) {
          if (currentScreen === 0) {
            //this means i am on the start screen
            if (data.value === 1) {
              setHighlightedIdx(0);
            } else if (data.value === 2) {
              setHighlightedIdx(1);
            }
          }

          if (currentScreen === 1) {
            //this means i am on the questionaire screen
            setHighlightedIdx(data.value - 1); // the value it will listen is between 1-3 so that means it will be choosing between any of the 3 values, but we are storing, 0,1,2 respectively for the answers
          }
        }

        if (data?.event === SocketEventEnum.BACK_BUTTON && data.value === 1) {
          if (currentScreen === 0) return;
          if (currentScreen === 1) {
            if (selectedQuestion?.id === "q1") {
              setSelectedTab(layoutEnum.landingPage);
              setCurrentScreen(0);
            } else {
              setSelectedQuestion(
                questions[findIndex(selectedQuestion.id) - 1]
              );
            }
          }
        }

        if (data?.event === SocketEventEnum.NEXT_BUTTON && data.value === 1) {
          if (currentScreen < 0) return;
          if (currentScreen === 0 && highlightedIdx === 0) {
            setCurrentScreen(1);
            visitedRef.current = 1;
            startBtnRef.current?.click();
          } else if (currentScreen === 0 && highlightedIdx === 1) {
            setCurrentScreen(2);
            visitedRef.current = 2;
            instructionsBtnRef.current?.click();
            console.log("inside instruction button", highlightedIdx);
          }

          if (currentScreen === 1) {
            questionaireRefs[highlightedIdx].current?.click();
          }
          console.log({ currentScreen, ref: currentScreenRef.current });
          if (currentScreen === 3) {
            handlePrint();

            console.log("printing");
          }
        }
      } catch (err) {
        console.log("Failed to parse event.data", event.data, err);
      }
    };

    ws.onmessage = handleStartScreen;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (ws.readyState !== WebSocket.OPEN) return;

      if (e.key === "ArrowRight") {
        ws.send(
          JSON.stringify({ event: SocketEventEnum.NEXT_BUTTON, value: 1 })
        );
      } else if (e.key === "ArrowLeft") {
        ws.send(
          JSON.stringify({ event: SocketEventEnum.BACK_BUTTON, value: 1 })
        );
      }
      if (e.key === "1") {
        ws.send(JSON.stringify({ event: SocketEventEnum.KNOB, value: 1 }));
      }
      if (e.key === "2") {
        ws.send(JSON.stringify({ event: SocketEventEnum.KNOB, value: 2 }));
      }
      if (e.key === "3") {
        ws.send(JSON.stringify({ event: SocketEventEnum.KNOB, value: 3 }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      ws.onmessage = null;
      ws.close();
    };
    // Only run once on mount
    // eslint-disable-next-line
  }, [
    highlightedIdx,
    currentScreen,
    questionaireRefs,
    startBtnRef,
    instructionsBtnRef,
    visitedRef,
  ]);

  const handleBack = () => {
    setBackHandler(true);
    if (selectedQuestion?.id === "q1") {
      setSelectedTab(layoutEnum.landingPage);
      setCurrentScreen(0);
    } else {
      setSelectedQuestion(questions[findIndex(selectedQuestion.id) - 1]);
    }
  };

  // =====================================

  const values: IMainContext = {
    // socket: socketRef,
    setShowSplash,
    showSplash,
    selectedTab,
    setSelectedTab,
    currentScreen,
    setCurrentScreen,
    startBtnRef,
    instructionsBtnRef,
    focusedIdx,
    setFocusedIdx,
    animatingIdx,
    setAnimatingIdx,
    highlightedIdx,
    setHighlightedIdx,
    questionaireRefs,
    selectedOption,
    selectedQuestion,
    setSelectedOption,
    setSelectedQuestion,
    handleBack,
    backHandler,
    setBackHandler,
    selectedHomePageTab,
    setSelectedHomePageTab,
    printSlipRef,
    handlePrint,
  };
  return <MainContext.Provider value={values}>{children}</MainContext.Provider>;
}
