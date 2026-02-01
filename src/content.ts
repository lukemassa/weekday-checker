import { analyzeText } from "./analyze";

let warned = false;

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
  // TODO: For now, you only get one warning per page load
  if (warned) return;

  const el = event.target;

  if (!(el instanceof HTMLElement)) return;


  if (
    el.isContentEditable ||
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA"
  ) {
    const text = getText(el);

    const analysis = analyzeText(text);

    if (analysis.found) {
      warned = true;
      alert(analysis.message);
    }
  }
});
