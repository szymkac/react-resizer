import React from 'react';
import ResizerWrapper from './components/resizer/resizerWrapper';
import Resizable from './components/resizer/resizable';

const App = () => {
  return (
    <main>
      <ResizerWrapper>
        <Resizable left={'100px'} top={'100px'}>
          <img src='https://pbs.twimg.com/profile_images/619691410992672768/TwSZQOYf_400x400.png' />
        </Resizable>
      </ResizerWrapper>
    </main>
  );
}

export default App;
