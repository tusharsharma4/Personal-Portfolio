/**
 * Live Cathode Ray Oscilloscope (CRO) Canvas Simulation Engine
 * Recreates authentic lab oscilloscope graticule, electron beam glow,
 * phosphor persistence, and real-time signal generation for skills inspection.
 */

class CROInspector {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.animationId = null;
        this.phase = 0;
        
        // Signal parameters
        this.currentWaveform = "sine";
        this.frequency = 6.0;        // Base frequency
        this.targetFrequency = 6.0;
        this.amplitude = 0.65;       // Normalized amplitude (0 to 1)
        this.targetAmplitude = 0.65;
        this.noiseAmount = 0.04;
        this.timeDiv = 1.0;          // Timebase scale
        this.voltsDiv = 1.0;         // Vertical scale
        
        // Active probe metadata
        this.probeLabel = "Embedded C - Register-level firmware, ISR timers, UART/SPI/I2C drivers";
        this.ch1Info = "CH1: 8.0 kHz | Vpp: 3.3V";
        
        // Beam color (matches active CRT tube theme)
        this.beamColor = "#f59e0b"; // default amber
        this.beamGlow = "rgba(245, 158, 11, 0.45)";
        this.graticuleColor = "rgba(245, 158, 11, 0.18)";
        
