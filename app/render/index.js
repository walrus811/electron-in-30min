const filters = require('../util/filters');

const copyCanvas = document.getElementById('copyCanvas');
const copyCanvasCtx = copyCanvas.getContext('2d');
const drawCanvas = document.getElementById('drawCanvas');
const drawCanvasCtx = drawCanvas.getContext('2d');
const video = document.getElementById("video");
const cameraSelect = document.getElementById("cameraSelect");
const applyCameraButton = document.getElementById("applyCameraButton");
const filterSelect = document.getElementById("filterSelect");
const applyFilterButton = document.getElementById("applyFilterButton");

let currentFilter = filters.noneFilter;;

const initCameraSelect = async() => {
    cameraSelect.innerHTML = "";
    const devices = await navigator.mediaDevices.enumerateDevices();
    for (device of devices) {
        if (device.kind == "videoinput") {
            let option = document.createElement("option");
            option.innerHTML = device.label;
            option.value = device.id;
            cameraSelect.appendChild(option);
        }
    }
    if (cameraSelect.children.length > 0) {
        cameraSelect.value = cameraSelect.firstChild.value;
    }
};

const initFilterSelect = async() => {
    const filterObject = {
        "없음": filters.noneFilter,
        "흑백": filters.grayscaleFilter,
        "밝게": filters.lightFilter,
        "어둡게": filters.darkFilter,
        "빨간색 제거": filters.removeRedFilter,
        "파란색 제거": filters.removeBlueFilter,
        "초록색 제거": filters.removeGreenFilter,
        "노이즈 제거": filters.meanBlurFilter,
        "예술": filters.artFilter,
    };

    filterSelect.innerHTML = "";
    for (const [key, value] of Object.entries(filterObject)) {
        let option = document.createElement("option");
        option.innerHTML = key;
        option.value = value;
        filterSelect.appendChild(option);
    }
    if (filterSelect.children.length > 0) {
        filterSelect.value = filterSelect.firstChild.value;
    }
};

const init = async() => {
    try {
        await initCameraSelect();
        initFilterSelect();
    } catch (err) {

        console.log("init", `${err.name} : ${err.message}`);
    }
}

//events
applyCameraButton.addEventListener('click', async() => {

    const deviceId = cameraSelect.value;
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            deviceId: deviceId,
            height: drawCanvas.height,
            width: drawCanvas.width
        }
    });
    video.srcObject = stream;

});

applyFilterButton.addEventListener('click', () => {
    currentFilter = filterSelect.value;
});

video.addEventListener('play', () => {
    function step() {

        copyCanvasCtx.drawImage(video, 0, 0, copyCanvas.width, copyCanvas.height);
        let frame = copyCanvasCtx.getImageData(0, 0, copyCanvas.width, copyCanvas.height);
        currentFilter(drawCanvas, frame);
        requestAnimationFrame(step)
    }
    requestAnimationFrame(step);
});


init();