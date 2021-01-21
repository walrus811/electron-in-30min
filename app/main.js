const { app, BrowserWindow } = require('electron')
const global = require('./global');
const fs = require('fs');


if (!fs.existsSync(global.DEFAULT_PATH)) {
    fs.mkdirSync(global.DEFAULT_PATH, { recursive: true });
}

if (!fs.existsSync(global.DEFAULT_OUTPUT_PATH)) {
    fs.mkdirSync(global.DEFAULT_OUTPUT_PATH, { recursive: true });
}

if (!fs.existsSync(global.DEFAULT_JOB_LIST)) {
    fs.mkdirSync(global.DEFAULT_JOB_LIST, { recursive: true });
}

if (!fs.existsSync(global.DEFAULT_JOB_LIST_FILE)) {
    fs.writeFile(global.DEFAULT_JOB_LIST_FILE, JSON.stringify([]), () => {});
}

const ICON_PATH = require('path').join(__dirname, 'static/camera.png');

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 1000,
        minWidth: 900,
        minHeight: 1000,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.setIcon(ICON_PATH);
    win.loadFile(require('path').join(__dirname, 'render/index.html'));
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})