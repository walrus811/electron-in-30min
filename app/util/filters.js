function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

const noneFilter = (putCanvasCtx, frame) => {
    putCanvasCtx.putImageData(frame, 0, 0);
}

const grayscaleFilter = (putCanvasCtx, frame) => {
    let len = frame.data.length / 4;
    for (let i = 0; i < len; i++) {
        const rIndex = i * 4 + 0;
        const gIndex = i * 4 + 1;
        const bIndex = i * 4 + 2;
        const val = frame.data[rIndex] * 0.3 + frame.data[gIndex] * 0.59 + frame.data[bIndex] * 0.11;
        frame.data[rIndex] = val;
        frame.data[gIndex] = val;
        frame.data[bIndex] = val;
    }
    putCanvasCtx.putImageData(frame, 0, 0);
}
const brightnessFilter = (putCanvasCtx, frame, brightness) => {
    let len = frame.data.length / 4;

    for (let i = 0; i < len; i++) {
        const rIndex = i * 4 + 0;
        const gIndex = i * 4 + 1;
        const bIndex = i * 4 + 2;
        frame.data[rIndex] = frame.data[rIndex] * brightness;
        frame.data[gIndex] = frame.data[gIndex] * brightness;
        frame.data[bIndex] = frame.data[bIndex] * brightness;
    }
    putCanvasCtx.putImageData(frame, 0, 0);
}

const lightFilter = (putCanvasCtx, frame) => {
    return brightnessFilter(putCanvasCtx, frame, 2.0);
}

const darkFilter = (putCanvasCtx, frame, brightness) => {
    return brightnessFilter(putCanvasCtx, frame, 0.3);
}

const removeRedFilter = (putCanvasCtx, frame) => {
    let len = frame.data.length / 4;

    for (let i = 0; i < len; i++) {
        const rIndex = i * 4 + 0;
        frame.data[rIndex] = 0;
    }
    putCanvasCtx.putImageData(frame, 0, 0);
}

const removeGreenFilter = (putCanvasCtx, frame) => {
    let len = frame.data.length / 4;

    for (let i = 0; i < len; i++) {
        const gIndex = i * 4 + 1;
        frame.data[gIndex] = 0;
    }
    putCanvasCtx.putImageData(frame, 0, 0);
}

const removeBlueFilter = (putCanvasCtx, frame) => {
    let len = frame.data.length / 4;

    for (let i = 0; i < len; i++) {
        const bIndex = i * 4 + 2;
        frame.data[bIndex] = 0;
    }
    putCanvasCtx.putImageData(frame, 0, 0);
}

const meanBlurFilter = (putCanvasCtx, frame) => {

    for (let y = 0; y < frame.height; y++) {
        for (let x = 0; x < frame.width; x++) {
            if (x < 1 || y < 1 || x + 1 == frame.width || y + 1 == frame.height)
                continue;
            const sumRed =
                frame.data[((x - 1) + ((y - 1) * frame.width)) * 4 + 0] + //top left
                frame.data[((x + 0) + ((y - 1) * frame.width)) * 4 + 0] + //top center
                frame.data[((x + 1) + ((y - 1) * frame.width)) * 4 + 0] + //top right
                frame.data[((x - 1) + ((y + 0) * frame.width)) * 4 + 0] + //mid left
                frame.data[((x + 0) + ((y + 0) * frame.width)) * 4 + 0] + //center
                frame.data[((x + 1) + ((y + 0) * frame.width)) * 4 + 0] + //mid right
                frame.data[((x - 1) + ((y + 1) * frame.width)) * 4 + 0] + //low left
                frame.data[((x + 0) + ((y + 1) * frame.width)) * 4 + 0] + //low center
                frame.data[((x + 1) + ((y + 1) * frame.width)) * 4 + 0]; //low right
            frame.data[((x + 0) + ((y + 0) * frame.width)) * 4 + 0] = sumRed / 9;
            const sumGreen =
                frame.data[((x - 1) + ((y - 1) * frame.width)) * 4 + 1] + //top left
                frame.data[((x + 0) + ((y - 1) * frame.width)) * 4 + 1] + //top center
                frame.data[((x + 1) + ((y - 1) * frame.width)) * 4 + 1] + //top right
                frame.data[((x - 1) + ((y + 0) * frame.width)) * 4 + 1] + //mid left
                frame.data[((x + 0) + ((y + 0) * frame.width)) * 4 + 1] + //center
                frame.data[((x + 1) + ((y + 0) * frame.width)) * 4 + 1] + //mid right
                frame.data[((x - 1) + ((y + 1) * frame.width)) * 4 + 1] + //low left
                frame.data[((x + 0) + ((y + 1) * frame.width)) * 4 + 1] + //low center
                frame.data[((x + 1) + ((y + 1) * frame.width)) * 4 + 1]; //low right
            frame.data[((x + 0) + ((y + 0) * frame.width)) * 4 + 1] = sumGreen / 9;

            const sumBlue =
                frame.data[((x - 1) + ((y - 1) * frame.width)) * 4 + 2] + //top left
                frame.data[((x + 0) + ((y - 1) * frame.width)) * 4 + 2] + //top center
                frame.data[((x + 1) + ((y - 1) * frame.width)) * 4 + 2] + //top right
                frame.data[((x - 1) + ((y + 0) * frame.width)) * 4 + 2] + //mid left
                frame.data[((x + 0) + ((y + 0) * frame.width)) * 4 + 2] + //center
                frame.data[((x + 1) + ((y + 0) * frame.width)) * 4 + 2] + //mid right
                frame.data[((x - 1) + ((y + 1) * frame.width)) * 4 + 2] + //low left
                frame.data[((x + 0) + ((y + 1) * frame.width)) * 4 + 2] + //low center
                frame.data[((x + 1) + ((y + 1) * frame.width)) * 4 + 2]; //low right
            frame.data[((x + 0) + ((y + 0) * frame.width)) * 4 + 2] = sumBlue / 9;
        }
    }
    putCanvasCtx.putImageData(frame, 0, 0);
}

const artFilter = (putCanvasCtx, frame) => {
    shuffle(frame.data);
    putCanvasCtx.putImageData(frame, 0, 0);
}

module.exports = {
    noneFilter: noneFilter,
    grayscaleFilter: grayscaleFilter,
    lightFilter: lightFilter,
    darkFilter: darkFilter,
    removeRedFilter: removeRedFilter,
    removeBlueFilter: removeBlueFilter,
    removeGreenFilter: removeGreenFilter,
    meanBlurFilter: meanBlurFilter,
    artFilter: artFilter
};