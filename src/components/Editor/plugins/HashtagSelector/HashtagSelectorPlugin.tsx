import { Box } from '@chakra-ui/react';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { HashtagItem, HashtagList } from './HashtagList';
import { useLexicalHashtagListeners } from './useLexicalHashtagListeners';
import { ListPositionOffset } from './utils';

interface HashtagSelectorPluginProps {
  hashtagList: HashtagItem[];
  parentRef?: React.RefObject<HTMLElement | null>;
  listOffset?: ListPositionOffset;
  onHashtagSelected?: () => void;
}

export function HashtagSelectorPlugin({
  hashtagList,
  parentRef,
  listOffset,
  onHashtagSelected,
}: HashtagSelectorPluginProps) {
  const selectorElementRef = useRef<HTMLDivElement | null>(null);
  const [
    preselectedHashtag,
    setPreselectedHashtag,
  ] = useState<HashtagItem | null>(null);
  const visibleList = useRef<HashtagItem[]>([]);

  const handleArrowDown = useCallback(() => {
    const visibleHashtagList = visibleList.current;
    if (
      !preselectedHashtag ||
      visibleHashtagList.indexOf(preselectedHashtag) ===
        visibleHashtagList.length - 1
    ) {
      setPreselectedHashtag(visibleHashtagList[0]);
    } else {
      setPreselectedHashtag(
        visibleHashtagList[visibleList.current.indexOf(preselectedHashtag) + 1]
      );
    }
  }, [preselectedHashtag]);

  const handleArrowUp = useCallback(() => {
    const visibleHashtagList = visibleList.current;
    if (
      !preselectedHashtag ||
      visibleHashtagList.indexOf(preselectedHashtag) === 0
    ) {
      setPreselectedHashtag(visibleHashtagList[visibleHashtagList.length - 1]);
    } else {
      setPreselectedHashtag(
        visibleHashtagList[visibleHashtagList.indexOf(preselectedHashtag) - 1]
      );
    }
  }, [preselectedHashtag]);

  const handleEnterKey = () => {
    if (preselectedHashtag) {
      replaceHashtagWithContent(preselectedHashtag);
      setPreselectedHashtag(null);
      onHashtagSelected && onHashtagSelected();
    }
  };

  const handleVisibleListItemsChange = (newList: HashtagItem[]) => {
    visibleList.current = newList;
    if (preselectedHashtag && newList.indexOf(preselectedHashtag) === -1) {
      setPreselectedHashtag(newList[0]);
    }
  };

  const [
    currentHashtag,
    replaceHashtagWithContent,
  ] = useLexicalHashtagListeners(
    selectorElementRef,
    handleArrowDown,
    handleArrowUp,
    handleEnterKey,
    parentRef,
    listOffset,
    visibleList.current.length <= 0
  );

  useEffect(() => {
    if (!currentHashtag) {
      setPreselectedHashtag(null);
    } else {
      setPreselectedHashtag(hashtagList[0]);
    }
  }, [currentHashtag, hashtagList]);

  return (
    <Box ref={selectorElementRef} position="absolute" width="0px" height="0px">
      <HashtagList
        list={hashtagList}
        onItemClick={item => {
          replaceHashtagWithContent(item);
        }}
        currentHashtag={currentHashtag}
        onVisibleListItemsChange={handleVisibleListItemsChange}
        selectedItem={preselectedHashtag}
      />
    </Box>
  );
}
