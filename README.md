# OffTradeInBuilding React App

Vite + React 기반의 운영 준비도 계산기 앱입니다.

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

브라우저에서 표시되는 로컬 주소로 접속하면 됩니다.

## 프로덕션 빌드

```bash
npm run build
npm run preview
```

## GitHub Pages 배포

1. 이 폴더를 GitHub 저장소로 push합니다.
2. 저장소의 Settings > Pages에서 Source를 GitHub Actions로 선택합니다.
3. main 브랜치 push 시 [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) 워크플로우가 빌드 후 배포합니다.

## 주요 파일

- [index.html](index.html): 앱 엔트리 HTML
- [src/main.jsx](src/main.jsx): React 부트스트랩
- [src/App.jsx](src/App.jsx): 화면/로직 컴포넌트
- [src/styles.css](src/styles.css): 반응형 UI 스타일
- [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml): Pages 배포 워크플로우
