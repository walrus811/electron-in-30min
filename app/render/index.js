const fs = require('fs');
const cp = require("child_process");
const path = require('path');
const global = require('../global');

const utility = require('../util/utility');
const filters = require('../util/filters');

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

const copyCanvas = document.getElementById('copyCanvas');
const copyCanvasCtx = copyCanvas.getContext('2d');
const drawCanvas = document.getElementById('drawCanvas');
const drawCanvasCtx = drawCanvas.getContext('2d');
const video = document.getElementById("video");
const cameraSelect = document.getElementById("cameraSelect");
const applyCameraButton = document.getElementById("applyCameraButton");
const filterSelect = document.getElementById("filterSelect");
const applyFilterButton = document.getElementById("applyFilterButton");
const captureButton = document.getElementById("captureButton");
const jobListElement = document.getElementById("jobListElement");
const openFolder = document.getElementById("openFolder");

let currentFilter = filters.noneFilter;

const initJobFileList = (jobList) => {
    jobListElement.innerHTML = "";

    for (const job of jobList) {
        const newJobElementString = `
        <li class="list-group-item list-group-item-primary  d-flex  align-items-center ">
        ${job.path}(${job.date.toLocaleString()})
        </li>
        `;

        const newJobElement = utility.htmlToElement(newJobElementString);
        const newStartButton = document.createElement("button");
        newStartButton.setAttribute("class", "btn btn-sm btn-primary ml-2");
        newStartButton.innerHTML = "열기";
        newStartButton.onclick = () => {
            try {
                if (process.platform == 'darwin') {
                    cp.execSync(`open -R ${job.path}/`, );
                } else if (process.platform == 'win32') {
                    cp.execSync(`explorer.exe ${job.path}\\`);
                } else {;
                }
            } catch (err) {
                console.log(`can't open ${job.path}`, err);
            }

        };
        newJobElement.appendChild(newStartButton);
        jobListElement.appendChild(newJobElement);
    }
};

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

    filterSelect.innerHTML = "";
    for (const [key, value] of Object.entries(filterObject)) {
        let option = document.createElement("option");
        option.innerHTML = key;
        option.value = key;
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
        const jobList = require(global.DEFAULT_JOB_LIST_FILE);
        initJobFileList(jobList);
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
    currentFilter = filterObject[filterSelect.value];
});

video.addEventListener('play', () => {
    function step() {
        copyCanvasCtx.drawImage(video, 0, 0, copyCanvas.width, copyCanvas.height);
        let frame = copyCanvasCtx.getImageData(0, 0, copyCanvas.width, copyCanvas.height);
        currentFilter(drawCanvasCtx, frame);
        requestAnimationFrame(step)
    }
    requestAnimationFrame(step);
});

captureButton.addEventListener('click', () => {
    let img = drawCanvas.toDataURL();
    const data = img.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.alloc(data.length, data, 'base64');
    const savePath = path.join(global.DEFAULT_OUTPUT_PATH, `${utility.getUnixTicks().toString()}.png`);

    try {
        fs.writeFileSync(savePath, buffer);
        const jobList = require(global.DEFAULT_JOB_LIST_FILE);
        jobList.push({ "date": (new Date()).toString(), "path": savePath });
        fs.writeFileSync(global.DEFAULT_JOB_LIST_FILE, JSON.stringify(jobList));
        initJobFileList(jobList);
        const noti = new Notification('Filter C', {
            body: `캡쳐 완료(${savePath})!`
        });
        noti.onclick = () => {
            try {
                if (process.platform == 'darwin') {
                    cp.execSync(`open -R ${savePath}/`, );
                } else if (process.platform == 'win32') {
                    cp.execSync(`explorer.exe ${savePath}\\`);
                } else {;
                }
            } catch (err) {
                console.log(`can't open ${savePath}`, err);
            }
        }

    } catch (err) {
        console.log("can't write file", err);
    }
});

openFolder.addEventListener('click', () => {
    try {
        if (process.platform == 'darwin') {
            cp.execSync(`open -R ${global.DEFAULT_OUTPUT_PATH}/`, );
        } else if (process.platform == 'win32') {
            cp.execSync(`explorer.exe ${global.DEFAULT_OUTPUT_PATH}\\`);
        } else {;
        }
    } catch (err) {
        console.log(`can't open ${global.DEFAULT_OUTPUT_PATH}`, err);
    }
});




init();