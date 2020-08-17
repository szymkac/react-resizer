import React, { useState } from 'react';
import ResizerWrapper from './components/resizer/resizerWrapper';
import Resizable from './components/resizer/resizable';

const App = () => {
  const [sizes, setSizes] = useState({ width: '100px', height: '100px' });
  const onSizeChange = resizerSizes => {
    console.log(sizes, resizerSizes)
    setSizes(resizerSizes.newSizes)
  }
  return (
    <main>
      <ResizerWrapper minHeight='100vh'>
        <Resizable  {...sizes} keepRatio centered resultUnits='px' onSizeChange={onSizeChange}>
          {/* <img src='https://pbs.twimg.com/profile_images/619691410992672768/TwSZQOYf_400x400.png' alt='pepeusz' /> */}
        </Resizable>
      </ResizerWrapper>
    </main>
  );
}

export default App;
