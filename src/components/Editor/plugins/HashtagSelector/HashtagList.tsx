import { Box, Menu, MenuItem } from '@chakra-ui/react';
import React, { useMemo } from 'react';

export interface HashtagItem {
  shortcut: string;
  body: string;
}

interface HashtagListProps {
  list: HashtagItem[];
  onItemClick: (item: HashtagItem) => void;
  currentHashtag: string | null;
}

export const HASHTAG_ITEM_HEIGHT = 33;

const listContainerStyles = {
  outline: '2px solid transparent',
  outlineOffset: '2px',
  background: '#fff',
  boxShadow: 'sm',
  width: 'max-content',
  zIndex: 5,
  borderRadius: 'md',
  borderWidth: '1px',
  maxHeight: `${HASHTAG_ITEM_HEIGHT * 5 + 2}px`,
  maxWidth: '250px',
  overflow: 'auto',
};

export const HashtagList = ({
  list,
  onItemClick,
  currentHashtag,
}: HashtagListProps) => {
  console.log(currentHashtag);
  const itemsElements = useMemo(
    () =>
      list
        .filter(item =>
          currentHashtag ? item.shortcut.includes(currentHashtag) : true
        )
        .map((item, index) => (
          <MenuItem
            key={index}
            onClick={onItemClick.bind(null, item)}
            height={`${currentHashtag}px`}
          >
            #{item.shortcut}
          </MenuItem>
        )),
    [list, currentHashtag]
  );
  console.log(itemsElements);
  const listBottom = useMemo(() => {
    const value =
      itemsElements && itemsElements.length > 1
        ? (itemsElements.length - 1) * HASHTAG_ITEM_HEIGHT
        : 0;
    return `${value}px`;
  }, [itemsElements]);

  return currentHashtag !== null ? (
    <Menu isOpen autoSelect={false} matchWidth>
      <Box {...listContainerStyles} position="relative" bottom={listBottom}>
        {itemsElements}
      </Box>
    </Menu>
  ) : null;
};
