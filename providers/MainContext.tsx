"use client";
import { SLIP_COUNT_KEY, questions } from "@/utils/data";
import { findIndex } from "@/utils/helper";
import {
  IMainContext,
  SocketEventEnum,
  TLocalStorageCount,
  TSocketPayload,
  homePageTabsEnum,
  layoutEnum,
  questionsTypes,
} from "@/utils/types";
import downloadjs from "downloadjs";
import { number } from "framer-motion";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/utils/localstorage.util";

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
  selectedHomePageTab: homePageTabsEnum?.questionareTab,
  setSelectedHomePageTab: () => {},
  printSlipRef: {} as RefObject<null>,
  handlePrint: () => {},
  showSplash: false,
  setShowSplash: () => {},
  wsRef: {} as React.RefObject<WebSocket | null>,
  answers: [],
  setAnswers: () => {},
  removeOption: null,
  setRemoveOption: () => {},
  handleRemoveOption: () => null,
  questionsLength: false,
  setQuestionsLength: () => {},
});
export const useMainContext = () => useContext(MainContext);

function getMeterFrequencies(answers: (number | null)[]) {
  const counts = [0, 0, 0];
  let nonNullTotal = 0;

  answers.forEach((a) => {
    if (a === 0 || a === 1 || a === 2) {
      counts[a]++;
      nonNullTotal++;
    }
  });

  if (nonNullTotal === 0) return [0, 0, 0];

  return counts.map((count) => count / nonNullTotal);
}

function updateCount() {
  let data: TLocalStorageCount | null = getFromLocalStorage(SLIP_COUNT_KEY);

  if (!data) {
    data = { value: 1 };
  } else {
    data.value += 1;
  }
  saveToLocalStorage(SLIP_COUNT_KEY, data);
  return data.value;
}

