/**
 * Vintage Web Audio API Procedural Sound Synthesizer
 * 100% procedural sound design for 1990s CRT TV, mechanical switches,
 * rotary tuner, analog static bursts, and retro arcade sounds.
 */

class RetroAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.humNode = null;
        this.humGain = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        try {
            this.ctx = new AudioContext();
            this.initialized = true;
            // Warm up audio graph
            if (this.ctx.state === 'suspended') {
                const unlock = () => {
                    if (this.ctx && this.ctx.state === 'suspended') {
                        this.ctx.resume();
                    }
                    window.removeEventListener('click', unlock);
                    window.removeEventListener('keydown', unlock);
                    window.removeEventListener('touchstart', unlock);
                };
                window.addEventListener('click', unlock, { once: true });
                window.addEventListener('keydown', unlock, { once: true });
                window.addEventListener('touchstart', unlock, { once: true });
            }
        } catch (e) {
            console.warn("AudioContext init error:", e);
        }
    }

    ensureContext() {
        if (!this.initialized) {
            this.init();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.humGain) {
            this.humGain.gain.setValueAtTime(this.isMuted ? 0 : 0.015, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    setMute(mute) {
        this.isMuted = !!mute;
        if (this.humGain && this.ctx) {
            this.humGain.gain.setValueAtTime(this.isMuted ? 0 : 0.015, this.ctx.currentTime);
        }
    }

    /* ==============================================================
       POWER ON: Mechanical Latch Clunk + Degauss Coil Thump & Twang
       ============================================================== */
    playPowerOn() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. Mechanical switch click (snap impulse)
        const snapOsc = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();
        snapOsc.type = 'triangle';
        snapOsc.frequency.setValueAtTime(800, now);
        snapOsc.frequency.exponentialRampToValueAtTime(120, now + 0.03);
        snapGain.gain.setValueAtTime(0.4, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        snapOsc.connect(snapGain);
        snapGain.connect(this.ctx.destination);
        snapOsc.start(now);
        snapOsc.stop(now + 0.04);

        // 2. Heavy mechanical latch "chunk" (low frequency resonance)
        const clunkOsc = this.ctx.createOscillator();
        const clunkGain = this.ctx.createGain();
        clunkOsc.type = 'sine';
        clunkOsc.frequency.setValueAtTime(140, now);
        clunkOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
        clunkGain.gain.setValueAtTime(0.5, now);
        clunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        clunkOsc.connect(clunkGain);
        clunkGain.connect(this.ctx.destination);
        clunkOsc.start(now);
        clunkOsc.stop(now + 0.16);

        // 3. CRT Degauss Coil: Deep "BWWOOOMM-twang" that starts at ~100ms
        const degaussTime = now + 0.08;
        const degaussOsc = this.ctx.createOscillator();
        const degaussGain = this.ctx.createGain();
        const degaussFilter = this.ctx.createBiquadFilter();

        degaussFilter.type = 'lowpass';
        degaussFilter.frequency.setValueAtTime(350, degaussTime);
        degaussFilter.frequency.exponentialRampToValueAtTime(70, degaussTime + 0.7);

        degaussOsc.type = 'sawtooth';
        degaussOsc.frequency.setValueAtTime(120, degaussTime);
        degaussOsc.frequency.exponentialRampToValueAtTime(42, degaussTime + 0.8);

        degaussGain.gain.setValueAtTime(0.0, degaussTime);
        degaussGain.gain.linearRampToValueAtTime(0.6, degaussTime + 0.05);
        degaussGain.gain.exponentialRampToValueAtTime(0.001, degaussTime + 0.85);

        degaussOsc.connect(degaussFilter);
        degaussFilter.connect(degaussGain);
        degaussGain.connect(this.ctx.destination);

        degaussOsc.start(degaussTime);
        degaussOsc.stop(degaussTime + 0.9);

        // 4. Subtle static burst as beam warms up
        this.playStaticBurst(0.35, 0.18, now + 0.15);
    }

    /* ==============================================================
       POWER OFF: Flyback Transformer Pitch Drop + Mechanical Release
       ============================================================== */
    playPowerOff() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Switch release click
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(600, now);
        clickOsc.frequency.exponentialRampToValueAtTime(90, now + 0.04);
        clickGain.gain.setValueAtTime(0.35, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.06);

        // High-voltage electron beam collapse squeal & decay
        const coilOsc = this.ctx.createOscillator();
        const coilGain = this.ctx.createGain();
        coilOsc.type = 'sine';
        coilOsc.frequency.setValueAtTime(2800, now + 0.02);
        coilOsc.frequency.exponentialRampToValueAtTime(180, now + 0.45);
        coilGain.gain.setValueAtTime(0.25, now + 0.02);
        coilGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
        coilOsc.connect(coilGain);
        coilGain.connect(this.ctx.destination);
        coilOsc.start(now + 0.02);
        coilOsc.stop(now + 0.5);

        // Stop continuous hum if active
        this.stopCRTHum();
    }

    /* ==============================================================
       ROTARY CHANNEL KNOB: Heavy Dual-detent Ratchet Clunk
       ============================================================== */
    playKnobClick() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Two closely spaced clicks for mechanical ratchet feel
        [0, 0.018].forEach((delay, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(idx === 0 ? 1400 : 950, now + delay);
            filter.Q.setValueAtTime(4.0, now + delay);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(idx === 0 ? 320 : 210, now + delay);
            osc.frequency.exponentialRampToValueAtTime(60, now + delay + 0.025);

            gain.gain.setValueAtTime(0.4, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.03);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + delay);
            osc.stop(now + delay + 0.035);
        });
    }

    /* ==============================================================
       ANALOG STATIC BURST: White Noise Tuning Interference
       ============================================================== */
    playStaticBurst(duration = 0.22, volume = 0.15, startTime = null) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const start = startTime !== null ? startTime : this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * duration);
        if (bufferSize <= 0) return;

        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // Analog white noise with slight crackle modulation
            data[i] = (Math.random() * 2 - 1) * (0.8 + Math.random() * 0.4);
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;

        // Bandpass filter to make it sound like an RF VHF/UHF analog tuner
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, start);
        filter.Q.setValueAtTime(1.2, start);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume * 0.7, start);
        gain.gain.linearRampToValueAtTime(volume, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        noiseNode.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noiseNode.start(start);
        noiseNode.stop(start + duration + 0.02);
    }

    /* ==============================================================
       CONTINUOUS CRT BACKGROUND HUM (Subtle 50/60Hz Transformer)
       ============================================================== */
    startCRTHum() {
        if (this.humNode || !this.ctx) return;
        if (this.isMuted) return;

        const now = this.ctx.currentTime;
        this.humNode = this.ctx.createOscillator();
        this.humGain = this.ctx.createGain();

        // 60Hz hum with very low volume
        this.humNode.type = 'sawtooth';
        this.humNode.frequency.setValueAtTime(60, now);

        const humFilter = this.ctx.createBiquadFilter();
        humFilter.type = 'lowpass';
        humFilter.frequency.setValueAtTime(120, now);

        this.humGain.gain.setValueAtTime(0.0, now);
        this.humGain.gain.linearRampToValueAtTime(0.015, now + 1.0);

        this.humNode.connect(humFilter);
        humFilter.connect(this.humGain);
        this.humGain.connect(this.ctx.destination);

        this.humNode.start(now);
    }

    stopCRTHum() {
        if (this.humGain && this.ctx) {
            this.humGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
            setTimeout(() => {
                if (this.humNode) {
                    try { this.humNode.stop(); } catch(e){}
                    this.humNode = null;
                    this.humGain = null;
                }
            }, 250);
        }
    }

    /* ==============================================================
       RETRO KEYBOARD / TELETYPE TICK: On-screen interaction sound
       ============================================================== */
    playKeyClick() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        // Randomize pitch slightly for organic typing feel
        const pitch = 1800 + (Math.random() * 400 - 200);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.015);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.025);
    }

    /* ==============================================================
       OSCILLOSCOPE PROBE CHIRP: Skill Probe Selection
       ============================================================== */
    playProbeBeep(freq = 880) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.06);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    /* ==============================================================
       ARCADE RETRO SOUNDS (Pong & Snake)
       ============================================================== */
    playPongPaddle() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    }

    playPongWall() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
    }

    playPongScore(isWin = true) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = isWin ? [330, 440, 550, 660] : [330, 260, 200];
        const step = 0.07;
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + (idx * step);

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.18, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + step);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(start);
            osc.stop(start + step + 0.01);
        });
    }

    playSnakeEat() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
    }

    playGameOver() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const tones = [440, 370, 311, 220, 164];
        tones.forEach((freq, i) => {
            const start = now + i * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.2, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(start);
            osc.stop(start + 0.1);
        });
    }

    /* ==============================================================
       RADIO TELEMETRY / MORSE CODE TRANSMIT
       ============================================================== */
    playTransmitBeeps() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const pattern = [0.05, 0.05, 0.15, 0.05, 0.05, 0.15, 0.05]; // dits and dahs
        let current = now;

        pattern.forEach((dur, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(750 + (i % 2 === 0 ? 50 : 0), current);

            gain.gain.setValueAtTime(0.18, current);
            gain.gain.exponentialRampToValueAtTime(0.001, current + dur);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(current);
            osc.stop(current + dur + 0.01);

            current += dur + 0.04;
        });
    }
}

// Global audio singleton
window.retroAudio = new RetroAudioEngine();
