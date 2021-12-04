# 30분만에 마스터하는 Electron

## Filter C

![샘플](https://github.com/walrus811/filterc/blob/main/sample.png)

---
## 챕터
### A. 시작
### B. 파일 IO
### C. Custom API
### D. 배포

---
## A. 시작
---

1. node 설치 (https://nodejs.org/en/download/)
2. git 설치 (https://git-scm.com/)
3. visual studio code 설치(https://code.visualstudio.com/)

4. 프로젝트를 만들 적절한 위치 선정
```bash
mkdir filterc
cd filterc
npm init -y
```

5. 다음처럼 폴더구조 생성
```bash
mkdir -p app/render
mkdir app/util
```

6. package.json을 아래처럼 수정
### package.json
```json
{
    "name": "filterC",
    "version": "1.0.0",
    "description": "",
    "main": "app/main.js",
    "scripts": {
        "start": "npx electron ."
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
        "bootstrap": "^4.6.0"
    },
    "devDependencies": {
        "electron": "^11.2.0",
        "electron-reloader": "^1.2.0"
    }
}

```

7. 패키지 설치
```bash
npm i
```

8. 엔트리 포인트 작성
```bash
touch app/main.js
touch app/render/index.html
touch app/render/index.css
touch app/render/index.js
```

### app/main.js
```js
const { app, BrowserWindow } = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

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
```

9. 실행 해보기
```bash
npm start
```

10. 레포지토리 clone

해당 레포지토리를 clone하고 app/render 내용을 동일한 위치에 복사

```bash
└─filterc
    │  package.json
    │
    └─app
        │  main.js
        │
        ├─render
        │      index.css
        │      index.html
        │      index.js
        │
        ├─static
        │      camera.png
        │
        └─util
                filters.js
                utility.js
```

11. 실행 해보기
```bash
npm start
```

12. 아이콘 추가

아이콘은 레포지토리에 있는 걸 사용

### app/main.js
```js
//추가!
const ICON_PATH = require('path').join(__dirname, 'static/camera.png');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    })
//추가
    win.setIcon(ICON_PATH);
    win.loadFile(path.join(__dirname, 'render/index.html'));
}
```

13. 실행 해보기
```bash
npm start   
```

---
## B. 파일 IO

12. 파일을 저장할 폴더 생성
```bash
touch app/global.js
```
### app/global.js
[path.join](https://nodejs.org/api/path.html#path_path_join_paths)
[os.homedir](https://nodejs.org/api/os.html#os_os_homedir)
```js
const APP_NAME = "filterc"
//앱 데이터 저장 위치, ex) C:\Users\walru\filterc
exports.DEFAULT_PATH = require("path").join(require("os").homedir(), APP_NAME);
//캡쳐 파일 저장 위치, ex) C:\Users\walru\filterc\output
exports.DEFAULT_OUTPUT_PATH = require("path").join(require("os").homedir(), APP_NAME, "output");
//캡쳐 파일 저장 위치, ex) C:\Users\walru\filterc\job
exports.DEFAULT_JOB_LIST = require("path").join(require("os").homedir(), APP_NAME, "job");
//캡쳐 파일 저장 위치, ex) C:\Users\walru\filterc\job\job.json
exports.DEFAULT_JOB_LIST_FILE = require("path").join(require("os").homedir(), APP_NAME, "job", "job.json");
```

### app/main.js
[fs.existsSync](https://nodejs.org/api/fs.html#fs_fs_existssync_path)
[fs.mkdirSync](https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_options)
[fs.writeFile](https://nodejs.org/api/fs.html#fs_fs_writefilesync_file_data_options)
```js
const { app, BrowserWindow } = require('electron')
//추가
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
    fs.writeFile(global.DEFAULT_JOB_LIST_FILE, JSON.stringify([]), () => { });
}
// 이하 생략...
```

13. 실행 해보기
```bash
npm start   
```

### Windows
```cmd
explorer %USERPROFILE%\filterc
```

### OS X
```bash
OPEN -R ~/filterc
```

14. 캡쳐 기능 추가(캔버스 이미지 버퍼 변환)
### app/renderer/index.js
```js
//소스 코드 최상위에 필요한 node 라이브러리 임포트
const fs = require('fs');
const cp = require("child_process");
const path = require('path');
const global = require('../global');
```

### app/renderer/index.js
[Buffer](https://nodejs.org/api/buffer.html#buffer_static_method_buffer_alloc_size_fill_encoding)

```js
captureButton.addEventListener('click', () => {
    //우측 캔버스로부터 이미지 데이터 얻기
    let img = drawCanvas.toDataURL();
    //헤더 제거
    const data = img.replace(/^data:image\/\w+;base64,/, "");
    //raw 데이터를 파일로 저장하기 위해 버퍼로 변환
    const buffer = Buffer.alloc(data.length, data, 'base64');    
    //저장할 파일 경로 지정, ex)  C:\Users\walru\filterc\output\121432435.png
    const savePath = path.join(global.DEFAULT_OUTPUT_PATH, `${utility.getUnixTicks().toString()}.png`);
    
    try {
        //버퍼 내용을 savePath에다 작성
        fs.writeFileSync(savePath, buffer);

        //작업 리스트 갱신
        const jobList = require(global.DEFAULT_JOB_LIST_FILE);
        jobList.push({ "date": (new Date()).toString(), "path": savePath });
        fs.writeFileSync(global.DEFAULT_JOB_LIST_FILE, JSON.stringify(jobList));
        initJobFileList(jobList);
    } catch (err) {
        console.log("can't write file", err);
    }
});


```

15. 실행 해보기
```bash
npm start   
```

### Windows
```cmd
explorer %USERPROFILE%\filterc\output
```

### OS X
```bash
Open -R ~/filterc/output
```

16. 폴더 열기

### app/renderer/index.js
[process.platform](https://nodejs.org/api/process.html#process_process_platform)
[child_process.execSync](https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options)

```js
openFolder.addEventListener('click', () => {
    try {
        //OS X일 경우
        if (process.platform == 'darwin') {
            cp.execSync(`open -R ${global.DEFAULT_OUTPUT_PATH}/`, );
        } 
        //Windows 일 경우
        else if (process.platform == 'win32') {
            cp.execSync(`explorer.exe ${global.DEFAULT_OUTPUT_PATH}\\`);
        } else {;
        }
    } catch (err) {
        console.log(`can't open ${global.DEFAULT_OUTPUT_PATH}`, err);
    }
});
```

17. 실행 해보기
```bash
npm start   
```

18. 작업 목록 출력
### app/main.js
```js
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
```

19. 실행 해보기
```bash
npm start   
```

---

## C. Custom API(Notification)
[Notification](https://www.electronjs.org/docs/api/notification)

20. 작업 완료 알림 추가
### app/renderer/index.js
```js

captureButton.addEventListener('click', () => {
//생략...
    try{
//생략...
//initJobFileList(jobList);
        const noti = new Notification('Filter C', {
            body: `캡쳐 완료(${savePath})!`
        });
    } catch (err) {
        console.log("can't write file", err);
    }
});
```

21. 실행 해보기
```bash
npm start   
```

22. Notification 클릭 이벤트
### app/renderer/index.js
```js

captureButton.addEventListener('click', () => {
//생략...
    try{
//생략...
//initJobFileList(jobList);
        const noti = new Notification('Filter C', {
            body: `캡쳐 완료(${savePath})!`
        });
//추가
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
```

23. 실행 해보기
```bash
npm start   
```

---
## D. 배포
[electron-packager](https://github.com/electron/electron-packager)

24. electron-packager 설치
```bash
npm install -D electron-packager
```
25. 빌드 스크립트 추가

### package.json
```json
{
    "name": "filterC",
    "version": "1.0.0",
    "description": "",
    "main": "app/main.js",
    "scripts": {
        "start": "npx electron .",
        "build": " npx electron-packager . --platform=darwin,win32 --arch=x64 --overwrite --out=release",
        "build-mac": " npx electron-packager . --platform=darwin --arch=x64 --overwrite --out=release",
        "build-win": " npx electron-packager . --platform=win32 --arch=x64 --overwrite --out=release"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
        "bootstrap": "^4.6.0",
        "electron-packager": "^15.2.0"
    },
    "devDependencies": {
        "electron": "^11.2.0",
        "electron-reloader": "^1.2.0"
    }
}
```

26. 빌드

### Windows
```cmd
npm run build-win
```

### OS X
```bash
npm run build-mac
```

27. 빌드 결과물 확인
```bash
cd release
```
---
