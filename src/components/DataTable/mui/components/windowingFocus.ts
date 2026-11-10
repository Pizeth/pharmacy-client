import { dataTableClasses } from "../styles";

/** Excludes controls hidden by ancestor display or their computed visibility. */
function isRenderedControl(element: HTMLElement): boolean {
  for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
    if (getComputedStyle(ancestor).display === "none") return false;
  }
  const visibility = getComputedStyle(element).visibility;
  return visibility !== "hidden" && visibility !== "collapse";
}

/** Recognizes editable hosts that participate in native Tab order without an explicit tabindex. */
function isImplicitEditingHost(element: HTMLElement): boolean {
  return !element.hasAttribute("tabindex") &&
    element.matches('[contenteditable=""],[contenteditable="true"],[contenteditable="plaintext-only"]') &&
    !element.parentElement?.isContentEditable;
}

/** Collects enabled, rendered native focus candidates in document order. */
function candidateControls(doc: Document): HTMLElement[] {
  return Array.from(doc.querySelectorAll<HTMLElement>(
    'a[href],button,input,select,textarea,[tabindex],summary,[contenteditable]',
  )).filter(element => (element.tabIndex >= 0 || isImplicitEditingHost(element)) &&
    !element.matches(":disabled") && !element.closest('[hidden],[inert],[aria-hidden="true"]') && isRenderedControl(element));
}

/** Chooses the checked radio or the direction-specific entry point for an unchecked group. */
function isRadioStop(element: HTMLElement, candidates: readonly HTMLElement[], reverse: boolean): boolean {
  if (!(element instanceof HTMLInputElement) || element.type !== "radio" || !element.name) return true;
  const group = candidates.filter((candidate): candidate is HTMLInputElement =>
    candidate instanceof HTMLInputElement && candidate.type === "radio" &&
    candidate.name === element.name && candidate.form === element.form &&
    candidate.getRootNode() === element.getRootNode());
  const selected = group.find(radio => radio.checked);
  return element === (selected ?? (reverse ? group.at(-1) : group.at(0)));
}

/** Orders native tab stops by positive tabindex, preserving document order for ordinary stops. */
function sequentialStops(candidates: readonly HTMLElement[], reverse: boolean): HTMLElement[] {
  return candidates.filter(element => isRadioStop(element, candidates, reverse))
    .sort((a, b) => (a.tabIndex > 0 ? a.tabIndex : Number.MAX_SAFE_INTEGER) -
      (b.tabIndex > 0 ? b.tabIndex : Number.MAX_SAFE_INTEGER));
}

/** Predicts adjacent native focus, using document position for programmatically focused elements. */
function adjacentStop(doc: Document, candidates: readonly HTMLElement[], stops: readonly HTMLElement[], reverse: boolean): HTMLElement | undefined {
  const active = doc.activeElement;
  const current = stops.findIndex(element => element === active);
  if (current >= 0) {
    const nextIndex = current + (reverse ? -1 : 1);
    return nextIndex < 0 ? undefined : stops.at(nextIndex);
  }
  if (!active || active === doc.body) return stops.at(reverse ? -1 : 0);
  const direction = reverse ? Node.DOCUMENT_POSITION_PRECEDING : Node.DOCUMENT_POSITION_FOLLOWING;
  const adjacent = candidates.filter(element => stops.includes(element) && (active.compareDocumentPosition(element) & direction) !== 0);
  return adjacent.at(reverse ? -1 : 0);
}

/** Detects traversal across the body even when omitted rows contain its only controls. */
function crossesBody(body: HTMLTableSectionElement, next: HTMLElement | undefined, reverse: boolean): boolean {
  const active = body.ownerDocument.activeElement;
  const activePosition = active ? body.compareDocumentPosition(active) : 0;
  const nextPosition = next ? body.compareDocumentPosition(next) : 0;
  const enteringFrom = reverse ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING;
  const leavingToward = reverse ? Node.DOCUMENT_POSITION_PRECEDING : Node.DOCUMENT_POSITION_FOLLOWING;
  // Omitted rows may contain the only controls; native navigation needs those
  // restored whenever its path crosses the body's document position.
  return (activePosition & enteringFrom) !== 0 &&
    (!next || body.contains(next) || (nextPosition & leavingToward) !== 0);
}

/** Expand before native Tab moves focus, preserving browser-controlled navigation. */
export function shouldRestoreWindowForTab(body: HTMLTableSectionElement, event: KeyboardEvent): boolean {
  const container = body.closest(`.${dataTableClasses.container}`);
  if (event.target instanceof Node && container?.contains(event.target)) return true;
  const candidates = candidateControls(body.ownerDocument);
  const stops = sequentialStops(candidates, event.shiftKey);
  const next = adjacentStop(body.ownerDocument, candidates, stops, event.shiftKey);
  return crossesBody(body, next, event.shiftKey) || (next !== undefined && body.contains(next));
}
