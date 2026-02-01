import { ProblemFinder } from "./problems";

const debounceDelay = 300;

let timer: number | null = null;

let p = new ProblemFinder(new Date());

function getText(el: HTMLElement): string {
  if (el.isContentEditable) {
    return el.innerText;
  }

  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el.value;
  }

  return "";
}

document.addEventListener("input", (event) => {
  const el = event.target;

  if (!(el instanceof HTMLElement)) return;

  if (
    !el.isContentEditable &&
    el.tagName !== "INPUT" &&
    el.tagName !== "TEXTAREA"
  )
    return;

  if (timer !== null) {
    clearTimeout(timer);
  }

  timer = window.setTimeout(() => {
    const text = getText(el);
    const analysis = p.analyzeText(text);
    if (analysis.found) {
      alert(analysis.message);
    }
  }, debounceDelay);
});
