import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $createTextNode,
  $isElementNode,
  LexicalNode,
} from 'lexical';
import { $isLinkNode } from '@lexical/link';

export function LinkCleanupPlugin({ linksEnabled }: { linksEnabled: boolean }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (linksEnabled) return;

    editor.update(() => {
      // Check whether the current selection sits inside a LinkNode before we
      // start replacing. Only that case requires us to re-anchor the cursor
      // afterwards; otherwise we leave the user's caret where it was.
      const selection = $getSelection();
      let selectionWasInLink = false;
      if ($isRangeSelection(selection)) {
        let ancestor: LexicalNode | null = selection.anchor.getNode();
        while (ancestor !== null && !$isLinkNode(ancestor)) {
          ancestor = ancestor.getParent();
        }
        selectionWasInLink = ancestor !== null;
      }

      const replaceLinkNodes = (node: LexicalNode) => {
        if ($isLinkNode(node)) {
          node.replace($createTextNode(node.getTextContent()));
          return;
        }
        if ($isElementNode(node)) {
          node.getChildren().forEach(replaceLinkNodes);
        }
      };
      $getRoot()
        .getChildren()
        .forEach(replaceLinkNodes);

      // Selection was anchored inside a LinkNode we just removed — moving it
      // to the end of the root keeps it valid. Setting selection to null
      // would crash downstream listeners that read `selection.anchor` without
      // a null-check (e.g. the hashtag plugin).
      if (selectionWasInLink) {
        $getRoot().selectEnd();
      }
    });
  }, [linksEnabled, editor]);

  return null;
}
