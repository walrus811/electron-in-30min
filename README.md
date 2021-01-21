# 30분만에 마스터하는 Electron

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
```
mkdir filterc
cd filterc
npm init -y
```

5. 다음처럼 폴더구조 생성
```
mkdir -p app/render
mkdir app/util
```

6. package.json을 아래처럼 수정
```
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
```
npm i
```

8. 엔트리 포인트 작성
```
touch app/main.js
touch app/render/index.html
touch app/render/index.css
touch app/render/index.js
```

### app/main.js
```
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

    win.loadFile('app/render/index.html')
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
```
npm start
```

10. renderer 파일 복사

다운로드 : https://devcloud.malgn.com/index.php/s/TGWjxWQH4RRXWT7

비밀번호 : 비밀

=> app 폴더에 압축 풀기

```
filterc
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
    └─util
            filters.js
```

11. 실행 해보기
```
npm start
```

---
## B. 파일 IO
12. 캡쳐 기능 추가

---
## C. Custom API

---
## D. 배포

---