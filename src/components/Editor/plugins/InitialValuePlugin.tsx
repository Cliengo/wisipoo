import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection } from 'lexical';
import { useEffect } from 'react';

export function InitialValuePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot()

      // In the browser you can use the native DOMParser API to parse the HTML string.
      const parser = new DOMParser();
      const dom = parser.parseFromString(value, 'text/html');
    
      // Once you have the DOM instance it's easy to generate LexicalNodes.
      const nodes = $generateNodesFromDOM(editor, dom);
      
      // Select the root
      root.select();
    
      // Insert them at a selection.
      const selection = $getSelection();
      //@ts-ignore
      selection.insertNodes(nodes);
    });
  }, []);

  return null;
}
