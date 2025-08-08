"use client";
import { SLIP_COUNT_KEY, questions } from "@/utils/data";
import { eventLogger, findIndex } from "@/utils/helper";
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
  isPrinting: false,
  setIsPrinting: () => {},
  handleReset: () => {},
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
  const [isPrinting, setIsPrinting] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isPreRendering, setIsPreRendering] = useState(false);
  const [preRenderedCanvas, setPreRenderedCanvas] =
    useState<HTMLCanvasElement | null>(null);
  const [preRenderedId, setPreRenderedId] = useState<string | null>(null);
  const [hasPrinted, setHasPrinted] = useState(false);

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
    setSelectedTab(layoutEnum.landingPage);
    setShowSplash(false);
    setCurrentScreen(0);
    setHighlightedIdx(0);
    setSelectedOption(null);
    setAnswers([]);
    setSelectedQuestion(questions[0]);
    setSelectedHomePageTab(homePageTabsEnum.questionareTab);
    // Reset print-related states
    setHasPrinted(false);
    setPreRenderedCanvas(null);
    setPreRenderedId(null);
    setIsPreRendering(false);
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

  const remapByRemovedOption: Record<number, Record<number, number>> = {
    0: {
      0: 1, // removed → fallback
      1: 2, // now acts as index 2
    },
    1: {
      0: 0,
      1: 2, // removed → fallback
    },
    2: {
      0: 0,
      1: 1,
      2: 1, // removed → fallback
    },
  };
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws) return;

    const handleStartScreen = async (event: MessageEvent) => {
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
            let value = data.value - 1;

            if (removeOption === 0) {
              if (value === 0) {
                setHighlightedIdx(1);
                return;
              }
              if (value === 1) {
                setHighlightedIdx(2);
                return;
              }
            }

            if (removeOption === 2) {
              if (value === 0) {
                setHighlightedIdx(0);
                return;
              }
              if (value === 1) {
                setHighlightedIdx(1);
                return;
              }
            }

            setHighlightedIdx(value);
          }
        }

        if (data?.event === SocketEventEnum.BACK_BUTTON && data.value === 1) {
          if (currentScreen === 0) return;
          if (currentScreen === 1) {
            if (selectedQuestion?.id === "q1") {
              setSelectedTab(layoutEnum.landingPage);
              setCurrentScreen(0);
              setAnswers([]);
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
          }

          if (currentScreen === 1) {
            questionaireRefs[highlightedIdx].current?.click();
            const qIdx = findIndex(selectedQuestion?.id) + 3;
            console.log({ qIdx });

            // To send meter1 value:
            ws.send(
              JSON.stringify({ event: SocketEventEnum.METER1, value: meter1 })
            );

            // To send meter2 value:
            ws.send(
              JSON.stringify({ event: SocketEventEnum.METER2, value: meter2 })
            );

            // To send meter3 value:
            ws.send(
              JSON.stringify({ event: SocketEventEnum.METER3, value: meter3 })
            );

            if (qIdx === 7) return;

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
        }
      } catch (err) {
        console.log("Failed to parse event.data", event.data, err);
      }
    };

    const handleKeyDown = async (e: KeyboardEvent) => {
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

      await eventLogger({
        page: currentScreen,
        action: {
          eventTriggered:
            e.key === "ArrowRight" || e.key === "ArrowLeft"
              ? 1
              : e.key === "1"
              ? 1
              : e.key === "2"
              ? 2
              : 3,
        },
        value: highlightedIdx || currentScreen,
      });
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
    const fileName = "slipData.json";
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

  // Pre-render function that runs during animations
  const preRenderPrintContent = async () => {
    if (isPreRendering || preRenderedCanvas) {
      console.log(
        "🔄 Pre-rendering skipped - already in progress or completed"
      );
      return; // Already pre-rendering or done
    }

    setIsPreRendering(true);
    console.log("🔄 Starting pre-render during animations...");

    try {
      // Step 1: Find element
      const step1Start = performance.now();
      const pricingTableElmt = document.querySelector<HTMLElement>("#slip-pdf");
      if (!pricingTableElmt) {
        console.log("❌ Element #slip-pdf not found for pre-render");
        return;
      }
      const step1Time = performance.now() - step1Start;
      console.log(
        `✅ Pre-render Step 1 - Element found: ${step1Time.toFixed(2)}ms`
      );

      // Step 2: Update count and save file
      const step2Start = performance.now();
      const slipNo = updateCount();
      await saveFile(slipNo);
      const step2Time = performance.now() - step2Start;
      console.log(
        `✅ Pre-render Step 2 - Count update & file save: ${step2Time.toFixed(
          2
        )}ms`
      );

      // Step 3: Wait for fonts
      const step3Start = performance.now();
      await document.fonts.ready;
      const step3Time = performance.now() - step3Start;
      console.log(
        `✅ Pre-render Step 3 - Fonts ready: ${step3Time.toFixed(2)}ms`
      );

      // Step 4: Create styles
      const step4Start = performance.now();
      const style = document.createElement("style");
      document.head.appendChild(style);
      style.sheet?.insertRule(
        "body > div:last-child img { display: inline-block; }"
      );
      style.sheet?.insertRule(
        "body > div:last-child * { line-height: normal; }"
      );
      const step4Time = performance.now() - step4Start;
      console.log(
        `✅ Pre-render Step 4 - Styles created: ${step4Time.toFixed(2)}ms`
      );

      // Step 5: Clone element
      const step5Start = performance.now();
      const copiedPricingTableElmt = pricingTableElmt.cloneNode(
        true
      ) as HTMLElement;
      const step5Time = performance.now() - step5Start;
      console.log(
        `✅ Pre-render Step 5 - Element cloned: ${step5Time.toFixed(2)}ms`
      );

      // Step 6: Create wrapper
      const step6Start = performance.now();
      const wrapper = document.createElement("div");
      wrapper.style.width = "288px";
      wrapper.style.height = "787px";
      wrapper.style.position = "fixed";
      wrapper.style.right = "100%";
      wrapper.style.top = "0";
      wrapper.style.overflow = "hidden";
      wrapper.style.background = "#fff";
      wrapper.style.margin = "0";
      wrapper.style.padding = "0";

      copiedPricingTableElmt.style.width = "100%";
      copiedPricingTableElmt.style.height = "100%";
      copiedPricingTableElmt.style.margin = "0";
      copiedPricingTableElmt.style.padding = "0";

      wrapper.appendChild(copiedPricingTableElmt);
      document.body.appendChild(wrapper);
      const step6Time = performance.now() - step6Start;
      console.log(
        `✅ Pre-render Step 6 - Wrapper created & appended: ${step6Time.toFixed(
          2
        )}ms`
      );

      // Step 7: Layout stabilization delay
      const step7Start = performance.now();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const step7Time = performance.now() - step7Start;
      console.log(
        `✅ Pre-render Step 7 - Layout stabilization: ${step7Time.toFixed(2)}ms`
      );

      // Step 8: Render to canvas (this is usually the slowest part)
      const step8Start = performance.now();
      console.log("🔄 Starting pre-render html2canvas rendering...");
      const canvas = await html2canvas(wrapper, {
        width: 288,
        height: 787,
        windowWidth: 288,
        windowHeight: 787,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const step8Time = performance.now() - step8Start;
      console.log(
        `✅ Pre-render Step 8 - Canvas rendering: ${step8Time.toFixed(2)}ms`
      );

      // Step 9: Cleanup
      const step9Start = performance.now();
      wrapper.remove();
      style.remove();
      const step9Time = performance.now() - step9Start;
      console.log(`✅ Pre-render Step 9 - Cleanup: ${step9Time.toFixed(2)}ms`);

      // Store pre-rendered canvas and generate ID
      const id: string = uuidv4();
      setPreRenderedCanvas(canvas);
      setPreRenderedId(id);

      const totalPreRenderTime = performance.now() - step1Start;
      console.log(
        `🎉 Pre-render completed in ${totalPreRenderTime.toFixed(2)}ms`
      );
      console.log(`📊 Pre-render breakdown:`);
      console.log(
        `   - Setup (steps 1-7): ${(
          step1Time +
          step2Time +
          step3Time +
          step4Time +
          step5Time +
          step6Time +
          step7Time
        ).toFixed(2)}ms`
      );
      console.log(
        `   - Rendering (step 8): ${step8Time.toFixed(2)}ms (${(
          (step8Time / totalPreRenderTime) *
          100
        ).toFixed(1)}%)`
      );
      console.log(`   - Cleanup (step 9): ${step9Time.toFixed(2)}ms`);
    } catch (err) {
      console.log("❌ Pre-render failed:", err);
    } finally {
      setIsPreRendering(false);
    }
  };

  // Modified handlePrint that only does final steps
  const handlePrint = async () => {
    // Prevent multiple print executions
    if (hasPrinted) {
      console.log("🔄 Print already completed, skipping...");
      return;
    }

    const startTime = performance.now();
    console.log("🖨️  Starting print process (final steps only)...");

    wsRef.current?.send(JSON.stringify({ event: SocketEventEnum.PRINTING }));

    try {
      if (!preRenderedCanvas || !preRenderedId) {
        console.log(
          "❌ No pre-rendered content available, falling back to full render..."
        );
        // Fallback to original implementation
        await handlePrintFull();
        setHasPrinted(true);
        return;
      }

      // Step 10: Convert to data URL (fast since canvas is ready)
      const step10Start = performance.now();
      const dataURL = preRenderedCanvas.toDataURL("image/bmp");
      const step10Time = performance.now() - step10Start;
      console.log(
        `✅ Step 10 - Data URL conversion: ${step10Time.toFixed(2)}ms`
      );

      // Step 11: Download
      const step11Start = performance.now();
      downloadjs(dataURL, `${preRenderedId}.bmp`, "image/bmp");
      const step11Time = performance.now() - step11Start;
      console.log(
        `✅ Step 11 - Download initiated: ${step11Time.toFixed(2)}ms`
      );

      // Total time for final steps
      const totalTime = performance.now() - startTime;
      console.log(
        `🎉 Print process completed in ${totalTime.toFixed(
          2
        )}ms (using pre-rendered content)`
      );
      console.log(`📊 Final steps breakdown:`);
      console.log(`   - Data URL conversion: ${step10Time.toFixed(2)}ms`);
      console.log(`   - Download: ${step11Time.toFixed(2)}ms`);

      // Clear pre-rendered content and mark as printed
      setPreRenderedCanvas(null);
      setPreRenderedId(null);
      setHasPrinted(true);
    } catch (err) {
      const errorTime = performance.now() - startTime;
      console.log(`❌ Print failed after ${errorTime.toFixed(2)}ms:`, err);
    }
  };

  // Original handlePrint implementation (fallback)
  const handlePrintFull = async () => {
    const startTime = performance.now();
    console.log("🖨️  Starting full print process (fallback)...");

    try {
      // Step 1: Find element
      const step1Start = performance.now();
      const pricingTableElmt = document.querySelector<HTMLElement>("#slip-pdf");
      if (!pricingTableElmt) {
        console.log("❌ Element #slip-pdf not found");
        return;
      }
      const step1Time = performance.now() - step1Start;
      console.log(`✅ Step 1 - Element found: ${step1Time.toFixed(2)}ms`);

      // Step 2: Update count and save file
      const step2Start = performance.now();
      const slipNo = updateCount();
      await saveFile(slipNo);
      const step2Time = performance.now() - step2Start;
      console.log(
        `✅ Step 2 - Count update & file save: ${step2Time.toFixed(2)}ms`
      );

      // Step 3: Wait for fonts
      const step3Start = performance.now();
      await document.fonts.ready;
      const step3Time = performance.now() - step3Start;
      console.log(`✅ Step 3 - Fonts ready: ${step3Time.toFixed(2)}ms`);

      // Step 4: Create styles
      const step4Start = performance.now();
      const style = document.createElement("style");
      document.head.appendChild(style);
      style.sheet?.insertRule(
        "body > div:last-child img { display: inline-block; }"
      );
      style.sheet?.insertRule(
        "body > div:last-child * { line-height: normal; }"
      );
      const step4Time = performance.now() - step4Start;
      console.log(`✅ Step 4 - Styles created: ${step4Time.toFixed(2)}ms`);

      // Step 5: Clone element
      const step5Start = performance.now();
      const copiedPricingTableElmt = pricingTableElmt.cloneNode(
        true
      ) as HTMLElement;
      const step5Time = performance.now() - step5Start;
      console.log(`✅ Step 5 - Element cloned: ${step5Time.toFixed(2)}ms`);

      // Step 6: Create wrapper
      const step6Start = performance.now();
      const wrapper = document.createElement("div");
      wrapper.style.width = "288px";
      wrapper.style.height = "787px";
      wrapper.style.position = "fixed";
      wrapper.style.right = "100%";
      wrapper.style.top = "0";
      wrapper.style.overflow = "hidden";
      wrapper.style.background = "#fff";
      wrapper.style.margin = "0";
      wrapper.style.padding = "0";

      copiedPricingTableElmt.style.width = "100%";
      copiedPricingTableElmt.style.height = "100%";
      copiedPricingTableElmt.style.margin = "0";
      copiedPricingTableElmt.style.padding = "0";

      wrapper.appendChild(copiedPricingTableElmt);
      document.body.appendChild(wrapper);
      const step6Time = performance.now() - step6Start;
      console.log(
        `✅ Step 6 - Wrapper created & appended: ${step6Time.toFixed(2)}ms`
      );

      // Step 7: Layout stabilization delay
      const step7Start = performance.now();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const step7Time = performance.now() - step7Start;
      console.log(
        `✅ Step 7 - Layout stabilization: ${step7Time.toFixed(2)}ms`
      );

      // Step 8: Render to canvas (this is usually the slowest part)
      const step8Start = performance.now();
      console.log("🔄 Starting html2canvas rendering...");
      const canvas = await html2canvas(wrapper, {
        width: 288,
        height: 787,
        windowWidth: 288,
        windowHeight: 787,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const step8Time = performance.now() - step8Start;
      console.log(`✅ Step 8 - Canvas rendering: ${step8Time.toFixed(2)}ms`);

      // Step 9: Cleanup
      const step9Start = performance.now();
      wrapper.remove();
      style.remove();
      const step9Time = performance.now() - step9Start;
      console.log(`✅ Step 9 - Cleanup: ${step9Time.toFixed(2)}ms`);

      // Step 10: Generate ID and convert to data URL
      const step10Start = performance.now();
      const id: string = uuidv4();
      const dataURL = canvas.toDataURL("image/bmp");
      const step10Time = performance.now() - step10Start;
      console.log(
        `✅ Step 10 - ID generation & data URL: ${step10Time.toFixed(2)}ms`
      );

      // Step 11: Download
      const step11Start = performance.now();
      downloadjs(dataURL, `${id}.bmp`, "image/bmp");
      const step11Time = performance.now() - step11Start;
      console.log(
        `✅ Step 11 - Download initiated: ${step11Time.toFixed(2)}ms`
      );

      // Total time
      const totalTime = performance.now() - startTime;
      console.log(
        `🎉 Full print process completed in ${totalTime.toFixed(2)}ms`
      );
      console.log(`📊 Performance breakdown:`);
      console.log(
        `   - Setup (steps 1-7): ${(
          step1Time +
          step2Time +
          step3Time +
          step4Time +
          step5Time +
          step6Time +
          step7Time
        ).toFixed(2)}ms`
      );
      console.log(
        `   - Rendering (step 8): ${step8Time.toFixed(2)}ms (${(
          (step8Time / totalTime) *
          100
        ).toFixed(1)}%)`
      );
      console.log(
        `   - Finalization (steps 9-11): ${(
          step9Time +
          step10Time +
          step11Time
        ).toFixed(2)}ms`
      );
    } catch (err) {
      const errorTime = performance.now() - startTime;
      console.log(`❌ Full print failed after ${errorTime.toFixed(2)}ms:`, err);
    }
  };

  const handleBack = () => {
    setBackHandler(true);
    if (selectedQuestion?.id === "q1") {
      setSelectedTab(layoutEnum.landingPage);
      setCurrentScreen(0);
      setAnswers([]);
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
    preRenderPrintContent,
    setAnswers,
    answers,
    removeOption,
    setRemoveOption,
    handleRemoveOption,
    questionsLength,
    setQuestionsLength,
    isPrinting,
    setIsPrinting,
    handleReset,
  };
  return <MainContext.Provider value={values}>{children}</MainContext.Provider>;
}
