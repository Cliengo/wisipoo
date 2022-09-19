import { useEffect } from 'react';
import { $getSelection } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

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
      const selection = $getSelection();
      selection?.insertText(content);
    });
  };

  useEffect(() => {
    onInsertContentReady(addContentToEditor);
  }, [editor, onInsertContentReady]);

  return null;
};
