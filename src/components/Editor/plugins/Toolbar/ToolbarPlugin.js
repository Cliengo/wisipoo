/* eslint-disable */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { chakra, Flex, HStack } from '@chakra-ui/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { createPortal } from 'react-dom';
import { $isHeadingNode } from '@lexical/rich-text';
import { ActionButton } from './ActionButton.component';
import { getSelectedNode } from './utils/getSelectedNode';
import { FloatingLinkEditor } from './FloatingLinkEditor.component';
import { EmojiContainer } from './EmojiContainer.component';

export default function ToolbarPlugin({ editorIsActive, websiteType }) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [, setSelectedElementKey] = useState(null);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(
    () =>
      mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            updateToolbar();
          });
        }),
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          (/* _payload, newEditor */) => {
            updateToolbar();
            return false;
          },
          1
        ),
        editor.registerCommand(
          CAN_UNDO_COMMAND,
          payload => {
            setCanUndo(payload);
            return false;
          },
          1
        ),
        editor.registerCommand(
          CAN_REDO_COMMAND,
          payload => {
            setCanRedo(payload);
            return false;
          },
          1
        )
      ),
    [editor, updateToolbar]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const isFacebook = websiteType === 'facebook';
  const isWhatsapp = websiteType === 'whatsapp';
  const isInstagram = websiteType === 'instagram';

  return (
    <chakra.div
      id="toolbar"
      transition="all .4s ease"
      bg={editorIsActive ? 'gray.100' : 'white'}
      shadow={editorIsActive ? 'md' : 'none'}
      display="flex"
      justifyContent="space-between"
      border="1px solid"
      borderColor="gray.200"
      ref={toolbarRef}
      p={1}
      borderRadius="md"
      borderTopRadius="none"
    >
      <Flex>
        {!isInstagram && (
          <>
            {!isFacebook && (
              <>
                <ActionButton
                  name="bold"
                  onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                  }}
                  isActive={isBold}
                />
                <ActionButton
                  name="italic"
                  onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                  }}
                  isActive={isItalic}
                />
              </>
            )}

            {!isFacebook && !isInstagram && !isWhatsapp && (
              <ActionButton
                name="underline"
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
                isActive={isUnderline}
              />
            )}
          </>
        )}
        {!isInstagram && (
          <>
            <ActionButton
              name="ul"
              onClick={formatBulletList}
              isActive={blockType === 'ul'}
            />

            <ActionButton
              name="li"
              onClick={formatNumberedList}
              isActive={blockType === 'ol'}
            />
          </>
        )}

        <EmojiContainer />
        {!isFacebook && !isInstagram && !isWhatsapp && (
          <>
            <ActionButton name="link" onClick={insertLink} isActive={isLink} />
            {isLink &&
              createPortal(
                <FloatingLinkEditor editor={editor} />,
                document.body
              )}
          </>
        )}
      </Flex>

      <HStack spacing={2}>
        <ActionButton
          name="undo"
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND);
          }}
          isDisabled={!canUndo}
        />

        <ActionButton
          name="redo"
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND);
          }}
          isDisabled={!canRedo}
        />
      </HStack>
    </chakra.div>
  );
}
