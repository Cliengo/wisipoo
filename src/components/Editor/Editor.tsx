import React, { CSSProperties, useEffect, useMemo } from 'react';
import ExampleTheme from './theme/default';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { HashtagNode } from '@lexical/hashtag';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin as LexicalOnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { $generateHtmlFromNodes } from '@lexical/html';
import { EditorState, LexicalEditor } from 'lexical';
import { InitialValuePlugin } from './plugins/InitialValuePlugin';
import { Box, Text } from '@chakra-ui/react';
import { Icon } from './utils/EditorIcon.component';
import { AddContentToEditorType } from './plugins/InsertContentMethodPlugin';
import {
  ToolbarPlugin,
  AutoLinkPlugin,
  InsertContentMethodPlugin,
  OverrideEnterKeyPlugin,
} from './plugins';
import { HashtagSelectorPlugin } from './plugins/HashtagSelector/HashtagSelectorPlugin';
import {
  HashtagItem,
  HASHTAG_SELECTOR_PLUGIN_BUTTON_CLASS,
} from './plugins/HashtagSelector/HashtagList';
import { ListPositionOffset } from './plugins/HashtagSelector/utils';

function Placeholder({
  placeholder,
  style = {},
}: {
  placeholder?: string;
  style?: CSSProperties;
}) {
  return (
    <div className="editor-placeholder" style={style}>
      {placeholder || ''}
    </div>
  );
}

const editorConfig = {
  namespace: 'wisipoo',
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error: any) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
    HashtagNode,
  ],
};

function editorOnChange(
  editorState: EditorState,
  editor: LexicalEditor,
  onChange: (html: string) => void,
  websiteType: 'website' | 'facebook' | 'whatsapp' | 'instagram'
) {
  editorState.toJSON();
  editor.update(() => {
    const html = $generateHtmlFromNodes(editor);
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    dom.querySelectorAll('*').forEach(nod => {
      let node = nod as HTMLElement;
      // remove all data- attributes
      node.removeAttribute('data-lexical-node-type');
      node.removeAttribute('data-lexical-node-json');
      node.removeAttribute('data-lexical-editor-key');
      // if node is anchor tag, add target blank
      if (node.tagName) {
        if (node.tagName.toLowerCase() === 'a') {
          if (websiteType === 'website') {
            node.setAttribute('target', '_blank');
          } else {
            // remove tag an leave only the text link
            const linkTextNode = document.createElement('span');
            linkTextNode.innerText = node.getAttribute('href') || '';
            node.replaceWith(linkTextNode);
          }
        }
      }
      // wrap editor-text-italic class on em tag
      if (node.classList.contains('editor-text-italic')) {
        const em = document.createElement('em');
        node.replaceWith(em);
        em.appendChild(node);
      }
      // wrap editor-text-underline class on u tag
      if (node.classList.contains('editor-text-underline')) {
        const u = document.createElement('u');
        node.replaceWith(u);
        u.appendChild(node);
      }
    });
    onChange(dom.body.innerHTML);
  });
}

export interface EditorProps {
  initialValue?: string;
  onChange: (html: string) => void;
  websiteType: 'website' | 'facebook' | 'whatsapp' | 'instagram';
  editMode: boolean;
  handleEditMode: (editMode: boolean) => void;
  placeholder?: string;
  toolbarPlacement?: 'top' | 'bottom';
  embeddedToolbar?: boolean;
  hideUndoButtons?: boolean;
  borderless?: boolean;
  hideEditButton?: boolean;
  hideEmojis?: boolean;
  hideLink?: boolean;
  selectorsToIgnoreOnBlur?: Array<string>;
  onInsertContentReady?: (content: AddContentToEditorType) => void;
  onEnterKeyPress?: () => void;
  editorPlaceholderStyle?: React.CSSProperties;
  readOnlyBoxStyle?: React.CSSProperties;
  onKeyInput?: () => void;
  hashtagList?: HashtagItem[];
  parentRef?: React.RefObject<HTMLElement | null>;
  hashtagListOffset?: ListPositionOffset;
  onHashtagSelected?: () => void;
}

