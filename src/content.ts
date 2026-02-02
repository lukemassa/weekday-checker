import { ProblemFinder } from "./problems";

const debounceDelay = 300;

const controllers = new WeakMap<HTMLElement, EditorController>();

class EditorController {
  finder: ProblemFinder;
  timer: number | null;
  el: HTMLElement;

  constructor(el: HTMLElement) {
    this.finder = new ProblemFinder(new Date());
    this.timer = null;
    this.el = el;
  }

  debounce() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }
    this.timer = window.setTimeout(() => {
      const text = getText(this.el);
      const analysis = this.finder.analyzeText(text);
      if (analysis.found) {
        alert(analysis.message);
      }
    }, debounceDelay);
  }
}

document.addEventListener("input", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) return;

  const el = findEditableRoot(target);
  if (!el) return;

  if (
    !el.isContentEditable &&
    el.tagName !== "INPUT" &&
    el.tagName !== "TEXTAREA"
  )
    return;

  let controller = controllers.get(el);
  if (controller === undefined) {
    controller = new EditorController(el);
    controllers.set(el, controller);
  }
  controller.debounce();
});

function getText(el: HTMLElement): string {
  if (el.isContentEditable) {
    return el.innerText;
  }

  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el.value;
  }

  return "";
}

function findEditableRoot(target: HTMLElement): HTMLElement | null {
  // 1. Native inputs are already the logical root
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement
  ) {
    return target;
  }

  // 2. Walk up to the nearest contenteditable ancestor
  const editable = target.closest("[contenteditable]");
  if (!editable) return null;

  // 3. Sanity check: isContentEditable filters out edge cases
  // (e.g. contenteditable="false" on a child)
  if (!(editable instanceof HTMLElement) || !editable.isContentEditable) {
    return null;
  }

  return editable;
}
