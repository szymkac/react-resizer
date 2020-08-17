export const minSize = 22;

export const resizeFactors = {
    e: { sizeFactor: 0, deltaFactor: -1, changePos: false, dimension: 'horizontal' },
    w: { sizeFactor: 1, deltaFactor: 1, changePos: true, dimension: 'horizontal' },
    s: { sizeFactor: 0, deltaFactor: -1, changePos: false, dimension: 'vertical' },
    n: { sizeFactor: 1, deltaFactor: 1, changePos: true, dimension: 'vertical' }
}

export const dimensionHelpers = {
    vertical: { size: 'height', cursor: 'pageY', pos: 'top', oppositeSize: 'width' },
    horizontal: { size: 'width', cursor: 'pageX', pos: 'left', oppositeSize: 'height' },
}

export const units = ['px', '%'];