import { ElementNode, RangeSelection, TextNode } from 'lexical';
import { $isAtNodeEnd } from '@lexical/selection';

export function getSelectedNode(
  selection: RangeSelection
): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

export interface ListPositionOffset {
  top?: number;
  left?: number;
}

export function setListPosition(
  element: HTMLElement,
  rect: DOMRect,
  rootElementRect: DOMRect,
  offset?: ListPositionOffset
): void {
  let top =
    rect.top - rootElementRect.top + (offset && offset.top ? offset.top : 0);
  let left =
    rect.left -
    rootElementRect.left +
    (offset && offset.left ? offset.left : 0);
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
}

export function isScrolledIntoParentElement(element: HTMLElement) {
  const container = element.parentElement;
  if (container) {
    //Get container properties
    let cTop = container.scrollTop;
    let cBottom = cTop + container.clientHeight;

    //Get element properties
    let eTop = element.offsetTop;
    let eBottom = eTop + element.clientHeight;

    //Return outcome
    return eTop >= cTop && eBottom <= cBottom;
  }
  return false;
}
