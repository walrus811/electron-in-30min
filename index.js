const copyCanvas = document.getElementById('copyCanvas');
const copyCanvasCtx = copyCanvas.getContext('2d');
const drawCanvas = document.getElementById('drawCanvas');
const drawCanvasCtx = drawCanvas.getContext('2d');
const video = document.getElementById("video");
const fs = require('fs');
const cp = require("child_process");



navigator.mediaDevices.enumerateDevices()
    .then(async function(devices) {
        devices.forEach(function(device) {
            console.log(device.kind + ": " + device.label +
                " id = " + device.deviceId);
        });
        for (let device of devices) {
            if (device.label == "DroidCam Source 2") {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        deviceId: device.deviceId,
                        height: 360,
                        width: 360
                    }
                });
                handleStream(stream)
            }
        }


    })
    .catch(function(err) {
        console.log(err.name + ": " + err.message);
    });

video.addEventListener('play', () => {
    function step() {
        copyCanvasCtx.drawImage(video, 0, 0, copyCanvas.width, copyCanvas.height);
        let frame = copyCanvasCtx.getImageData(0, 0, copyCanvas.width, copyCanvas.height);
        meanBlurFilter(drawCanvasCtx, frame);
        requestAnimationFrame(step)
    }
    requestAnimationFrame(step);
})
const handleStream = (stream) => {
    video.srcObject = stream;
};

const show = document.getElementById('show');

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

const RemoveRedFilter = (putCanvasCtx, frame) => {
    let len = frame.data.length / 4;

    for (let i = 0; i < len; i++) {
        const rIndex = i * 4 + 0;
        frame.data[rIndex] = 0;
    }
    putCanvasCtx.putImageData(frame, 0, 0);
}

const RemoveGreenFilter = (putCanvasCtx, frame) => {
    let len = frame.data.length / 4;

    for (let i = 0; i < len; i++) {
        const gIndex = i * 4 + 1;
        frame.data[gIndex] = 0;
    }
    putCanvasCtx.putImageData(frame, 0, 0);
}


const RemoveBlueFilter = (putCanvasCtx, frame) => {
    let len = frame.data.length / 4;

    for (let i = 0; i < len; i++) {
        const bIndex = i * 4 + 2;
        frame.data[bIndex] = 0;
    }
    putCanvasCtx.putImageData(frame, 0, 0);
}


function handleError(e) {
    console.log(e)
}

fs.readdir("./", (err, files) => {
    files.forEach(file => {
        console.log(file);
    });
});