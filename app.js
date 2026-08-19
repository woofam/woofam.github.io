/**
 * Woofam Universe & Services Directory - Core Logic & Easter Egg Game
 */

// --- 1. Service Dataset Definition ---
const SERVICES_DATA = [
  {
    id: "3sec-value",
    name: "3초 가성비 (3-Sec Value)",
    shortName: "3초 가성비",
    category: "3sec",
    categoryLabel: "3-Sec Life",
    status: "LIVE",
    tagline: "단품 vs 묶음 3초 소비 공식",
    description: "다이소, 노브랜드, 쿠팡, 트레이더스 등 온·오프라인 유통 채널별 최적 구매 수량과 손익분기점(BEP)을 3초 만에 제시하는 낭비 제로 스마트 쇼핑 가이드.",
    icon: "⚡",
    url: "https://woofam.github.io/3sec-value/",
    github: "https://github.com/woofam/3sec-value",
    featured: true,
    tags: ["소비공식", "최저가비교", "손익분기", "자취생필품", "스마트쇼핑"]
  },
  {
    id: "3sec-recipe",
    name: "3초 레시피 (3-Sec Recipe)",
    shortName: "3초 레시피",
    category: "3sec",
    categoryLabel: "3-Sec Life",
    status: "LIVE",
    tagline: "3초 만에 고르는 한 끼 공식",
    description: "냉장고 속 재료와 현재 상황을 바탕으로 고민 없이 3초 만에 메뉴를 결정해 주는 초간단 원팬 & 자취 요리 레시피 큐레이션 서비스.",
    icon: "🍳",
    url: "https://woofam.github.io/3sec/",
    github: "https://github.com/woofam/3sec",
    featured: true,
    tags: ["초간단요리", "자취요리", "재료별추천", "3초결정", "식단고민해결"]
  },
  {
    id: "3sec-routine",
    name: "3초 루틴 (3-Sec Routine)",
    shortName: "3초 루틴",
    category: "3sec",
    categoryLabel: "3-Sec Life",
    status: "COMING_SOON",
    tagline: "미루기 방지 3초 카운트다운 타이머",
    description: "생각이 많아 시작하지 못할 때 5-4-3-2-1 즉각 실행 법칙을 적용하여 집중력을 극대화하는 미니멀 생산성 루틴 도구.",
    icon: "⏱️",
    url: "#",
    github: "https://github.com/woofam/3sec",
    featured: false,
    tags: ["생산성", "집중타이머", "루틴관리", "행동과학"]
  },
  {
    id: "unit-converter",
    name: "단위 환산 매트릭스 (Unit Matrix)",
    shortName: "단위 환산",
    category: "utility",
    categoryLabel: "Utilities",
    status: "BETA",
    tagline: "100g/10ml당 실질 단가 즉시 환산",
    description: "복잡한 포장 단위와 규격을 일관된 100g/10ml/개당 가격으로 즉각 비교 환산해 주는 쇼퍼용 스마트 유틸리티.",
    icon: "📐",
    url: "https://woofam.github.io/3sec-value/",
    github: "https://github.com/woofam",
    featured: false,
    tags: ["단위환산", "단가계산", "장보기도구", "유틸리티"]
  },
  {
    id: "regex-studio",
    name: "정규식 치트 스튜디오 (Regex Studio)",
    shortName: "Regex Studio",
    category: "dev",
    categoryLabel: "Dev Tools",
    status: "LIVE",
    tagline: "자주 쓰는 정규식 패턴 즉시 검증",
    description: "이메일, 전화번호, 비밀번호, URL 등 자주 쓰이는 정규식 패턴을 원클릭으로 테스트하고 복사하는 개발자용 경량 툴킷.",
    icon: "🪄",
    url: "https://github.com/woofam",
    github: "https://github.com/woofam",
    featured: false,
    tags: ["개발도구", "정규표현식", "치트시트", "웹유틸리티"]
  },
  {
    id: "quick-memo",
    name: "휘발성 로컬 메모 (Instant Pad)",
    shortName: "Instant Pad",
    category: "life",
    categoryLabel: "Daily Tools",
    status: "LIVE",
    tagline: "서버 저장 없는 100% 로컬 프라이빗 메모장",
    description: "브라우저 로컬 스토리지에만 안전하게 보관되는 초경량 마크다운 지원 임시 메모 및 스크래치패드.",
    icon: "📝",
    url: "https://github.com/woofam",
    github: "https://github.com/woofam",
    featured: false,
    tags: ["로컬메모", "마크다운", "프라이버시", "스크래치패드"]
  }
];

