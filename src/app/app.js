import React, { useState } from 'react';
import ResizerWrapper from './components/resizer/resizerWrapper';
import Resizable from './components/resizer/resizable';

const App = () => {
  const [sizes, setSizes] = useState({});
  const onSizeChange = resizerSizes => {
    console.log(sizes, resizerSizes)
    setSizes(resizerSizes.newSizes)
  }
  return (
    <main>
      <ResizerWrapper minHeight='100vh'>
        <Resizable  {...sizes} keepRatio centered resultUnits='%' onSizeChange={onSizeChange}>
          <img src='https://img.thedailybeast.com/image/upload/c_crop,d_placeholder_euli9k,h_1440,w_2560,x_0,y_0/dpr_2.0/c_limit,w_740/fl_lossy,q_auto/v1531451526/180712-Weill--The-Creator-of-Pepe-hero_uionjj' alt='pepeusz' />
        </Resizable>
      </ResizerWrapper>
    </main>
  );
}

export default App;
