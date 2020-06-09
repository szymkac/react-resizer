import React, { useRef, useEffect } from 'react';

import './resizable.scss'

const Resizable = () => {
    const resizableRef = useRef();

    const onResize = (e) => {
        console.log(e.target.getAttribute('name'));
        console.log("start");

        const resize = () => {
            console.log("resize");
        };

        const stopResize = () => {
            console.log("stop");

            window.removeEventListener('mousemove', resize)
            window.removeEventListener('mouseup', stopResize)
        };

        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize)
    };

    return <section ref={resizableRef} className='resizable-block'>
        <section className='resizable-content'>
            <div name='nw' className='anchor nw' onMouseDown={onResize}></div>
            <div name='ne' className='anchor ne' onMouseDown={onResize}></div>
            <div name='sw' className='anchor sw' onMouseDown={onResize}></div>
            <div name='se' className='anchor se' onMouseDown={onResize}></div>
        </section>
    </section>
}

export default Resizable;