import { Box } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { HashtagItem, HashtagList } from './HashtagList';
import { useLexicalHashtagListeners } from './useLexicalHashtagListeners';

interface HashtagSelectorPluginProps {
  hashtagList: HashtagItem[];
  parentRef: React.RefObject<HTMLElement | null>;
}

export function HashtagSelectorPlugin({
  hashtagList,
  parentRef,
}: HashtagSelectorPluginProps) {
  const selectorElementRef = useRef<HTMLDivElement | null>(null);
  const [
    currentHashtag,
    replaceHashtagWithContent,
  ] = useLexicalHashtagListeners(selectorElementRef, parentRef);
  return (
    <Box ref={selectorElementRef} position="absolute">
      <HashtagList
        list={hashtagList}
        onItemClick={item => {
          replaceHashtagWithContent(item);
        }}
        currentHashtag={currentHashtag}
      />
    </Box>
  );
}
