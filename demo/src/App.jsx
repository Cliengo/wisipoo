import { chakra } from '@chakra-ui/react';
import { Thing } from '../../.';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <chakra.p color="red">Hello Vite + React!</chakra.p>
        <Thing />
      </header>
    </div>
  );
}

export default App;
