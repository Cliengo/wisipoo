import React from 'react';
import { Square } from '@chakra-ui/react';
import { Icon } from '../../utils/EditorIcon.component';

export const ActionButton = ({ name, onClick, isActive }) => (
  <Square _hover={{ backgroundColor: 'gray.300' }} rounded="md" onClick={onClick} as="button">
    <Icon name={name} color={isActive ? '#3B86FF' : 'gray.700'} _hover={{ color: 'gray.800' }} />
  </Square>
);
