import React from 'react';
import ResizerWrapper from './components/resizer/resizerWrapper';
import Resizable from './components/resizer/resizable';

const App = () => {
  return (
    <main>
      <ResizerWrapper>
        <Resizable top={'100px'} left={'100px'} allowOverflow keepRatio centered>
          <img src='https://pbs.twimg.com/profile_images/619691410992672768/TwSZQOYf_400x400.png' alt='pepeusz' />
        </Resizable>
      </ResizerWrapper>
    </main>
  );
}

export default App;