// --- 2. State & DOM References ---
let currentCategory = "all";
let searchQuery = "";

const themeToggleBtn = document.getElementById("themeToggleBtn");
const searchInput = document.getElementById("searchInput");
const searchClearBtn = document.getElementById("searchClearBtn");
const filterPills = document.querySelectorAll(".pill-btn");
const featuredContainer = document.getElementById("featuredCardsContainer");
const servicesGrid = document.getElementById("servicesGrid");
const toastContainer = document.getElementById("toastContainer");

// --- 3. Theme Toggle & Persistence ---
function initTheme() {
  const savedTheme = localStorage.getItem("woofam_theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    // Default to dark theme
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = prefersDark ? "dark" : "dark";
    document.documentElement.setAttribute("data-theme", initialTheme);
    localStorage.setItem("woofam_theme", initialTheme);
  }
  updateThemeIcon();
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("woofam_theme", newTheme);
  updateThemeIcon();
  showToast(`☀️/🌙 ${newTheme === "dark" ? "다크" : "라이트"} 모드로 전환되었습니다.`);
}

function updateThemeIcon() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (!themeToggleBtn) return;
  themeToggleBtn.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
  themeToggleBtn.innerHTML = isDark
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
}

// --- 4. Render Functions ---
function getBadgeHtml(status) {
  if (status === "LIVE") {
    return `<span class="badge badge-live"><span class="badge-dot"></span>LIVE</span>`;
  } else if (status === "BETA") {
    return `<span class="badge badge-beta"><span class="badge-dot"></span>BETA</span>`;
  } else {
    return `<span class="badge badge-soon"><span class="badge-dot"></span>COMING SOON</span>`;
  }
}

