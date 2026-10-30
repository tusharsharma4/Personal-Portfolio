/**
 * CRT Arcade Engine: Playable CRT Pong & Phosphor Snake
 * Rendered with authentic CRT raster aesthetic, glowing phosphor trails,
 * scanlines, and 8-bit procedural sound effects.
 */

class RetroArcade {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.currentGame = 'menu'; // 'menu', 'pong', 'snake'
        this.animationId = null;
        this.lastTime = 0;
        
        // Colors
        this.themeColor = '#38bdf8';
        this.glowColor = 'rgba(56, 189, 248, 0.4)';
        
        // Game states
        this.pong = {
            playerY: 100,
            cpuY: 100,
            paddleH: 45,
            paddleW: 8,
            ballX: 150,
            ballY: 100,
            ballVx: 3.5,
            ballVy: 2.0,
            playerScore: 0,
            cpuScore: 0,
            targetScore: 5,
            trails: [],
            isGameOver: false,
            winner: null
        };

        this.snake = {
            gridSize: 14,
            gridW: 0,
            gridH: 0,
            body: [],
            direction: { x: 1, y: 0 },
            nextDirection: { x: 1, y: 0 },
            food: { x: 5, y: 5 },
            score: 0,
            highScore: parseInt(localStorage.getItem('tushar_snake_hi') || '0', 10),
            speed: 110, // ms per step
            lastMove: 0,
            isGameOver: false
        };

