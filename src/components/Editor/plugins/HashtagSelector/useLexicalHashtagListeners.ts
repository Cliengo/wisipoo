import { $getSelection, RangeSelection } from 'lexical';
import { HashtagNode } from '@lexical/hashtag';

import { useEffect, useCallback, useState } from 'react';
import { getSelectedNode, setSelectorPosition } from './utils';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HashtagItem } from '../HashtagSelector/HashtagList';
import { $generateNodesFromDOM } from '@lexical/html';

export const useLexicalHashtagListeners = (
  selectorElementRef: React.RefObject<HTMLDivElement | null>
): [string | null, (hashtag: HashtagItem) => void] => {
  const [selectedHashtagValue, setSelectedHashtagValue] = useState<
    string | null
  >(null);
  const [selectedHashtagKey, setSelectedHashtagKey] = useState<string | null>(
    null
  );

  const [editor] = useLexicalComposerContext();
  const updateSelectorPosition = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();

      const selectorElement = selectorElementRef.current;
      const nativeSelection = window.getSelection();

      if (selectorElement === null) {
        return;
      }

      const rootElement = editor.getRootElement();
      if (
        selection !== null &&
        nativeSelection !== null &&
        rootElement !== null &&
        rootElement.contains(nativeSelection.anchorNode)
      ) {
        const domRange = nativeSelection.getRangeAt(0);
        const rootElementRect = rootElement.getBoundingClientRect();
        let rect;

        if (nativeSelection.anchorNode === rootElement) {
          let inner = rootElement;
          while (inner.firstElementChild != null) {
            inner = inner.firstElementChild as HTMLElement;
          }
          rect = inner.getBoundingClientRect();
        } else {
          rect = domRange.getBoundingClientRect();
        }

        setSelectorPosition(selectorElement, rect, rootElementRect);
      }
    });
  }, [editor]);

  const replaceHashtagWithContent = (hashtag: HashtagItem) => {
    editor.update(() => {
      const selection = $getSelection() as RangeSelection;
      if (
        selection &&
        selection.getNodes()[0].getKey() === selectedHashtagKey
      ) {
        selection?.getNodes()[0].remove();
        const dom = new DOMParser().parseFromString(hashtag.body, 'text/html');
        const nodesToInsert = $generateNodesFromDOM(editor, dom);
        selection.insertNodes(nodesToInsert);
      }
    });
  };

  const setNewHashtag = (key: string) => {
    setSelectedHashtagKey(key);
    updateSelectorPosition();
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerMutationListener(HashtagNode, mutatedNodes => {
        // Only take into account single mutations
        if (mutatedNodes.size === 1) {
          const [newKey, mutation] = Array.from(mutatedNodes)[0];

          if (
            selectedHashtagKey &&
            newKey === selectedHashtagKey &&
            mutation === 'destroyed'
          ) {
            setSelectedHashtagKey(null);
          } else if (
            (!selectedHashtagKey && mutation === 'created') ||
            (selectedHashtagKey &&
              newKey !== selectedHashtagKey &&
              mutation === 'created')
          ) {
            setNewHashtag(newKey);
          }
        }
      }),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selector = $getSelection() as RangeSelection;
          const selectedNode = getSelectedNode(selector);
          console.log(selectedNode.getTextContent().trim());
          if (
            selectedHashtagKey &&
            selectedNode.getKey() !== selectedHashtagKey
          ) {
            setSelectedHashtagKey(null);
          }
        });
      }),
      editor.registerNodeTransform(HashtagNode, hashtagNode => {
        if (hashtagNode.getKey() === selectedHashtagKey) {
          setSelectedHashtagValue(hashtagNode.getTextContent().substring(1));
        }
      })
    );
  }, [selectedHashtagKey, updateSelectorPosition]);

  useEffect(() => {
    if (!selectedHashtagKey) {
      setSelectedHashtagValue(null);
    }
  }, [selectedHashtagKey]);

  return [selectedHashtagValue, replaceHashtagWithContent];
};
