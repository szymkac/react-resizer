import React from 'react';

import './resizerWrapper.scss'

const ResizerWrapper = ({ children, minHeight, height }) => {
    return <section className='resizer-wrapper' style={{ minHeight, height }}>
        {children}
    </section>
}

export default ResizerWrapper;