        this.keys = {};
        this.bindEvents();
        this.resize();
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.width = rect.width || 560;
        this.height = rect.height || 320;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Setup snake grid
        this.snake.gridW = Math.floor(this.width / this.snake.gridSize);
        this.snake.gridH = Math.floor(this.height / this.snake.gridSize);
    }

    setTheme(color, glow) {
        this.themeColor = color || '#38bdf8';
        this.glowColor = glow || 'rgba(56, 189, 248, 0.4)';
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            this.handleKey(e);
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Mouse move for Pong paddle
        if (this.canvas) {
            this.canvas.addEventListener('mousemove', (e) => {
                if (this.currentGame === 'pong') {
                    const rect = this.canvas.getBoundingClientRect();
                    const mouseY = e.clientY - rect.top;
                    this.pong.playerY = Math.max(10, Math.min(this.height - this.pong.paddleH - 10, mouseY - this.pong.paddleH / 2));
                }
            });

            this.canvas.addEventListener('touchmove', (e) => {
                if (this.currentGame === 'pong' && e.touches[0]) {
                    e.preventDefault();
                    const rect = this.canvas.getBoundingClientRect();
                    const touchY = e.touches[0].clientY - rect.top;
                    this.pong.playerY = Math.max(10, Math.min(this.height - this.pong.paddleH - 10, touchY - this.pong.paddleH / 2));
                }
            }, { passive: false });
        }
    }

    handleKey(e) {
        if (this.currentGame === 'snake') {
            const cur = this.snake.direction;
            if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && cur.y === 0) {
                this.snake.nextDirection = { x: 0, y: -1 };
                e.preventDefault();
            } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && cur.y === 0) {
                this.snake.nextDirection = { x: 0, y: 1 };
                e.preventDefault();
            } else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && cur.x === 0) {
                this.snake.nextDirection = { x: -1, y: 0 };
                e.preventDefault();
            } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && cur.x === 0) {
                this.snake.nextDirection = { x: 1, y: 0 };
                e.preventDefault();
            }
        } else if (this.currentGame === 'pong') {
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                this.pong.playerY = Math.max(10, this.pong.playerY - 24);
                e.preventDefault();
            } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                this.pong.playerY = Math.min(this.height - this.pong.paddleH - 10, this.pong.playerY + 24);
                e.preventDefault();
            }
        }
    }

    startPong() {
        this.currentGame = 'pong';
        this.pong.playerScore = 0;
        this.pong.cpuScore = 0;
        this.pong.isGameOver = false;
        this.pong.winner = null;
        this.resetPongBall();
        this.runLoop();
    }

    resetPongBall() {
        this.pong.ballX = this.width / 2;
        this.pong.ballY = this.height / 2;
        const dirX = Math.random() > 0.5 ? 1 : -1;
        const angle = (Math.random() * 0.8 - 0.4);
        const speed = 4.0;
        this.pong.ballVx = dirX * speed;
        this.pong.ballVy = angle * speed;
        this.pong.trails = [];
    }

    startSnake() {
        this.currentGame = 'snake';
        this.snake.gridW = Math.floor(this.width / this.snake.gridSize);
        this.snake.gridH = Math.floor(this.height / this.snake.gridSize);
        const midX = Math.floor(this.snake.gridW / 2);
        const midY = Math.floor(this.snake.gridH / 2);
        
        this.snake.body = [
            { x: midX, y: midY },
            { x: midX - 1, y: midY },
            { x: midX - 2, y: midY }
        ];
        this.snake.direction = { x: 1, y: 0 };
        this.snake.nextDirection = { x: 1, y: 0 };
        this.snake.score = 0;
        this.snake.speed = 100;
        this.snake.isGameOver = false;
        this.spawnFood();
        this.runLoop();
    }

    spawnFood() {
        let valid = false;
        let fx, fy;
        while (!valid) {
            fx = Math.floor(Math.random() * (this.snake.gridW - 2)) + 1;
            fy = Math.floor(Math.random() * (this.snake.gridH - 2)) + 1;
            valid = !this.snake.body.some(seg => seg.x === fx && seg.y === fy);
        }
        this.snake.food = { x: fx, y: fy };
    }

    showMenu() {
        this.currentGame = 'menu';
        this.drawMenu();
    }

    runLoop() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        
        const loop = (timestamp) => {
            if (this.currentGame === 'pong') {
                this.updatePong();
                this.drawPong();
            } else if (this.currentGame === 'snake') {
                this.updateSnake(timestamp);
                this.drawSnake();
            } else {
                this.drawMenu();
                return;
            }
            this.animationId = requestAnimationFrame(loop);
        };
        this.animationId = requestAnimationFrame(loop);
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /* ==============================================================
       PONG LOGIC & RENDERING
       ============================================================== */
    updatePong() {
        if (this.pong.isGameOver) return;

        const p = this.pong;
        const w = this.width;
        const h = this.height;

        // Ball trail persistence
        p.trails.push({ x: p.ballX, y: p.ballY, alpha: 0.7 });
        if (p.trails.length > 7) p.trails.shift();
        p.trails.forEach(t => t.alpha *= 0.85);

        // Move ball
        p.ballX += p.ballVx;
        p.ballY += p.ballVy;

        // CPU AI Paddle tracking with slight natural lag
        const targetCpuY = p.ballY - p.paddleH / 2;
        p.cpuY += (targetCpuY - p.cpuY) * 0.085;
        p.cpuY = Math.max(10, Math.min(h - p.paddleH - 10, p.cpuY));

        // Top / Bottom wall bounce
        if (p.ballY <= 10 || p.ballY >= h - 10) {
            p.ballVy *= -1;
            p.ballY = Math.max(10, Math.min(h - 10, p.ballY));
            if (window.retroAudio) window.retroAudio.playPongWall();
        }

        // Left Player Paddle Collision
        const pX = 25;
        if (p.ballX <= pX + p.paddleW && p.ballX >= pX - 4) {
            if (p.ballY >= p.playerY && p.ballY <= p.playerY + p.paddleH) {
                p.ballVx = Math.abs(p.ballVx) * 1.05; // slight speed increase
                // Deflection angle based on where it hit paddle
                const relativeHit = (p.ballY - (p.playerY + p.paddleH / 2)) / (p.paddleH / 2);
                p.ballVy = relativeHit * 4.5;
                p.ballX = pX + p.paddleW + 2;
                if (window.retroAudio) window.retroAudio.playPongPaddle();
            }
        }

        // Right CPU Paddle Collision
        const cpuX = w - 25 - p.paddleW;
        if (p.ballX >= cpuX - 4 && p.ballX <= cpuX + p.paddleW) {
            if (p.ballY >= p.cpuY && p.ballY <= p.cpuY + p.paddleH) {
                p.ballVx = -Math.abs(p.ballVx) * 1.05;
                const relativeHit = (p.ballY - (p.cpuY + p.paddleH / 2)) / (p.paddleH / 2);
                p.ballVy = relativeHit * 4.5;
                p.ballX = cpuX - 2;
                if (window.retroAudio) window.retroAudio.playPongPaddle();
            }
        }

        // Point Scored
        if (p.ballX < 0) {
            // CPU scored
            p.cpuScore++;
            if (window.retroAudio) window.retroAudio.playPongScore(false);
            if (p.cpuScore >= p.targetScore) {
                p.isGameOver = true;
                p.winner = 'CPU';
            } else {
                this.resetPongBall();
            }
        } else if (p.ballX > w) {
            // Player scored
            p.playerScore++;
            if (window.retroAudio) window.retroAudio.playPongScore(true);
            if (p.playerScore >= p.targetScore) {
                p.isGameOver = true;
                p.winner = 'PLAYER';
            } else {
                this.resetPongBall();
            }
        }
    }

    drawPong() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        const p = this.pong;

        // Dark raster background
        ctx.fillStyle = '#060a0f';
        ctx.fillRect(0, 0, w, h);

        // Center court dashed net
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();
        ctx.setLineDash([]);

        // Scoreboard
        ctx.font = '22px "Courier New", monospace';
        ctx.fillStyle = this.themeColor;
        ctx.textAlign = 'center';
        ctx.fillText(p.playerScore, w / 2 - 50, 35);
        ctx.fillText(p.cpuScore, w / 2 + 50, 35);

        // Subtitles
        ctx.font = '10px "Courier New", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillText('YOU', w / 2 - 50, 52);
        ctx.fillText('CRT-AI', w / 2 + 50, 52);

        // Ball trails
        p.trails.forEach(t => {
            ctx.fillStyle = this.glowColor;
            ctx.beginPath();
            ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Ball
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = this.themeColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.ballX, p.ballY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Player paddle
        ctx.fillStyle = this.themeColor;
        ctx.fillRect(25, p.playerY, p.paddleW, p.paddleH);

        // CPU paddle
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(w - 25 - p.paddleW, p.cpuY, p.paddleW, p.paddleH);

        // Game Over Banner
        if (p.isGameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.fillRect(0, h / 2 - 45, w, 90);
            ctx.font = 'bold 20px "Courier New", monospace';
            ctx.fillStyle = p.winner === 'PLAYER' ? '#10b981' : '#f43f5e';
            ctx.textAlign = 'center';
            ctx.fillText(p.winner === 'PLAYER' ? 'VICTORY! YOU DEFEATED CRT-AI' : 'GAME OVER - CRT-AI WON', w / 2, h / 2 - 8);
            ctx.font = '12px "Courier New", monospace';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('PRESS [SPACE] OR CLICK BELOW TO REPLAY', w / 2, h / 2 + 20);
        }
    }

    /* ==============================================================
       SNAKE LOGIC & RENDERING
       ============================================================== */
    updateSnake(timestamp) {
        if (this.snake.isGameOver) return;
        if (!this.snake.lastMove) this.snake.lastMove = timestamp;

        if (timestamp - this.snake.lastMove > this.snake.speed) {
            this.snake.lastMove = timestamp;
            this.snake.direction = this.snake.nextDirection;

            const head = this.snake.body[0];
            const newHead = {
                x: head.x + this.snake.direction.x,
                y: head.y + this.snake.direction.y
            };

            // Wall collision (wrap-around or wall death - retro wall death)
            if (newHead.x < 0 || newHead.x >= this.snake.gridW || newHead.y < 0 || newHead.y >= this.snake.gridH) {
                this.gameOverSnake();
                return;
            }

            // Self collision
            if (this.snake.body.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
                this.gameOverSnake();
                return;
            }

            this.snake.body.unshift(newHead);

            // Food collision
            if (newHead.x === this.snake.food.x && newHead.y === this.snake.food.y) {
                this.snake.score += 10;
                if (this.snake.score > this.snake.highScore) {
                    this.snake.highScore = this.snake.score;
                    localStorage.setItem('tushar_snake_hi', this.snake.highScore);
                }
                if (window.retroAudio) window.retroAudio.playSnakeEat();
                // Gradually speed up
                this.snake.speed = Math.max(50, 100 - Math.floor(this.snake.score / 30) * 8);
                this.spawnFood();
            } else {
                this.snake.body.pop();
            }
        }
    }

    gameOverSnake() {
        this.snake.isGameOver = true;
        if (window.retroAudio) window.retroAudio.playGameOver();
    }

    drawSnake() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        const s = this.snake;
        const g = s.gridSize;

        ctx.fillStyle = '#05080c';
        ctx.fillRect(0, 0, w, h);

        // Retro grid dots
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let x = 0; x < s.gridW; x++) {
            for (let y = 0; y < s.gridH; y++) {
                ctx.fillRect(x * g + g / 2 - 0.5, y * g + g / 2 - 0.5, 1, 1);
            }
        }

        // Draw food (pulsing phosphor)
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.fillRect(s.food.x * g + 2, s.food.y * g + 2, g - 4, g - 4);
        ctx.shadowBlur = 0;

        // Draw snake segments
        s.body.forEach((seg, i) => {
            if (i === 0) {
                ctx.fillStyle = '#ffffff'; // Head
                ctx.shadowColor = this.themeColor;
                ctx.shadowBlur = 6;
            } else {
                ctx.fillStyle = this.themeColor;
                ctx.shadowBlur = 0;
            }
            ctx.fillRect(seg.x * g + 1, seg.y * g + 1, g - 2, g - 2);
        });

        // Top HUD
        ctx.font = '12px "Courier New", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE: ${s.score}`, 12, 18);
        ctx.textAlign = 'right';
        ctx.fillText(`HI-SCORE: ${s.highScore}`, w - 12, 18);

        // Game Over
        if (s.isGameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, h / 2 - 40, w, 80);
            ctx.font = 'bold 18px "Courier New", monospace';
            ctx.fillStyle = '#ef4444';
            ctx.textAlign = 'center';
            ctx.fillText('CRASH DETECTED - GAME OVER', w / 2, h / 2 - 6);
            ctx.font = '12px "Courier New", monospace';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`FINAL SCORE: ${s.score} | PRESS [SPACE] TO RESTART`, w / 2, h / 2 + 18);
        }
    }

    drawMenu() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        ctx.fillStyle = '#05070a';
        ctx.fillRect(0, 0, w, h);

        ctx.font = 'bold 20px "Courier New", monospace';
        ctx.fillStyle = this.themeColor;
        ctx.textAlign = 'center';
        ctx.fillText('RETRO ARCADE LAB // 1989', w / 2, 50);

        ctx.font = '12px "Courier New", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('SELECT A SIMULATED CRT MINI-GAME', w / 2, 75);

        // Box 1: Pong
        ctx.strokeStyle = this.themeColor;
        ctx.strokeRect(w / 2 - 190, 110, 170, 120);
        ctx.font = 'bold 15px "Courier New", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('[ 1 ] CRT PONG', w / 2 - 105, 140);
        ctx.font = '11px "Courier New", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText('1P vs Analog AI', w / 2 - 105, 165);
        ctx.fillText('Mouse / W/S to move', w / 2 - 105, 185);
        ctx.fillText('First to 5 wins', w / 2 - 105, 205);

        // Box 2: Snake
        ctx.strokeStyle = '#10b981';
        ctx.strokeRect(w / 2 + 20, 110, 170, 120);
        ctx.font = 'bold 15px "Courier New", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('[ 2 ] PHOSPHOR SNAKE', w / 2 + 105, 140);
        ctx.font = '11px "Courier New", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText('Eat energy cells', w / 2 + 105, 165);
        ctx.fillText('Arrow keys / WASD', w / 2 + 105, 185);
        ctx.fillText(`Hi-Score: ${this.snake.highScore}`, w / 2 + 105, 205);

        ctx.font = '11px "Courier New", monospace';
        ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
        ctx.fillText('TIP: CLICK BUTTONS BELOW OR PRESS 1 OR 2 ON KEYBOARD', w / 2, h - 30);
    }
}

window.RetroArcade = RetroArcade;
