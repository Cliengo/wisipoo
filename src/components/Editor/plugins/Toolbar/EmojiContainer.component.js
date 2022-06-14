import React from 'react';
import {
  chakra, Popover, PopoverTrigger, PopoverContent,
} from '@chakra-ui/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection } from 'lexical';
import { ActionButton } from './ActionButton.component';

function Emoji({ dataEmoji }) {
  const [editor] = useLexicalComposerContext();

  const handleAddEmoji = () => {
    editor.update(() => {
      const selection = $getSelection();
      selection.insertText(dataEmoji);
    });
  };

  return (
    <chakra.span
      padding="4px"
      display="block"
      width="100%"
      textAlign="center"
      onClick={handleAddEmoji}
      cursor="pointer"
      _hover={{
        backgroundColor: 'gray.100',
      }}
    >
      {dataEmoji}
    </chakra.span>
  );
}

export const EmojiContainer = () => (
  <>
    <Popover placement="top-start" isLazy>
      <PopoverTrigger>
        <span>
          <ActionButton name="emoji" />
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <chakra.div
          display="grid"
          gridTemplateColumns="repeat(7, 1fr)"
          justifyItems="center"
          alignItems="center"
          height="240px"
          id="emojis-popup"
          overflow="auto"
          className="cat-emojis-popup"
        >
          <Emoji dataEmoji="😀" />
          <Emoji dataEmoji="😄" />
          <Emoji dataEmoji="😁" />
          <Emoji dataEmoji="😆" />
          <Emoji dataEmoji="😅" />
          <Emoji dataEmoji="😂" />
          <Emoji dataEmoji="😊" />
          <Emoji dataEmoji="🙂" />
          <Emoji dataEmoji="😉" />
          <Emoji dataEmoji="😍" />
          <Emoji dataEmoji="😘" />
          <Emoji dataEmoji="😋" />
          <Emoji dataEmoji="😜" />
          <Emoji dataEmoji="😝" />
          <Emoji dataEmoji="😛" />
          <Emoji dataEmoji="🤗" />
          <Emoji dataEmoji="😎" />
          <Emoji dataEmoji="😏" />
          <Emoji dataEmoji="😒" />
          <Emoji dataEmoji="😞" />
          <Emoji dataEmoji="😔" />
          <Emoji dataEmoji="😟" />
          <Emoji dataEmoji="😕" />
          <Emoji dataEmoji="🙁" />
          <Emoji dataEmoji="😫" />
          <Emoji dataEmoji="😩" />
          <Emoji dataEmoji="😤" />
          <Emoji dataEmoji="😠" />
          <Emoji dataEmoji="😡" />
          <Emoji dataEmoji="😶" />
          <Emoji dataEmoji="😐" />
          <Emoji dataEmoji="😑" />
          <Emoji dataEmoji="😯" />
          <Emoji dataEmoji="😦" />
          <Emoji dataEmoji="😧" />
          <Emoji dataEmoji="😮" />
          <Emoji dataEmoji="😳" />
          <Emoji dataEmoji="😱" />
          <Emoji dataEmoji="😢" />
          <Emoji dataEmoji="😥" />
          <Emoji dataEmoji="😭" />
          <Emoji dataEmoji="😴" />
          <Emoji dataEmoji="🙄" />
          <Emoji dataEmoji="🤔" />
          <Emoji dataEmoji="👐" />
          <Emoji dataEmoji="🙌" />
          <Emoji dataEmoji="👏" />
          <Emoji dataEmoji="🙏" />
          <Emoji dataEmoji="👍" />
          <Emoji dataEmoji="👎" />
          <Emoji dataEmoji="👊" />
          <Emoji dataEmoji="🤘" />
          <Emoji dataEmoji="👌" />
          <Emoji dataEmoji="👈" />
          <Emoji dataEmoji="👉" />
          <Emoji dataEmoji="👋" />
          <Emoji dataEmoji="💪" />
          <Emoji dataEmoji="💋" />
          <Emoji dataEmoji="👂" />
          <Emoji dataEmoji="👀" />
          <Emoji dataEmoji="⭐" />
          <Emoji dataEmoji="☀" />
          <Emoji dataEmoji="🌤" />
          <Emoji dataEmoji="⛅" />
          <Emoji dataEmoji="🌥" />
          <Emoji dataEmoji="🌦" />
          <Emoji dataEmoji="🌈" />
          <Emoji dataEmoji="🌧" />
          <Emoji dataEmoji="⛈" />
          <Emoji dataEmoji="🌩" />
          <Emoji dataEmoji="🌨" />
          <Emoji dataEmoji="☃" />
          <Emoji dataEmoji="⛄" />
          <Emoji dataEmoji="❄" />
          <Emoji dataEmoji="🌬" />
          <Emoji dataEmoji="💨" />
          <Emoji dataEmoji="🍰" />
          <Emoji dataEmoji="🎂" />
          <Emoji dataEmoji="🚗" />
          <Emoji dataEmoji="🚕" />
          <Emoji dataEmoji="🚙" />
          <Emoji dataEmoji="🚌" />
          <Emoji dataEmoji="🚎" />
          <Emoji dataEmoji="🏎" />
          <Emoji dataEmoji="🚓" />
          <Emoji dataEmoji="🚑" />
          <Emoji dataEmoji="🚒" />
          <Emoji dataEmoji="🚐" />
          <Emoji dataEmoji="🚚" />
          <Emoji dataEmoji="🚛" />
          <Emoji dataEmoji="🛩" />
          <Emoji dataEmoji="✈" />
          <Emoji dataEmoji="🛫" />
          <Emoji dataEmoji="🛬" />
          <Emoji dataEmoji="⌚" />
          <Emoji dataEmoji="📱" />
          <Emoji dataEmoji="💻" />
          <Emoji dataEmoji="🖨" />
          <Emoji dataEmoji="⏰" />
          <Emoji dataEmoji="⏳" />
          <Emoji dataEmoji="💡" />
          <Emoji dataEmoji="🎉" />
          <Emoji dataEmoji="📌" />
          <Emoji dataEmoji="📍" />
          <Emoji dataEmoji="🔎" />
          <Emoji dataEmoji="❤" />
          <Emoji dataEmoji="💔" />
          <Emoji dataEmoji="💤" />
          <Emoji dataEmoji="🎵" />
        </chakra.div>
      </PopoverContent>
    </Popover>
  </>
);
