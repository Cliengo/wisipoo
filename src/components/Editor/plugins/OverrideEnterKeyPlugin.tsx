import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { KEY_ENTER_COMMAND } from 'lexical';
import { useEffect, useRef } from 'react';

export interface OverrideEnterKeyPluginProps {
  onEnterKeyPress: () => void;
}

export function OverrideEnterKeyPlugin({
  onEnterKeyPress,
}: OverrideEnterKeyPluginProps) {
  const [editor] = useLexicalComposerContext();
  const listenerRef = useRef<() => void>();

  useEffect(() => {
    listenerRef.current = editor.registerCommand(
      KEY_ENTER_COMMAND,
      payload => {
        const event = payload as KeyboardEvent;
        event.preventDefault();
        if (event.ctrlKey) {
          return false;
        }
        onEnterKeyPress();
        return true;
      },
      4
    );
    return () => {
      listenerRef.current && listenerRef.current();
    };
  }, [onEnterKeyPress]);

  return null;
}
