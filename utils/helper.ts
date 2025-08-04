import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tw-merge";
import { shoePercentTypes } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const findIndex = (id: string) => {
  const questionNumber = id.split("")[1];
  const qIdx = parseInt(questionNumber) - 1;
  return qIdx;
};
export const maximumValue = (value: any) => {
  const max = Math.max(value.comfort, value.energy, value.response);
  const shoeType = Object.keys(value).filter((item) => value[item] === max);

  const shoeValues = shoeType.map((item: string) => {
    if (item === "comfort") {
      return "Vomero";
    } else if (item === "energy") {
      return "Pegasus";
    } else {
      return "Structure";
    }
  });
  return shoeValues;
};

type AnalyticsEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
};

declare global {
  interface Window {
    gtag?: any;
  }
}

export const logEvent = ({
  action,
  category,
  label,
  value,
}: AnalyticsEvent): void => {
  if (typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};


