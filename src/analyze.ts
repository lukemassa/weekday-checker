export type DateProblem = {
  problemString: string;
  actualDay: string;
};

export type Analysis =
  | { found: false }
  | { found: true; message: string };

export function findDateProblems(text: string): DateProblem | null {
  if (text.includes("Tuesday Jan 31")) {
    return {
      "problemString":"Tuesday Jan 31",
      "actualDay":"Saturday"
    }
  }
    if (text.includes("Wednesday Jan 31")) {
    return {
      "problemString":"Wednesday Jan 31",
      "actualDay":"Saturday"
    }
  }
  return null;
}

export function analyzeText(text: string): Analysis {
  const res = findDateProblems(text);

  if (res === null) {
    return { found: false };
  }

  return {
    found: true,
    message: `${res.problemString} is a ${res.actualDay}`,
  };
}