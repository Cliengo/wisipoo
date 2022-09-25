import { Box } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { HashtagItem, HashtagList } from './HashtagList';
import { useLexicalHashtagListeners } from './useLexicalHashtagListeners';

interface HashtagSelectorPluginProps {
  hashtagList: HashtagItem[];
}

export function HashtagSelectorPlugin({
  hashtagList,
}: HashtagSelectorPluginProps) {
  const selectorElementRef = useRef<HTMLDivElement | null>(null);
  const [
    currentHashtag,
    replaceHashtagWithContent,
  ] = useLexicalHashtagListeners(selectorElementRef);
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