export function Editor({
  initialValue,
  onChange,
  websiteType,
  editMode,
  handleEditMode,
  placeholder,
  toolbarPlacement = 'bottom',
  embeddedToolbar,
  hideUndoButtons,
  borderless,
  hideEditButton,
  hideEmojis,
  hideLink,
  selectorsToIgnoreOnBlur = [],
  onInsertContentReady,
  onEnterKeyPress,
  editorPlaceholderStyle,
  readOnlyBoxStyle = {},
  hashtagList,
  parentRef,
  hashtagListOffset,
  onHashtagSelected,
}: EditorProps) {
  const Toolbar = useMemo(
    () =>
      !(websiteType === 'instagram' && hideEmojis) ? (
        <ToolbarPlugin
          embeddedToolbar={embeddedToolbar}
          websiteType={websiteType}
          hideUndoButtons={hideUndoButtons}
          borderless={borderless}
          hideEmojis={hideEmojis}
          hideLink={hideLink}
        />
      ) : null,
    [
      websiteType,
      embeddedToolbar,
      hideEditButton,
      borderless,
      hideEmojis,
      hideLink,
    ]
  );

  const isDescendant = function(parent: any, child: any) {
    let node = child.parentNode;
    while (node) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

  function handleCustomBlur(e: any) {
    const element = e.target as HTMLElement;
    const selectors = ['#wisipoo', '.link-editor', ...selectorsToIgnoreOnBlur];
    if (
      element.getAttribute('id') === 'editor-link-input' ||
      element?.parentElement?.getAttribute('id') === 'editor-link-input' ||
      element
        .getAttribute('class')
        ?.split(' ')
        .includes(HASHTAG_SELECTOR_PLUGIN_BUTTON_CLASS)
    ) {
      return;
    }

    for (const item of selectors) {
      if (isDescendant(document.querySelector(item), element)) {
        return;
      }
    }

    handleEditMode(false);
  }

  useEffect(() => {
    if (editMode) {
      // add click event listener to body
      setTimeout(() => {
        document.body.addEventListener('click', handleCustomBlur);
      }, 400);
    } else {
      document.body.removeEventListener('click', handleCustomBlur);
    }
    return () => {
      document.body.removeEventListener('click', handleCustomBlur);
    };
  }, [editMode]);

  if (!editMode) {
    const getTextToShow = () => {
      const domNode = new DOMParser().parseFromString(
        initialValue || '',
        'text/html'
      );
      return !domNode.body.innerText ? placeholder : initialValue;
    };

    return (
      <Box
        onClick={() => handleEditMode(true)}
        cursor="pointer"
        position="relative"
        px={4}
        py={2}
        pr={12}
        mb={4}
        alignItems="center"
        {...(!borderless && {
          border: '1px solid #ccc',
          rounded: 'md',
        })}
        style={{ ...readOnlyBoxStyle }}
      >
        <Text
          dangerouslySetInnerHTML={{
            __html: getTextToShow() || '',
          }}
        />
        {!hideEditButton ? (
          <Icon
            name="edit"
            w="24px"
            h="24px"
            position="absolute"
            right="0"
            top="0"
            my="8px"
            mr="14px"
          />
        ) : null}
      </Box>
    );
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container" id="wisipoo">
        <Box
          className="editor-inner"
          {...(!borderless && {
            border: '1px solid #e1e1e1',
            roundedTop: 'md',
          })}
        >
          {toolbarPlacement === 'top' ? Toolbar : null}
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={
              <Placeholder
                placeholder={placeholder}
                style={editorPlaceholderStyle}
              />
            }
          />
          <InitialValuePlugin value={initialValue || ''} />
          <LexicalOnChangePlugin
            onChange={(editorState, editor) =>
              editorOnChange(editorState, editor, onChange, websiteType)
            }
            ignoreInitialChange
          />
          <HistoryPlugin />
          <ListPlugin />
          {!hideLink && websiteType === 'website' && (
            <>
              <LinkPlugin />
              <AutoLinkPlugin />
            </>
          )}
          {onInsertContentReady && (
            <InsertContentMethodPlugin
              onInsertContentReady={onInsertContentReady}
            />
          )}
          {onEnterKeyPress && (
            <OverrideEnterKeyPlugin onEnterKeyPress={onEnterKeyPress} />
          )}
          {hashtagList && (
            <>
              <HashtagPlugin />
              <HashtagSelectorPlugin
                hashtagList={hashtagList}
                parentRef={parentRef}
                listOffset={hashtagListOffset}
                onHashtagSelected={onHashtagSelected}
              />
            </>
          )}
        </Box>
        {toolbarPlacement === 'bottom' ? Toolbar : null}
      </div>
    </LexicalComposer>
  );
}
