# ⚡ Woofam Universe & Services Hub (`woofam.github.io`)

> **"Ideas turned into Daily Utilities & 3-Sec Solutions"**  
> 3초의 직관으로 일상의 고민을 해결하는 **3-Sec Life** 시리즈 및 Woofam의 다양한 온라인 서비스 바로가기 포털 & 브랜드 랜딩 페이지입니다.

---

## 🌟 대표 서비스 라인업 (Services Lineup)

### 1. ⚡ 3-Sec Life Family (3초 라이프 시그니처)
- **[3초 가성비 (3-Sec Value)](https://woofam.github.io/3sec-value/)**: 단품 vs 묶음 최적 채널(다이소, 노브랜드, 쿠팡 등) 처방 및 손익분기 계산
- **[3초 레시피 (3-Sec Recipe)](https://woofam.github.io/3sec/)**: 냉장고 속 재료로 3초 만에 메뉴를 결정하는 초간단 자취 요리 큐레이션
- **3초 루틴 (3-Sec Routine)** *(Coming Soon)*: 5-4-3-2-1 즉각 실행 법칙 기반 미루기 방지 타이머

### 2. 🛠️ Utilities & Dev Tools
- **단위 환산 매트릭스 (Unit Matrix)**: 100g / 10ml당 실질 단가 즉시 환산
- **정규식 치트 스튜디오 (Regex Studio)**: 자주 쓰는 정규식 패턴 즉시 검증 및 복사
- **휘발성 로컬 메모 (Instant Pad)**: 서버 저장 없는 100% 로컬 프라이빗 마크다운 메모장

---

## 🎮 숨겨진 이스터에그 (Easter Egg)

- 상단 내비게이션의 **[🎮 3-Sec Run]** 버튼을 누르거나, 키보드 **`G`** 키를 누르거나, 로고를 더블 클릭하면 **HTML5 무한 런닝머신 허들 러너 게임**이 실행됩니다.
- 조작법: **[ 스페이스바(Space) ]** 또는 **[ 화면 탭 ]** 으로 허들을 뛰어넘고 최고 기록에 도전하세요!

---

## 🚀 새로운 서비스 추가 방법 (How to Add a Service)

`app.js` 파일 내의 `SERVICES_DATA` 배열에 서비스 객체를 추가하기만 하면 포털에 자동으로 렌더링되고 실시간 검색 및 카테고리 필터링이 지원됩니다.

```javascript
{
  id: "my-new-service",
  name: "서비스 이름",
  shortName: "약칭",
  category: "3sec" | "utility" | "dev" | "life",
  categoryLabel: "카테고리명",
  status: "LIVE" | "BETA" | "COMING_SOON",
  tagline: "한 줄 슬로건",
  description: "상세 설명",
  icon: "🚀",
  url: "https://woofam.github.io/my-service/",
  github: "https://github.com/woofam/my-service",
  featured: false, // 3-Sec Life 상단 쇼케이스 노출 여부
  tags: ["태그1", "태그2"]
}
```

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: HTML5, Vanilla CSS3 (CSS Variables, Glassmorphism, Dark/Light Themes), Vanilla JavaScript (ES6+)
- **Hosting**: GitHub Pages (`https://woofam.github.io`)
- **Typography**: Pretendard, Outfit, JetBrains Mono
- **Dependencies**: 0 External Runtime Dependencies (경량 & 초고속 로딩)

---

## 📄 라이선스 (License)

This project is licensed under the [MIT License](LICENSE).
