import React, { useEffect } from 'react';
import ExampleTheme from './theme/default';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import ToolbarPlugin from './plugins/Toolbar/ToolbarPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin as LexicalOnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import { $generateHtmlFromNodes } from '@lexical/html';
import { EditorState, LexicalEditor } from 'lexical';
import { InitialValuePlugin } from './plugins/InitialValuePlugin';
import { Box, Text } from '@chakra-ui/react';
import { Icon } from './utils/EditorIcon.component';

function Placeholder({
  placeholder
}: {
  placeholder?: string;
}) {
  return <div className="editor-placeholder">{placeholder || ''}</div>;
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
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

function editorOnChange(
  editorState: EditorState,
  editor: LexicalEditor,
  onChange: (html: string) => void
) {
  editorState.toJSON();
  editor.update(() => {
    const html = $generateHtmlFromNodes(editor);
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    dom.querySelectorAll('*').forEach(node => {
      // if node is anchor tag, add target blank
      if (node.tagName) {
        if (node.tagName.toLowerCase() === 'a') {
          node.setAttribute('target', '_blank');
        }
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
}

export function Editor({
  initialValue,
  onChange,
  websiteType,
  editMode,
  handleEditMode,
  placeholder
}: EditorProps) {
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
    const wisipoo = document.querySelector('#wisipoo');
    const linkInput = document.querySelector('.link-editor');
    const element = e.target as HTMLElement;
    if (!isDescendant(wisipoo, element) && !isDescendant(linkInput, element)) {
      handleEditMode(false);
    }
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
    return (
      <Box
        onClick={() => handleEditMode(true)}
        cursor="pointer"
        position="relative"
        border="1px solid #ccc"
        px={4}
        py={2}
        pr={12}
        mb={4}
        rounded="md"
        alignItems="center"
      >
        <Text dangerouslySetInnerHTML={{ __html: initialValue || placeholder || '' }} />
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
      </Box>
    );
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container" id="wisipoo">
        <Box
          border="1px solid #e1e1e1"
          roundedTop="md"
          className="editor-inner"
        >
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder placeholder={placeholder} />}
          />
          <InitialValuePlugin value={initialValue || ''} />
          <LexicalOnChangePlugin
            onChange={(editorState, editor) =>
              editorOnChange(editorState, editor, onChange)
            }
            ignoreInitialChange
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
        </Box>
        <ToolbarPlugin editorIsActive={true} websiteType={websiteType} />
      </div>
    </LexicalComposer>
  );
}
