import { useEffect } from 'react';
import { $getSelection, RangeSelection } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateNodesFromDOM } from '@lexical/html';

export interface AddContentToEditorType {
  (content: string): void;
}

export interface InsertContentMethodPlugin {
  onInsertContentReady: Function;
}

export const InsertContentMethodPlugin = ({
  onInsertContentReady,
}: InsertContentMethodPlugin) => {
  const [editor] = useLexicalComposerContext();

  const addContentToEditor: AddContentToEditorType = (content: string) => {
    editor.update(() => {
      const selection = $getSelection() as RangeSelection;

      const dom = new DOMParser().parseFromString(content, 'text/html');

      const nodes = $generateNodesFromDOM(editor, dom);
      selection?.insertNodes(nodes);
    });
  };

  useEffect(() => {
    onInsertContentReady(addContentToEditor);
  }, [editor, onInsertContentReady]);

  return null;
};
