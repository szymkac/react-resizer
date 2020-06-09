import React from 'react';
import ResizerWrapper from './components/resizer/resizerWrapper';
import Resizable from './components/resizer/resizable';

const App = () => {
  return (
    <main>
      <ResizerWrapper>
        <Resizable></Resizable>
      </ResizerWrapper>
    </main>
  );
}

export default App;
