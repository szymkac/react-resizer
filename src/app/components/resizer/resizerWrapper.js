import React from 'react';

import './resizerWrapper.scss'

const ResizerWrapper = ({ children }) => {
    return <section className='resizer-wrapper'>
        {children}
    </section>
}

export default ResizerWrapper;