export default function MainContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [focusedIdx, setFocusedIdx] = useState(0); // 0: START, 1: INSTRUCTIONS
  const [animatingIdx, setAnimatingIdx] = useState<number | null>(null);
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [lastSocketEvent, setLastSocketEvent] = useState<string | null>(null);
  const [questionsLength, setQuestionsLength] = useState<boolean>(false);

  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const currentScreenRef = useRef(currentScreen);
  const [meter1, meter2, meter3] = getMeterFrequencies(answers);

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

  const [backHandler, setBackHandler] = useState<boolean>(false);
  const visitedRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedTab, setSelectedTab] = useState<layoutEnum>(
    layoutEnum.landingPage
  );

  const [removeOption, setRemoveOption] = useState<number | null>(null);

  // =================Socket Initialization====================

  const wsRef = useRef<WebSocket | null>(null);
  const connectionCounter = useRef<number>(0);
  const removeOptionRef = useRef<number | null>(null);

  const [selectedHomePageTab, setSelectedHomePageTab] =
    useState<homePageTabsEnum>(homePageTabsEnum.questionareTab);

  const handleReset = () => {
    console.log("logging");
    setSelectedTab(layoutEnum.landingPage);
    setShowSplash(false);
    setCurrentScreen(0);
    setHighlightedIdx(0);
    setSelectedOption(null);
    setAnswers([]);
    setSelectedQuestion(questions[0]);
    setSelectedHomePageTab(homePageTabsEnum.questionareTab);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)
      wsRef.current.send(
        JSON.stringify({ event: SocketEventEnum.SCREEN_NUMBER, value: 1 })
      );
  };

  // Modify the resetTimer function to accept any Event type
  const resetTimer = (event?: Event) => {
    if (selectedTab === layoutEnum.landingPage) return;

    // Check if it's a keyboard event
    if (event instanceof KeyboardEvent) {
      if (["ArrowLeft", "ArrowRight", "1", "2", "3"].includes(event.key)) {
        return;
      }
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleReset();
    }, 40000);
  };
  // Keep the ref in sync with the state
  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  useEffect(() => {
    if (showSplash) {
      console.log("showSplash fired");
      const timer = setTimeout(() => {
        handleReset();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSplash, setCurrentScreen]);

  // resets timer if screen is idle for 30 seconds
  useEffect(() => {
    const events = ["mousemove", "click", "scroll", "touchstart", "mousedown"];

    // Handle keydown separately to check for specific keys
    const handleKeydown = (e: KeyboardEvent) => {
      resetTimer(e);
    };

    // Add regular event listeners
    events.forEach((event) => document.addEventListener(event, resetTimer));
    // Add keydown with special handling
    document.addEventListener("keydown", handleKeydown);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.addEventListener("message", resetTimer);
    }

    resetTimer();

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, resetTimer)
      );
      document.removeEventListener("keydown", handleKeydown);
      if (timerRef.current) clearTimeout(timerRef.current);
      // Don't close the WebSocket connection here
    };
  }, [selectedTab]);

  useEffect(() => {
    if (selectedHomePageTab === homePageTabsEnum.animatedText) {
      console.log("is ref fired");
      setCurrentScreen(3);
      visitedRef.current = 3;
    }
  }, [selectedHomePageTab, visitedRef]);

  // Create a separate effect for WebSocket initialization with no dependencies
  useEffect(() => {
    if (!wsRef.current) {
      connectionCounter.current++;
      wsRef.current = new WebSocket(
        process.env.NEXT_PUBLIC_SOCKET_URL as string
      );
      wsRef.current.onopen = () => {
        console.log(
          `WebSocket Connection #${connectionCounter.current} established`
        );
        wsRef.current?.send("Hello, WebSocket!");
        wsRef.current?.send(
          JSON.stringify({
            event: SocketEventEnum.SCREEN_NUMBER,
            value: 1,
          })
        );
      };
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []); // Empty dependency array - only runs once on mount

  // Separate effect for handling WebSocket events
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws) return;

    console.log(
      removeOptionRef.current,
      "removeOptionRef.current is useEffect"
    );
    console.log(removeOption, "Remove option is useEffect");

    const handleStartScreen = (event: MessageEvent) => {
      try {
        const data: TSocketPayload = JSON.parse(event.data);

        // currentScreenRef.current is the instruction screen
        if (currentScreenRef.current === 2 && visitedRef.current === 2) {
          if (
            data?.event === SocketEventEnum.NEXT_BUTTON ||
            data?.event === SocketEventEnum.BACK_BUTTON ||
            data?.event === SocketEventEnum.KNOB
          ) {
            setCurrentScreen(0);
            setSelectedTab(layoutEnum.landingPage);
            ws.send(
              JSON.stringify({ event: SocketEventEnum.SCREEN_NUMBER, value: 1 })
            );
            // visitedRef.current = 0;
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
            const value = data.value - 1;
            setHighlightedIdx(value); // the value it will listen is between 1-3 so that means it will be choosing between any of the 3 values, but we are storing, 0,1,2 respectively for the answers
          }
        }

        if (data?.event === SocketEventEnum.BACK_BUTTON && data.value === 1) {
          if (currentScreen === 0) return;
          if (currentScreen === 1) {
            if (selectedQuestion?.id === "q1") {
              setSelectedTab(layoutEnum.landingPage);
              setCurrentScreen(0);
              ws?.send(
                JSON.stringify({
                  event: SocketEventEnum.SCREEN_NUMBER,
                  value: 1,
                })
              );
            } else {
              ws?.send(
                JSON.stringify({
                  event: SocketEventEnum.SCREEN_NUMBER,
                  value: findIndex(selectedQuestion?.id) + 1, //findIndex returns current questions so our screens per Q are head from their current index
                })
              );
              setSelectedQuestion(
                questions[findIndex(selectedQuestion.id) - 1]
              );
            }
          }
        }

        if (data?.event === SocketEventEnum.NEXT_BUTTON && data.value === 1) {
          setLastSocketEvent(SocketEventEnum.NEXT_BUTTON);
          if (currentScreen < 0) return;
          if (currentScreen === 0 && highlightedIdx === 0) {
            setCurrentScreen(1);
            visitedRef.current = 1;
            startBtnRef.current?.click();
            // sends users screen 2 means user has reached questionaire section question 1
            ws.send(
              JSON.stringify({ event: SocketEventEnum.SCREEN_NUMBER, value: 2 })
            );
          } else if (currentScreen === 0 && highlightedIdx === 1) {
            setCurrentScreen(2);
            visitedRef.current = 2;
            instructionsBtnRef.current?.click();
            console.log("inside instruction button", highlightedIdx);
          }

          if (currentScreen === 1) {
            questionaireRefs[highlightedIdx].current?.click();
            const qIdx = findIndex(selectedQuestion?.id) + 3;
            // To send meter1 value:
            ws.send(JSON.stringify({ event: "meter1", value: meter1 }));

            // To send meter2 value:
            ws.send(JSON.stringify({ event: "meter2", value: meter2 }));

            // To send meter3 value:
            ws.send(JSON.stringify({ event: "meter3", value: meter3 }));

            if (qIdx === 7) return;
            const tempRemoveOption = handleRemoveOption();
            console.log(tempRemoveOption, "tro");
            console.log(removeOptionRef.current, "removeOptionRef");

            // For qIdx === 6, add a small delay to ensure state is updated
            if (qIdx === 6) {
              setTimeout(() => {
                const finalOptionCount =
                  removeOptionRef.current === null ? 3 : 2;
                ws.send(
                  JSON.stringify({
                    event: SocketEventEnum.SCREEN_NUMBER,
                    value: findIndex(selectedQuestion?.id) + 3,
                    option: finalOptionCount,
                  })
                );
              }, 10); // 10ms delay should be enough
            } else {
              ws.send(
                JSON.stringify({
                  event: SocketEventEnum.SCREEN_NUMBER,
                  value: findIndex(selectedQuestion?.id) + 3,
                })
              );
            }
          }

          if (currentScreen === 3) {
            handlePrint();
            ws?.send(JSON.stringify({ event: "printing" }));
            ws.send(
              JSON.stringify({ event: SocketEventEnum.SCREEN_NUMBER, value: 1 })
            );

            console.log("printing");
          }
        }
      } catch (err) {
        console.log("Failed to parse event.data", event.data, err);
      }
    };

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
        console.log("in 1 body");
        ws.send(JSON.stringify({ event: SocketEventEnum.KNOB, value: 1 }));
      }
      if (e.key === "2") {
        ws.send(JSON.stringify({ event: SocketEventEnum.KNOB, value: 2 }));
      }
      if (e.key === "3") {
        ws.send(JSON.stringify({ event: SocketEventEnum.KNOB, value: 3 }));
      }
    };

    ws.onmessage = handleStartScreen;
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      ws.onmessage = null;
    };
  }, [
    highlightedIdx,
    currentScreen,
    questionaireRefs,
    startBtnRef,
    instructionsBtnRef,
    visitedRef,
    meter1,
    meter2,
    meter3,
    removeOption,
    answers,
    removeOptionRef,
  ]);

  useEffect(() => {
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      currentScreen === 1 &&
      lastSocketEvent === SocketEventEnum.NEXT_BUTTON
    ) {
      wsRef.current.send(JSON.stringify({ event: "meter1", value: meter1 }));
      wsRef.current.send(JSON.stringify({ event: "meter2", value: meter2 }));
      wsRef.current.send(JSON.stringify({ event: "meter3", value: meter3 }));

      // Reset the event so it doesn't send again on every answers change
      setLastSocketEvent(null);
    }
  }, [answers, meter1, meter2, meter3, currentScreen, lastSocketEvent]);

  async function saveFile(slipNo: number) {
    const fileName = "slipData.txt";
    const content = JSON.stringify({ slipNo, createdAt: new Date() });

    const response = await fetch("/api/slipRecord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName, content }),
    });

    const data = await response.json();
  }

  const handlePrint = async () => {
    const pricingTableElmt = document.querySelector<HTMLElement>("#slip-pdf");
    if (!pricingTableElmt) return;

    const slipNo = updateCount(); //updates the receipt count on top
    await saveFile(slipNo);

    // Clone the element
    const copiedPricingTableElmt = pricingTableElmt.cloneNode(
      true
    ) as HTMLElement;

    // Create a wrapper to control size
    const wrapper = document.createElement("div");
    wrapper.style.width = "464px";
    wrapper.style.height = "787px";
    wrapper.style.position = "fixed";
    wrapper.style.right = "100%";
    wrapper.style.overflow = "hidden"; // Optional: crop content
    wrapper.appendChild(copiedPricingTableElmt);

    // Apply size directly to the cloned element if needed
    copiedPricingTableElmt.style.width = "100%";
    copiedPricingTableElmt.style.height = "100%";

    document.body.appendChild(wrapper);

    // Render to canvas
    const canvas = await html2canvas(wrapper, {
      width: 464,
      height: 787,
      windowWidth: 464, // help ensure layout matches
      windowHeight: 787,
    });

    // Cleanup
    wrapper.remove();

    // Try BMP (browser support may vary)
    const id: string = uuidv4();
    const dataURL = canvas.toDataURL("image/bmp");
    downloadjs(dataURL, `${id}.bmp`, "image/bmp");
    // to show redirection screen since there is no functionality that runs after user has closed the download popup or
    setTimeout(async () => {
      setShowSplash(true);
      await fetch("/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exePath: process.env.NEXT_PUBLIC_SCRIPT_PATH as string,
          bmpPath: `${
            process.env.NEXT_PUBLIC_DOWNLOAD_PATH as string
          }${id}.bmp`,
        }),
      });
    }, 3000);
    setTimeout(() => {
      handleReset();
    }, 6000);
  };

  const handleBack = () => {
    setBackHandler(true);
    if (selectedQuestion?.id === "q1") {
      setSelectedTab(layoutEnum.landingPage);
      setCurrentScreen(0);
    } else {
      setSelectedQuestion(questions[findIndex(selectedQuestion.id) - 1]);
    }
  };

  const handleRemoveOption = useCallback(() => {
    const filteredAnswers = answers.filter((item) => item !== null);
    let tempOption = null;

    if (filteredAnswers.length > 3) {
      const duplicates: number[] = [];
      filteredAnswers.forEach((item, index) => {
        if (
          filteredAnswers.indexOf(item as number) !== index &&
          !duplicates.includes(item as number)
        ) {
          duplicates.push(item as number);
        }
      });

      if (duplicates.length > 1) {
        const options = [0, 1, 2];
        const hideOption = options.find((item) => !duplicates.includes(item));
        tempOption = hideOption as number;
        // setRemoveOption(hideOption as number);
      }

      const check = filteredAnswers.filter(
        (item) => !duplicates.includes(item as number)
      );

      if (duplicates.length === 1 && tempOption === null && check.length > 1) {
        setQuestionsLength(true);
        setSelectedHomePageTab(homePageTabsEnum.animatedText);
      }
    }
    console.log(tempOption, "inside handle Remove function");
    removeOptionRef.current = tempOption;
    return tempOption;
  }, [answers]);

  // =====================================

  const values: IMainContext = {
    // socket: socketRef,
    wsRef,
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
    setAnswers,
    answers,
    removeOption,
    setRemoveOption,
    handleRemoveOption,
    questionsLength,
    setQuestionsLength,
  };
  return <MainContext.Provider value={values}>{children}</MainContext.Provider>;
}
