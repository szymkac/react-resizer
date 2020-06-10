import React, { useRef } from 'react';

import './resizable.scss'

const minSize = 22;
const parentPadding = minSize / 2;

const resizeFactors = {
    e: { sizeFactor: 0, deltaFactor: -1, changePos: false, dimension: 'horizontal' },
    w: { sizeFactor: 1, deltaFactor: 1, changePos: true, dimension: 'horizontal' },
    s: { sizeFactor: 0, deltaFactor: -1, changePos: false, dimension: 'vertical' },
    n: { sizeFactor: 1, deltaFactor: 1, changePos: true, dimension: 'vertical' }
}

const dimensionHelpers = {
    vertical: { size: 'height', cursor: 'pageY', pos: 'top' },
    horizontal: { size: 'width', cursor: 'pageX', pos: 'left' },
}

const handleResize = (onMoveEvent, element, anchor) => {
    const style = element.style;
    const boundingClientRect = element.getBoundingClientRect();
    const parentBoundingClientRect = element.parentElement.getBoundingClientRect();

    anchor.split('').forEach(a => {
        const { sizeFactor, deltaFactor, changePos, dimension } = resizeFactors[a];
        const { size, cursor, pos } = dimensionHelpers[dimension];
        if (onMoveEvent[cursor] > parentPadding && onMoveEvent[cursor] < parentBoundingClientRect[size] - parentPadding) {
            const newSize = (boundingClientRect[size] * sizeFactor) + ((boundingClientRect[pos] - onMoveEvent[cursor]) * deltaFactor);
            if (newSize > minSize) {
                style[size] = newSize + 'px';
                if (changePos) {
                    style[pos] = onMoveEvent[cursor] + 'px';
                }
            }
        }
    })
}

const Resizable = () => {
    const resizableRef = useRef();

    const onStartResize = onMouseDownEvent => {
        onMouseDownEvent.preventDefault()
        window.addEventListener('mousemove', onResize);
        window.addEventListener('mouseup', onStopResize)

        const anchor = onMouseDownEvent.target.getAttribute('name');

        function onResize(onMoveEvent) {
            handleResize(onMoveEvent, resizableRef.current, anchor);
        };

        function onStopResize() {
            window.removeEventListener('mousemove', onResize);
            window.removeEventListener('mouseup', onStopResize);
        };
    };

    return <section ref={resizableRef} className='resizable-block'>
        <section className='resizable-content'>
            <div name='n' className='anchor n' onMouseDown={onStartResize}></div>
            <div name='e' className='anchor e' onMouseDown={onStartResize}></div>
            <div name='s' className='anchor s' onMouseDown={onStartResize}></div>
            <div name='w' className='anchor w' onMouseDown={onStartResize}></div>
            <div name='nw' className='anchor nw' onMouseDown={onStartResize}></div>
            <div name='ne' className='anchor ne' onMouseDown={onStartResize}></div>
            <div name='sw' className='anchor sw' onMouseDown={onStartResize}></div>
            <div name='se' className='anchor se' onMouseDown={onStartResize}></div>
        </section>
    </section>
}

export default Resizable;