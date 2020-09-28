import { minSize, resizeFactors, dimensionHelpers, units } from './resizable-consts';

export const calculateNewSize = (dir, element, onMoveEvent, allowOverflow, centered) => {
    const boundingClientRect = getElementBounding(element);
    const parentBoundingClientRect = getElementBounding(element.parentElement);
    const { sizeFactor, deltaFactor, changePos, dimension } = resizeFactors[dir];
    const { size, cursor, pos, oppositeSize } = dimensionHelpers[dimension];

    const isCentered = centered && dimension === 'horizontal';
    const overflow = !(onMoveEvent[cursor] > 0 && onMoveEvent[cursor] < parentBoundingClientRect[size]);
    let newSize = (!allowOverflow && overflow) || (allowOverflow && overflow && dir !== 's') ? boundingClientRect[size] :
        (boundingClientRect[size] * sizeFactor) + ((boundingClientRect[pos] - onMoveEvent[cursor]) * deltaFactor);

    if (isCentered) {
        const sizeDiff = newSize - boundingClientRect[size];
        newSize += sizeDiff;
    }

    if (newSize > minSize) {
        return {
            newSize,
            newPos: changePos && onMoveEvent[cursor] > 0 ? onMoveEvent[cursor] : null,
            oppositeSize,
            size,
            pos,
            sizeChanges: newSize !== boundingClientRect[size],
            dimension,
            overflowing: overflow && allowOverflow && dir === 's'
        };
    }
    else {
        return { sizeChanges: false };
    }
};

export const handleResize = (onMoveEvent, element, directions, opt = {}) => {
    if (opt.keepRatio) {
        handleResizeWithRatio(onMoveEvent, element, directions, opt);
    }
    else {
        handleResizeWithoutRatio(onMoveEvent, element, directions, opt);
    }
};

export const handleResizeWithoutRatio = (onMoveEvent, element, directions, { allowOverflow, centered } = {}) => {
    const { style } = element;
    const isDiagonal = directions.length > 1;

    directions.split('').forEach(dir => {
        const { newSize, newPos, oppositeSize, size, pos, dimension, sizeChanges, overflowing } = calculateNewSize(dir, element, onMoveEvent, allowOverflow, centered);
        if (sizeChanges) {
            style[size] = newSize + 'px';
            if (newPos !== null) {
                style[pos] = centered && dimension === 'horizontal' ? '50%' : newPos + 'px';
            }
            if (!isDiagonal && !style[oppositeSize]) {
                style[oppositeSize] = getElementBounding(element)[oppositeSize] + 'px';
            }

            if (dir === 's') {
                handleOverflow(element, overflowing);
            }
        }
    })
};

export const handleResizeWithRatio = (onMoveEvent, element, directions, { allowOverflow, centered } = {}) => {
    const { style } = element;
    const boundingClientRect = getElementBounding(element);
    const parentBoundingClientRect = getElementBounding(element.parentElement);
    const { height: oldHeight, width: oldWidth } = boundingClientRect;
    const [verticalDir, horizontalDir] = directions.split('');

    const { newSize: newWidth, newPos: newLeft, sizeChanges: widthChange, overflowing: overflowRight } = calculateNewSize(horizontalDir, element, onMoveEvent, allowOverflow, centered);
    if (widthChange) {
        const newHeight = oldHeight * newWidth / oldWidth;
        const newTop = resizeFactors[verticalDir].changePos ? boundingClientRect.top + oldHeight - newHeight : boundingClientRect.top;
        const overflowTop = parentBoundingClientRect.height < newHeight + newTop;

        if (newHeight > minSize && newTop >= 0 && !overflowRight && (!overflowTop || overflowTop && allowOverflow)) {
            style.width = newWidth + 'px';
            style.height = newHeight + 'px';
            if (newTop !== null) {
                style.top = newTop + 'px';
            }
            style.left = centered ? '50%' : newLeft + 'px';

            if (verticalDir === 's') {
                handleOverflow(element, overflowTop);
            }
        }
    }
};

export const removeUnit = value => parseInt(units.reduce((acc, cur) => acc.replace(cur, ''), value));

const percentTopToPx = (styleTop, parentElement) => {
    const topPercent = removeUnit(styleTop);
    const parentBoundingClientRect = parentElement.getBoundingClientRect();
    return (topPercent * parentBoundingClientRect.height / 100);
}

export const pxToPercent = (elementValue, parentValue) => removeUnit(elementValue) * 100 / parentValue + '%';

export const percentToPx = (elementValue, parentValue) => removeUnit(elementValue) * parentValue / 100 + 'px';

export const handleUnit = (elementValue, parentValue, targetUnit) => {
    const isPercent = elementValue.includes('%');

    if (isPercent) {
        return targetUnit === '%' ? elementValue : percentToPx(elementValue, parentValue);
    }
    else {
        return targetUnit === '%' ? pxToPercent(elementValue, parentValue) : elementValue;
    }

}

export const handleUnits = (element, unit, centered) => {
    const { width, height, top, left } = element.style;
    const { width: parentWidth, height: parentHeight } = element.parentElement.getBoundingClientRect();

    return {
        width: handleUnit(width, parentWidth, unit),
        height: handleUnit(height, parentHeight, unit),
        left: centered ? "50%" : handleUnit(left, parentWidth, unit),
        top: handleUnit(top, parentHeight, unit)
    }
}

export const getElementBounding = element => {
    const { width, height, left } = element.getBoundingClientRect();

    const styleTop = element.style.top;
    const top = styleTop.includes('%') ? percentTopToPx(styleTop, element.parentElement) : removeUnit(element.style.top);
    return {
        width,
        height,
        top,
        left
    }
}

export const handleOverflow = (element, overflowing) => {
    const { parentElement } = element;
    const { height: originalParentHeight } = getElementBounding(parentElement);

    const handle = overflowing || (!overflowing && parentElement.dataset.originalHeight < originalParentHeight);

    if (handle) {
        if (!parentElement.dataset.originalHeight) {
            parentElement.setAttribute('data-original-height', originalParentHeight);
        }
        const { height, top } = getElementBounding(element);
        const newParentHeight = top + height;
        parentElement.style.height = newParentHeight + 'px';
        parentElement.scrollIntoView({ block: "end" });

        if (newParentHeight < parentElement.dataset.originalHeight) {
            parentElement.removeAttribute('data-original-height');
        }
    }
}