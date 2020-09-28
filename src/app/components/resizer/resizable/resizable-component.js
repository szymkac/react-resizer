import React, { useRef, useEffect } from 'react';

import { handleResize, getElementBounding, handleOverflow, handleUnits } from './resizable-logic';
import './resizable.scss';



const Resizable = ({ children, keepRatio = false, allowOverflow = false, centered = false, resultUnits = 'px', onSizeChange, ...styleProps }) => {
    const resizableRef = useRef();

    useEffect(() => {
        if (allowOverflow) {
            const { top, height } = getElementBounding(resizableRef.current);
            const { height: parentHeight } = getElementBounding(resizableRef.current.parentElement);
            if (top + height > parentHeight) {
                handleOverflow(resizableRef.current, true)
            }
        }
    }, [allowOverflow]);

    const onStartResize = onMouseDownEvent => {
        onMouseDownEvent.preventDefault()
        const targetElement = allowOverflow ? document : resizableRef.current.parentElement;

        targetElement.addEventListener('mousemove', onResize);
        targetElement.addEventListener('mouseup', onStopResize);
        targetElement.addEventListener('mouseleave', onStopResize);

        const anchor = onMouseDownEvent.target.getAttribute('name');

        function onResize(onMoveEvent) {
            handleResize(onMoveEvent, resizableRef.current, anchor, { keepRatio, allowOverflow, centered });
        };

        function onStopResize() {
            targetElement.removeEventListener('mousemove', onResize);
            targetElement.removeEventListener('mouseup', onStopResize);
            targetElement.removeEventListener('mouseleave', onStopResize);
            if (typeof onSizeChange === 'function') {
                const { height, width } = resizableRef.current.parentElement.getBoundingClientRect();
                onSizeChange({
                    newSizes: handleUnits(resizableRef.current, resultUnits, centered),
                    parentSizes: {
                        height, width
                    }
                })
            }
        };
    };


    let possitionStyles = { top: '0px', ...styleProps };
    if (centered) {
        possitionStyles.left = '50%';
    }

    return <section ref={resizableRef} style={possitionStyles} className={`resizable-block${centered ? ' center' : ''}`}>
        <section className='resizable-border'>
            {!keepRatio && <div name='n' className='anchor rectangle n' onMouseDown={onStartResize}></div>}
            {!keepRatio && <div name='e' className='anchor rectangle e' onMouseDown={onStartResize}></div>}
            {!keepRatio && <div name='s' className='anchor rectangle s' onMouseDown={onStartResize}></div>}
            {!keepRatio && <div name='w' className='anchor rectangle w' onMouseDown={onStartResize}></div>}
            <div name='nw' className='anchor triangle n w' onMouseDown={onStartResize}></div>
            <div name='ne' className='anchor triangle n e' onMouseDown={onStartResize}></div>
            <div name='sw' className='anchor triangle s w' onMouseDown={onStartResize}></div>
            <div name='se' className='anchor triangle s e' onMouseDown={onStartResize}></div>
        </section>
        <section className="resizable-content">
            {children}
        </section>
    </section>
}

export default Resizable;