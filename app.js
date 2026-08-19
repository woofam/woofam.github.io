/**
 * Woofam — Minimal Portal & 8-Bit Pixel Human Hurdle Runner Game
 */

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});

// ==========================================================================
// 8-Bit Pixel Human Runner Game Engine (Treadmill Hurdle Run)
// ==========================================================================
function initGame() {
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  const viewport = document.getElementById("gameViewport");
  const gameMsg = document.getElementById("gameMsg");
  const btnGamePlay = document.getElementById("btnGamePlay");
  const scoreDistEl = document.getElementById("scoreDist");
  const highScoreEl = document.getElementById("highScore");

  let gameState = "IDLE"; // IDLE, RUNNING, GAMEOVER
  let animId = null;
  let highScore = parseInt(localStorage.getItem("woofam_game_high") || "0", 10);
  if (highScoreEl) highScoreEl.textContent = `${highScore}m`;

  const GROUND_Y = 160;
  const PIXEL_SIZE = 2.4; // Pixel size for 8-bit rendering

  // --- Pixel Art Color Palette ---
  const C_SKIN = "#ffdbac";
  const C_HAIR = "#2d1a10";
  const C_SHIRT = "#2563eb"; // Woofam Blue
  const C_SHIRT_DARK = "#1d4ed8";
  const C_PANTS = "#334155";
  const C_SHOES = "#ffffff";
  const C_SHOE_SOLE = "#0f172a";

  // --- Pixel Human Sprites (14 width x 18 height matrix) ---
  // . = empty, H = hair, S = skin, T = shirt, t = dark shirt, P = pants, W = shoes, B = black
  const SPRITE_RUN_1 = [
    "....HHHHHH....",
    "...HHHHHHHH...",
    "...HHSSSSSH...",
    "...HHSSBSSH...",
    "....SSSSSS....",
    "....SSSSSS....",
    "...TTTTTTTT...",
    "..STTTTTTTTS..",
    "..STTTTTTTTS..",
    "..S.TTTTTT.S..",
    "....PPPPPP....",
    "....PP..PP....",
    "...PP....PP...",
    "...PP....PP...",
    "...PP.....PP..",
    "..WW......WW..",
    "..BB......BB..",
    ".............."
  ];

  const SPRITE_RUN_2 = [
    "....HHHHHH....",
    "...HHHHHHHH...",
    "...HHSSSSSH...",
    "...HHSSBSSH...",
    "....SSSSSS....",
    "....SSSSSS....",
    "...TTTTTTTT...",
    "...TTTTTTTT...",
    "...STTTTTTS...",
    "...S.TTTT.S...",
    "....PPPPPP....",
    "....PPPPPP....",
    ".....PPPP.....",
    ".....PPPP.....",
    ".....PPPP.....",
    ".....WWWW.....",
    ".....BBBB.....",
    ".............."
  ];

  const SPRITE_RUN_3 = [
    "....HHHHHH....",
    "...HHHHHHHH...",
    "...HHSSSSSH...",
    "...HHSSBSSH...",
    "....SSSSSS....",
    "....SSSSSS....",
    "...TTTTTTTT...",
    "..STTTTTTTTS..",
    "..STTTTTTTTS..",
    "..S.TTTTTT.S..",
    "....PPPPPP....",
    "....PP..PP....",
    "...PP....PP...",
    "..PP......PP..",
    "..PP......PP..",
    ".WW........WW.",
    ".BB........BB.",
    ".............."
  ];

  const SPRITE_JUMP = [
    "....HHHHHH....",
    "...HHHHHHHH...",
    "...HHSSSSSH...",
    "...HHSSBSSH...",
    "....SSSSSS....",
    "....SSSSSS....",
    "..STTTTTTTTS..",
    "..STTTTTTTTS..",
    "...TTTTTTTT...",
    "....PPPPPP....",
    "....PPPPPP....",
    "...PPPPPPPP...",
    "..WW......WW..",
    "..BB......BB..",
    "..............",
    "..............",
    "..............",
    ".............."
  ];

  // --- Runner Entity ---
  const runner = {
    x: 60,
    y: GROUND_Y - 18 * PIXEL_SIZE,
    width: 14 * PIXEL_SIZE,
    height: 18 * PIXEL_SIZE,
    vy: 0,
    gravity: 0.72,
    jumpPower: -12.8,
    isGrounded: true,
    animFrame: 0
  };

  let obstacles = [];
  let treadmillMarks = [];
  let score = 0;
  let speed = 5.2;
  let spawnCounter = 60;
  let particles = [];

  // Initialize treadmill marks
  for (let i = 0; i < 25; i++) {
    treadmillMarks.push(i * 36);
  }

  function resetGame() {
    runner.y = GROUND_Y - runner.height;
    runner.vy = 0;
    runner.isGrounded = true;
    runner.animFrame = 0;
    obstacles = [];
    particles = [];
    score = 0;
    speed = 5.5;
    spawnCounter = 50;
    if (scoreDistEl) scoreDistEl.textContent = "0m";
  }

  function startGame() {
    resetGame();
    gameState = "RUNNING";
    gameMsg.classList.add("hidden");
    viewport.focus();
    if (animId) cancelAnimationFrame(animId);
    gameLoop();
  }

  function jump() {
    if (gameState === "RUNNING") {
      if (runner.isGrounded) {
        runner.vy = runner.jumpPower;
        runner.isGrounded = false;
        // jump particles
        for (let i = 0; i < 6; i++) {
          particles.push({
            x: runner.x + runner.width / 2 + (Math.random() - 0.5) * 12,
            y: GROUND_Y - 2,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * -2,
            life: 18,
            color: "#60a5fa"
          });
        }
      }
    } else if (gameState === "IDLE" || gameState === "GAMEOVER") {
      startGame();
    }
  }

  function spawnObstacle() {
    const types = ["hurdle", "cone", "barrier"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    if (type === "hurdle") {
      obstacles.push({
        x: canvas.width + 20,
        y: GROUND_Y - 26,
        width: 18,
        height: 26,
        type: "hurdle"
      });
    } else if (type === "cone") {
      obstacles.push({
        x: canvas.width + 20,
        y: GROUND_Y - 20,
        width: 16,
        height: 20,
        type: "cone"
      });
    } else {
      obstacles.push({
        x: canvas.width + 20,
        y: GROUND_Y - 32,
        width: 26,
        height: 32,
        type: "barrier"
      });
    }
  }

  function update() {
    // Distance & Speed
    score += 0.18;
    const currentM = Math.floor(score);
    if (scoreDistEl) scoreDistEl.textContent = `${currentM}m`;
    speed = 5.5 + Math.min(6, currentM / 100);

    // Physics
    runner.vy += runner.gravity;
    runner.y += runner.vy;

    if (runner.y >= GROUND_Y - runner.height) {
      runner.y = GROUND_Y - runner.height;
      runner.vy = 0;
      runner.isGrounded = true;
    }

    runner.animFrame += 0.22;

    // Running particles
    if (runner.isGrounded && Math.random() < 0.25) {
      particles.push({
        x: runner.x + 4,
        y: GROUND_Y - 2,
        vx: -speed * 0.4 + (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 1.5,
        life: 14,
        color: "#94a3b8"
      });
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Treadmill Belt Marks
    for (let i = 0; i < treadmillMarks.length; i++) {
      treadmillMarks[i] -= speed;
      if (treadmillMarks[i] < -20) {
        treadmillMarks[i] = canvas.width + 10;
      }
    }

    // Spawn Obstacles
    spawnCounter--;
    if (spawnCounter <= 0) {
      spawnObstacle();
      spawnCounter = Math.floor(Math.random() * 40 + 55 - Math.min(25, speed * 2));
    }

    // Update & Check Obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.x -= speed;

      // Hitbox Collision (Tight & Fair)
      const padX = 4;
      const padY = 4;
      if (
        runner.x + padX < obs.x + obs.width &&
        runner.x + runner.width - padX > obs.x &&
        runner.y + padY < obs.y + obs.height &&
        runner.y + runner.height > obs.y + padY
      ) {
        handleGameOver();
        return;
      }

      if (obs.x + obs.width < -30) {
        obstacles.splice(i, 1);
      }
    }
  }

  function handleGameOver() {
    gameState = "GAMEOVER";
    const finalDist = Math.floor(score);
    if (finalDist > highScore) {
      highScore = finalDist;
      localStorage.setItem("woofam_game_high", highScore);
      if (highScoreEl) highScoreEl.textContent = `${highScore}m`;
    }

    gameMsg.classList.remove("hidden");
    gameMsg.innerHTML = `
      <div class="game-start-box">
        <span class="start-icon">💥</span>
        <h4 style="color: #ef4444;">GAME OVER</h4>
        <p>기록: <strong>${finalDist}m</strong> (최고 기록: ${highScore}m)</p>
        <button type="button" class="btn-game-play" onclick="window.startWoofamGame()">다시 달리기 (Space)</button>
      </div>
    `;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background (Dark Retro Runner)
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Treadmill Belt (Ground)
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

    // Treadmill Top Guide Line
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(0, GROUND_Y, canvas.width, 2);

    // Treadmill moving stripes
    ctx.fillStyle = "#334155";
    for (let mark of treadmillMarks) {
      ctx.fillRect(mark, GROUND_Y + 4, 18, canvas.height - GROUND_Y - 4);
    }

    // Draw Particles
    for (let p of particles) {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 3, 3);
    }

    // Draw Bitmap Pixel Human Runner
    drawPixelRunner(ctx, runner);

    // Draw Obstacles
    for (let obs of obstacles) {
      drawPixelObstacle(ctx, obs);
    }
  }

  function drawPixelRunner(c, r) {
    let sprite;
    if (!r.isGrounded) {
      sprite = SPRITE_JUMP;
    } else {
      const step = Math.floor(r.animFrame) % 3;
      if (step === 0) sprite = SPRITE_RUN_1;
      else if (step === 1) sprite = SPRITE_RUN_2;
      else sprite = SPRITE_RUN_3;
    }

    for (let row = 0; row < sprite.length; row++) {
      const line = sprite[row];
      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        if (ch === ".") continue;

        if (ch === "H") c.fillStyle = C_HAIR;
        else if (ch === "S") c.fillStyle = C_SKIN;
        else if (ch === "T") c.fillStyle = C_SHIRT;
        else if (ch === "t") c.fillStyle = C_SHIRT_DARK;
        else if (ch === "P") c.fillStyle = C_PANTS;
        else if (ch === "W") c.fillStyle = C_SHOES;
        else if (ch === "B") c.fillStyle = C_SHOE_SOLE;
        else c.fillStyle = "#ffffff";

        c.fillRect(r.x + col * PIXEL_SIZE, r.y + row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }

  function drawPixelObstacle(c, obs) {
    if (obs.type === "hurdle") {
      // 8-bit Athletic Red/White Hurdle
      c.fillStyle = "#ef4444";
      c.fillRect(obs.x, obs.y, obs.width, 6);
      c.fillStyle = "#ffffff";
      c.fillRect(obs.x + 5, obs.y, 4, 6);
      c.fillRect(obs.x + 13, obs.y, 4, 6);

      // Hurdle Legs
      c.fillStyle = "#cbd5e1";
      c.fillRect(obs.x + 2, obs.y + 6, 3, obs.height - 6);
      c.fillRect(obs.x + obs.width - 5, obs.y + 6, 3, obs.height - 6);
    } else if (obs.type === "cone") {
      // Traffic Cone
      c.fillStyle = "#f97316";
      c.fillRect(obs.x + 6, obs.y, 4, 6);
      c.fillStyle = "#ffffff";
      c.fillRect(obs.x + 4, obs.y + 6, 8, 4);
      c.fillStyle = "#f97316";
      c.fillRect(obs.x + 2, obs.y + 10, 12, 6);
      c.fillStyle = "#1e293b";
      c.fillRect(obs.x, obs.y + 16, obs.width, 4);
    } else {
      // Electronic Barrier
      c.fillStyle = "#f59e0b";
      c.fillRect(obs.x, obs.y, obs.width, 8);
      c.fillStyle = "#ffffff";
      c.fillRect(obs.x + 6, obs.y + 2, obs.width - 12, 4);
      c.fillStyle = "#64748b";
      c.fillRect(obs.x + 3, obs.y + 8, 4, obs.height - 8);
      c.fillRect(obs.x + obs.width - 7, obs.y + 8, 4, obs.height - 8);
    }
  }

  function gameLoop() {
    if (gameState !== "RUNNING") return;
    update();
    draw();
    animId = requestAnimationFrame(gameLoop);
  }

  // Draw initial idle screen
  draw();

  // Global expose for start button
  window.startWoofamGame = startGame;

  // Event Listeners
  btnGamePlay?.addEventListener("click", startGame);

  viewport?.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    jump();
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      // Prevent browser scrolling with spacebar when focused or playing
      const isInput = document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA");
      if (!isInput) {
        e.preventDefault();
        jump();
      }
    }
  });
}
