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
    vertical: { size: 'height', cursor: 'pageY', pos: 'top', oppositeSize: 'width' },
    horizontal: { size: 'width', cursor: 'pageX', pos: 'left', oppositeSize: 'height' },
}

const handleResize = (onMoveEvent, element, anchor) => {
    const style = element.style;
    const boundingClientRect = element.getBoundingClientRect();
    const parentBoundingClientRect = element.parentElement.getBoundingClientRect();

    const diagonal = anchor.length > 1;
    anchor.split('').forEach(a => {
        const { sizeFactor, deltaFactor, changePos, dimension } = resizeFactors[a];
        const { size, cursor, pos, oppositeSize } = dimensionHelpers[dimension];

        if (onMoveEvent[cursor] > parentPadding && onMoveEvent[cursor] < parentBoundingClientRect[size] - parentPadding) {
            const newSize = (boundingClientRect[size] * sizeFactor) + ((boundingClientRect[pos] - onMoveEvent[cursor]) * deltaFactor);

            if (newSize > minSize) {
                style[size] = newSize + 'px';
                if (!diagonal && !style[oppositeSize]) {
                    style[oppositeSize] = boundingClientRect[oppositeSize] + 'px';
                }
                if (changePos) {
                    style[pos] = onMoveEvent[cursor] + 'px';
                }
            }
        }
    })
}

const calculateNewSize = (dir, element, onMoveEvent, allowOverflow = true) => {
    const boundingClientRect = element.getBoundingClientRect();
    const parentBoundingClientRect = element.parentElement.getBoundingClientRect();
    const { sizeFactor, deltaFactor, changePos, dimension } = resizeFactors[dir];
    const { size, cursor, pos } = dimensionHelpers[dimension];

    const overflow = onMoveEvent[cursor] > parentPadding && onMoveEvent[cursor] < parentBoundingClientRect[size] - parentPadding;
    const newSize = !allowOverflow && overflow ? boundingClientRect[size] :
        (boundingClientRect[size] * sizeFactor) + ((boundingClientRect[pos] - onMoveEvent[cursor]) * deltaFactor);

    return { overflow, newSize, changePos, cursor };
}

const handleResizeWithRatio = (onMoveEvent, element, anchor) => {
    const style = element.style;
    const boundingClientRect = element.getBoundingClientRect();
    const parentBoundingClientRect = element.parentElement.getBoundingClientRect();
    const { height: oldHeight, width: oldWidth } = boundingClientRect;
    const [verticalDir, horizontalDir] = anchor.split('');

    const { newSize: newHeight, changePos: changeTop } = calculateNewSize(verticalDir, element, onMoveEvent);
    const newWidth = oldWidth * newHeight / oldHeight;

    if (newHeight > minSize && newWidth > minSize) {
        style.width = newWidth + 'px';
        style.height = newHeight + 'px';
        if(changeTop){
            style.top = onMoveEvent.pageY + 'px';
        }
    }
}

const Resizable = ({ children, keepRatio, ...styleProps }) => {
    const resizableRef = useRef();

    const onStartResize = onMouseDownEvent => {
        onMouseDownEvent.preventDefault()
        const { parentElement } = resizableRef.current;
        parentElement.addEventListener('mousemove', onResize);
        parentElement.addEventListener('mouseup', onStopResize)
        parentElement.addEventListener('mouseleave', onStopResize)

        const anchor = onMouseDownEvent.target.getAttribute('name');

        function onResize(onMoveEvent) {
            if (keepRatio) {
                handleResizeWithRatio(onMoveEvent, resizableRef.current, anchor)
            }
            else {
                handleResize(onMoveEvent, resizableRef.current, anchor);
            }
        };

        function onStopResize() {
            parentElement.removeEventListener('mousemove', onResize);
            parentElement.removeEventListener('mouseleave', onStopResize)
            parentElement.removeEventListener('mouseup', onStopResize);
        };
    };

    return <section ref={resizableRef} style={styleProps} className='resizable-block'>
        <section className='resizable-content'>
            {!keepRatio && <div name='n' className='anchor n' onMouseDown={onStartResize}></div>}
            {!keepRatio && <div name='e' className='anchor e' onMouseDown={onStartResize}></div>}
            {!keepRatio && <div name='s' className='anchor s' onMouseDown={onStartResize}></div>}
            {!keepRatio && <div name='w' className='anchor w' onMouseDown={onStartResize}></div>}
            <div name='nw' className='anchor nw' onMouseDown={onStartResize}></div>
            <div name='ne' className='anchor ne' onMouseDown={onStartResize}></div>
            <div name='sw' className='anchor sw' onMouseDown={onStartResize}></div>
            <div name='se' className='anchor se' onMouseDown={onStartResize}></div>
            {children}
        </section>
    </section>
}

export default Resizable;