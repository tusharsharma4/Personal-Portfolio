/**
 * Portfolio Data Configuration for Tushar Sharma
 * Extracted directly from official resume:
 * - Poornima College of Engineering, Jaipur (B.Tech ECE, 2023 - 2027, CGPA: 8.0/10.0)
 * - Full-Stack Developer Intern @ BOSCH Limited (June 2026 - July 2026)
 * - Projects: DLR TOP Audit Automation, Special Forces Defense Glove, Smart Home Security System
 * - Achievements: ICI FEST'24 Winner (SKIT), Runner-Up IISF (IIT Guwahati), 1st Position TEK-Connect (RTU Kota), 2nd Position Abhivyakti
 * - Contact: tusharsharmabs05@gmail.com | +91 6367520514 | linkedin.com/in/tusharsharma04 | www.tushar-sharma.in
 */

window.PORTFOLIO_DATA = {
    profile: {
        name: "Tushar Sharma",
        title: "Electronics & Communication Engineer | Full-Stack & Embedded Systems Developer",
        institution: "Poornima College of Engineering, Jaipur",
        degree: "Bachelor of Technology in Electronics & Communication",
        cgpa: "8.0 / 10.0",
        period: "September 2023 - May 2027",
        location: "Jaipur, Rajasthan, India",
        avatar: "assets/profile_photo_0.png",
        resumeUrl: "assets/Tushar_Sharma_Resume.pdf",
        tagline: "Bridging the physical and digital domains through embedded systems, firmware, PCB design, and full-stack web applications.",
        bio: [
            "Hello! I am Tushar Sharma, an Electronics & Communication Engineering undergraduate at Poornima College of Engineering, Jaipur (CGPA 8.0/10.0). I specialize in both embedded hardware (STM32, ESP32, UART, PCB Design) and scalable full-stack software development (Python FastAPI, HTML5 & CSS3, SQLite, REST APIs).",
            "Recently interned at BOSCH Limited as a Full-Stack Developer Intern, where I built an enterprise-level shop-floor compliance evaluation application across 25 manufacturing teams, engineered custom calculation engines to eliminate persistent ghost data, and created dynamic executive reporting dashboards.",
            "Passionate about defense tech, IoT, and embedded robotics—demonstrated through my award-winning hardware builds including the Special Forces Defense Glove and the Biometric & Laser Smart Home Security System."
        ],
        stats: [
            { label: "B.Tech CGPA", value: "8.0 / 10.0" },
            { label: "Industry Internship", value: "BOSCH Limited" },
            { label: "Competition Podiums", value: "4 Major Awards" },
            { label: "Graduation Batch", value: "2023 - 2027" }
        ],
        academicDetails: {
            college: "Poornima College of Engineering, Jaipur",
            duration: "September 2023 - May 2027",
            degree: "B.Tech in Electronics & Communication",
            cgpa: "8.0 / 10.0"
        },
        interests: [
            "Embedded Systems (ESP32, STM32)",
            "PCB Designing (KiCad)",
            "Full-Stack Web (FastAPI, HTML5 & CSS3)",
            "IoT & Biometric Security",
            "Defense Electronics & Tactical Wearables",
            "RF Simulation (CST Studio Suite, MATLAB)"
        ]
    },

    skillsCategories: [
        {
            category: "Embedded Systems & Hardware",
            skills: [
                {
                    name: "Embedded C",
                    level: "Advanced",
                    desc: "Microcontroller firmware, register-level drivers, ISR timers, peripheral control.",
                    cro: { type: "square", freq: 16.0, vpp: "3.3V", label: "CLK: 16.0 MHz | SPI / Timer ISR Pulse" }
                },
                {
                    name: "ESP32 & STM32",
                    level: "Advanced",
                    desc: "Dual-core processing, FreeRTOS tasks, ARM Cortex-M architecture, DMA channels.",
                    cro: { type: "sine", freq: 12.0, vpp: "3.3V", label: "ARM CLK: 12.0 MHz HSE External Crystal" }
                },
                {
                    name: "UART Protocol",
                    level: "Mastery",
                    desc: "Serial data transmission, baud-rate clock synchronization, telemetry packet framing.",
                    cro: { type: "square", freq: 9.6, vpp: "3.3V", label: "UART TX: 115200 Baud ASCII Serial Frame" }
                },
                {
                    name: "IoT & Sensors",
                    level: "Advanced",
                    desc: "Sensor interfacing, real-time telemetry, laser detection, biometric scanner integration.",
                    cro: { type: "burst", freq: 8.4, vpp: "3.3V", label: "RF BURST: 2.4 GHz IoT Sensor Packet" }
                },
                {
                    name: "PCB Designing (KiCad)",
                    level: "Advanced",
                    desc: "Schematic capture, multi-layer routing, ground planes, noise isolation, component footprints.",
                    cro: { type: "sawtooth", freq: 5.0, vpp: "5.0V", label: "SMPS: 500 kHz Buck Regulator Switching Ripple" }
                },
                {
                    name: "3D Designing & Tinkercad",
                    level: "Intermediate+",
                    desc: "Rapid prototyping, tactical glove mechanical attachments, custom enclosures.",
                    cro: { type: "triangle", freq: 3.5, vpp: "2.4V", label: "PWM: Micro-Servo Actuator Position Pulse" }
                }
            ]
        },
        {
            category: "Programming, Backend & Web",
            skills: [
                {
                    name: "Python",
                    level: "Advanced",
                    desc: "Core algorithms, data analysis, calculation engines, script automation.",
                    cro: { type: "sine", freq: 7.2, vpp: "3.0V", label: "PY CALC: Reverse-Engineered Rule Processor" }
                },
                {
                    name: "FastAPI & Flask",
                    level: "Advanced",
                    desc: "Asynchronous REST API architectures, Pydantic schemas, dependency injection, concurrent endpoints.",
                    cro: { type: "pulse", freq: 14.0, vpp: "3.3V", label: "API BURST: FastAPI Async Endpoint Request" }
                },
                {
                    name: "SQL, MySQL & SQLite",
                    level: "Advanced",
                    desc: "Relational database modeling, snapshotting, schema indexing, query optimization.",
                    cro: { type: "square", freq: 10.0, vpp: "3.0V", label: "SQL QUERY: SQLite Snapshot Transaction" }
                },
                {
                    name: "Frontend (HTML5 & CSS3)",
                    level: "Advanced",
                    desc: "Semantic responsive layouts, modern design tokens, CRT raster styling, UI validation.",
                    cro: { type: "square", freq: 7.0, vpp: "3.0V", label: "CSS RASTER: HTML5 & CSS3 Hardware Accelerated Render" }
                },
                {
                    name: "MATLAB & CST Studio Suite",
                    level: "Intermediate",
                    desc: "Signal processing, mathematical modeling, electromagnetic RF simulation.",
                    cro: { type: "sine", freq: 18.0, vpp: "2.5V", label: "RF SIM: CST Studio S-Parameter Frequency Response" }
                },
                {
                    name: "Git & GitHub / VS Code",
                    level: "Proficient",
                    desc: "Branching strategies, collaborative workflows, version control, automated releases.",
                    cro: { type: "burst", freq: 11.0, vpp: "3.3V", label: "GIT: SHA-256 Commit Push Telemetry" }
                }
            ]
        }
    ],

    experience: [
        {
            period: "JUNE 2026 - JULY 2026",
            role: "Full-Stack Developer Intern",
            org: "BOSCH Limited",
            location: "Jaipur, India",
            summary: "Engineered an enterprise-grade shop-floor compliance evaluation system deployed across 25 manufacturing teams at BOSCH Limited.",
            highlights: [
                "Developed a full-stack web application (Python FastAPI, SQLite, HTML5 & CSS3) to automate shop-floor compliance evaluations across 25 manufacturing teams.",
                "Engineered a custom backend calculation engine that reverse-engineered mathematical rules, successfully eliminating persistent 'ghost data' errors and manual entry.",
                "Built a dynamic frontend dashboard featuring historical data snapshotting, dynamic weightage validation, and automated Excel report generation for plant leadership."
            ]
        }
    ],

    projects: [
        {
            id: "prj-1",
            title: "DLR TOP Audit Automation System",
            tag: "FULL-STACK / ENTERPRISE WEB",
            period: "2026",
            headline: "Centralized enterprise dashboard for BPS compliance and leadership evaluation across 25 manufacturing teams.",
            description: "Developed during the BOSCH Limited internship, this full-stack system centralizes shop-floor audits for BPS compliance. It eliminates manual audit discrepancies by reverse-engineering complex compliance calculation formulas.",
            tech: ["Python FastAPI", "HTML5 & CSS3", "SQLite", "REST APIs", "Excel Automation", "Git"],
            metrics: "Deployed across 25 manufacturing teams | 100% elimination of ghost data errors",
            badge: "BOSCH INTERNSHIP BUILD",
            github: "https://github.com/tusharsharma04",
            live: "https://www.tushar-sharma.in"
        },
        {
            id: "prj-2",
            title: "Special Forces Defense Glove",
            tag: "TACTICAL EMBEDDED / DEFENSE TECH",
            period: "2024",
            headline: "Wearable tactical combat system engineered for soldier safety and close-range combat assistance.",
            description: "Engineered a high-tech wearable tactical combat glove integrating non-lethal high-voltage electric shock deterrent, high-intensity stun light, RGB tactical signaling, distraction laser, and an ergonomic protective shield for defense operations. Features a custom retractable claw mechanism and a pin-shooter-inspired attachment for tactical close-range defense.",
            tech: ["Embedded Systems", "High-Voltage Circuitry", "Stun LED Array", "Laser Module", "3D Designing", "Tinkercad", "KiCad"],
            metrics: "Multi-modal defense: Shock + Stun Light + Laser + Retractable Claw mechanism",
            badge: "HARDWARE INNOVATION",
            github: "https://github.com/tusharsharma04",
            live: "https://www.tushar-sharma.in"
        },
        {
            id: "prj-3",
            title: "Smart Home Security System",
            tag: "BIOMETRIC / EMBEDDED SECURITY",
            period: "2024",
            headline: "Multi-layered home security featuring optical biometric authentication, laser tripwires, and active shock deterrent.",
            description: "Developed a comprehensive smart home protection architecture combining fingerprint-based access control with real-time laser intrusion detection for instant threat response. Includes a compact embedded electronics unit with relay modules and non-lethal electronic shock deterrents to repel physical tampering.",
            tech: ["Embedded C", "ESP32", "Optical Fingerprint Sensor", "Laser Intrusion Grid", "Relay Modules", "Arduino IDE"],
            metrics: "Sub-second biometric response time | Real-time perimeter tripwire alert",
            badge: "AWARD WINNING BUILD",
            github: "https://github.com/tusharsharma04",
            live: "https://www.tushar-sharma.in"
        },
        {
            id: "prj-4",
            title: "TUSHAR-VISION: 90's CRT Interactive Portfolio",
            tag: "CREATIVE WEB / AUDIO SYNTH",
            period: "2024 - 2026",
            headline: "Simulated 1989 Cathode Ray Tube television with real-time Web Audio API and canvas CRO.",
            description: "A retro broadcast portfolio mimicking vintage CRT screens with raster scanlines, phosphor persistence, degauss thump, rotary dial tuner, live oscilloscope waveform inspector, and built-in playable retro games.",
            tech: ["JavaScript ES6+", "Web Audio API", "HTML5 Canvas CRO", "CSS3 3D Shaders", "Zero External Dependencies"],
            metrics: "60 FPS hardware acceleration | 100% synthesized procedural sound",
            badge: "ORIGINAL CONCEPT",
            github: "https://github.com/tusharsharma04",
            live: "https://www.tushar-sharma.in"
        }
    ],

    achievements: [
        {
            title: "Winner, ICI FEST'24 - Teck Connect Exhibition",
            org: "Swami Keshvanand Institute of Technology (SKIT)",
            year: "2024",
            desc: "Awarded 1st place in the flagship technical exhibition for outstanding hardware innovation and engineering demonstration."
        },
        {
            title: "Runner-Up at Pragya Bharat Event",
            org: "India International Science Festival (IISF) @ IIT Guwahati",
            year: "2024",
            desc: "Secured runner-up position at the national-level Pragya Bharat event organized during the prestigious India International Science Festival at IIT Guwahati."
        },
        {
            title: "First Position - TEK-Connect 2024 Exhibition",
            org: "Rajasthan Technical University (RTU), Kota",
            year: "2024",
            desc: "Awarded 1st position across inter-college engineering teams in the annual technical project exhibition at RTU Kota."
        },
        {
            title: "Second Position - Abhivyakti Science Model Exhibition",
            org: "HSS Fair 2024, Jaipur",
            year: "2024",
            desc: "Won 2nd prize for presenting an advanced working science and embedded security model."
        }
    ],

    channels: [
        { id: 0, code: "CH 00", title: "CALIBRATION & DIRECTORY", subtitle: "SMPTE Color Calibration & Main Directory" },
        { id: 1, code: "CH 01", title: "PROFILE & EDUCATION", subtitle: "Poornima College ECE // CGPA 8.0 // Credentials" },
        { id: 2, code: "CH 02", title: "TECHNICAL SKILLS & CRO LAB", subtitle: "Live Cathode Ray Oscilloscope & Hardware Probes" },
        { id: 3, code: "CH 03", title: "EXPERIENCE LOG (BOSCH)", subtitle: "Full-Stack Developer Intern @ BOSCH Limited" },
        { id: 4, code: "CH 04", title: "PROJECTS BROADCAST", subtitle: "DLR TOP Audit, Defense Glove, Smart Home Security" },
        { id: 5, code: "CH 05", title: "ACHIEVEMENTS & AWARDS", subtitle: "SKIT Winner, IISF IIT Guwahati, RTU Kota 1st" },
        { id: 6, code: "CH 06", title: "RETRO ARCADE", subtitle: "Playable CRT Pong & Phosphor Snake" },
        { id: 7, code: "CH 07", title: "CONTACT TERMINAL", subtitle: "Send Message // Email // LinkedIn // Phone" }
    ],

    contact: {
        name: "Tushar Sharma",
        email: "tusharsharmabs05@gmail.com",
        phone: "+91 63675 20514",
        phoneRaw: "+916367520514",
        linkedin: "https://www.linkedin.com/in/tusharsharma04",
        linkedinDisplay: "linkedin.com/in/tusharsharma04",
        website: "https://www.tushar-sharma.in",
        websiteDisplay: "www.tushar-sharma.in",
        location: "Jaipur, Rajasthan, India",
        callsign: "VU2-TS-JAIPUR",
        frequency: "145.500 MHz (VHF FM Amateur Band)"
    }
};
