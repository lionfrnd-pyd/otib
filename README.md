# OffTradeInBuilding React App

Vite + React + SQLite 기반의 건물 내 오프라인 직거래 앱입니다.

## 사전 준비

1. Node.js LTS 설치 (권장: 20 이상)
2. 설치 확인

```bash
node -v
npm -v
```

## 로컬 실행

```bash
npm install
npm run dev
```

이 모드에서는 프론트만 실행됩니다.

## DB 포함 실행

```bash
npm install
npm run dev:full
```

- 프론트: http://localhost:5173
- API 서버: http://localhost:4000
- SQLite 파일: server/data/otib.db

프론트는 DB 서버 연결에 성공하면 SQLite에 거래글을 저장합니다.

## 프로덕션 빌드

```bash
npm run build
npm run preview
```

## GitHub Pages 배포

1. 이 폴더를 GitHub 저장소로 push합니다.
2. 저장소의 Settings > Pages에서 Source를 GitHub Actions로 선택합니다.
3. main 브랜치 push 시 [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) 워크플로우가 빌드 후 배포합니다.

참고: GitHub Pages는 정적 호스팅이므로 SQLite 서버는 별도 배포가 필요합니다.

## Pages에서 실제 DB 모드 켜기

1. 백엔드 API 서버를 Render 또는 Railway에 배포합니다.
2. 배포된 API URL을 복사합니다. 예: `https://otib-api.onrender.com`
3. GitHub 저장소에서 Settings > Secrets and variables > Actions > Variables로 이동합니다.
4. Repository variable 추가
	- Name: `VITE_API_BASE`
	- Value: `https://otib-api.onrender.com`
5. API 서버 환경변수 설정
	- `CORS_ORIGIN=https://lionfrnd-pyd.github.io`
6. main 브랜치에 push하면 Pages 워크플로우가 새 API 주소로 빌드되어 실제 DB 저장 모드로 동작합니다.

## API 서버 배포 예시 (Render)

1. Render에서 New + Web Service 선택
2. GitHub 저장소 연결 후 루트 경로를 `OffTradeInBuilding`으로 지정
3. Build Command: `npm install`
4. Start Command: `npm run server`
5. Environment Variables
	- `CORS_ORIGIN=https://lionfrnd-pyd.github.io`
6. 배포 완료 후 `/api/health` 응답 확인

## 주요 파일

- [index.html](index.html): 앱 엔트리 HTML
- [src/main.jsx](src/main.jsx): React 부트스트랩
- [src/App.jsx](src/App.jsx): 화면/로직 컴포넌트
- [src/styles.css](src/styles.css): 반응형 UI 스타일
- [server/index.js](server/index.js): Express + SQLite API 서버
- [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml): Pages 배포 워크플로우
