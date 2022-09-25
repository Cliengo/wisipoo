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

export function setSelectorPosition(
  element: HTMLElement,
  rect: DOMRect,
  rootElementRect: DOMRect
): void {
  let top = rect.top - rootElementRect.top - 35;
  let left = rect.left - rootElementRect.left - 16;
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
}