function renderFeatured() {
  if (!featuredContainer) return;
  const featuredServices = SERVICES_DATA.filter((s) => s.featured);

  featuredContainer.innerHTML = featuredServices
    .map(
      (item) => `
      <article class="featured-card" id="featured-${item.id}">
        <div>
          <div class="card-top">
            <div class="card-icon">${item.icon}</div>
            ${getBadgeHtml(item.status)}
          </div>
          <h3 class="card-title font-display">${item.name}</h3>
          <p class="card-tagline">"${item.tagline}"</p>
          <p class="card-desc">${item.description}</p>
          <div class="card-tags">
            ${item.tags.map((tag) => `<span class="tag">#${tag}</span>`).join("")}
          </div>
        </div>
        <div class="card-actions">
          <a href="${item.url}" class="btn-primary" target="_blank" rel="noopener noreferrer" id="btn-launch-${item.id}">
            <span>서비스 바로가기</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
          <a href="${item.github}" class="btn-secondary" target="_blank" rel="noopener noreferrer" title="GitHub Repository">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>GitHub</span>
          </a>
          <button type="button" class="share-btn" onclick="copyServiceUrl('${item.url}', '${item.name}')" title="URL 복사">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </button>
        </div>
      </article>
    `
    )
    .join("");
}

function renderServicesGrid() {
  if (!servicesGrid) return;

  const filtered = SERVICES_DATA.filter((service) => {
    const matchesCategory = currentCategory === "all" || service.category === currentCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      service.name.toLowerCase().includes(query) ||
      service.tagline.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.tags.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    servicesGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>일치하는 서비스가 없습니다</h3>
        <p style="margin-top: 6px; font-size: 0.9rem;">"${searchQuery}" 검색어에 맞는 서비스가 없습니다. 다른 검색어를 입력해 보세요.</p>
      </div>
    `;
    return;
  }

  servicesGrid.innerHTML = filtered
    .map(
      (item) => `
      <article class="service-card" id="card-${item.id}">
        <div>
          <div class="service-header">
            <div class="service-icon">${item.icon}</div>
            ${getBadgeHtml(item.status)}
          </div>
          <h3 class="service-name font-display">${item.name}</h3>
          <p class="service-summary">${item.description}</p>
          <div class="card-tags">
            ${item.tags.slice(0, 3).map((tag) => `<span class="tag">#${tag}</span>`).join("")}
          </div>
        </div>
        <div class="service-footer">
          <a href="${item.url}" class="service-link" ${item.url !== "#" ? 'target="_blank" rel="noopener noreferrer"' : ""}>
            <span>${item.status === "COMING_SOON" ? "출시 예정" : "바로가기"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <button type="button" class="share-btn" onclick="copyServiceUrl('${item.url}', '${item.name}')" title="링크 복사">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      </article>
    `
    )
    .join("");
}

// --- 5. Interactive Utilities ---
function copyServiceUrl(url, name) {
  if (url === "#") {
    showToast(`ℹ️ ${name} 서비스는 곧 출시될 예정입니다.`);
    return;
  }
  navigator.clipboard
    .writeText(url)
    .then(() => {
      showToast(`✨ ${name} 링크가 복사되었습니다!`);
    })
    .catch(() => {
      showToast(`🔗 링크: ${url}`);
    });
}

function showToast(message) {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2800);
}

// ==========================================================================
// 6. Easter Egg: 3-Sec Hurdle Runner (무한 런닝머신 점프 게임 엔진)
// ==========================================================================
const gameModal = document.getElementById("gameModal");
const easterEggBtn = document.getElementById("easterEggBtn");
const closeGameBtn = document.getElementById("closeGameBtn");
const startGameBtn = document.getElementById("startGameBtn");
const gameCanvas = document.getElementById("gameCanvas");
const gameOverlayMsg = document.getElementById("gameOverlayMsg");
const gameHighScoreEl = document.getElementById("gameHighScore");
const gameSpeedDisplayEl = document.getElementById("gameSpeedDisplay");

let ctx = null;
let gameAnimId = null;
let gameState = "IDLE"; // IDLE, RUNNING, GAMEOVER
let highScore = parseInt(localStorage.getItem("woofam_runner_highscore") || "0", 10);

// Game Entities & Constants
const GROUND_Y = 210;
let runner = {
  x: 70,
  y: GROUND_Y - 40,
  width: 32,
  height: 40,
  vy: 0,
  gravity: 0.85,
  jumpPower: -14.5,
  isGrounded: true,
  runFrame: 0,
  particles: []
};

let obstacles = [];
let treadmillLines = [];
let gameScore = 0;
let gameSpeed = 5.5;
let spawnTimer = 0;
let celebrationText = "";
let celebrationTimer = 0;

function openEasterEggGame() {
  if (!gameModal) return;
  gameModal.classList.add("active");
  gameModal.setAttribute("aria-hidden", "false");
  if (!ctx && gameCanvas) {
    ctx = gameCanvas.getContext("2d");
  }
  updateHighScoreDisplay();
  resetGame();
  drawIdleScreen();
}

function closeEasterEggGame() {
  if (!gameModal) return;
  gameModal.classList.remove("active");
  gameModal.setAttribute("aria-hidden", "true");
  if (gameAnimId) {
    cancelAnimationFrame(gameAnimId);
    gameAnimId = null;
  }
  gameState = "IDLE";
}

function updateHighScoreDisplay() {
  if (gameHighScoreEl) {
    gameHighScoreEl.textContent = `${highScore}m`;
  }
}

function resetGame() {
  runner.y = GROUND_Y - runner.height;
  runner.vy = 0;
  runner.isGrounded = true;
  runner.particles = [];
  obstacles = [];
  gameScore = 0;
  gameSpeed = 6;
  spawnTimer = 50;
  celebrationText = "";
  celebrationTimer = 0;

  // Initialize treadmill stripes
  treadmillLines = [];
  for (let i = 0; i < 20; i++) {
    treadmillLines.push({ x: i * 40 });
  }
}

function startRunnerGame() {
  resetGame();
  gameState = "RUNNING";
  if (gameOverlayMsg) gameOverlayMsg.classList.add("hidden");
  if (gameAnimId) cancelAnimationFrame(gameAnimId);
  lastTime = performance.now();
  loopGame();
}

function jump() {
  if (gameState === "RUNNING") {
    if (runner.isGrounded) {
      runner.vy = runner.jumpPower;
      runner.isGrounded = false;
      // Add jump burst particles
      for (let i = 0; i < 8; i++) {
        runner.particles.push({
          x: runner.x + runner.width / 2,
          y: runner.y + runner.height,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * -3,
          size: Math.random() * 4 + 2,
          color: "#38bdf8",
          alpha: 1
        });
      }
    }
  } else if (gameState === "GAMEOVER" || gameState === "IDLE") {
    startRunnerGame();
  }
}

function spawnObstacle() {
  const types = ["hurdle", "laser", "double-hurdle"];
  const type = types[Math.floor(Math.random() * types.length)];
  
  if (type === "hurdle") {
    obstacles.push({
      x: gameCanvas.width + 20,
      y: GROUND_Y - 32,
      width: 22,
      height: 32,
      type: "hurdle"
    });
  } else if (type === "laser") {
    obstacles.push({
      x: gameCanvas.width + 20,
      y: GROUND_Y - 26,
      width: 16,
      height: 26,
      type: "laser"
    });
  } else if (type === "double-hurdle") {
    obstacles.push({
      x: gameCanvas.width + 20,
      y: GROUND_Y - 36,
      width: 38,
      height: 36,
      type: "double-hurdle"
    });
  }
}

let lastTime = 0;
function loopGame() {
  if (gameState !== "RUNNING") return;

  updateGame();
  drawGame();

  gameAnimId = requestAnimationFrame(loopGame);
}

function updateGame() {
  gameScore += 0.2;
  const currentDist = Math.floor(gameScore);

  // Speed up dynamically
  gameSpeed = 6 + Math.min(6, currentDist / 120);
  if (gameSpeedDisplayEl) {
    gameSpeedDisplayEl.textContent = `${(gameSpeed / 6).toFixed(1)}x`;
  }

  // 3-sec milestones
  if (currentDist === 30) {
    celebrationText = "⚡ 3초 돌파! 쾌속 생존 공식 발동!";
    celebrationTimer = 90;
  } else if (currentDist === 100) {
    celebrationText = "🔥 100m 돌파! 갓생 러너!";
    celebrationTimer = 90;
  } else if (currentDist === 300) {
    celebrationText = "👑 300m 레전드 달성!";
    celebrationTimer = 120;
  }

  if (celebrationTimer > 0) celebrationTimer--;

  // Runner Physics
  runner.vy += runner.gravity;
  runner.y += runner.vy;

  if (runner.y >= GROUND_Y - runner.height) {
    runner.y = GROUND_Y - runner.height;
    runner.vy = 0;
    runner.isGrounded = true;
  }

  runner.runFrame += 0.25;

  // Running particles
  if (runner.isGrounded && Math.random() < 0.3) {
    runner.particles.push({
      x: runner.x,
      y: runner.y + runner.height - 2,
      vx: -gameSpeed * 0.5 + (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1.5,
      color: "#818cf8",
      alpha: 0.8
    });
  }

  // Update particles
  for (let i = runner.particles.length - 1; i >= 0; i--) {
    const p = runner.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.04;
    if (p.alpha <= 0) {
      runner.particles.splice(i, 1);
    }
  }

  // Treadmill Lines Animation
  for (let line of treadmillLines) {
    line.x -= gameSpeed;
    if (line.x < -20) {
      line.x = gameCanvas.width + 20;
    }
  }

  // Spawn Obstacles
  spawnTimer--;
  if (spawnTimer <= 0) {
    spawnObstacle();
    // Random interval based on speed
    spawnTimer = Math.floor(Math.random() * 45 + 50 - Math.min(25, gameSpeed * 2));
  }

  // Update Obstacles & Collision Check
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.x -= gameSpeed;

    // Hitbox collision (with slight inner margin for forgiving feel)
    const margin = 5;
    if (
      runner.x + margin < obs.x + obs.width &&
      runner.x + runner.width - margin > obs.x &&
      runner.y + margin < obs.y + obs.height &&
      runner.y + runner.height > obs.y + margin
    ) {
      gameOver();
      return;
    }

    if (obs.x + obs.width < -50) {
      obstacles.splice(i, 1);
    }
  }
}

function gameOver() {
  gameState = "GAMEOVER";
  const finalDist = Math.floor(gameScore);
  if (finalDist > highScore) {
    highScore = finalDist;
    localStorage.setItem("woofam_runner_highscore", highScore);
    updateHighScoreDisplay();
    showToast(`🏆 신기록 달성! ${highScore}m`);
  }

  if (gameOverlayMsg) {
    gameOverlayMsg.classList.remove("hidden");
    gameOverlayMsg.innerHTML = `
      <div class="game-start-card">
        <div class="game-card-icon">💥</div>
        <h3 style="color: #ef4444;">GAME OVER</h3>
        <p class="game-instruction">기록: <strong>${finalDist}m</strong> (최고 기록: ${highScore}m)</p>
        <button type="button" class="btn-start-game" onclick="startRunnerGame()">다시 도전하기 (Space / 탭)</button>
      </div>
    `;
  }
}

function drawGame() {
  if (!ctx) return;
  const w = gameCanvas.width;
  const h = gameCanvas.height;

  // Clear Canvas (Dark Arcade Theme)
  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, w, h);

  // Background Grid Lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, GROUND_Y);
    ctx.stroke();
  }

  // Treadmill Ground Belt
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, GROUND_Y, w, h - GROUND_Y);

  // Treadmill Neon Top Edge
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, "#6366f1");
  grad.addColorStop(0.5, "#38bdf8");
  grad.addColorStop(1, "#34d399");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(w, GROUND_Y);
  ctx.stroke();

  // Treadmill moving stripes
  ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
  ctx.lineWidth = 4;
  for (let line of treadmillLines) {
    ctx.beginPath();
    ctx.moveTo(line.x, GROUND_Y + 4);
    ctx.lineTo(line.x - 15, h);
    ctx.stroke();
  }

  // Draw Particles
  for (let p of runner.particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // Draw Runner (Cyber Neon Mascot with animated legs)
  drawRunner(ctx, runner);

  // Draw Obstacles
  for (let obs of obstacles) {
    drawObstacle(ctx, obs);
  }

  // In-Game HUD: Score & Speed
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 18px Outfit, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`⚡ ${Math.floor(gameScore)}m`, 20, 36);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "14px JetBrains Mono, monospace";
  ctx.fillText(`HI: ${highScore}m`, 110, 36);

  // Celebration Notification
  if (celebrationTimer > 0 && celebrationText) {
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 16px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(celebrationText, w / 2, 50);
  }
}

function drawRunner(c, r) {
  const isJumping = !r.isGrounded;

  // Glow aura
  c.shadowColor = "#818cf8";
  c.shadowBlur = 12;

  // Body (Modern Stylized Cyber Capsule)
  c.fillStyle = "#818cf8";
  c.beginPath();
  c.roundRect(r.x, r.y, r.width, r.height - 12, 8);
  c.fill();

  // Lightning Eye Visor
  c.fillStyle = "#38bdf8";
  c.fillRect(r.x + 14, r.y + 8, 14, 6);

  // 3-Sec Lightning Logo on Body
  c.fillStyle = "#fbbf24";
  c.font = "bold 12px Outfit";
  c.fillText("⚡", r.x + 8, r.y + 22);

  c.shadowBlur = 0; // Reset shadow

  // Animated Running Legs
  c.strokeStyle = "#38bdf8";
  c.lineWidth = 4;
  c.lineCap = "round";

  const legY = r.y + r.height - 12;
  if (isJumping) {
    // Tucked legs during jump
    c.beginPath();
    c.moveTo(r.x + 8, legY);
    c.lineTo(r.x + 4, legY + 8);
    c.stroke();

    c.beginPath();
    c.moveTo(r.x + 22, legY);
    c.lineTo(r.x + 26, legY + 8);
    c.stroke();
  } else {
    // Running stride
    const cycle = Math.sin(r.runFrame) * 10;
    c.beginPath();
    c.moveTo(r.x + 10, legY);
    c.lineTo(r.x + 10 + cycle, legY + 12);
    c.stroke();

    c.beginPath();
    c.moveTo(r.x + 20, legY);
    c.lineTo(r.x + 20 - cycle, legY + 12);
    c.stroke();
  }
}

function drawObstacle(c, obs) {
  c.shadowColor = "#ef4444";
  c.shadowBlur = 10;

  if (obs.type === "hurdle") {
    // Athletic Neon Hurdle
    c.fillStyle = "#ef4444";
    c.fillRect(obs.x + 2, obs.y, obs.width - 4, 6); // Top bar
    c.fillStyle = "#ffffff";
    c.fillRect(obs.x + 7, obs.y, 4, 6); // Stripe

    // Posts
    c.fillStyle = "#94a3b8";
    c.fillRect(obs.x + 2, obs.y + 6, 4, obs.height - 6);
    c.fillRect(obs.x + obs.width - 6, obs.y + 6, 4, obs.height - 6);
  } else if (obs.type === "laser") {
    // Laser Energy Barrier
    c.fillStyle = "#f59e0b";
    c.fillRect(obs.x, obs.y, obs.width, obs.height);
    c.fillStyle = "#ffffff";
    c.fillRect(obs.x + 4, obs.y + 4, obs.width - 8, obs.height - 8);
  } else if (obs.type === "double-hurdle") {
    // Double Hurdle Combination
    c.fillStyle = "#ec4899";
    c.fillRect(obs.x, obs.y, obs.width, 8);
    c.fillStyle = "#ffffff";
    c.fillRect(obs.x + 12, obs.y, 6, 8);
    c.fillStyle = "#94a3b8";
    c.fillRect(obs.x + 3, obs.y + 8, 4, obs.height - 8);
    c.fillRect(obs.x + obs.width - 7, obs.y + 8, 4, obs.height - 8);
  }

  c.shadowBlur = 0;
}

function drawIdleScreen() {
  if (!ctx) return;
  const w = gameCanvas.width;
  const h = gameCanvas.height;

  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, w, h);

  // Ground
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, GROUND_Y, w, h - GROUND_Y);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(w, GROUND_Y);
  ctx.stroke();

  // Draw idle runner
  drawRunner(ctx, runner);
}

// --- 7. Event Listeners Setup ---
function setupEventListeners() {
  // Theme toggle
  themeToggleBtn?.addEventListener("click", toggleTheme);

  // Search input
  searchInput?.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    if (searchClearBtn) {
      searchClearBtn.style.display = searchQuery ? "inline-flex" : "none";
    }
    renderServicesGrid();
  });

  // Search clear
  searchClearBtn?.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    searchClearBtn.style.display = "none";
    searchInput.focus();
    renderServicesGrid();
  });

  // Filter pills
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.getAttribute("data-category") || "all";
      renderServicesGrid();
    });
  });

  // Easter Egg Game Triggers
  easterEggBtn?.addEventListener("click", openEasterEggGame);
  closeGameBtn?.addEventListener("click", closeEasterEggGame);
  startGameBtn?.addEventListener("click", startRunnerGame);

  // Logo double-click easter egg
  const brandLogo = document.getElementById("brandLogo");
  brandLogo?.addEventListener("dblclick", (e) => {
    e.preventDefault();
    openEasterEggGame();
    showToast("🎉 이스터에그 발견! 3초 허들 달리기 게임을 시작합니다.");
  });

  // Keyboard controls for game
  window.addEventListener("keydown", (e) => {
    // If modal is active
    if (gameModal?.classList.contains("active")) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      } else if (e.code === "Escape") {
        closeEasterEggGame();
      } else if (e.code === "KeyR" && gameState === "GAMEOVER") {
        startRunnerGame();
      }
    } else {
      // Shortcut 'G' or 'g' when not in search input
      if ((e.key === "g" || e.key === "G") && document.activeElement !== searchInput) {
        openEasterEggGame();
      }
    }
  });

  // Touch / Click on canvas to jump
  gameCanvas?.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    jump();
  });

  // Close modal when clicking outside
  gameModal?.addEventListener("click", (e) => {
    if (e.target === gameModal) {
      closeEasterEggGame();
    }
  });
}

// Global expose for inline handler
window.openEasterEggGame = openEasterEggGame;
window.copyServiceUrl = copyServiceUrl;
window.startRunnerGame = startRunnerGame;

// --- 8. Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderFeatured();
  renderServicesGrid();
  setupEventListeners();
});