        this.isRunning = true;
        this.resize();
        this.initControls();
        this.start();
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = (rect.width || 600) * dpr;
        this.canvas.height = (rect.height || 180) * dpr;
        this.ctx.scale(dpr, dpr);
        this.width = rect.width || 600;
        this.height = rect.height || 180;
    }

    setThemeColors(hex, glow, graticule) {
        this.beamColor = hex || "#f59e0b";
        this.beamGlow = glow || "rgba(245, 158, 11, 0.45)";
        this.graticuleColor = graticule || "rgba(245, 158, 11, 0.18)";
    }

    setSignal(config, skillName, skillDesc) {
        if (!config) return;
        this.currentWaveform = config.type || "sine";
        this.targetFrequency = config.freq || 6.0;
        this.targetAmplitude = 0.7;
        this.probeLabel = `${skillName}: ${skillDesc || ''}`;
        this.ch1Info = `CH1: ${(config.freq || 8).toFixed(1)} kHz | Vpp: ${config.vpp || '3.3V'}`;
        
        // Update DOM elements if present
        const labelEl = document.getElementById('croProbeTarget');
        const infoEl = document.getElementById('croChInfo');
        if (labelEl) labelEl.textContent = `PROBE TARGET: ${this.probeLabel}`;
        if (infoEl) infoEl.textContent = this.ch1Info;
    }

    initControls() {
        // Controls will hook into channel 2 UI elements
        const timeKnob = document.getElementById('croTimeDivBtn');
        const voltsKnob = document.getElementById('croVoltsDivBtn');
        const waveBtn = document.getElementById('croWaveBtn');

        if (timeKnob) {
            timeKnob.addEventListener('click', () => {
                const times = [0.5, 1.0, 1.5, 2.0, 0.25];
                let idx = times.indexOf(this.timeDiv);
                this.timeDiv = times[(idx + 1) % times.length];
                timeKnob.textContent = `TIME/DIV: ${this.timeDiv}x`;
                if (window.retroAudio) window.retroAudio.playKnobClick();
            });
        }

        if (voltsKnob) {
            voltsKnob.addEventListener('click', () => {
                const volts = [0.5, 0.8, 1.0, 1.3];
                let idx = volts.indexOf(this.voltsDiv);
                this.voltsDiv = volts[(idx + 1) % volts.length];
                voltsKnob.textContent = `VOLTS/DIV: ${this.voltsDiv}x`;
                if (window.retroAudio) window.retroAudio.playKnobClick();
            });
        }

        if (waveBtn) {
            waveBtn.addEventListener('click', () => {
                const waves = ["sine", "square", "sawtooth", "triangle", "burst"];
                let idx = waves.indexOf(this.currentWaveform);
                this.currentWaveform = waves[(idx + 1) % waves.length];
                waveBtn.textContent = `MODE: ${this.currentWaveform.toUpperCase()}`;
                if (window.retroAudio) window.retroAudio.playKnobClick();
            });
        }
    }

    drawGraticule() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        ctx.strokeStyle = this.graticuleColor;
        ctx.lineWidth = 1;

        // 8 vertical divisions, 4 horizontal divisions
        const xDivs = 10;
        const yDivs = 6;
        const xStep = w / xDivs;
        const yStep = h / yDivs;

        // Grid lines
        ctx.beginPath();
        for (let i = 1; i < xDivs; i++) {
            const x = Math.round(i * xStep) + 0.5;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }
        for (let j = 1; j < yDivs; j++) {
            const y = Math.round(j * yStep) + 0.5;
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
        ctx.stroke();

        // Center crosshair with sub-ticks (authentic lab oscilloscope feel)
        const centerX = Math.round(w / 2) + 0.5;
        const centerY = Math.round(h / 2) + 0.5;

        ctx.strokeStyle = this.beamGlow;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        // Center X line tick marks
        for (let x = 0; x < w; x += xStep / 5) {
            ctx.moveTo(x, centerY - 3);
            ctx.lineTo(x, centerY + 3);
        }
        // Center Y line tick marks
        for (let y = 0; y < h; y += yStep / 5) {
            ctx.moveTo(centerX - 3, y);
            ctx.lineTo(centerX + 3, y);
        }
        ctx.stroke();
    }

    computeSample(t) {
        const type = this.currentWaveform;
        let val = 0;

        switch (type) {
            case "square": {
                val = Math.sin(t) >= 0 ? 1 : -1;
                // Add realistic analog rise/fall rounding
                const sineComponent = Math.sin(t * 3) * 0.15 + Math.sin(t * 5) * 0.08;
                val = (Math.sin(t) >= 0 ? 0.9 : -0.9) + sineComponent;
                break;
            }
            case "sawtooth": {
                const norm = (t / (2 * Math.PI)) % 1;
                val = (norm >= 0 ? norm : 1 + norm) * 2 - 1;
                break;
            }
            case "triangle": {
                const norm = (t / (2 * Math.PI)) % 1;
                const pos = norm >= 0 ? norm : 1 + norm;
                val = pos < 0.5 ? (pos * 4 - 1) : (3 - pos * 4);
                break;
            }
            case "burst": {
                // Digital packet burst with sync preamble
                const burstCycle = (t / (4 * Math.PI)) % 1;
                if (burstCycle < 0.6) {
                    val = Math.sin(t * 4) > 0 ? 0.85 : -0.85;
                } else {
                    val = Math.sin(t * 0.5) * 0.15;
                }
                break;
            }
            case "pulse": {
                // Short clock pulses
                const cycle = (t / (2 * Math.PI)) % 1;
                val = cycle < 0.2 ? 1 : -0.3;
                break;
            }
            case "sine":
            default: {
                // Fundamental + slight 3rd harmonic for warm analog vibe
                val = Math.sin(t) + 0.08 * Math.sin(3 * t);
                break;
            }
        }

        // Add subtle high-frequency thermal noise
        const noise = (Math.random() * 2 - 1) * this.noiseAmount;
        return val + noise;
    }

    draw() {
        if (!this.canvas || !this.isRunning) return;

        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        const centerY = h / 2;

        // Smoothly interpolate frequency and amplitude transitions
        this.frequency += (this.targetFrequency - this.frequency) * 0.1;
        this.amplitude += (this.targetAmplitude - this.amplitude) * 0.1;

        // Dark oscilloscope CRT background with faint phosphor trail persistence
        ctx.fillStyle = "rgba(10, 14, 18, 0.4)";
        ctx.fillRect(0, 0, w, h);

        // Draw reticle / graticule
        this.drawGraticule();

        // Advance phase for sweeping wave animation
        this.phase += 0.08 * this.frequency;

        // Draw electron beam path
        const maxAmp = (h * 0.38) * this.amplitude * this.voltsDiv;
        const stepX = 2; // Pixel step

        // Pass 1: Wide diffuse phosphor glow
        ctx.save();
        ctx.strokeStyle = this.beamGlow;
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();

        for (let x = 0; x <= w; x += stepX) {
            const t = (x / w) * (Math.PI * 2) * (this.frequency * this.timeDiv) + this.phase;
            const sample = this.computeSample(t);
            const y = centerY - sample * maxAmp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Pass 2: Intense inner electron beam core
        ctx.strokeStyle = this.beamColor;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = this.beamColor;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();

        // Request next frame
        this.animationId = requestAnimationFrame(() => this.draw());
    }

    start() {
        if (!this.animationId) {
            this.isRunning = true;
            this.draw();
        }
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

window.CROInspector = CROInspector;
