/**
 * TV Controller & State Orchestrator
 * Controls Power, Channel Tuning, Rotary Knob, Chassis, Phosphor Tube,
 * Audio synchronization, and DOM rendering.
 */

class TVController {
    constructor() {
        this.isPoweredOn = false;
        this.currentChannel = 0;
        this.currentChassis = 'wood'; // 'wood' or 'beige'
        this.tubeThemes = ['bw', 'amber', 'green', 'color', 'cyan'];
        this.currentTubeIdx = 0; // default mono (B&W)
        
        this.croInstance = null;
        this.arcadeInstance = null;
        this.activeProjectIdx = 0;
        this.osdTimeout = null;
        
        this.init();
    }

    init() {
        this.renderData();
        this.bindEvents();
        this.updateKnobAngle();
        this.updateChassisUI();
        this.updateTubeUI();
    }

    /* ==============================================================
       DATA POPULATION (From js/data.js)
       ============================================================== */
    renderData() {
        const data = window.PORTFOLIO_DATA;
        if (!data) return;

        // 1. Render TV Guide (Channel 0)
        const guideGrid = document.getElementById('tvGuideGrid');
        if (guideGrid) {
            guideGrid.innerHTML = data.channels.map(ch => `
                <div class="guide-item" data-ch="${ch.id}">
                    <span class="guide-code">${ch.code}</span>
                    <span class="guide-name">${ch.title}</span>
                    <span class="guide-desc">${ch.subtitle}</span>
                </div>
            `).join('');

            guideGrid.querySelectorAll('.guide-item').forEach(item => {
                item.addEventListener('click', () => {
                    const ch = parseInt(item.getAttribute('data-ch'), 10);
                    this.setChannel(ch);
                });
            });
        }

        // 2. Render Profile & Bio (Channel 1)
        const p = data.profile;
        const c = data.contact;
        const profileContainer = document.getElementById('profileChannelContent');
        if (profileContainer) {
            profileContainer.innerHTML = `
                <div class="teletext-card">
                    <div class="profile-header-flex">
                        <div class="profile-avatar-frame">
                            <img src="${p.avatar}" alt="${p.name}" class="profile-avatar-img" onerror="this.style.display='none'">
                        </div>
                        <div class="profile-meta-col">
                            <div class="profile-headline">${p.name}</div>
                            <div class="profile-subtitle">${p.title}</div>
                            <div class="profile-contacts-strip">
                                <a href="${c.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-pill-link">
                                    <span>💼</span> ${c.linkedinDisplay}
                                </a>
                                <a href="${c.website}" target="_blank" rel="noopener noreferrer" class="contact-pill-link">
                                    <span>🌐</span> ${c.websiteDisplay}
                                </a>
                                <a href="mailto:${c.email}" class="contact-pill-link">
                                    <span>✉</span> ${c.email}
                                </a>
                                <a href="tel:${c.phoneRaw}" class="contact-pill-link">
                                    <span>📞</span> ${c.phone}
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Academic Education Box -->
                    <div class="profile-edu-box">
                        <div>
                            <div class="edu-school-name">🎓 ${p.academicDetails.college}</div>
                            <div class="edu-degree">${p.academicDetails.degree} // ${p.academicDetails.duration}</div>
                        </div>
                        <div class="edu-score-badge">CGPA: ${p.academicDetails.cgpa}</div>
                    </div>

                    <div class="bio-paragraph">${p.bio[0]}</div>
                    <div class="bio-paragraph">${p.bio[1]}</div>
                    <div class="bio-paragraph">${p.bio[2]}</div>
                    
                    <div class="stats-grid">
                        ${p.stats.map(s => `
                            <div class="stat-box">
                                <div class="stat-value">${s.value}</div>
                                <div class="stat-label">${s.label}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-top: 10px;">
                        <div style="font-size: 11px; letter-spacing: 1px; font-weight: bold;">
                            TECHNICAL DOMAINS & INTERESTS:
                        </div>
                        <a href="${p.resumeUrl}" download="Tushar_Sharma_Resume.pdf" class="resume-download-btn">
                            <span>📄</span> DOWNLOAD OFFICIAL RESUME (PDF)
                        </a>
                    </div>

                    <div class="interests-pill-list">
                        ${p.interests.map(i => `<span class="interest-pill">${i}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        // 3. Render Technical Skills & CRO Lab (Channel 2)
        const skillsContainer = document.getElementById('skillsCategoriesContainer');
        if (skillsContainer) {
            skillsContainer.innerHTML = data.skillsCategories.map((cat, catIdx) => `
                <div class="skills-category-section">
                    <div class="skills-cat-title">
                        <span>${catIdx + 1}. ${cat.category.toUpperCase()}</span>
                    </div>
                    <div class="skill-tags-cloud">
                        ${cat.skills.map((skill, sIdx) => `
                            <button class="skill-tag-card ${catIdx === 0 && sIdx === 0 ? 'active-probe' : ''}" 
                                data-cat="${catIdx}" data-idx="${sIdx}">
                                <span>⚡</span> ${skill.name}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `).join('');

            // Hook up skill tag clicks & hovers to CRO probe
            skillsContainer.querySelectorAll('.skill-tag-card').forEach(btn => {
                const triggerProbe = () => {
                    const cIdx = parseInt(btn.getAttribute('data-cat'), 10);
                    const sIdx = parseInt(btn.getAttribute('data-idx'), 10);
                    const skill = data.skillsCategories[cIdx].skills[sIdx];
                    
                    skillsContainer.querySelectorAll('.skill-tag-card').forEach(b => b.classList.remove('active-probe'));
                    btn.classList.add('active-probe');
                    
                    if (this.croInstance) {
                        this.croInstance.setSignal(skill.cro, skill.name, skill.desc);
                    }
                    if (window.retroAudio) {
                        window.retroAudio.playProbeBeep(skill.cro.freq * 120 + 400);
                    }
                };

                btn.addEventListener('click', triggerProbe);
                btn.addEventListener('mouseenter', triggerProbe);
            });
        }

        // 4. Render Experience (Channel 3)
        const expContainer = document.getElementById('experienceListContainer');
        if (expContainer) {
            expContainer.innerHTML = data.experience.map(exp => `
                <div class="exp-entry-card">
                    <div class="exp-header-row">
                        <span class="exp-role-title">${exp.role}</span>
                        <span class="exp-period-badge">${exp.period}</span>
                    </div>
                    <div class="exp-org-line">${exp.org} // ${exp.location}</div>
                    <div class="exp-summary">${exp.summary}</div>
                    <ul class="exp-bullet-list">
                        ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                </div>
            `).join('');
        }

        // 5. Render Projects Showcase (Channel 4)
        this.renderActiveProject();

        // 6. Render Achievements (Channel 5)
        const achContainer = document.getElementById('achievementsGrid');
        if (achContainer) {
            achContainer.innerHTML = data.achievements.map(ach => `
                <div class="achievement-card">
                    <div class="ach-year-tag">// ${ach.year} // ${ach.org}</div>
                    <div class="ach-title">${ach.title}</div>
                    <div class="ach-desc">${ach.desc}</div>
                </div>
            `).join('');
        }
    }

    renderActiveProject() {
        const data = window.PORTFOLIO_DATA;
        if (!data || !data.projects.length) return;
        
        const prj = data.projects[this.activeProjectIdx];
        const container = document.getElementById('projectActiveCard');
        const counterEl = document.getElementById('projectCounter');
        
        if (counterEl) {
            counterEl.textContent = `ARCHIVE [${this.activeProjectIdx + 1} / ${data.projects.length}]`;
        }

        if (container) {
            container.innerHTML = `
                <div class="prj-top-meta">
                    <span class="prj-tag-badge">${prj.tag}</span>
                    <span style="font-size: 11px; opacity: 0.8;">BATCH: ${prj.period}</span>
                </div>
                <div class="prj-title">${prj.title}</div>
                <div class="prj-headline">${prj.headline}</div>
                <div class="prj-description">${prj.description}</div>
                
                <div class="prj-metrics-box">
                    <strong>PERFORMANCE / SPECS:</strong> ${prj.metrics}
                </div>

                <div class="prj-tech-stack">
                    ${prj.tech.map(t => `<span class="tech-chip">${t}</span>`).join('')}
                </div>

                <div class="prj-actions-row">
                    <a href="${prj.github}" target="_blank" rel="noopener noreferrer" class="prj-btn">
                        <span>💾</span> VIEW GITHUB / REPO
                    </a>
                    <a href="${prj.live}" target="_blank" rel="noopener noreferrer" class="prj-btn">
                        <span>🌐</span> VISIT OFFICIAL WEBSITE
                    </a>
                </div>
            `;
        }
    }

    /* ==============================================================
       EVENT LISTENERS
       ============================================================== */
    bindEvents() {
        // Power button click
        const powerBtn = document.getElementById('powerBtn');
        if (powerBtn) {
            powerBtn.addEventListener('click', () => this.togglePower());
        }

        // Screen click when OFF turns it on
        const screenOff = document.getElementById('screenOffDisplay');
        if (screenOff) {
            screenOff.addEventListener('click', () => {
                if (!this.isPoweredOn) this.turnOn();
            });
        }

        // Rotary knob tuning
        const knobWheel = document.getElementById('knobWheel');
        if (knobWheel) {
            knobWheel.addEventListener('click', () => {
                this.nextChannel();
            });
            knobWheel.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (e.deltaY < 0) this.prevChannel();
                else this.nextChannel();
            });
        }

        // Sound toggle
        const sfxToggle = document.getElementById('sfxToggleBtn');
        const topSfxBtn = document.getElementById('topSfxBtn');
        const handleMute = () => {
            const isMuted = window.retroAudio.toggleMute();
            const leds = document.querySelectorAll('.sfx-led');
            leds.forEach(led => {
                if (isMuted) led.classList.add('muted');
                else led.classList.remove('muted');
            });
            if (topSfxBtn) topSfxBtn.textContent = isMuted ? 'SFX: OFF 🔇' : 'SFX: ON 🔊';
        };

        if (sfxToggle) sfxToggle.addEventListener('click', handleMute);
        if (topSfxBtn) topSfxBtn.addEventListener('click', handleMute);

        // Chassis style switcher (Wood / Beige)
        const chassisBtn = document.getElementById('chassisToggleBtn');
        if (chassisBtn) {
            chassisBtn.addEventListener('click', () => this.toggleChassis());
        }

        // CRT Tube phosphor theme switcher
        const tubeBtn = document.getElementById('tubeThemeBtn');
        if (tubeBtn) {
            tubeBtn.addEventListener('click', () => this.nextTubeTheme());
        }

        // Channel navigation buttons (bottom console)
        document.querySelectorAll('.ch-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const ch = parseInt(btn.getAttribute('data-ch'), 10);
                this.setChannel(ch);
            });
        });

        // Inner screen navigation buttons
        document.querySelectorAll('.nav-prev-ch').forEach(btn => {
            btn.addEventListener('click', () => this.prevChannel());
        });
        document.querySelectorAll('.nav-next-ch').forEach(btn => {
            btn.addEventListener('click', () => this.nextChannel());
        });
        document.querySelectorAll('.nav-menu-ch').forEach(btn => {
            btn.addEventListener('click', () => this.setChannel(0));
        });

        // Projects carousel buttons
        const prjPrev = document.getElementById('prjPrevBtn');
        const prjNext = document.getElementById('prjNextBtn');
        if (prjPrev) {
            prjPrev.addEventListener('click', () => {
                const total = window.PORTFOLIO_DATA.projects.length;
                this.activeProjectIdx = (this.activeProjectIdx - 1 + total) % total;
                this.renderActiveProject();
                if (window.retroAudio) window.retroAudio.playKnobClick();
            });
        }
        if (prjNext) {
            prjNext.addEventListener('click', () => {
                const total = window.PORTFOLIO_DATA.projects.length;
                this.activeProjectIdx = (this.activeProjectIdx + 1) % total;
                this.renderActiveProject();
                if (window.retroAudio) window.retroAudio.playKnobClick();
            });
        }

        // Contact terminal input typing sound
        const contactInputs = document.querySelectorAll('.retro-input, .retro-textarea');
        contactInputs.forEach(input => {
            input.addEventListener('keydown', () => {
                if (window.retroAudio) window.retroAudio.playKeyClick();
            });
        });

        // Contact submit
        const transmitBtn = document.getElementById('transmitBtn');
        if (transmitBtn) {
            transmitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleTransmit();
            });
        }

        // Arcade game buttons
        const btnPong = document.getElementById('arcadePongBtn');
        const btnSnake = document.getElementById('arcadeSnakeBtn');
        const btnMenu = document.getElementById('arcadeMenuBtn');

        if (btnPong) {
            btnPong.addEventListener('click', () => {
                if (this.arcadeInstance) this.arcadeInstance.startPong();
            });
        }
        if (btnSnake) {
            btnSnake.addEventListener('click', () => {
                if (this.arcadeInstance) this.arcadeInstance.startSnake();
            });
        }
        if (btnMenu) {
            btnMenu.addEventListener('click', () => {
                if (this.arcadeInstance) this.arcadeInstance.showMenu();
            });
        }

        // Keyboard shortcuts
        window.addEventListener('keydown', (e) => {
            // If typing in form input, skip global shortcuts
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                return;
            }

            if (e.key >= '0' && e.key <= '7') {
                this.setChannel(parseInt(e.key, 10));
            } else if (e.code === 'Space') {
                e.preventDefault();
                this.togglePower();
            } else if (e.key === 't' || e.key === 'T') {
                this.toggleChassis();
            } else if (e.key === 'c' || e.key === 'C') {
                this.nextTubeTheme();
            } else if (e.key === 'm' || e.key === 'M') {
                handleMute();
            }
        });
    }

    /* ==============================================================
       POWER MANAGEMENT
       ============================================================== */
    togglePower() {
        if (this.isPoweredOn) {
            this.turnOff();
        } else {
            this.turnOn();
        }
    }

    turnOn() {
        if (this.isPoweredOn) return;
        this.isPoweredOn = true;

        if (window.retroAudio) {
            window.retroAudio.playPowerOn();
            window.retroAudio.startCRTHum();
        }

        const powerBtn = document.getElementById('powerBtn');
        const screenOff = document.getElementById('screenOffDisplay');
        const screenContent = document.getElementById('screenContent');

        if (powerBtn) powerBtn.classList.add('is-on');
        if (screenOff) screenOff.classList.add('hidden');

        if (screenContent) {
            screenContent.classList.remove('power-animating-off');
            screenContent.classList.add('power-animating-on');
            setTimeout(() => {
                screenContent.classList.remove('power-animating-on');
            }, 600);
        }

        this.setChannel(this.currentChannel, false);
    }

    turnOff() {
        if (!this.isPoweredOn) return;
        this.isPoweredOn = false;

        if (window.retroAudio) {
            window.retroAudio.playPowerOff();
        }

        const powerBtn = document.getElementById('powerBtn');
        const screenOff = document.getElementById('screenOffDisplay');
        const screenContent = document.getElementById('screenContent');

        if (powerBtn) powerBtn.classList.remove('is-on');

        if (screenContent) {
            screenContent.classList.remove('power-animating-on');
            screenContent.classList.add('power-animating-off');
        }

        if (this.croInstance) this.croInstance.stop();
        if (this.arcadeInstance) this.arcadeInstance.stop();

        setTimeout(() => {
            if (!this.isPoweredOn && screenOff) {
                screenOff.classList.remove('hidden');
                if (screenContent) screenContent.classList.remove('power-animating-off');
            }
        }, 550);
    }

    /* ==============================================================
       CHANNEL SWITCHING
       ============================================================== */
    setChannel(chNum, playAudio = true) {
        if (chNum < 0 || chNum > 7) return;
        this.currentChannel = chNum;

        if (!this.isPoweredOn) {
            this.turnOn();
            return;
        }

        if (playAudio && window.retroAudio) {
            window.retroAudio.playKnobClick();
            window.retroAudio.playStaticBurst(0.24, 0.18);
        }

        // Show brief static overlay
        const staticOverlay = document.getElementById('channelStaticOverlay');
        if (staticOverlay) {
            staticOverlay.classList.add('active');
            setTimeout(() => staticOverlay.classList.remove('active'), 180);
        }

        // Update rotary knob rotation (each channel is 45 degrees)
        this.updateKnobAngle();

        // Update bottom channel button active states
        document.querySelectorAll('.ch-btn').forEach(btn => {
            const bCh = parseInt(btn.getAttribute('data-ch'), 10);
            if (bCh === chNum) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Switch channel view
        document.querySelectorAll('.channel-view').forEach(view => {
            const vCh = parseInt(view.getAttribute('data-channel-id'), 10);
            if (vCh === chNum) view.classList.add('active');
            else view.classList.remove('active');
        });

        // Trigger channel-specific engines
        if (chNum === 2) {
            // Technical Skills & CRO Lab
            setTimeout(() => {
                if (!this.croInstance) {
                    this.croInstance = new window.CROInspector('croCanvas');
                } else {
                    this.croInstance.resize();
                    this.croInstance.start();
                }
            }, 50);
        } else if (this.croInstance) {
            this.croInstance.stop();
        }

        if (chNum === 6) {
            // Retro Arcade
            setTimeout(() => {
                if (!this.arcadeInstance) {
                    this.arcadeInstance = new window.RetroArcade('arcadeCanvas');
                } else {
                    this.arcadeInstance.resize();
                    this.arcadeInstance.runLoop();
                }
            }, 50);
        } else if (this.arcadeInstance) {
            this.arcadeInstance.stop();
        }

        // Show OSD banner
        this.showOSD(`CH 0${chNum}`, window.PORTFOLIO_DATA.channels[chNum].title);
    }

    nextChannel() {
        const next = (this.currentChannel + 1) % 8;
        this.setChannel(next);
    }

    prevChannel() {
        const prev = (this.currentChannel - 1 + 8) % 8;
        this.setChannel(prev);
    }

    updateKnobAngle() {
        const knobWheel = document.getElementById('knobWheel');
        if (knobWheel) {
            const angle = this.currentChannel * 45; // 8 stops = 45 deg
            knobWheel.style.transform = `rotate(${angle}deg)`;
        }
    }

    showOSD(channelCode, title) {
        const osd = document.getElementById('crtOSD');
        const osdCh = document.getElementById('osdChannel');
        const osdMeta = document.getElementById('osdMeta');

        if (osd && osdCh) {
            osdCh.textContent = channelCode;
            if (osdMeta) osdMeta.textContent = `NTSC-M 60Hz // ${title}`;
            osd.classList.add('show');

            if (this.osdTimeout) clearTimeout(this.osdTimeout);
            this.osdTimeout = setTimeout(() => {
                osd.classList.remove('show');
            }, 2500);
        }
    }

    /* ==============================================================
       CHASSIS & PHOSPHOR THEMES
       ============================================================== */
    toggleChassis() {
        this.currentChassis = this.currentChassis === 'wood' ? 'beige' : 'wood';
        this.updateChassisUI();
        if (window.retroAudio) window.retroAudio.playKnobClick();
    }

    updateChassisUI() {
        const cabinet = document.getElementById('tvCabinet');
        const chassisBtn = document.getElementById('chassisToggleBtn');

        if (cabinet) {
            if (this.currentChassis === 'wood') {
                cabinet.classList.remove('chassis-beige');
                cabinet.classList.add('chassis-wood');
                if (chassisBtn) chassisBtn.textContent = 'CASING: WALNUT WOOD';
            } else {
                cabinet.classList.remove('chassis-wood');
                cabinet.classList.add('chassis-beige');
                if (chassisBtn) chassisBtn.textContent = 'CASING: 1989 LAB BEIGE';
            }
        }
    }

    nextTubeTheme() {
        this.currentTubeIdx = (this.currentTubeIdx + 1) % this.tubeThemes.length;
        this.updateTubeUI();
        if (window.retroAudio) window.retroAudio.playKnobClick();
    }

    updateTubeUI() {
        const tubeName = this.tubeThemes[this.currentTubeIdx];
        const monitor = document.getElementById('crtMonitor');
        const tubeBtn = document.getElementById('tubeThemeBtn');

        if (monitor) {
            this.tubeThemes.forEach(t => monitor.classList.remove(`tube-${t}`));
            monitor.classList.add(`tube-${tubeName}`);
        }

        const labels = {
            amber: 'CRT TUBE: AMBER P3',
            green: 'CRT TUBE: GREEN P1',
            color: 'CRT TUBE: TRINITRON COLOR',
            bw: 'CRT TUBE: MONOCHROME B&W',
            cyan: 'CRT TUBE: CYBERPUNK CYAN'
        };

        if (tubeBtn) {
            tubeBtn.textContent = labels[tubeName] || `TUBE: ${tubeName.toUpperCase()}`;
        }

        // Update CRO colors if initialized
        if (this.croInstance) {
            const colors = {
                amber: ['#f59e0b', 'rgba(245, 158, 11, 0.45)', 'rgba(245, 158, 11, 0.18)'],
                green: ['#22c55e', 'rgba(34, 197, 94, 0.45)', 'rgba(34, 197, 94, 0.18)'],
                color: ['#38bdf8', 'rgba(56, 189, 248, 0.45)', 'rgba(56, 189, 248, 0.18)'],
                bw:    ['#e2e8f0', 'rgba(226, 232, 240, 0.45)', 'rgba(226, 232, 240, 0.18)'],
                cyan:  ['#06b6d4', 'rgba(6, 182, 212, 0.45)', 'rgba(6, 182, 212, 0.18)']
            };
            const c = colors[tubeName] || colors.amber;
            this.croInstance.setThemeColors(c[0], c[1], c[2]);
        }
    }

    /* ==============================================================
       CONTACT TERMINAL TRANSMISSION
       ============================================================== */
    handleTransmit() {
        const nameInput = document.getElementById('txName');
        const emailInput = document.getElementById('txEmail');
        const msgInput = document.getElementById('txMsg');
        const statusBox = document.getElementById('txStatusReport');

        if (!nameInput || !emailInput || !msgInput) return;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const msg = msgInput.value.trim();

        if (!name || !email || !msg) {
            if (statusBox) {
                statusBox.textContent = 'TRANSMISSION ERROR: ALL FIELDS REQUIRED FOR TELEMETRY BURST.';
                statusBox.style.color = '#ef4444';
            }
            return;
        }

        if (window.retroAudio) {
            window.retroAudio.playTransmitBeeps();
        }

        if (statusBox) {
            statusBox.textContent = 'ENCRYPTING PACKET & MODULATING RF CARRIER (145.500 MHz)...';
            statusBox.style.color = 'var(--tube-phosphor)';

            setTimeout(() => {
                statusBox.innerHTML = `
                    <span style="color:#10b981;">✓ PACKET TRANSMITTED SUCCESSFULLY!</span><br>
                    <span>ACK RECEIVED FROM VU2-TS-JAIPUR. THANK YOU, ${name.toUpperCase()}!</span>
                `;
                nameInput.value = '';
                emailInput.value = '';
                msgInput.value = '';
            }, 1200);
        }
    }
}

// Instantiate TV on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.tv = new TVController();
});
