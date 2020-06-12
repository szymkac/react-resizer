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

const calculateNewSize = (dir, element, onMoveEvent, allowOverflow) => {
    const boundingClientRect = element.getBoundingClientRect();
    const parentBoundingClientRect = element.parentElement.getBoundingClientRect();
    const { sizeFactor, deltaFactor, changePos, dimension } = resizeFactors[dir];
    const { size, cursor, pos, oppositeSize } = dimensionHelpers[dimension];

    const overflow = !(onMoveEvent[cursor] > parentPadding && onMoveEvent[cursor] < parentBoundingClientRect[size] - parentPadding);
    const newSize = !allowOverflow && overflow ? boundingClientRect[size] :
        (boundingClientRect[size] * sizeFactor) + ((boundingClientRect[pos] - onMoveEvent[cursor]) * deltaFactor);

    if (newSize > minSize) {
        const newPos = changePos && onMoveEvent[cursor] > parentPadding ? onMoveEvent[cursor] : boundingClientRect[pos];
        return { newSize, newPos, oppositeSize, size, pos, sizeChanges: newSize !== boundingClientRect[size] };
    }
    else {
        return { newSize: boundingClientRect[size], newPos: boundingClientRect[pos], oppositeSize, size, pos, sizeChanges: false };
    }
}

const handleResize = (onMoveEvent, element, anchor, allowOverflow) => {
    const style = element.style;
    const diagonal = anchor.length > 1;

    anchor.split('').forEach(dir => {
        const { newSize, newPos, oppositeSize, size, pos } = calculateNewSize(dir, element, onMoveEvent, allowOverflow);
        style[size] = newSize + 'px';
        style[pos] = newPos + 'px';
        if (!diagonal && !style[oppositeSize]) {
            style[oppositeSize] = element.getBoundingClientRect()[oppositeSize] + 'px';
        }
    })
}

const handleResizeWithRatio = (onMoveEvent, element, anchor, allowOverflow) => {
    const style = element.style;
    const boundingClientRect = element.getBoundingClientRect();
    const parentBoundingClientRect = element.parentElement.getBoundingClientRect();
    const { height: oldHeight, width: oldWidth } = boundingClientRect;
    const [verticalDir, horizontalDir] = anchor.split('');

    const { newSize: newHeight, newPos: newTop, sizeChanges: heightChange } = calculateNewSize(verticalDir, element, onMoveEvent, allowOverflow);
    if (heightChange) {
        const newWidth = oldWidth * newHeight / oldHeight;
        const newLeft = resizeFactors[horizontalDir].changePos ? boundingClientRect.left + oldWidth - newWidth : boundingClientRect.left;
        const overflowRight = parentBoundingClientRect.width - parentPadding < newWidth + newLeft;

        if (newWidth > minSize && newLeft > parentPadding && !overflowRight) {
            style.width = newWidth + 'px';
            style.height = newHeight + 'px';
            style.top = newTop + 'px';
            style.left = newLeft + 'px';
        }
    }
}

const Resizable = ({ children, keepRatio, allowOverflow = false, ...styleProps }) => {
    const resizableRef = useRef();

    const onStartResize = onMouseDownEvent => {
        onMouseDownEvent.preventDefault()
        const { parentElement } = resizableRef.current;
        parentElement.addEventListener('mousemove', onResize);
        parentElement.addEventListener('mouseup', onStopResize);
        parentElement.addEventListener('mouseleave', onStopResize);

        const anchor = onMouseDownEvent.target.getAttribute('name');

        function onResize(onMoveEvent) {
            if (keepRatio) {
                handleResizeWithRatio(onMoveEvent, resizableRef.current, anchor, allowOverflow)
            }
            else {
                handleResize(onMoveEvent, resizableRef.current, anchor, allowOverflow);
            }
        };

        function onStopResize() {
            parentElement.removeEventListener('mousemove', onResize);
            parentElement.removeEventListener('mouseleave', onStopResize);
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