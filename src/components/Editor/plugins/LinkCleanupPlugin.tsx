import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $createTextNode,
  $isElementNode,
  LexicalNode,
} from 'lexical';
import { $isLinkNode } from '@lexical/link';

export function LinkCleanupPlugin({
  linksEnabled,
}: {
  linksEnabled: boolean;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (linksEnabled) return;

    editor.update(() => {
      let didReplace = false;
      const replaceLinkNodes = (node: LexicalNode) => {
        if ($isLinkNode(node)) {
          node.replace($createTextNode(node.getTextContent()));
          didReplace = true;
          return;
        }
        if ($isElementNode(node)) {
          node.getChildren().forEach(replaceLinkNodes);
        }
      };
      $getRoot()
        .getChildren()
        .forEach(replaceLinkNodes);
      // Selection may have been anchored inside a removed LinkNode. Move it
      // to the end of the root — a known-valid position. Setting selection to
      // null instead would crash downstream listeners that read
      // `selection.anchor` without a null-check (e.g. the hashtag plugin).
      if (didReplace) {
        $getRoot().selectEnd();
      }
    });
  }, [linksEnabled, editor]);

  return null;
}
