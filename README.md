# MCX Field Client Prototype

Jetpack Compose 기반 Android MCX Client 프로젝트를 제안/논의하기 위한 정적 웹 프로토타입입니다.

## 가정한 프로젝트 성격

- 가장 가능성 높은 대상: MCPTT/MCX Android Client의 차세대 버전
- 도메인: PS-LTE, LTE-R, 공공안전망, 철도/현장 무전통신
- 기존 공개 앱이 확인되지 않아, 아이페이지온의 공개 사업 이력과 MCPTT/MCX 앱 공통 패턴을 기준으로 벤치마킹했습니다.

## 구성한 핵심 화면

- PTT 중심 홈 화면
- Talk Group 선택
- 현장 위치/AVL 지도
- 암호화 메시지
- 긴급 모드 전환
- 고대비/접근성 미리보기
- 관제 콘솔형 그룹 모니터

## 실행 방법

브라우저에서 `index.html`을 열면 바로 실행됩니다. 별도 빌드 과정이 없습니다.

GitHub Pages에 배포할 때는 저장소 루트에 있는 `index.html`, `styles.css`, `app.js`를 그대로 사용하면 됩니다.
