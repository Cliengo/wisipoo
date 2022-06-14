import { HeadingNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import theme from './theme/default';

export const editorConfig = {
  // The editor theme
  theme: theme,
  // Handling of errors during update
  onError(error: any) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [HeadingNode, ListNode, ListItemNode, AutoLinkNode, LinkNode],
};
