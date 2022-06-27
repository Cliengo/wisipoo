import React, { useState } from 'react';
import { Box, Center, Select } from '@chakra-ui/react';
import './App.css';
import { Editor } from '../../.';

function App() {
  const [editMode, setEditMode] = useState(false);
  const [initialValue, setInitialValue] = useState('<p>hello <b>world</b></p>');

  const [websiteType, setWebsiteType] = useState('website');

  return (
    <Center minH="100vh" flexDir="column">
      <Box maxW="700px" mb={8}>
        <Select value={websiteType} onChange={(e) => setWebsiteType(e.target.value)}>
          <option value="website">Website</option>
          <option value="whatsapp">Whatsapp</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
        </Select>
      </Box>
      <Box w="100%" maxW="520px" mx="auto">
        <Editor
          handleEditMode={setEditMode}
          editMode={editMode}
          initialValue={initialValue}
          onChange={value => {
          setInitialValue(value)
          }}
          websiteType={websiteType}
          placeholder="Write something..."
        />
      </Box>
      <Box
        mt={8}
        border="1px solid #e1e1e1"
        rounded="md"
        p={2}
        w="100%"
        maxW="520px"
        mx="auto"
      >
        {initialValue}
      </Box>
    </Center>
  );
}

export default App;
