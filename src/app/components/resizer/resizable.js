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

const calculateNewSize = (dir, element, onMoveEvent, allowOverflow, centered) => {
    const boundingClientRect = element.getBoundingClientRect();
    const parentBoundingClientRect = element.parentElement.getBoundingClientRect();
    const { sizeFactor, deltaFactor, changePos, dimension } = resizeFactors[dir];
    const { size, cursor, pos, oppositeSize } = dimensionHelpers[dimension];

    const isCentered = centered && dimension === 'horizontal';
    const overflow = !(onMoveEvent[cursor] > parentPadding && onMoveEvent[cursor] < parentBoundingClientRect[size] - parentPadding);
    let newSize = (!allowOverflow && overflow) || (allowOverflow && overflow && dir !== 's') ? boundingClientRect[size] :
        (boundingClientRect[size] * sizeFactor) + ((boundingClientRect[pos] - onMoveEvent[cursor]) * deltaFactor);

    if (isCentered) {
        const sizeDiff = newSize - boundingClientRect[size];
        newSize += sizeDiff;
    }

    if (newSize > minSize) {
        const newPos = changePos && onMoveEvent[cursor] > parentPadding ? onMoveEvent[cursor] : boundingClientRect[pos];
        return { newSize, newPos, oppositeSize, size, pos, sizeChanges: newSize !== boundingClientRect[size], dimension };
    }
    else {
        return { newSize: boundingClientRect[size], newPos: boundingClientRect[pos], oppositeSize, size, pos, sizeChanges: false, dimension };
    }
}

const handleResize = (onMoveEvent, element, anchor, allowOverflow, centered) => {
    const style = element.style;
    const diagonal = anchor.length > 1;

    anchor.split('').forEach(dir => {
        const { newSize, newPos, oppositeSize, size, pos, dimension } = calculateNewSize(dir, element, onMoveEvent, allowOverflow, centered);
        style[size] = newSize + 'px';
        style[pos] = centered && dimension === 'horizontal' ? '50%' : newPos + 'px';
        if (!diagonal && !style[oppositeSize]) {
            style[oppositeSize] = element.getBoundingClientRect()[oppositeSize] + 'px';
        }
    })
}

const handleResizeWithRatio = (onMoveEvent, element, anchor, allowOverflow, centered) => {
    const style = element.style;
    const boundingClientRect = element.getBoundingClientRect();
    const parentBoundingClientRect = element.parentElement.getBoundingClientRect();
    const { height: oldHeight, width: oldWidth } = boundingClientRect;
    const [verticalDir, horizontalDir] = anchor.split('');

    const { newSize: newHeight, newPos: newTop, sizeChanges: heightChange } = calculateNewSize(verticalDir, element, onMoveEvent, allowOverflow, centered);
    if (heightChange) {
        const newWidth = oldWidth * newHeight / oldHeight;
        const newLeft = resizeFactors[horizontalDir].changePos ? boundingClientRect.left + oldWidth - newWidth : boundingClientRect.left;
        const overflowRight = parentBoundingClientRect.width - parentPadding < newWidth + newLeft;

        if (newWidth > minSize && newLeft > parentPadding && !overflowRight) {
            style.width = newWidth + 'px';
            style.height = newHeight + 'px';
            style.top = newTop + 'px';
            style.left = centered ? '50%' : newLeft + 'px';
        }
    }
}

const Resizable = ({ children, keepRatio, allowOverflow = false, centered = false, ...styleProps }) => {
    const resizableRef = useRef();

    const onStartResize = onMouseDownEvent => {
        onMouseDownEvent.preventDefault()
        const targetElement = allowOverflow ? document : resizableRef.current.parentElement;

        targetElement.addEventListener('mousemove', onResize);
        targetElement.addEventListener('mouseup', onStopResize);
        targetElement.addEventListener('mouseleave', onStopResize);

        const anchor = onMouseDownEvent.target.getAttribute('name');

        function onResize(onMoveEvent) {
            if (keepRatio) {
                handleResizeWithRatio(onMoveEvent, resizableRef.current, anchor, allowOverflow, centered)
            }
            else {
                handleResize(onMoveEvent, resizableRef.current, anchor, allowOverflow, centered);
            }
        };

        function onStopResize() {
            targetElement.removeEventListener('mousemove', onResize);
            targetElement.removeEventListener('mouseup', onStopResize);
            targetElement.removeEventListener('mouseleave', onStopResize);
        };
    };


    let possitionStyles = { ...styleProps };
    if (centered) {
        possitionStyles.left = '50%';
    }

    return <section ref={resizableRef} style={possitionStyles} className={`resizable-block${centered ? ' center' : ''}`}>
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