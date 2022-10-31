import { useEffect, useCallback, useState } from 'react';
import {
  $getSelection,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  RangeSelection,
  KEY_ENTER_COMMAND,
} from 'lexical';
import { HashtagNode } from '@lexical/hashtag';
import { $generateNodesFromDOM } from '@lexical/html';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { getSelectedNode, ListPositionOffset, setListPosition } from './utils';
import { HashtagItem } from '../HashtagSelector/HashtagList';

export const useLexicalHashtagListeners = (
  selectorElementRef: React.RefObject<HTMLDivElement | null>,
  onArrowDown: () => void,
  onArrowUp: () => void,
  onEnterKey: () => void,
  parentRef?: React.RefObject<HTMLElement | null>,
  listOffset?: ListPositionOffset,
  isEmptyList?: boolean
): [string | null, (hashtag: HashtagItem) => void] => {
  const [selectedHashtagValue, setSelectedHashtagValue] = useState<
    string | null
  >(null);
  const [selectedHashtagKey, setSelectedHashtagKey] = useState<string | null>(
    null
  );

  const [editor] = useLexicalComposerContext();

  const scrollToBottom = () => {
    if (parentRef) {
      const scrollElement = parentRef.current;

      const selection = $getSelection() as RangeSelection;

      const anchorElement = editor.getElementByKey(selection.anchor.key);

      if (anchorElement === null || !scrollElement) {
        return;
      }

      const scrollRect = scrollElement.getBoundingClientRect();
      const rect = anchorElement.getBoundingClientRect();

      if (rect.bottom > scrollRect.bottom) {
        anchorElement.scrollIntoView(false);
      } else if (rect.top < scrollRect.top) {
        anchorElement.scrollIntoView();
      }
    }
  };

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

        setListPosition(selectorElement, rect, rootElementRect, listOffset);
      }
    });
  }, [editor, listOffset]);

  const replaceHashtagWithContent = (hashtag: HashtagItem) => {
    editor.update(
      () => {
        const selection = $getSelection() as RangeSelection;
        if (
          selection &&
          selection.getNodes()[0].getKey() === selectedHashtagKey
        ) {
          selection?.getNodes()[0].remove();
          let hastagHTMLString = hashtag.allowedForChannel
            ? hashtag.body
            : hashtag.getAlternativeBody();
          const dom = new DOMParser().parseFromString(
            hastagHTMLString,
            'text/html'
          );
          const nodesToInsert = $generateNodesFromDOM(editor, dom);
          selection.insertNodes(nodesToInsert);
        }
      },
      { tag: 'nodesInserted' }
    );
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
      editor.registerUpdateListener(({ editorState, tags }) => {
        editorState.read(() => {
          const selector = $getSelection() as RangeSelection;
          const selectedNode = getSelectedNode(selector);
          if (
            selectedHashtagKey &&
            selectedNode.getKey() !== selectedHashtagKey
          ) {
            setSelectedHashtagKey(null);
          }
          if (Array.from(tags).includes('nodesInserted')) {
            scrollToBottom();
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

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        payload => {
          if (selectedHashtagKey && !isEmptyList) {
            const event = payload as KeyboardEvent;
            event.preventDefault();
            onArrowDown();
            return true;
          }
          return false;
        },
        4
      ),
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        payload => {
          if (selectedHashtagKey && !isEmptyList) {
            const event = payload as KeyboardEvent;
            event.preventDefault();
            onArrowUp();
            return true;
          }
          return false;
        },
        4
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        payload => {
          if (selectedHashtagKey && !isEmptyList) {
            const event = payload as KeyboardEvent;
            event.preventDefault();
            onEnterKey();
            return true;
          }
          return false;
        },
        4
      )
    );
  }, [onArrowDown, onArrowUp, onEnterKey, selectedHashtagKey, isEmptyList]);

  return [selectedHashtagValue, replaceHashtagWithContent];
};
