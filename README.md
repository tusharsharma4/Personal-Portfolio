# Retro CRT TV Portfolio

An interactive personal portfolio designed in the style of a late-1980s Cathode Ray Tube (CRT) television. Features analog TV simulation effects, a procedural Web Audio synthesizer, an interactive oscilloscope simulator, and vintage teletext-inspired navigation.

Built with vanilla JavaScript, HTML5 Canvas, Web Audio API, and CSS.

---

## Overview

This portfolio presents resume, project, and background information through an interactive 8-channel vintage television interface:

- **CH 00 (SMPTE / Directory):** Calibration test pattern with IRE color bars and channel index.
- **CH 01 (Profile):** Education, academic background, and core focus areas.
- **CH 02 (Skills & Oscilloscope):** Interactive Cathode Ray Oscilloscope (CRO) rendering real-time waveforms (sine, square, sawtooth, RF burst) linked to engineering proficiencies.
- **CH 03 (Experience):** Work history, internships, and technical roles.
- **CH 04 (Projects):** Hardware and software project archive with repository links, schematics, and technical specifications.
- **CH 05 (Achievements):** Competitions, hackathons, and certifications.
- **CH 06 (Arcade):** Playable retro mini-games (CRT Pong and Phosphor Snake) rendered directly on the screen canvas.
- **CH 07 (Terminal):** Vintage telemetry console with teletype sound effects and direct links to GitHub, LinkedIn, and email.

---

## Technical Highlights

### Analog CRT & Shaders
- Screen curvature, scanline overlays, aperture grille, and vignette using pure CSS.
- CRT power-on flash and vertical-collapse turn-off animation with decaying center phosphor point.
- Switchable chassis styles (1989 Lab Beige and Walnut Woodgrain).
- Switchable phosphor tube themes: Amber (P3), Green (P1), Trinitron Color, Monochrome (B&W), and Cyan.

### Procedural Web Audio Engine
- All audio is generated in real-time via the browser's Web Audio API (`OscillatorNode`, `GainNode`, `BiquadFilterNode`).
- No external audio files or dependencies.
- Simulates power relay clicks, magnetic degauss thumps, rotary switch ratchets, and analog RF tuning bursts.

### Interactive CRO Waveform Generator
- Canvas-based oscilloscope engine with adjustable `TIME/DIV`, `VOLTS/DIV`, and triggering modes.
- Hovering or clicking skill badges morphs the probe signal in real time.

---

## Tech Stack

- **Markup:** HTML5
- **Styling:** CSS3 (Custom properties, CSS Grid, Flexbox, CRT filters)
- **Logic:** Vanilla JavaScript (ES6+)
- **Graphics:** HTML5 2D Canvas (Oscilloscope, static noise, phosphor trails)
- **Audio:** Web Audio API

---

## Project Structure

```
.
├── index.html              # Main application entry point
├── styles/
│   ├── tv.css              # Chassis geometry, rotary dials, and speaker styling
│   ├── crt.css             # Screen curvature, scanlines, beam collapse, and themes
│   └── channels.css        # Content views for channels 00 through 07
├── js/
│   ├── tv.js               # State management, channel tuning, and input handlers
│   ├── audio.js            # Web Audio API synthesizer
│   ├── cro.js              # Real-time oscilloscope canvas engine
│   ├── arcade.js           # Pong and Snake mini-game logic
│   └── data.js             # Portfolio content and resume configuration
├── assets/
│   ├── profile_photo_0.png # Avatar image
│   └── Tushar_Sharma_Resume.pdf
├── package.json
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites
A modern web browser with support for HTML5 Canvas and the Web Audio API (Chrome, Edge, Firefox, Safari).

### Running Locally

No build step is required. You can serve the files directly using any static server:

Using Python:
```bash
python -m http.server 8080
```

Using Node (`serve`):
```bash
npx serve . -p 8080
```

Then navigate to `http://localhost:8080` in your browser.

---

## Controls

| Input | Action |
| :--- | :--- |
| **Power Button / Space** | Toggle TV power on/off |
| **Channel Dial / Keys 0–7** | Switch directly between channels |
| **Mouse Wheel on Dial** | Step channel up/down |
| **Theme Button / C Key** | Cycle phosphor display profile |
| **Casing Button / T Key** | Toggle between Lab Beige and Walnut casing |
| **Audio Button / M Key** | Mute or unmute procedural audio |
| **Arrow Keys / WASD** | Game controls (in CH 06 Arcade) |

---

## Customization

To update the portfolio content with your own information:
1. Open `js/data.js` (or the resume configuration block in `index.html`).
2. Update the profile fields, education, skills, projects, and contact links.
3. Replace `assets/profile_photo_0.png` and `assets/Tushar_Sharma_Resume.pdf` with your own files.

---

## License

This project is licensed under the [MIT License](LICENSE).
