import { findProblemDates } from "./problems";


export type Analysis = { found: false } | { found: true; message: string };

export function analyzeText(text: string): Analysis {
  const date = findProblemDates(text);

  return date
    ? {
        found: true,
        message: formatDateMessage(date),
      }
    : { found: false };
}

export function formatDateMessage(date: Date): string {
  const dateString = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return `${dateString} is a ${weekday}`;
}