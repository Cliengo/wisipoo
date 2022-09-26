import { Box, Menu, MenuItem } from '@chakra-ui/react';
import React, { useMemo, useEffect } from 'react';
import { isScrolledIntoParentElement } from './utils';

export interface HashtagItem {
  shortcut: string;
  body: string;
}

interface HashtagListProps {
  list: HashtagItem[];
  onItemClick: (item: HashtagItem) => void;
  currentHashtag: string | null;
  onVisibleListItemsChange: (newList: HashtagItem[]) => void;
  selectedItem: HashtagItem | null;
}

export const HASHTAG_ITEM_HEIGHT = 33;

const listContainerStyles = {
  outline: '2px solid transparent',
  outlineOffset: '2px',
  background: '#fff',
  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 5%)',
  width: 'max-content',
  zIndex: 5,
  borderRadius: '0.375rem',
  borderWidth: '1px',
  borderColor: '#E2E8F0',
  maxHeight: `${HASHTAG_ITEM_HEIGHT * 5 + 2}px`,
  maxWidth: '250px',
  overflow: 'auto',
};

export const HASHTAG_SELECTOR_PLUGIN_BUTTON_CLASS =
  'hashtag-selector-plugin-button';

export const HashtagList = ({
  list,
  onItemClick,
  currentHashtag,
  onVisibleListItemsChange,
  selectedItem,
}: HashtagListProps) => {
  const filteredHashtagList = useMemo(() => {
    const filteredList = list.filter(item =>
      currentHashtag ? item.shortcut.includes(currentHashtag) : true
    );
    return {
      hashtagItemsList: filteredList,
      elementsList: filteredList.map((item, index) => (
        <MenuItem
          className={`${HASHTAG_SELECTOR_PLUGIN_BUTTON_CLASS}${
            selectedItem === item ? ' selected' : ''
          }`}
          key={index}
          onClick={onItemClick.bind(null, item)}
          height={`${HASHTAG_ITEM_HEIGHT}px`}
        >
          #{item.shortcut}
        </MenuItem>
      )),
    };
  }, [list, currentHashtag, selectedItem, onItemClick]);

  useEffect(() => {
    onVisibleListItemsChange(filteredHashtagList.hashtagItemsList);
  }, [filteredHashtagList, onVisibleListItemsChange]);

  const listBottom = useMemo(() => {
    const value =
      filteredHashtagList.hashtagItemsList &&
      filteredHashtagList.hashtagItemsList.length > 1
        ? Math.min(filteredHashtagList.hashtagItemsList.length - 1, 4) *
          HASHTAG_ITEM_HEIGHT
        : 0;
    return `${value}px`;
  }, [filteredHashtagList]);

  useEffect(() => {
    if (selectedItem) {
      const selectedListElement = document.getElementsByClassName(
        `${HASHTAG_SELECTOR_PLUGIN_BUTTON_CLASS} selected`
      )[0];

      if (
        selectedListElement &&
        !isScrolledIntoParentElement(selectedListElement as HTMLElement)
      ) {
        selectedListElement.scrollIntoView();
      }
    }
  }, [selectedItem]);

  return currentHashtag !== null ? (
    <Menu isOpen autoSelect={false} matchWidth>
      <Box {...listContainerStyles} position="relative" bottom={listBottom}>
        {filteredHashtagList.elementsList}
      </Box>
    </Menu>
  ) : null;
};
