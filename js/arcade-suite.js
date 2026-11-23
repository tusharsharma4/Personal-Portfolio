/**
 * ====================================================================
 * RETRO ARCADE SUITE FOR CRT TV PORTFOLIO
 * Integrated from portfolio-main arcade games
 * Powered by 240x180 logical canvas, high-DPI scaling, Web Audio synthesizer,
 * and adaptive CRT phosphor theme styling.
 * ====================================================================
 */

(function () {
  'use strict';

  // --- PROCEDURAL WEB AUDIO SYNTHESIZER ---
  const NOTES = [587.33, 659.25, 739.99, 880, 987.77, 1174.66, 1318.51, 1479.98, 1760];

  function playArcadeFx(name, options) {
    options = options || {};
    try {
      const getCtx = window.getAudioContext;
      const actx = getCtx ? getCtx() : null;
      if (!actx || (window.soundEnabled !== undefined && !window.soundEnabled)) return;
      if (actx.state === 'suspended') actx.resume();

      const t = actx.currentTime + (options.delay || 0);

      // Stereo panning if x is provided (0..240)
      let panNode = null;
      if (options.x !== undefined && actx.createStereoPanner) {
        panNode = actx.createStereoPanner();
        const p = Math.max(-1, Math.min(1, (options.x / 240) * 2 - 1));
        panNode.pan.setValueAtTime(p, t);
        panNode.connect(actx.destination);
      }
      const dest = panNode || actx.destination;

      if (name === 'tick' || name === 'tap') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'triangle';
        const freq = name === 'tick' ? 880 : 380;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.03);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.035);
      } else if (name === 'pop') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(680, t + 0.07);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.075);
      } else if (name === 'key') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200 + Math.random() * 300, t);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.045);
      } else if (name === 'bounce') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(180, t + 0.05);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.055);
      } else if (name === 'break') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.13);
      } else if (name === 'note') {
        const idx = options.index !== undefined ? options.index : 0;
        const freq = NOTES[idx % NOTES.length] || 440;
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.23);
      } else if (name === 'success') {
        [587.33, 880].forEach((f, i) => {
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          const st = t + i * 0.09;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, st);
          gain.gain.setValueAtTime(0.1, st);
          gain.gain.exponentialRampToValueAtTime(0.001, st + 0.22);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(st);
          osc.stop(st + 0.23);
        });
      } else if (name === 'error') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.linearRampToValueAtTime(90, t + 0.16);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.17);
      } else if (name === 'gameOver') {
        [340, 280, 220, 160].forEach((f, i) => {
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          const st = t + i * 0.11;
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, st);
          gain.gain.setValueAtTime(0.1, st);
          gain.gain.exponentialRampToValueAtTime(0.001, st + 0.18);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(st);
          osc.stop(st + 0.19);
        });
      } else {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.05);
      }
    } catch (e) {
      // AudioContext policy suppression safe catch
    }
  }

  // --- CRT THEME TOKENS ADAPTER ---
  function getCrtColors() {
    const root = document.body || document.documentElement;
    const style = getComputedStyle(root);
    const phosphorMain = style.getPropertyValue('--phosphor-main').trim() || '#ffb000';
    const phosphorDim = style.getPropertyValue('--phosphor-dim').trim() || 'rgba(255, 176, 0, 0.35)';
    const phosphorSec = style.getPropertyValue('--phosphor-secondary').trim() || '#ffdc73';

    return {
      ink: phosphorMain,
      muted: phosphorDim,
      line: 'rgba(255, 255, 255, 0.22)',
      paper: '#060806',
      signal: phosphorSec || phosphorMain,
      accent: '#ff3355',
      amber: '#ffb000',
      green: '#4aff6b',
      teal: '#68f0ff',
      blue: '#38bdf8',
      violet: '#ff77e0',
    };
  }

  // --- HOST ADAPTER (contract.ts + host.ts implementation) ---
  function createArcadeHost(canvas, gameFn, options) {
    options = options || {};
    const W = options.width || 240;
    const H = options.height || 180;
    const g = canvas.getContext('2d');

    const heldKeys = new Set();
    const keyListeners = [];
    const pointerListeners = [];
    let frameListener = null;
    let themeListeners = [];
    let rafId = 0;
    let running = true;
    let paused = false;

    function togglePause() {
      paused = !paused;
      if (!paused) {
        last = performance.now();
      }
      return paused;
    }

    // High-DPI Auto-Scaling
    let scale = 1;
    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const cssW = rect.width || 320;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(((cssW * H) / W) * dpr);
      scale = canvas.width / W;
      g.setTransform(scale, 0, 0, scale, 0, 0);
      if (frameListener) frameListener(0, performance.now());
    }
    resize();
    window.addEventListener('resize', resize);

    // Key mapping
    function mapKey(code) {
      if (code === 'ArrowUp' || code === 'KeyW') return 'up';
      if (code === 'ArrowDown' || code === 'KeyS') return 'down';
      if (code === 'ArrowLeft' || code === 'KeyA') return 'left';
      if (code === 'ArrowRight' || code === 'KeyD') return 'right';
      if (code === 'Space' || code === 'Enter') return 'action';
      return null;
    }

    function handleKeyDown(e) {
      if (!running) return;
      if (e.code === 'KeyP') {
        togglePause();
        e.preventDefault();
        return;
      }
      if (paused) {
        togglePause();
        return;
      }
      const k = mapKey(e.code);
      if (k) {
        heldKeys.add(k);
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
          e.preventDefault();
        }
      }
      for (let i = 0; i < keyListeners.length; i++) {
        keyListeners[i](k, true, e);
      }
    }

    function handleKeyUp(e) {
      if (!running) return;
      const k = mapKey(e.code);
      if (k) heldKeys.delete(k);
      for (let i = 0; i < keyListeners.length; i++) {
        keyListeners[i](k, false, e);
      }
    }

    function handlePointer(e, type) {
      if (!running) return;
      if (paused) {
        if (type === 'down') togglePause();
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * W;
      const y = ((e.clientY - rect.top) / rect.height) * H;
      for (let i = 0; i < pointerListeners.length; i++) {
        pointerListeners[i](type, x, y, e);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('pointerdown', (e) => handlePointer(e, 'down'));
    canvas.addEventListener('pointermove', (e) => handlePointer(e, 'move'));
    window.addEventListener('pointerup', (e) => handlePointer(e, 'up'));

    // Animation Frame Loop
    let last = performance.now();
    function loop(now) {
      if (!running) return;
      if (paused) {
        g.setTransform(scale, 0, 0, scale, 0, 0);
        g.fillStyle = "rgba(0, 0, 0, 0.72)";
        g.fillRect(0, 0, W, H);
        g.strokeStyle = colors.amber || "#ffdc73";
        g.lineWidth = 1;
        g.strokeRect(W / 2 - 65, H / 2 - 20, 130, 40);
        g.fillStyle = colors.amber || "#ffdc73";
        g.font = `bold 12px ${ctx.fonts.mono}`;
        g.textAlign = "center";
        g.fillText("⏸ GAME PAUSED", W / 2, H / 2 - 4);
        g.font = `8px ${ctx.fonts.mono}`;
        g.fillStyle = "#ffffff";
        g.fillText("CLICK SCREEN OR RESUME", W / 2, H / 2 + 10);
        rafId = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min(100, now - last);
      last = now;
      if (frameListener) {
        g.setTransform(scale, 0, 0, scale, 0, 0);
        frameListener(dt, now);
      }
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    const colors = getCrtColors();

    const ctx = {
      canvas,
      g,
      width: W,
      height: H,
      colors,
      fonts: {
        mono: '"Courier New", Courier, monospace',
        pixel: '"VT323", "Courier New", monospace',
        serif: '"Georgia", serif',
      },
      reduced: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      onTheme: (fn) => themeListeners.push(fn),
      frame: (fn) => { frameListener = fn; },
      onKey: (fn) => keyListeners.push(fn),
      held: (key) => heldKeys.has(key),
      onPointer: (fn) => pointerListeners.push(fn),
      play: (sound, opts) => playArcadeFx(sound, opts),
      score: (val, txt) => {
        if (options.onScore) options.onScore(val, txt);
      },
      over: (summary) => {
        if (options.onOver) options.onOver(summary);
      },
      announce: (msg) => {
        if (options.onAnnounce) options.onAnnounce(msg);
      },
    };

    const stopGame = gameFn(ctx);

    return {
      stop: () => {
        running = false;
        if (stopGame && typeof stopGame === 'function') stopGame();
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      },
      togglePause,
      isPaused: () => paused,
      setPaused: (val) => {
        if (paused !== val) togglePause();
      },
      heldKeys,
    };
  }

  // --- GAME 1: PONG (Ruler & Rivet / Robo Soccer '89) ---
  const pongGame = (ctx) => {
    const { g, colors, width: W, height: H } = ctx;
    const WIN = 5;
    const PH = 36;
    const PW = 6;
    const BALL = 3.5;

    const you = { y: H / 2, score: 0 };
    const cpu = { y: H / 2, score: 0, aim: 0 };
    const ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, speed: 0 };
    let serve = 900;
    let shake = 0;
    let pointer = null;
    let serveTo = 1;

    const launch = (toward) => {
      // Dynamic non-zero angle, prevents flat horizontal infinite loop
      const angle = (Math.random() * 0.8 - 0.4) * Math.PI * 0.5;
      ball.speed = ctx.reduced ? 100 : 120;
      ball.x = W / 2;
      ball.y = H / 2;
      ball.vx = Math.cos(angle) * ball.speed * toward;
      ball.vy = Math.sin(angle) * ball.speed;
    };

    const point = (yours) => {
      if (yours) you.score++;
      else cpu.score++;
      ctx.play(yours ? "success" : "error", { x: yours ? W : 0 });
      ctx.score(you.score, `YOU: ${you.score} | CPU: ${cpu.score}`);
      shake = 1;
      ball.x = W / 2;
      ball.y = H / 2;
      ball.vx = 0;
      ball.vy = 0;

      if (you.score === WIN || cpu.score === WIN) {
        matchOver = true;
        ctx.play("gameOver");
        return ctx.over(you.score === WIN ? `YOU WIN! ${you.score} to ${cpu.score}` : `CPU WINS! ${cpu.score} to ${you.score}`);
      }
      serve = 700;
      serveTo = yours ? 1 : -1;
    };

    const resetMatch = () => {
      you.score = 0;
      cpu.score = 0;
      matchOver = false;
      serve = 700;
      serveTo = 1;
      ball.x = W / 2;
      ball.y = H / 2;
      ball.vx = 0;
      ball.vy = 0;
      ctx.score(0, `YOU: 0 | CPU: 0`);
      launch(1);
    };

    const hit = (paddleY, side) => {
      const offset = Math.max(-1, Math.min(1, (ball.y - paddleY) / (PH / 2)));
      // Capped speed to prevent infinite acceleration bug
      ball.speed = Math.min(ball.speed * 1.06, ctx.reduced ? 170 : 230);
      let angle = offset * (Math.PI / 3.4);
      // Ensure minimum angle to prevent straight flat line
      if (Math.abs(angle) < 0.18) angle = (offset >= 0 ? 0.18 : -0.18);
      ball.vx = Math.cos(angle) * ball.speed * side;
      ball.vy = Math.sin(angle) * ball.speed;
      ctx.play("bounce", { x: ball.x });
      // The CPU aims at a slightly wrong spot each rally; sharper shots fool it more
      cpu.aim = (Math.random() - 0.5) * (14 + Math.abs(offset) * 26);
    };

    let matchOver = false;
    ctx.onPointer((type, _x, y) => {
      if (matchOver && type === "down") return resetMatch();
      if (type === "move" || type === "down") pointer = y;
    });
    ctx.onKey((key) => {
      if (matchOver) return resetMatch();
      key && (pointer = null);
    });

    ctx.frame((dt) => {
      const s = dt / 1000;
      if (pointer !== null) you.y += (pointer - you.y) * Math.min(1, s * 18);
      if (ctx.held("up")) you.y -= 190 * s;
      if (ctx.held("down")) you.y += 190 * s;
      you.y = Math.max(PH / 2, Math.min(H - PH / 2, you.y));

      // Balanced AI: tracks ball on its half, capped speed, beatable by angled hits
      const target = ball.vx > 0 && ball.x > W * 0.3 ? ball.y + cpu.aim : H / 2;
      const reach = (70 + you.score * 14) * s;
      cpu.y += Math.max(-reach, Math.min(reach, target - cpu.y));
      cpu.y = Math.max(PH / 2, Math.min(H - PH / 2, cpu.y));

      if (serve > 0 && dt) {
        serve -= dt;
        if (serve <= 0) launch(serveTo);
      }
      ball.x += ball.vx * s;
      ball.y += ball.vy * s;

      if (ball.y < BALL || ball.y > H - BALL) {
        ball.y = Math.max(BALL, Math.min(H - BALL, ball.y));
        ball.vy *= -1;
        ctx.play("tick", { x: ball.x });
      }

      // Player paddle hit
      if (ball.vx < 0 && ball.x - BALL < 12 + PW && ball.x > 8 && Math.abs(ball.y - you.y) < PH / 2 + BALL) {
        ball.x = 12 + PW + BALL;
        hit(you.y, 1);
      }
      // CPU paddle hit
      if (ball.vx > 0 && ball.x + BALL > W - 12 - PW && ball.x < W - 8 && Math.abs(ball.y - cpu.y) < PH / 2 + BALL) {
        ball.x = W - 12 - PW - BALL;
        hit(cpu.y, -1);
      }

      if (ball.x < -BALL * 2) point(false);
      else if (ball.x > W + BALL * 2) point(true);
      shake = Math.max(0, shake - s * 4);

      g.clearRect(0, 0, W, H);

      // Pitch centre line
      g.strokeStyle = colors.line;
      g.lineWidth = 1;
      g.setLineDash([4, 5]);
      g.beginPath();
      g.moveTo(W / 2, 0);
      g.lineTo(W / 2, H);
      g.stroke();
      g.setLineDash([]);
      g.beginPath();
      g.moveTo(W / 2 - 5, H / 2);
      g.lineTo(W / 2 + 5, H / 2);
      g.stroke();

      // Scores on field
      g.font = `20px ${ctx.fonts.pixel}`;
      g.textAlign = "center";
      g.fillStyle = colors.muted;
      const nudge = ctx.reduced ? 0 : shake * 3;
      g.fillText(String(you.score), W / 2 - 28, 28 - nudge);
      g.fillText(String(cpu.score), W / 2 + 28, 28 - nudge);
      g.font = `9px ${ctx.fonts.mono}`;
      g.fillText("YOU", W / 2 - 28, 40);
      g.fillText("CPU", W / 2 + 28, 40);

      // Player paddle (signal phosphor)
      g.fillStyle = colors.signal;
      g.fillRect(12, you.y - PH / 2, PW, PH);
      g.fillStyle = colors.paper;
      for (let t = 4; t < PH; t += 4) g.fillRect(12 + (t % 12 ? 3 : 1), you.y - PH / 2 + t, PW, 1);

      // CPU paddle
      const cx = W - 12 - PW;
      g.strokeStyle = colors.ink;
      g.lineWidth = 1.5;
      g.strokeRect(cx + 0.75, cpu.y - PH / 2 + 0.75, PW - 1.5, PH - 1.5);
      g.beginPath();
      g.moveTo(cx + PW, cpu.y);
      g.lineTo(W, cpu.y);
      g.arc(cx + PW / 2, cpu.y, 2, 0, Math.PI * 2);
      g.stroke();

      // Ball / Rivet
      if (serve <= 0 || Math.floor(serve / 120) % 2 || ctx.reduced) {
        g.fillStyle = colors.amber;
        g.beginPath();
        g.arc(ball.x, ball.y, BALL, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = colors.ink;
        g.lineWidth = 1;
        g.stroke();
        // Crosshair on ball
        g.beginPath();
        g.moveTo(ball.x - 2, ball.y);
        g.lineTo(ball.x + 2, ball.y);
        g.moveTo(ball.x, ball.y - 2);
        g.lineTo(ball.x, ball.y + 2);
        g.stroke();
      }

      if (matchOver) {
        g.fillStyle = "rgba(0,0,0,0.7)";
        g.fillRect(W / 2 - 70, H / 2 - 20, 140, 40);
        g.strokeStyle = colors.amber || "#ffdc73";
        g.lineWidth = 1;
        g.strokeRect(W / 2 - 70, H / 2 - 20, 140, 40);
        g.fillStyle = you.score === WIN ? colors.green || "#4aff6b" : colors.accent || "#ff3355";
        g.font = `bold 11px ${ctx.fonts.mono}`;
        g.textAlign = "center";
        g.fillText(you.score === WIN ? "MATCH WON!" : "MATCH LOST!", W / 2, H / 2 - 4);
        g.fillStyle = colors.signal || "#ffdc73";
        g.font = `8px ${ctx.fonts.mono}`;
        g.fillText("TAP OR RESTART TO PLAY AGAIN", W / 2, H / 2 + 10);
      }
    });

    return () => {};
  };

  // --- GAME 2: BREAKOUT (Title Block) ---
  const breakoutGame = (ctx) => {
    const { g } = ctx;
    const W = 800;
    const H = 600;
    const BALL = 21;
    const R = BALL / 2;
    const PADDLE_H = 24;
    const PADDLE_SPEED = 16;
    const PADDLE_W = 150;
    const SCORE = 10;
    const UNIT = 76;
    const CELL_H = 44;

    const HUES = ["accent", "amber", "green", "teal", "blue", "violet"];
    const ROWS = [
      [["DRAWN BY", 3], ["REV", 2], ["DATE", 3], ["SHEET", 2]],
      [["LICENSE", 3], ["TYPEFACE", 3], ["DEPLOYED", 2], ["AGENTS", 2]],
      [["STACK", 6], ["SOUND", 4]],
    ];

    const sheet = () => {
      const bricks = [];
      let n = 0;
      ROWS.forEach((row, r) => {
        let x = 20;
        for (const [label, units] of row) {
          const w = units * UNIT;
          const hue = HUES[n++ % HUES.length];
          bricks.push({ x, y: 70 + r * CELL_H * 2, w, h: CELL_H, label, hue }, { x, y: 70 + r * CELL_H * 2 + CELL_H, w, h: CELL_H, hue });
          x += w;
        }
      });
      return bricks;
    };

    const k = ctx.width / W;
    let bricks = sheet();
    let score = 0;
    let balls = 3;
    let running = false;
    let paddle = W / 2 - PADDLE_W / 2;
    const ball = { x: W / 2, y: H * 0.6, vx: 0, vy: 0 };

    const speed = () => (ctx.reduced ? 7 : 10);
    const resetBall = () => {
      const angle = (Math.random() * 2 - 1) * (Math.PI / 6);
      ball.x = W / 2;
      ball.y = H * 0.6;
      ball.vx = speed() * Math.sin(angle);
      ball.vy = -speed() * Math.cos(angle);
    };

    const action = () => {
      if (!bricks.length) {
        bricks = sheet();
        resetBall();
        running = false;
      } else if (!running) {
        resetBall();
        running = true;
      }
    };

    ctx.onPointer((type, x) => {
      if (type === "down") action();
      paddle = Math.min(W - PADDLE_W, Math.max(0, x / k - PADDLE_W / 2));
    });
    ctx.onKey((key, down, event) => key === "action" && down && !event.repeat && action());

    ctx.frame((dt, now) => {
      if (ctx.held("left")) paddle = Math.max(0, paddle - PADDLE_SPEED);
      if (ctx.held("right")) paddle = Math.min(W - PADDLE_W, paddle + PADDLE_SPEED);

      if (running) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x < R || ball.x > W - R) {
          ball.x = Math.min(W - R, Math.max(R, ball.x));
          ball.vx *= -1;
          ctx.play("bounce", { x: ball.x * k });
        }
        if (ball.y < R) {
          ball.y = R;
          ball.vy *= -1;
          ctx.play("bounce", { x: ball.x * k });
        }
        if (ball.y > H) {
          running = false;
          ctx.play("gameOver");
          resetBall();
          if (--balls <= 0) return ctx.over(`Game Over! Score: ${score}`);
          return;
        }

        const top = H - PADDLE_H;
        if (ball.vy > 0 && ball.y + R > top && ball.y < top + PADDLE_H && ball.x + R > paddle && ball.x - R < paddle + PADDLE_W) {
          const offset = Math.max(-1, Math.min(1, (ball.x - (paddle + PADDLE_W / 2)) / (PADDLE_W / 2)));
          const angle = offset * (Math.PI / 3);
          ball.vx = speed() * Math.sin(angle);
          ball.vy = -speed() * Math.cos(angle);
          ball.y = top - R;
          ctx.play("bounce", { x: ball.x * k });
        }

        let hit = false;
        for (let i = 0; i < bricks.length; i++) {
          const b = bricks[i];
          if (b.hit !== undefined) continue;
          if (ball.x + R > b.x && ball.x - R < b.x + b.w && ball.y - R < b.y + b.h && ball.y + R > b.y) {
            hit = true;
            score += SCORE;
            b.hit = now;
            ctx.play("break", { x: ball.x * k });
          }
        }
        if (hit) {
          ball.vy *= -1;
          ctx.score(score);
          bricks = bricks.filter((b) => b.hit === undefined || now - b.hit < 120);
        }
        if (bricks.length === 0) {
          running = false;
          ctx.play("success");
          ctx.over(`Title Block Cleared! Final Score: ${score}`);
        }
      }

      // Render Breakout
      const c = ctx.colors;
      g.clearRect(0, 0, ctx.width, ctx.height);
      g.save();
      g.scale(k, k);

      // Lives indicator
      for (let i = 0; i < balls; i++) {
        g.strokeStyle = c.muted;
        g.lineWidth = 4;
        g.beginPath();
        g.arc(W - 30 - i * 40, 26, 10, 0, Math.PI * 2);
        g.stroke();
      }

      // Bricks
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        const flash = b.hit !== undefined;
        g.fillStyle = flash ? c.signal : b.hue ? c[b.hue] : c.paper;
        g.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4);
        g.strokeStyle = b.hue ? c.ink : c.muted;
        g.lineWidth = 3;
        g.strokeRect(b.x + 2.5, b.y + 2.5, b.w - 5, b.h - 5);
        if (b.label && !flash) {
          g.font = `20px ${ctx.fonts.pixel}`;
          g.fillStyle = c.paper;
          g.textAlign = "left";
          g.fillText(b.label, b.x + 10, b.y + 28);
        }
      }

      // Paddle
      g.fillStyle = c.ink;
      g.beginPath();
      g.roundRect(paddle, H - PADDLE_H, PADDLE_W, PADDLE_H, 4);
      g.fill();
      g.fillStyle = c.paper;
      g.fillRect(paddle + 16, H - PADDLE_H + 6, 2, PADDLE_H - 12);
      g.fillRect(paddle + PADDLE_W - 18, H - PADDLE_H + 6, 2, PADDLE_H - 12);

      // Ball
      g.fillStyle = c.signal;
      g.beginPath();
      g.arc(ball.x, ball.y, R * 1.3, 0, Math.PI * 2);
      g.fill();

      if (!running) {
        g.font = `32px ${ctx.fonts.pixel}`;
        g.fillStyle = c.muted;
        g.textAlign = "center";
        g.fillText("SPACE OR CLICK TO LAUNCH", W / 2, H * 0.6 + 50);
      }
      g.restore();
    });

    resetBall();
    ctx.score(0);
    return () => {};
  };

  // --- GAME 3: TYPING (Cursor Race) ---
  const typingGame = (ctx) => {
    const { g, colors, width: W, height: H } = ctx;
    const SNIPPETS = [
      ["embedded · main.c", "void setup() {\n  pinMode(LED_BUILTIN, OUTPUT);\n  Serial.begin(115200);\n}"],
      ["firmware · sensor.c", "int readADC(uint8_t ch) {\n  ADMUX = (ADMUX & 0xF0) | ch;\n  ADCSRA |= (1 << ADSC);\n  return ADC;\n}"],
      ["esp8266 · wifi.cpp", "void connectWifi() {\n  WiFi.mode(WIFI_STA);\n  WiFi.begin(SSID, PASS);\n}"],
      ["codenaya · debounce.ts", "const schedule = () => {\n  clearTimeout(timer);\n  timer = setTimeout(run, 50);\n};"],
    ];
    const GHOST_WPM = 35;
    const LINE = 14;
    const CHAR = 5.8;

    const [source, text] = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
    const wrong = new Set();
    let at = 0, typed = 0, mistakes = 0, elapsed = 0, started = false, done = false, shake = 0;

    const skip = () => {
      while (text[at] === " " && (at === 0 || text[at - 1] === "\n" || text[at - 1] === " ")) at++;
    };
    const wpm = () => (elapsed > 500 ? Math.round(at / 5 / (elapsed / 60000)) : 0);
    const accuracy = () => (typed ? Math.round(((typed - mistakes) / typed) * 100) : 100);

    ctx.onKey((_key, down, event) => {
      if (!down || done) return;
      const char = event.key === "Enter" ? "\n" : event.key;
      if (char.length !== 1) return;
      started = true;
      typed++;
      if (char === text[at]) {
        at++;
        skip();
        ctx.play("key");
      } else {
        mistakes++;
        wrong.add(at);
        shake = 1;
        ctx.play("tick");
      }
      ctx.score(wpm(), `${wpm()} wpm`);
      if (at >= text.length) {
        done = true;
        ctx.play("success");
        ctx.over(`${wpm()} WPM at ${accuracy()}% accuracy.`);
      }
    });

    ctx.frame((dt) => {
      if (started && !done) elapsed += dt;
      shake = Math.max(0, shake - dt / 200);
      const ghost = started ? Math.min(text.length, (elapsed / 60000) * GHOST_WPM * 5) : 0;

      g.clearRect(0, 0, W, H);
      g.font = `8px ${ctx.fonts.mono}`;
      g.fillStyle = colors.muted;
      g.textAlign = "left";
      g.fillText(source, 10, 14);

      g.font = `10px ${ctx.fonts.mono}`;
      const nudge = ctx.reduced ? 0 : Math.sin(shake * 20) * shake * 1.5;
      let col = 0, row = 0;
      const where = (idx) => {
        let c = 0, r = 0;
        for (let j = 0; j < idx; j++) {
          if (text[j] !== "\n") c++;
          else { r++; c = 0; }
        }
        return [10 + c * CHAR, 34 + r * LINE];
      };

      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === "\n") { row++; col = 0; continue; }
        const x = 10 + col * CHAR + (i === at ? nudge : 0);
        const y = 34 + row * LINE;
        if (wrong.has(i)) {
          g.fillStyle = colors.accent;
          g.fillRect(x, y + 2, CHAR, 1.5);
        }
        g.fillStyle = i < at ? colors.ink : wrong.has(i) && i === at ? colors.accent : colors.muted;
        g.fillText(ch, x, y);
        col++;
      }

      // Ghost and user cursors
      const [gx, gy] = where(Math.floor(ghost));
      g.strokeStyle = colors.violet;
      g.lineWidth = 1;
      g.strokeRect(gx + 0.5, gy - 9.5, CHAR, 12);
      const [ux, uy] = where(at);
      g.fillStyle = colors.signal;
      g.fillRect(ux + nudge, uy + 3, CHAR, 2);

      // Speed gauge
      const dx = W - 46, dy = H - 14;
      const angle = (v) => Math.PI + (Math.min(v, 100) / 100) * Math.PI;
      g.strokeStyle = colors.muted;
      g.beginPath();
      g.arc(dx, dy, 28, Math.PI, 0);
      g.stroke();
      g.strokeStyle = colors.violet;
      g.beginPath();
      g.moveTo(dx + Math.cos(angle(GHOST_WPM)) * 22, dy + Math.sin(angle(GHOST_WPM)) * 22);
      g.lineTo(dx + Math.cos(angle(GHOST_WPM)) * 30, dy + Math.sin(angle(GHOST_WPM)) * 30);
      g.stroke();
      g.strokeStyle = colors.signal;
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(dx, dy);
      g.lineTo(dx + Math.cos(angle(wpm())) * 24, dy + Math.sin(angle(wpm())) * 24);
      g.stroke();

      g.font = `9px ${ctx.fonts.mono}`;
      g.textAlign = "center";
      g.fillStyle = colors.ink;
      g.fillText(`${wpm()} wpm`, dx, dy + 11);
      g.textAlign = "left";
      g.fillStyle = colors.muted;
      g.fillText(started ? `${accuracy()}% accurate` : "type to race ghost", 10, H - 14);
      g.fillStyle = colors.violet;
      g.fillText(`ghost: ${GHOST_WPM} wpm`, 10, H - 3);
    });

    skip();
    return () => {};
  };

  // --- GAME 4: MEMORY (Repeat After Me) ---
  const memoryGame = (ctx) => {
    const { g, colors, width: W, height: H } = ctx;
    const cx = W / 2, cy = H / 2 + 4, R = 52;
    const MARKS = [
      { key: "up", dx: 0, dy: -1, hue: "accent", note: 0 },
      { key: "right", dx: 1, dy: 0, hue: "amber", note: 2 },
      { key: "down", dx: 0, dy: 1, hue: "green", note: 4 },
      { key: "left", dx: -1, dy: 0, hue: "blue", note: 7 },
    ];
    const sequence = [];
    let mode = "listen", step = 0, clock = -600, lit = -1, glow = 0;

    const flash = (mark) => {
      lit = mark;
      glow = 1;
      ctx.play("note", { index: MARKS[mark].note, x: cx + MARKS[mark].dx * R });
    };
    const grow = () => {
      sequence.push(Math.floor(Math.random() * 4));
      mode = "listen";
      step = 0;
      clock = -700;
    };
    const gap = () => Math.max(300, 560 - (sequence.length - 1) * 28);

    const resetGame = () => {
      sequence.length = 0;
      mode = "listen";
      step = 0;
      clock = -700;
      ctx.score(0);
      grow();
    };

    const press = (mark) => {
      if (mode === "miss") return resetGame();
      if (mode !== "play") return;
      flash(mark);
      if (mark !== sequence[step]) {
        mode = "miss";
        lit = sequence[step];
        ctx.play("error");
        ctx.over(`Remembered ${sequence.length - 1} steps.`);
        return;
      }
      if (++step === sequence.length) {
        ctx.score(sequence.length);
        grow();
      }
    };

    ctx.onKey((key, down, event) => {
      if (!down || event.repeat) return;
      if (mode === "miss") return resetGame();
      const m = MARKS.findIndex((item) => item.key === key);
      if (m >= 0) press(m);
    });

    ctx.onPointer((type, x, y) => {
      if (type !== "down") return;
      if (mode === "miss") return resetGame();
      let best = -1, dist = 26;
      MARKS.forEach((m, i) => {
        const d = Math.hypot(x - (cx + m.dx * R), y - (cy + m.dy * R * 0.75));
        if (d < dist) { best = i; dist = d; }
      });
      if (best >= 0) press(best);
    });

    grow();

    ctx.frame((dt) => {
      if (mode === "listen" && dt) {
        clock += dt;
        if (clock >= 0) {
          if (step < sequence.length) {
            flash(sequence[step++]);
            clock -= gap();
          } else {
            mode = "play";
            step = 0;
          }
        }
      }
      glow = Math.max(0, glow - dt / 260);
      if (!glow && mode !== "miss") lit = -1;

      g.clearRect(0, 0, W, H);
      g.strokeStyle = colors.line;
      g.lineWidth = 1;
      g.beginPath();
      g.ellipse(cx, cy, R, R * 0.75, 0, 0, Math.PI * 2);
      g.moveTo(cx - R - 14, cy);
      g.lineTo(cx + R + 14, cy);
      g.moveTo(cx, cy - R * 0.75 - 14);
      g.lineTo(cx, cy + R * 0.75 + 14);
      g.stroke();

      MARKS.forEach((m, i) => {
        const x = cx + m.dx * R;
        const y = cy + m.dy * R * 0.75;
        const on = i === lit;
        const size = 13 + (on && !ctx.reduced ? glow * 3 : 0);
        g.beginPath();
        g.arc(x, y, size * 0.62, 0, Math.PI * 2);
        g.fillStyle = on ? colors[m.hue] : colors.paper;
        g.fill();
        g.strokeStyle = on ? colors.ink : colors[m.hue];
        g.lineWidth = 1.5;
        g.stroke();
      });

      g.font = `10px ${ctx.fonts.mono}`;
      g.textAlign = "center";
      g.fillStyle = colors.muted;
      g.fillText(mode === "listen" ? "LISTEN TO PATTERN..." : "REPEAT PATTERN (WASD / CLICK)", cx, H - 12);
    });

    return () => {};
  };

  // --- GAME 5: REACTION (Signal Lamp) ---
  const reactionGame = (ctx) => {
    const { g, colors, width: W, height: H } = ctx;
    const TRIES = 5;
    const BENCHMARK = 255;
    let state = "idle", wait = 0, litAt = 0, lastNow = 0, pulse = 0;
    const times = [];
    const avg = () => Math.round(times.reduce((a, b) => a + b, 0) / (times.length || 1));

    const arm = () => {
      state = "wait";
      wait = 1200 + Math.random() * 2200;
    };

    const press = (stamp) => {
      if (times.length >= TRIES) {
        times.length = 0;
        ctx.score(0, "0 ms");
        return arm(), ctx.play("tap");
      }
      if (state === "idle" || state === "shown" || state === "early") return arm(), ctx.play("tap");
      if (state === "wait") {
        state = "early";
        ctx.play("error");
        return;
      }
      const ms = Math.max(1, Math.round(stamp - litAt));
      times.push(ms);
      pulse = 1;
      ctx.play(ms < BENCHMARK ? "success" : "tap");
      ctx.score(avg(), `${avg()} ms`);
      state = "shown";
      if (times.length === TRIES) {
        ctx.over(`5 Tries Avg: ${avg()} ms (Benchmark: ${BENCHMARK} ms)`);
      }
    };

    ctx.onKey((key, down, event) => key === "action" && down && !event.repeat && press(event.timeStamp));
    ctx.onPointer((type, _x, _y, event) => type === "down" && press(event.timeStamp));

    ctx.frame((dt, now) => {
      lastNow = now;
      if (state === "wait" && dt) {
        wait -= dt;
        if (wait <= 0) {
          state = "lit";
          litAt = lastNow;
          ctx.play("tick");
        }
      }
      pulse = Math.max(0, pulse - dt / 300);

      g.clearRect(0, 0, W, H);
      const cx = W / 2, cy = 64;

      // Industrial panel plate
      g.strokeStyle = colors.line;
      g.lineWidth = 1;
      g.strokeRect(cx - 52.5, cy - 44.5, 105, 89);

      // Signal lamp
      const lit = state === "lit";
      g.lineWidth = 2;
      g.strokeStyle = colors.ink;
      g.beginPath();
      g.arc(cx, cy, 28, 0, Math.PI * 2);
      g.stroke();
      g.beginPath();
      g.arc(cx, cy, 22 + (ctx.reduced ? 0 : pulse * 3), 0, Math.PI * 2);
      g.fillStyle = lit ? colors.green : state === "early" ? colors.accent : colors.paper;
      g.fill();

      g.textAlign = "center";
      g.font = `11px ${ctx.fonts.mono}`;
      g.fillStyle = state === "early" ? colors.accent : colors.ink;
      const labels = {
        idle: "PRESS SPACE OR CLICK TO ARM",
        wait: "WAIT FOR IT...",
        lit: "NOW! PRESS!",
        early: "TOO SOON! CLICK TO RETRY",
        shown: times.length === TRIES ? `FINISHED: ${avg()} ms` : `${times.at(-1)} ms · CLICK FOR NEXT`,
      };
      g.fillText(labels[state], cx, cy + 50);

      // Trial dots timeline
      g.strokeStyle = colors.muted;
      g.beginPath();
      g.moveTo(24, H - 24);
      g.lineTo(W - 24, H - 24);
      g.stroke();
      times.forEach((ms, i) => {
        const x = 24 + (Math.min(ms, 600) / 600) * (W - 48);
        g.fillStyle = colors.signal;
        g.beginPath();
        g.arc(x, H - 24, 3, 0, Math.PI * 2);
        g.fill();
      });
    });

    return () => {};
  };

  // --- GAME 6: SHEETS (2048 ISO Paper Sizes) ---
  const sheetsGame = (ctx) => {
    const { g, colors, width: W, height: H } = ctx;
    const N = 4, CELL_W = 54, CELL_H = 39, GAP = 4, X0 = 6, Y0 = 6, TOP = 11;
    const HUE5 = ["amber", "green", "teal", "blue", "violet"];
    let tiles = [], total = 0, largest = 1, done = false;

    const at = (x, y) => tiles.find((t) => !t.gone && t.x === x && t.y === y);
    const spawn = () => {
      const free = [];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!at(x, y)) free.push([x, y]);
      if (!free.length) return;
      const [x, y] = free[Math.floor(Math.random() * free.length)];
      tiles.push({ k: Math.random() < 0.9 ? 1 : 2, x, y });
    };
    spawn(); spawn();

    const stuck = () => {
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const k = at(x, y)?.k;
          if (!k || at(x + 1, y)?.k === k || at(x, y + 1)?.k === k) return false;
        }
      }
      return true;
    };

    const resetGame = () => {
      tiles = [];
      total = 0;
      done = false;
      ctx.score(0);
      spawn();
      spawn();
    };

    const move = (dx, dy) => {
      if (done) return resetGame();
      tiles = tiles.filter((t) => !t.gone);
      let moved = false, merged = 0;
      for (let i = 0; i < N; i++) {
        const line = [0, 1, 2, 3].map((j) => (dx + dy > 0 ? (dx ? [N - 1 - j, i] : [i, N - 1 - j]) : (dx ? [j, i] : [i, j])));
        const row = line.map(([x, y]) => at(x, y)).filter(Boolean);
        let slot = 0, last = null;
        for (const tile of row) {
          if (last && last.k === tile.k && !last.merged) {
            last.k++;
            last.merged = true;
            tile.gone = true;
            total += 2 ** last.k;
            merged = Math.max(merged, last.k);
            moved = true;
          } else {
            const [x, y] = line[slot++];
            if (x !== tile.x || y !== tile.y) moved = true;
            tile.x = x; tile.y = y;
            tile.merged = false;
            last = tile;
          }
        }
      }
      if (moved) {
        spawn();
        ctx.play(merged ? "note" : "tick", { index: merged });
        ctx.score(total);
        if (merged >= TOP) {
          done = true;
          ctx.play("success");
          ctx.over(`Reached A0! Final Score: ${total}`);
        } else if (stuck()) {
          done = true;
          ctx.play("gameOver");
          ctx.over(`No moves left. Score: ${total}`);
        }
      }
    };

    ctx.onKey((key, down) => {
      if (!down) return;
      if (key === "left") move(-1, 0);
      else if (key === "right") move(1, 0);
      else if (key === "up") move(0, -1);
      else if (key === "down") move(0, 1);
    });

    let dragStart = null;
    ctx.onPointer((type, x, y) => {
      if (type === "down") dragStart = { x, y };
      else if (type === "up" && dragStart) {
        const dx = x - dragStart.x, dy = y - dragStart.y;
        if (Math.abs(dx) > 16 || Math.abs(dy) > 16) {
          if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1, 0);
          else move(0, dy > 0 ? 1 : -1);
        }
        dragStart = null;
      }
    });

    ctx.frame(() => {
      g.clearRect(0, 0, W, H);

      // Draw grid cells fitting the display box
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const px = X0 + x * (CELL_W + GAP);
          const py = Y0 + y * (CELL_H + GAP);
          g.fillStyle = 'rgba(255, 255, 255, 0.04)';
          g.beginPath();
          g.roundRect(px, py, CELL_W, CELL_H, 2);
          g.fill();
          g.strokeStyle = colors.line;
          g.lineWidth = 1;
          g.stroke();
        }
      }

      // Draw tiles
      tiles.forEach((t) => {
        if (t.gone) return;
        const px = X0 + t.x * (CELL_W + GAP);
        const py = Y0 + t.y * (CELL_H + GAP);
        const hue = colors[t.k >= TOP ? "accent" : HUE5[(t.k - 1) % 5]];

        g.fillStyle = hue;
        g.beginPath();
        g.roundRect(px + 1, py + 1, CELL_W - 2, CELL_H - 2, 3);
        g.fill();

        // Technical drafting inner frame for higher sheet sizes (A5..A0)
        if (t.k >= 6) {
          g.strokeStyle = colors.paper;
          g.lineWidth = 1;
          g.strokeRect(px + 3.5, py + 3.5, CELL_W - 7, CELL_H - 7);
        }

        // Sheet label and numeric area value
        g.font = `bold 14px ${ctx.fonts.pixel}`;
        g.fillStyle = colors.paper;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(`A${TOP - t.k}`, px + CELL_W / 2, py + CELL_H / 2 - 3);

        g.font = `8px ${ctx.fonts.mono}`;
        g.fillText(String(2 ** t.k), px + CELL_W / 2, py + CELL_H / 2 + 9);
      });
    });

    return () => {};
  };

  // --- GAME 7: CENTRE PUNCH (Precision Accuracy) ---
  const punchGame = (ctx) => {
    const { g, colors, width: W, height: H } = ctx;
    const ROUND = 20000, R = 13;
    let left = ROUND, started = false, done = false, hits = 0, shots = 0, spent = 0;
    let mark = { x: W / 2, y: H / 2, age: 0, life: 1700 };
    let aim = { x: W / 2, y: H / 2 };
    const holes = [];

    const next = () => {
      const x = R + 10 + Math.random() * (W - 2 * R - 20);
      const y = R + 24 + Math.random() * (H - 2 * R - 40);
      mark = { x, y, age: 0, life: Math.max(900, 1700 - hits * 35) };
    };

    const resetGame = () => {
      hits = 0;
      shots = 0;
      spent = 0;
      holes = [];
      left = ROUND;
      started = true;
      done = false;
      ctx.score(0);
      next();
    };

    const shoot = (x, y) => {
      if (done) return resetGame();
      if (!started) { started = true; ctx.play("tap"); return next(); }
      shots++;
      const off = Math.hypot(x - mark.x, y - mark.y);
      if (off <= R * (1 - mark.age / mark.life) + 2) {
        hits++;
        spent += mark.age;
        holes.push({ x, y, off, miss: false });
        ctx.play("pop");
        ctx.score(hits);
        next();
      } else {
        holes.push({ x, y, off, miss: true });
        ctx.play("error");
      }
    };

    ctx.onPointer((type, x, y) => {
      aim = { x, y };
      if (type === "down") shoot(x, y);
    });
    ctx.onKey((key, down) => down && key === "action" && (done ? resetGame() : shoot(aim.x, aim.y)));

    ctx.frame((dt) => {
      if (started && !done) {
        left -= dt;
        mark.age += dt;
        if (mark.age >= mark.life) { next(); ctx.play("tick"); }
        if (left <= 0) {
          done = true;
          ctx.play("success");
          ctx.over(`Hits: ${hits}/${shots} (${shots ? Math.round((hits / shots) * 100) : 0}%)`);
        }
      }

      g.clearRect(0, 0, W, H);
      // Timeline
      g.fillStyle = left < 5000 ? colors.accent : colors.ink;
      g.fillRect(8, 6, (W - 16) * Math.max(0, left / ROUND), 2);

      // Holes
      holes.forEach((h) => {
        g.fillStyle = h.miss ? colors.accent : colors.ink;
        g.beginPath();
        g.arc(h.x, h.y, 2.5, 0, Math.PI * 2);
        g.fill();
      });

      // Target
      if (!done && started) {
        const rad = Math.max(2, R * (1 - mark.age / mark.life));
        g.strokeStyle = colors.amber;
        g.beginPath();
        g.arc(mark.x, mark.y, rad, 0, Math.PI * 2);
        g.stroke();
      }

      // Punch crosshair
      g.strokeStyle = colors.signal;
      g.strokeRect(aim.x - 4, aim.y - 4, 8, 8);

      g.font = `9px ${ctx.fonts.mono}`;
      g.textAlign = "left";
      g.fillStyle = colors.muted;
      g.fillText(started ? `TIME: ${Math.ceil(left / 1000)}s | HITS: ${hits}` : "CLICK OR SPACE TO START", 8, H - 8);
    });

    return () => {};
  };

  // --- GAME 8: WORD CHECK (Tech Wordle) ---
  const wordsGame = (ctx) => {
    const { g, colors, width: W, height: H } = ctx;
    const WORDS = ["REACT", "CLERK", "AGENT", "MODEL", "BUILD", "SWIFT", "CARGO", "QUERY", "PARSE", "TOKEN", "DEBUG", "ASYNC"];
    const answer = WORDS[Math.floor(Math.random() * WORDS.length)];
    const tries = [];
    const marks = [];
    let typed = "", done = false;

    const check = (guess) => {
      const left = [...answer];
      const m = [...guess].map((c, i) => (c === answer[i] ? (left[i] = "", 2) : 0));
      [...guess].forEach((c, i) => {
        if (!m[i]) {
          const idx = left.indexOf(c);
          if (idx >= 0) { m[i] = 1; left[idx] = ""; }
        }
      });
      return m;
    };

    const resetGame = () => {
      answer = WORDS[Math.floor(Math.random() * WORDS.length)];
      tries = [];
      marks = [];
      typed = "";
      done = false;
      ctx.score(0);
    };

    const press = (k) => {
      if (done) {
        if (k === "enter") return resetGame();
        return;
      }
      if (k === "back") {
        typed = typed.slice(0, -1);
        ctx.play("tick");
      } else if (k === "enter") {
        if (typed.length < 5) { ctx.play("error"); return; }
        const m = check(typed);
        tries.push(typed);
        marks.push(m);
        typed = "";
        const won = m.every((v) => v === 2);
        if (won) {
          done = true;
          ctx.play("success");
          ctx.over(`Correct! ${answer} in ${tries.length} tries.`);
        } else if (tries.length >= 6) {
          done = true;
          ctx.play("gameOver");
          ctx.over(`Word was: ${answer}`);
        } else ctx.play("pop");
      } else if (typed.length < 5 && /^[A-Z]$/.test(k)) {
        typed += k;
        ctx.play("key");
      }
    };

    ctx.onPointer((type) => {
      if (type === "down" && done) resetGame();
    });

    ctx.onKey((_key, down, event) => {
      if (!down) return;
      if (done && event.key === "Enter") return resetGame();
      if (event.key === "Enter") press("enter");
      else if (event.key === "Backspace") press("back");
      else if (/^[a-zA-Z]$/.test(event.key)) press(event.key.toUpperCase());
    });

    ctx.frame(() => {
      g.clearRect(0, 0, W, H);
      const TILE = 18, GAP = 4, X0 = (W - 5 * (TILE + GAP)) / 2;

      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
          const x = X0 + c * (TILE + GAP);
          const y = 14 + r * (TILE + GAP);
          const rowWord = r < tries.length ? tries[r] : r === tries.length ? typed : "";
          const char = rowWord[c] || "";
          const mark = r < marks.length ? marks[r][c] : null;

          if (mark === 2) g.fillStyle = colors.green;
          else if (mark === 1) g.fillStyle = colors.amber;
          else g.fillStyle = colors.paper;
          g.fillRect(x, y, TILE, TILE);
          g.strokeStyle = colors.line;
          g.strokeRect(x, y, TILE, TILE);

          if (char) {
            g.font = `12px ${ctx.fonts.mono}`;
            g.fillStyle = mark !== null ? colors.paper : colors.ink;
            g.textAlign = "center";
            g.fillText(char, x + TILE / 2, y + TILE / 2 + 4);
          }
        }
      }

      g.font = `9px ${ctx.fonts.mono}`;
      g.textAlign = "center";
      g.fillStyle = colors.muted;
      g.fillText(done ? `WORD: ${answer}` : "TYPE 5-LETTER TECH WORD & PRESS ENTER", W / 2, H - 10);
    });

    return () => {};
  };

  // --- GAME 9: PLANE (Paper Plane) ---
  const planeGame = (ctx) => {
    const { g, colors, width: W, height: H } = ctx;
    const PX = 64, COL_W = 20, SPACING = 112, GRAVITY = 0.00055, FLAP = -0.16;
    let y = H / 2, v = 0, started = false, dead = false, cleared = 0;
    const columns = [{ x: W - 40, gap: H / 2, size: 80 }];

    const resetGame = () => {
      y = H / 2;
      v = FLAP;
      started = true;
      dead = false;
      cleared = 0;
      columns.length = 0;
      columns.push({ x: W - 40, gap: H / 2, size: 80 });
      ctx.score(0);
      ctx.play("tap");
    };

    const flap = () => {
      if (dead) return resetGame();
      started = true;
      v = FLAP;
      ctx.play("tap");
    };

    ctx.onKey((key, down) => down && (key === "action" || key === "up") && flap());
    ctx.onPointer((type) => type === "down" && flap());

    ctx.frame((dt) => {
      if (started && !dead) {
        v += GRAVITY * dt;
        y += v * dt;
        const speed = 0.06 + cleared * 0.001;

        columns.forEach((c) => {
          c.x -= speed * dt;
          if (!c.passed && c.x + COL_W < PX) {
            c.passed = true;
            cleared++;
            ctx.score(cleared);
            ctx.play("pop");
          }
          if (PX + 4 > c.x && PX - 4 < c.x + COL_W && Math.abs(y - c.gap) > c.size / 2 - 4) {
            dead = true;
            ctx.play("break");
            ctx.over(`Cleared ${cleared} gaps.`);
          }
        });

        if (columns[0]?.x < -COL_W) columns.shift();
        if (columns.at(-1)?.x < W - SPACING) {
          const last = columns.at(-1).gap;
          const size = Math.max(54, 86 - cleared * 1.5);
          const gap = Math.min(H - size / 2 - 10, Math.max(size / 2 + 10, last + (Math.random() - 0.5) * 60));
          columns.push({ x: W, gap, size });
        }
      }

      g.clearRect(0, 0, W, H);
      // Columns
      columns.forEach((c) => {
        g.strokeStyle = colors.ink;
        g.strokeRect(c.x, 0, COL_W, c.gap - c.size / 2);
        g.strokeRect(c.x, c.gap + c.size / 2, COL_W, H - (c.gap + c.size / 2));
      });

      // Paper Plane
      g.fillStyle = colors.signal;
      g.beginPath();
      g.moveTo(PX + 8, y);
      g.lineTo(PX - 6, y - 5);
      g.lineTo(PX - 2, y);
      g.lineTo(PX - 6, y + 5);
      g.closePath();
      g.fill();

      g.font = `9px ${ctx.fonts.mono}`;
      g.fillStyle = colors.muted;
      g.textAlign = "left";
      g.fillText(started ? `GAPS: ${cleared}` : "SPACE OR TAP TO FLAP", 8, H - 8);

      if (dead) {
        g.fillStyle = colors.paper;
        g.fillRect(W / 2 - 65, H / 2 - 16, 130, 32);
        g.strokeStyle = colors.accent;
        g.lineWidth = 1;
        g.strokeRect(W / 2 - 65, H / 2 - 16, 130, 32);
        g.fillStyle = colors.accent;
        g.textAlign = "center";
        g.font = `bold 10px ${ctx.fonts.mono}`;
        g.fillText("FLIGHT CRASH", W / 2, H / 2 - 4);
        g.fillStyle = colors.signal;
        g.font = `8px ${ctx.fonts.mono}`;
        g.fillText("CLICK FLAP OR RESTART", W / 2, H / 2 + 8);
      }
    });

    return () => {};
  };

  // --- GAME 10: REDLINE (Code Review Bug Spotter) ---
  const redlineGame = (ctx) => {
    const { g, colors, width: W, height: H } = ctx;
    const SNIPPETS = [
      ["rust · bounds", 3, "0..=len reads past end. Use 0..len", "fn sum(v: &[u32]) -> u32 {\n  let mut tot = 0;\n  for i in 0..=v.len() {\n    tot += v[i];\n  }\n  tot\n}"],
      ["ts · await", 2, "fetch returns Promise. Missing await", "async function save(k: string) {\n  const res = fetch('/api', { body: k });\n  if (!res.ok) throw Error();\n}"],
      ["ts · slice", 3, "lines[len] is undefined. Use len - 1", "function last(s: string) {\n  const lines = s.split('\\n');\n  return lines[lines.length];\n}"],
    ];
    const [title, bugLine, why, code] = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
    const lines = code.split("\n");
    let selected = -1, done = false;

    const choose = (idx) => {
      if (done) return;
      selected = idx;
      done = true;
      if (selected + 1 === bugLine) {
        ctx.play("success");
        ctx.over(`Correct! Line ${bugLine}: ${why}`);
      } else {
        ctx.play("error");
        ctx.over(`Bug was Line ${bugLine}: ${why}`);
      }
    };

    ctx.onPointer((type, _x, y) => {
      if (type !== "down" || done) return;
      const idx = Math.floor((y - 30) / 18);
      if (idx >= 0 && idx < lines.length) choose(idx);
    });

    ctx.frame(() => {
      g.clearRect(0, 0, W, H);
      g.font = `9px ${ctx.fonts.mono}`;
      g.fillStyle = colors.muted;
      g.textAlign = "left";
      g.fillText(title, 10, 16);

      lines.forEach((l, i) => {
        const y = 42 + i * 18;
        if (done && i + 1 === bugLine) {
          g.strokeStyle = colors.green;
          g.strokeRect(8, y - 12, W - 16, 16);
        } else if (done && i === selected) {
          g.strokeStyle = colors.accent;
          g.strokeRect(8, y - 12, W - 16, 16);
        }
        g.fillStyle = colors.muted;
        g.fillText(String(i + 1), 12, y);
        g.fillStyle = colors.ink;
        g.fillText(l, 30, y);
      });

      g.font = `9px ${ctx.fonts.mono}`;
      g.fillStyle = colors.signal;
      g.fillText(done ? `LINE ${bugLine}: ${why}` : "CLICK THE LINE WITH THE BUG", 10, H - 10);
    });

    return () => {};
  };

  // --- GAME 11: LOOSE PARTS (Vector Asteroids Space Shooter) ---
  const PART_SIZES = [16, 9, 5];
  const PART_HUES = ["amber", "green", "teal", "violet"];

  const partsGame = (ctx) => {
    const { g, colors, width: W, height: H } = ctx;
    let x = W / 2;
    let y = H / 2;
    let vx = 0;
    let vy = 0;
    let angle = -Math.PI / 2;
    let aim = null;
    let pressed = false;
    let lives = 3;
    let safe = 0;
    let gone = 0;
    let cool = 0;
    let wave = 0;
    let points = 0;
    let started = false;
    let dead = false;
    let rocks = [];
    let bolts = [];
    let rings = [];

    const rock = (rx, ry, size, toShip = false) => {
      const a = toShip ? Math.atan2(y - ry, x - rx) + (Math.random() - 0.5) * 0.7 : Math.random() * Math.PI * 2;
      const speed = (26 + Math.random() * 18 + size * 10 + wave * 4) * (ctx.reduced ? 0.75 : 1);
      return {
        x: rx,
        y: ry,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        size,
        hue: Math.floor(Math.random() * PART_HUES.length),
        turn: 0,
        spin: (Math.random() - 0.5) * 1.2,
        edge: Array.from({ length: 9 }, () => 0.72 + Math.random() * 0.3),
      };
    };

    const newWave = () => {
      wave++;
      rocks = Array.from({ length: 3 + wave }, (_, i) => (i % 2 ? rock(Math.random() * W, 0, 0, true) : rock(0, Math.random() * H, 0)));
    };
    newWave();

    const fire = () => {
      if (cool > 0 || bolts.length > 3 || gone) return;
      bolts.push({ x: x + Math.cos(angle) * 7, y: y + Math.sin(angle) * 7, vx: vx + Math.cos(angle) * 190, vy: vy + Math.sin(angle) * 190, life: 0.75 });
      cool = 160;
      ctx.play("tap", { x });
    };

    const wrap = (o, m) => {
      o.x = ((o.x + m) % (W + 2 * m) + W + 2 * m) % (W + 2 * m) - m;
      o.y = ((o.y + m) % (H + 2 * m) + H + 2 * m) % (H + 2 * m) - m;
    };

    const resetGame = () => {
      x = W / 2;
      y = H / 2;
      vx = 0;
      vy = 0;
      angle = -Math.PI / 2;
      aim = null;
      pressed = false;
      lives = 3;
      safe = 1500;
      gone = 0;
      cool = 0;
      wave = 0;
      points = 0;
      started = true;
      dead = false;
      rocks = [];
      bolts = [];
      rings = [];
      ctx.score(0);
      newWave();
    };

    ctx.onKey((key, down) => {
      if (!down) return;
      if (dead) return resetGame();
      started = true;
      aim = null;
      if (key === "action") fire();
    });

    ctx.onPointer((type, px, py) => {
      if (dead) {
        if (type === "down") resetGame();
        return;
      }
      aim = [px, py];
      if (type === "down") {
        if (started) fire();
        started = true;
        pressed = true;
      } else if (type === "up") {
        pressed = false;
      }
    });

    const step = (dt) => {
      const s = dt / 1000;
      cool -= dt;
      safe = Math.max(0, safe - dt);
      if (gone) {
        gone = Math.max(0, gone - dt);
        if (!gone) {
          x = W / 2;
          y = H / 2;
          vx = vy = 0;
          safe = 2000;
        }
      } else {
        const turn = 4.2 * s;
        if (ctx.held("left")) angle -= turn;
        if (ctx.held("right")) angle += turn;
        if (aim && Math.hypot(aim[0] - x, aim[1] - y) > 8) {
          const to = Math.atan2(aim[1] - y, aim[0] - x);
          const d = Math.atan2(Math.sin(to - angle), Math.cos(to - angle));
          angle += Math.max(-turn * 1.4, Math.min(turn * 1.4, d));
        }
        if (ctx.held("up") || pressed) {
          vx += Math.cos(angle) * 130 * s;
          vy += Math.sin(angle) * 130 * s;
        }
        if (ctx.held("action")) fire();
        const drag = Math.pow(0.55, s);
        vx *= drag;
        vy *= drag;
        const sp = Math.hypot(vx, vy);
        if (sp > 120) {
          vx *= 120 / sp;
          vy *= 120 / sp;
        }
        x += vx * s;
        y += vy * s;
        const ship = { x, y };
        wrap(ship, 4);
        x = ship.x;
        y = ship.y;
      }

      for (const r of rocks) {
        r.x += r.vx * s;
        r.y += r.vy * s;
        r.turn += r.spin * s;
        wrap(r, PART_SIZES[r.size]);
      }
      bolts = bolts.filter((b) => {
        b.x += b.vx * s;
        b.y += b.vy * s;
        wrap(b, 0);
        b.life -= s;
        const hit = rocks.find((r) => Math.hypot(r.x - b.x, r.y - b.y) < PART_SIZES[r.size] + 1);
        if (hit) {
          rocks.splice(rocks.indexOf(hit), 1);
          if (hit.size < 2) rocks.push(rock(hit.x, hit.y, hit.size + 1), rock(hit.x, hit.y, hit.size + 1));
          points += [20, 50, 100][hit.size];
          ctx.score(points);
          rings.push([hit.x, hit.y, 0]);
          ctx.play(hit.size < 2 ? "break" : "pop", { x: hit.x });
          return false;
        }
        return b.life > 0;
      });
      rings = rings.filter((ring) => (ring[2] += dt / 320) < 1);

      if (!gone && !safe && rocks.some((r) => Math.hypot(r.x - x, r.y - y) < PART_SIZES[r.size] * 0.85 + 3)) {
        lives--;
        rings.push([x, y, 0]);
        ctx.play("error", { x });
        if (!lives) {
          dead = true;
          ctx.play("gameOver");
          return ctx.over(`Wave ${wave}, ${points} points.`);
        }
        ctx.announce(`Hit. ${lives} left.`);
        gone = 900;
      }
      if (!rocks.length) {
        ctx.play("success");
        ctx.announce(`Wave ${wave} cleared.`);
        newWave();
        safe = 1500;
      }
    };

    ctx.frame((dt) => {
      if (started && !dead) step(dt);

      g.clearRect(0, 0, W, H);
      g.font = `8px ${ctx.fonts.mono}`;
      g.textAlign = "left";
      for (const r of rocks) {
        const size = PART_SIZES[r.size];
        g.strokeStyle = colors[PART_HUES[r.hue]] || colors.amber;
        g.lineWidth = 1.5;
        g.beginPath();
        r.edge.forEach((k, i) => {
          const a = r.turn + (i / r.edge.length) * Math.PI * 2;
          g.lineTo(r.x + Math.cos(a) * size * k, r.y + Math.sin(a) * size * k);
        });
        g.closePath();
        g.stroke();
        // Centre mark, and a diameter callout on the two larger sizes.
        g.lineWidth = 1;
        g.strokeStyle = colors.line;
        g.beginPath();
        g.moveTo(r.x - 3, r.y);
        g.lineTo(r.x + 3, r.y);
        g.moveTo(r.x, r.y - 3);
        g.lineTo(r.x, r.y + 3);
        // The callout leans away from the nearest edges, so it never runs off the frame.
        const sx = r.x + size + 30 > W ? -1 : 1;
        const sy = r.y - size - 10 < 0 ? -1 : 1;
        if (r.size < 2) {
          g.moveTo(r.x + sx * size * 0.6, r.y - sy * size * 0.6);
          g.lineTo(r.x + sx * (size + 4), r.y - sy * (size + 3));
          g.lineTo(r.x + sx * (size + 10), r.y - sy * (size + 3));
        }
        g.stroke();
        if (r.size < 2) {
          g.fillStyle = colors.muted;
          g.textAlign = sx > 0 ? "left" : "right";
          g.fillText(`Ø${size * 2}`, r.x + sx * (size + 11), r.y - sy * size + (sy < 0 ? 8 : 0));
          g.textAlign = "left";
        }
      }
      g.strokeStyle = colors.muted;
      for (const [rx, ry, t] of rings) {
        g.globalAlpha = 1 - t;
        g.beginPath();
        g.arc(rx, ry, 3 + t * (ctx.reduced ? 2 : 12), 0, Math.PI * 2);
        g.stroke();
      }
      g.globalAlpha = 1;
      g.strokeStyle = colors.ink;
      g.lineWidth = 1.5;
      g.beginPath();
      for (const b of bolts) {
        g.moveTo(b.x, b.y);
        g.lineTo(b.x - b.vx / 60, b.y - b.vy / 60);
      }
      g.stroke();

      // The ship: a dimension arrowhead with its line trailing; blinks while it is safe.
      if (!gone && !(safe && !ctx.reduced && Math.floor(safe / 150) % 2)) {
        const c = Math.cos(angle);
        const sn = Math.sin(angle);
        const pt = (f, side) => [x + c * f - sn * side, y + sn * f + c * side];
        // Filled, in the signal blue: the one solid shape on a field of outlined parts.
        const ink = dead ? colors.accent : colors.signal;
        g.fillStyle = ink;
        g.strokeStyle = ink;
        g.lineWidth = 2;
        g.beginPath();
        const p1 = pt(8, 0);
        const p2 = pt(-5, 5);
        const p3 = pt(-5, -5);
        g.moveTo(p1[0], p1[1]);
        g.lineTo(p2[0], p2[1]);
        g.lineTo(p3[0], p3[1]);
        g.closePath();
        g.fill();
        g.beginPath();
        const p4 = pt(-5, 0);
        const p5 = pt(-11, 0);
        g.moveTo(p4[0], p4[1]);
        g.lineTo(p5[0], p5[1]);
        g.stroke();
        if ((ctx.held("up") || pressed) && started && !dead) {
          g.strokeStyle = colors.muted;
          g.lineWidth = 1;
          g.setLineDash([2, 2]);
          g.beginPath();
          const p6 = pt(-11, 0);
          const p7 = pt(-17, 0);
          g.moveTo(p6[0], p6[1]);
          g.lineTo(p7[0], p7[1]);
          g.stroke();
          g.setLineDash([]);
        }
      }

      g.font = `9px ${ctx.fonts.mono}`;
      g.fillStyle = colors.muted;
      g.fillText(`WAVE ${wave}`, 8, 11);
      g.textAlign = "right";
      g.fillText(`${lives} ${lives === 1 ? "SHIP" : "SHIPS"}`, W - 8, 11);
      if (!started) {
        g.textAlign = "center";
        g.fillStyle = colors.ink;
        g.fillText("WASD/ARROWS, SPACE FIRES", W / 2, H - 14);
      }

      if (dead) {
        g.fillStyle = colors.paper;
        g.fillRect(W / 2 - 60, H / 2 - 16, 120, 32);
        g.strokeStyle = colors.accent;
        g.strokeRect(W / 2 - 60, H / 2 - 16, 120, 32);
        g.fillStyle = colors.accent;
        g.textAlign = "center";
        g.font = `bold 10px ${ctx.fonts.mono}`;
        g.fillText("HULL BREACH", W / 2, H / 2 - 4);
        g.fillStyle = colors.signal;
        g.font = `8px ${ctx.fonts.mono}`;
        g.fillText("TAP OR RESTART", W / 2, H / 2 + 8);
      }
    });

    return () => {};
  };

  // --- GAME 12: STACK LAYERS (Tetris Block Stacker) ---
  const stackGame = (ctx) => {
    const { g, colors, width: W, height: H } = ctx;
    const COLS = 10;
    const ROWS = 18;
    const CELL = Math.floor((H - 12) / ROWS);
    const ox = 18;
    const oy = Math.floor((H - ROWS * CELL) / 2);
    const px = ox + COLS * CELL + 16;

    const PIECES = [
      [4, [0, 1, 1, 1, 2, 1, 3, 1]], // I piece
      [2, [0, 0, 1, 0, 0, 1, 1, 1]], // O piece
      [3, [1, 0, 0, 1, 1, 1, 2, 1]], // T piece
      [3, [1, 0, 2, 0, 0, 1, 1, 1]], // S piece
      [3, [0, 0, 1, 0, 1, 1, 2, 1]], // Z piece
      [3, [0, 0, 0, 1, 1, 1, 2, 1]], // J piece
      [3, [2, 0, 0, 1, 1, 1, 2, 1]], // L piece
    ];
    const TINTS = ["teal", "amber", "violet", "green", "blue", "teal", "amber"];
    const LAYERS = ["RUST", "TYPESCRIPT", "REACT", "NEXT.JS", "NODE.JS", "CONVEX", "POSTGRES", "TAILWIND", "DOCKER", "ZOD"];

    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(-1));
    let laid = [];
    let bag = [];

    const drawPiece = () => {
      if (!bag.length) bag = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
      return bag.pop();
    };

    const make = (kind) => {
      const [n, cells] = PIECES[kind];
      return { kind, cells: [...cells], x: Math.floor((COLS - n) / 2), y: kind ? 0 : -1 };
    };

    let piece = make(drawPiece());
    let next = drawPiece();
    let lines = 0;
    let points = 0;
    let clock = 0;
    let started = false;
    let dead = false;
    let flash = [];
    let fade = 0;
    let nudge = 0;

    const resetGame = () => {
      board = Array.from({ length: ROWS }, () => Array(COLS).fill(-1));
      laid = [];
      bag = [];
      lines = 0;
      points = 0;
      clock = 0;
      started = true;
      dead = false;
      flash = [];
      fade = 0;
      nudge = 0;
      piece = make(drawPiece());
      next = drawPiece();
      ctx.score(0);
      ctx.play("success");
    };

    const fits = (cells, x, y) => {
      for (let i = 0; i < 8; i += 2) {
        const c = x + cells[i];
        const r = y + cells[i + 1];
        if (c < 0 || c >= COLS || r >= ROWS || (r >= 0 && board[r][c] >= 0)) return false;
      }
      return true;
    };

    const move = (dx) => {
      if (!fits(piece.cells, piece.x + dx, piece.y)) return false;
      piece.x += dx;
      return true;
    };

    const rotate = () => {
      if (dead) return;
      const n = PIECES[piece.kind][0];
      const turned = piece.cells.map((_, i, c) => (i % 2 ? c[i - 1] : n - 1 - c[i + 1]));
      // Wall kicks [0, -1, 1, -2, 2]
      for (const dx of [0, -1, 1, -2, 2]) {
        if (fits(turned, piece.x + dx, piece.y)) {
          piece.cells = turned;
          piece.x += dx;
          ctx.play("tick", { x: ox + piece.x * CELL });
          return;
        }
      }
    };

    const lock = () => {
      for (let i = 0; i < 8; i += 2) {
        const r = piece.y + piece.cells[i + 1];
        if (r < 0) return end();
      }
      for (let i = 0; i < 8; i += 2) {
        const r = piece.y + piece.cells[i + 1];
        const c = piece.x + piece.cells[i];
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
          board[r][c] = piece.kind;
        }
      }
      flash = [];
      for (let r = 0; r < ROWS; r++) {
        if (board[r].every((c) => c >= 0)) {
          board.splice(r, 1);
          board.unshift(Array(COLS).fill(-1));
          flash.push(r);
          laid.push(LAYERS[(lines + flash.length - 1) % LAYERS.length]);
        }
      }
      const level = 1 + Math.floor(lines / 6);
      if (flash.length) {
        lines += flash.length;
        points += [0, 100, 300, 500, 800][flash.length] * level;
        fade = 1;
        ctx.play(flash.length > 3 ? "success" : "break", { x: W / 2 });
        ctx.play("note", { index: Math.min(8, lines % 9), delay: 0.08 });
        ctx.score(points);
      } else {
        ctx.play("tap", { x: ox + piece.x * CELL });
      }
      piece = make(next);
      next = drawPiece();
      if (!fits(piece.cells, piece.x, piece.y)) end();
    };

    const end = () => {
      dead = true;
      ctx.play("gameOver");
      ctx.over(`Stack Full! ${lines} layers, ${points} pts.`);
    };

    const fall = () => {
      if (fits(piece.cells, piece.x, piece.y + 1)) piece.y++;
      else lock();
    };

    const drop = () => {
      if (dead) return;
      while (fits(piece.cells, piece.x, piece.y + 1)) piece.y++;
      nudge = 1;
      lock();
    };

    ctx.onKey((key, down, event) => {
      if (!down) return;
      if (dead) {
        if (key) resetGame();
        return;
      }
      if (!started) { started = true; return; }

      if (key === "left") {
        if (move(-1)) ctx.play("tick", { x: ox + piece.x * CELL });
      } else if (key === "right") {
        if (move(1)) ctx.play("tick", { x: ox + piece.x * CELL });
      } else if (key === "up") {
        rotate();
      } else if (key === "down") {
        fall();
        clock = 0;
      } else if (key === "action") {
        drop();
      }
    });

    ctx.onPointer((type, x, y) => {
      if (type !== "down") return;
      if (dead) return resetGame();
      if (!started) return void (started = true);
      if (x < px - 8) rotate();
      else drop();
    });

    const tile = (tx, ty, size, hue, weight) => {
      g.save();
      g.beginPath();
      g.rect(tx, ty, size, size);
      g.clip();
      g.fillStyle = hue;
      g.globalAlpha = 0.25;
      g.fill();
      g.globalAlpha = 1;
      g.strokeStyle = hue;
      g.lineWidth = 1;
      g.beginPath();
      for (let d = -size; d < size; d += 3.5) {
        g.moveTo(tx + d, ty + size);
        g.lineTo(tx + d + size, ty);
      }
      g.stroke();
      g.restore();
      g.strokeStyle = hue;
      g.lineWidth = weight;
      g.strokeRect(tx + weight / 2, ty + weight / 2, size - weight, size - weight);
    };

    const cellsOf = (p, py = p.y) => [0, 2, 4, 6].map((i) => [p.x + p.cells[i], py + p.cells[i + 1]]);

    ctx.frame((dt) => {
      if (started && !dead) {
        const level = 1 + Math.floor(lines / 6);
        const every = Math.max(130, 720 - (level - 1) * 60) * (ctx.reduced ? 1.25 : 1);
        clock += dt;
        while (clock > every && !dead) {
          clock -= every;
          fall();
        }
      }
      fade = Math.max(0, fade - dt / 320);
      nudge = Math.max(0, nudge - dt / 120);

      g.clearRect(0, 0, W, H);
      const shake = ctx.reduced ? 0 : nudge * 1.5;

      // Board grid
      g.fillStyle = colors.line;
      for (let c = 1; c < COLS; c++) {
        for (let r = 1; r < ROWS; r++) {
          g.fillRect(ox + c * CELL - 0.5, oy + r * CELL - 0.5, 1, 1);
        }
      }
      g.strokeStyle = colors.muted;
      g.lineWidth = 1;
      g.strokeRect(ox - 0.5, oy - 0.5 + shake, COLS * CELL + 1, ROWS * CELL + 1);

      // Stacked blocks
      board.forEach((row, r) => {
        row.forEach((k, c) => {
          if (k >= 0) tile(ox + c * CELL, oy + r * CELL + shake, CELL, colors[TINTS[k]] || colors.teal, 1);
        });
      });

      // Clear row flash animation
      if (fade && !ctx.reduced) {
        g.strokeStyle = colors.signal;
        g.globalAlpha = fade;
        g.lineWidth = 1.5;
        g.beginPath();
        for (const r of flash) {
          g.moveTo(ox - 6, oy + r * CELL + CELL / 2);
          g.lineTo(ox + COLS * CELL + 6, oy + r * CELL + CELL / 2);
        }
        g.stroke();
        g.globalAlpha = 1;
      }

      // Live piece and landing ghost projection
      if (!dead) {
        let land = piece.y;
        while (fits(piece.cells, piece.x, land + 1)) land++;
        // Ghost piece
        g.strokeStyle = colors.muted;
        g.setLineDash([2, 2]);
        g.lineWidth = 1;
        for (const [c, r] of cellsOf(piece, land)) {
          if (r >= 0) g.strokeRect(ox + c * CELL + 1, oy + r * CELL + 1, CELL - 2, CELL - 2);
        }
        g.setLineDash([]);
        // Falling active piece
        for (const [c, r] of cellsOf(piece)) {
          if (r >= 0) tile(ox + c * CELL, oy + r * CELL, CELL, colors[TINTS[piece.kind]] || colors.signal, 2);
        }
      }

      // Legend panel on right
      g.font = `9px ${ctx.fonts.mono}`;
      g.textAlign = "left";
      g.fillStyle = colors.muted;
      g.fillText("NEXT", px, oy + 8);
      const [n, cells] = PIECES[next];
      for (let i = 0; i < 8; i += 2) {
        tile(px + 4 + cells[i] * 7 + (4 - n) * 3.5, oy + 14 + cells[i + 1] * 7, 7, colors[TINTS[next]] || colors.amber, 1);
      }

      g.fillText("SECTION A-A", px, oy + 54);
      g.strokeStyle = colors.line;
      g.beginPath();
      g.moveTo(px, oy + 58.5);
      g.lineTo(W - 8, oy + 58.5);
      g.stroke();

      const shown = laid.slice(-6).reverse();
      shown.forEach((word, i) => {
        const y = oy + 64 + i * 11;
        tile(px, y, 8, colors[TINTS[(laid.length - 1 - i) % 7]] || colors.green, 1);
        g.fillStyle = i ? colors.muted : colors.ink;
        g.fillText(word, px + 12, y + 7);
      });
      if (!shown.length) g.fillText("no layers yet", px, oy + 71);

      g.fillStyle = colors.muted;
      g.fillText(`LV ${1 + Math.floor(lines / 6)} | PTS ${points}`, px, oy + ROWS * CELL - 4);

      if (!started && !dead) {
        g.fillStyle = colors.paper;
        g.fillRect(ox + 2, oy + (ROWS * CELL) / 2 - 12, COLS * CELL - 4, 24);
        g.fillStyle = colors.ink;
        g.textAlign = "center";
        g.fillText("TAP OR ARROW", ox + (COLS * CELL) / 2, oy + (ROWS * CELL) / 2 - 2);
        g.fillText("TO START", ox + (COLS * CELL) / 2, oy + (ROWS * CELL) / 2 + 8);
      }

      if (dead) {
        g.fillStyle = colors.paper;
        g.fillRect(ox + 2, oy + (ROWS * CELL) / 2 - 16, COLS * CELL - 4, 32);
        g.fillStyle = colors.accent;
        g.textAlign = "center";
        g.font = `bold 10px ${ctx.fonts.mono}`;
        g.fillText("GAME OVER", ox + (COLS * CELL) / 2, oy + (ROWS * CELL) / 2 - 4);
        g.fillStyle = colors.signal;
        g.font = `8px ${ctx.fonts.mono}`;
        g.fillText("TAP OR RESTART", ox + (COLS * CELL) / 2, oy + (ROWS * CELL) / 2 + 8);
      }
    });

    return () => {};
  };

  // --- PUBLIC API ---
  const GAMES = {
    pong: pongGame,
    soccer: pongGame, // replaces Robo Soccer with new pong
    breakout: breakoutGame,
    typing: typingGame,
    memory: memoryGame,
    reaction: reactionGame,
    sheets: sheetsGame,
    punch: punchGame,
    words: wordsGame,
    plane: planeGame,
    redline: redlineGame,
    parts: partsGame,
    stack: stackGame,
  };

  let activeHost = null;

  window.ArcadeSuite = {
    games: GAMES,
    start: function (gameId, canvas, options) {
      if (activeHost) {
        activeHost.stop();
        activeHost = null;
      }
      const fn = GAMES[gameId] || pongGame;
      activeHost = createArcadeHost(canvas, fn, options);
      return activeHost;
    },
    stop: function () {
      if (activeHost) {
        activeHost.stop();
        activeHost = null;
      }
    },
    togglePause: function () {
      if (activeHost && activeHost.togglePause) {
        return activeHost.togglePause();
      }
      return false;
    },
    isPaused: function () {
      return activeHost && activeHost.isPaused ? activeHost.isPaused() : false;
    },
    getHost: function () {
      return activeHost;
    },
  };
})();
