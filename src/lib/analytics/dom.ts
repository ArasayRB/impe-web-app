// analytics/dom.ts

export function getSlot(
  root: HTMLElement,
  selector: string
): HTMLElement {

  const el =
    root.querySelector(selector);

  if (!el) {
    throw new Error(
      `Analytics slot not found: ${selector}`
    );
  }

  return el as HTMLElement;
}