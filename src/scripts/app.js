/* global React, ReactDOM, JSZip */

const {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo
} = React;

// Detectar preferencia de modo oscuro del sistema
const getSystemDarkMode = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

// Aplicar clases y fondo según modo
const applyDarkMode = isDark => {
  if (isDark) {
    document.documentElement.classList.add("dark");
    document.body.className = "bg-slate-950 transition-colors duration-500";
  } else {
    document.documentElement.classList.remove("dark");
    document.body.className = "bg-slate-50 transition-colors duration-500";
  }
};
const UI_ICONS = {
  Style: /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
  })),
  Content: /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
  })),
  Mockups: /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
  })),
  Effects: /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M13 10V3L4 14h7v7l9-11h-7z"
  })),
  Export: /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
  }))
};
const ADVANCED_TEMPLATES = [{
  id: "classic",
  name: "Clásico Solid",
  description: "Fondo de color plano estándar para iconos minimalistas",
  preview: (color1, color2) => `
            <svg viewBox="0 0 100 100" class="w-full h-full">
                <rect x="15" y="15" width="70" height="70" rx="20" fill="${color1}" />
            </svg>
        `
}, {
  id: "mesh-gradient",
  name: "Mesh Gradient",
  description: "Gradiente artístico multidimensional",
  preview: (color1, color2) => `
            <svg viewBox="0 0 100 100" class="w-full h-full">
                <defs>
                    <radialGradient id="mesh1" cx="20%" cy="20%" r="50%">
                        <stop offset="0%" stop-color="${color1}" />
                        <stop offset="100%" stop-color="${color1}00" />
                    </radialGradient>
                    <radialGradient id="mesh2" cx="80%" cy="80%" r="50%">
                        <stop offset="0%" stop-color="${color2}" />
                        <stop offset="100%" stop-color="${color2}00" />
                    </radialGradient>
                    <radialGradient id="mesh3" cx="80%" cy="20%" r="50%">
                        <stop offset="0%" stop-color="${color1}88" />
                        <stop offset="100%" stop-color="${color1}00" />
                    </radialGradient>
                </defs>
                <rect width="100" height="100" fill="${color1}22" />
                <rect width="100" height="100" fill="url(#mesh1)" />
                <rect width="100" height="100" fill="url(#mesh2)" />
                <rect width="100" height="100" fill="url(#mesh3)" />
            </svg>
        `
}, {
  id: "isometric-3d",
  name: "3D Isometric",
  description: "Estilo isométrico con profundidad",
  preview: (color1, color2) => `
            <svg viewBox="0 0 100 100" class="w-full h-full">
                <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" fill="${color1}" />
                <path d="M50 20 L80 35 L50 50 L20 35 Z" fill="#ffffff22" />
                <path d="M20 35 L50 50 L50 80 L20 65 Z" fill="#00000022" />
            </svg>
        `
}, {
  id: "inner-glow",
  name: "Inner Glow",
  description: "Efecto de brillo interno suave",
  preview: (color1, color2) => `
            <svg viewBox="0 0 100 100" class="w-full h-full">
                <defs>
                    <filter id="glow">
                        <feFlood flood-color="white" result="flood" />
                        <feComposite in="flood" in2="SourceGraphic" operator="out" result="mask" />
                        <feGaussianBlur in="mask" stdDeviation="5" result="blurred" />
                        <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
                    </filter>
                </defs>
                <rect x="15" y="15" width="70" height="70" rx="20" fill="${color1}" filter="url(#glow)" />
            </svg>
        `
}, {
  id: "neon-outer",
  name: "Neon Glow",
  description: "Brillo exterior intenso y vibrante",
  preview: (color1, color2) => `
            <svg viewBox="0 0 100 100" class="w-full h-full">
                <defs>
                    <filter id="neon-blur" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                    </filter>
                </defs>
                <rect x="20" y="20" width="60" height="60" rx="15" fill="${color1}" filter="url(#neon-blur)" opacity="0.6" />
                <rect x="25" y="25" width="50" height="50" rx="12" fill="none" stroke="${color2}" stroke-width="4" />
            </svg>
        `
}];
const PASTEL_COLORS = ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#D4BAFF", "#FFB3D9", "#FFC9B3", "#B3FFB3", "#B3E5FF", "#E1B3FF", "#FFE1B3"];
const PRIMARY_COLORS = ["#EF4444", "#F97316", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#27272a", "#52525b", "#a1a1aa", "#ffffff"];
const GRADIENT_PALETTES = [{
  name: "Sunset",
  colors: ["#FF512F", "#DD2476"]
}, {
  name: "Ocean",
  colors: ["#2193B0", "#6DD5ED"]
}, {
  name: "Lush",
  colors: ["#56ab2f", "#a8e063"]
}, {
  name: "Purplex",
  colors: ["#614ad3", "#e42c64"]
}, {
  name: "Cyber",
  colors: ["#00f2fe", "#4facfe"]
}, {
  name: "Midnight",
  colors: ["#232526", "#414345"]
}];
const BRAND_GRADIENTS = [{
  name: "Ocean",
  colors: ["#0ea5e9", "#2563eb"]
}, {
  name: "Sunset",
  colors: ["#f43f5e", "#fb923c"]
}, {
  name: "Forest",
  colors: ["#10b981", "#059669"]
}, {
  name: "Royal",
  colors: ["#8b5cf6", "#d946ef"]
}, {
  name: "Cyber",
  colors: ["#06b6d4", "#8b5cf6"]
}, {
  name: "Industrial",
  colors: ["#334155", "#0f172a"]
}];
const PRO_FONTS = [{
  id: "Inter",
  name: "Modern",
  family: "'Inter', sans-serif"
}, {
  id: "Montserrat",
  name: "Bold",
  family: "'Montserrat', sans-serif"
}, {
  id: "Playfair Display",
  name: "Elegant",
  family: "'Playfair Display', serif"
}, {
  id: "JetBrains Mono",
  name: "Code",
  family: "'JetBrains Mono', monospace"
}];
const PRESETS = [{
  name: "Midnight Neon",
  template: "neon-outer",
  shape: "hexagon",
  primary: "#8b5cf6",
  secondary: "#ec4899",
  noise: 5,
  gloss: false,
  pattern: "none"
}, {
  name: "Glass Apple",
  template: "inner-glow",
  shape: "rounded-square",
  primary: "#ffffff",
  secondary: "#f8fafc",
  noise: 0,
  glass: true,
  pattern: "none"
}, {
  name: "Gold 3D",
  template: "isometric-3d",
  shape: "hexagon",
  primary: "#fbbf24",
  secondary: "#d97706",
  gloss: true,
  noise: 0,
  pattern: "dots"
}, {
  name: "Retro Mesh",
  template: "mesh-gradient",
  shape: "circle",
  primary: "#f472b6",
  secondary: "#60a5fa",
  noise: 12,
  glass: false,
  pattern: "grid"
}];
const MOCKUP_TEMPLATES = [{
  id: "none",
  name: "Solo Logo",
  icon: "🎨"
}, {
  id: "iphone",
  name: "iPhone App",
  icon: "📱"
}, {
  id: "macos",
  name: "macOS Dock",
  icon: "💻"
}, {
  id: "browser",
  name: "Favicon Preview",
  icon: "🌐"
}, {
  id: "social",
  name: "Profile Pic",
  icon: "👤"
}];
const PATTERNS = [{
  id: "none",
  name: "Liso",
  path: ""
}, {
  id: "dots",
  name: "Puntos",
  path: '<pattern id="pattern-dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white" opacity="0.3" /></pattern>'
}, {
  id: "lines",
  name: "Líneas",
  path: '<pattern id="pattern-lines" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1" height="10" fill="white" opacity="0.2" /></pattern>'
}, {
  id: "grid",
  name: "Cuadrícula",
  path: '<pattern id="pattern-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.2" /></pattern>'
}];
const SLATE_COLORS = ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a", "#020617"];
const SHAPES = [{
  id: "circle",
  name: "Círculo",
  path: "M 50, 50 m -40, 0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0"
}, {
  id: "square",
  name: "Cuadrado",
  path: "M 10,10 H 90 V 90 H 10 Z"
}, {
  id: "rounded-square",
  name: "Rounded",
  path: "M 30,10 H 70 A 20,20 0 0 1 90,30 V 70 A 20,20 0 0 1 70,90 H 30 A 20,20 0 0 1 10,70 V 30 A 20,20 0 0 1 30,10 Z"
}, {
  id: "hexagon",
  name: "Hexágono",
  path: "M 50,10 L 90,30 V 70 L 50,90 L 10,70 V 30 Z"
}];
const SYMBOL_CATEGORIES = {
  "Popular": ["⭐", "🔥", "✨", "🚀", "💡", "🎨", "📱", "💻", "❤️", "🌈"],
  "Tech": ["⚡", "📡", "🛠️", "⚙️", "🔒", "🔑", "🛡️", "🔗", "💾", "🖱️"],
  "Finanzas": ["💰", "💳", "📈", "🏦", "💎", "💸", "💹", "🪙"],
  "Multimedia": ["🎵", "📸", "🎥", "🎮", "🎙️", "🎧", "🎬", "📺"],
  "Gestos": ["👍", "🖐️", "✌️", "🤟", "🤝", "✍️", "💪", "🧠"],
  "Viajes": ["✈️", "🚗", "🚲", "🏙️", "🌴", "🗺️", "⛺", "⛰️"]
};
const IconStudio = () => {
  // UI States
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : getSystemDarkMode();
  });
  const [activeSection, setActiveSection] = useState("Style");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Icon States
  const [selectedTemplate, setSelectedTemplate] = useState("mesh-gradient");
  const [selectedMockup, setSelectedMockup] = useState("none");
  const [selectedFont, setSelectedFont] = useState(PRO_FONTS[0].family);
  const [selectedPattern, setSelectedPattern] = useState("none");
  const [primaryColor, setPrimaryColor] = useState("#FFB3BA");
  const [secondaryColor, setSecondaryColor] = useState("#BAE1FF");
  const [previewBackground, setPreviewBackground] = useState("checker"); // 'checker', 'light', 'dark'
  const [selectedShape, setSelectedShape] = useState("rounded-square");
  const [activeLayer, setActiveLayer] = useState("main"); // 'main', 'sec'
  const [iconText, setIconText] = useState("A");
  const [fontSize, setFontSize] = useState(40);
  const [textOffsetX, setTextOffsetX] = useState(0);
  const [textOffsetY, setTextOffsetY] = useState(0);
  const [secondarySymbol, setSecondarySymbol] = useState("");
  const [secondarySize, setSecondarySize] = useState(25);
  const [secOffsetX, setSecOffsetX] = useState(0);
  const [secOffsetY, setSecOffsetY] = useState(0);
  const [iconSize, setIconSize] = useState(512);
  const [shadowIntensity, setShadowIntensity] = useState(20);
  const [noiseIntensity, setNoiseIntensity] = useState(0);
  const [glassOverlay, setGlassOverlay] = useState(false);
  const [glossyEffect, setGlossyEffect] = useState(false);
  const [longShadow, setLongShadow] = useState(false);
  const [showSafeGuide, setShowSafeGuide] = useState(false);
  const [textColor, setTextColor] = useState("#ffffff");
  const [secondaryTextColor, setSecondaryTextColor] = useState("#ffffff");
  const [uploadedImage, setUploadedImage] = useState(null);

  // Initial Appearance
  useEffect(() => {
    applyDarkMode(darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Handle Image Upload
  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setUploadedImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleRandomize = () => {
    const templates = ADVANCED_TEMPLATES.map(t => t.id);
    const shapes = SHAPES.map(s => s.id);
    const patterns = PATTERNS.map(p => p.id);
    const allColors = [...PASTEL_COLORS, ...PRIMARY_COLORS];
    const symbols = Object.values(SYMBOL_CATEGORIES).flat();
    const bgs = ["checker", "light", "dark", "mesh"];
    setSelectedTemplate(templates[Math.floor(Math.random() * templates.length)]);
    setSelectedShape(shapes[Math.floor(Math.random() * shapes.length)]);
    setSelectedPattern(patterns[Math.floor(Math.random() * patterns.length)]);
    setPrimaryColor(allColors[Math.floor(Math.random() * allColors.length)]);
    setSecondaryColor(allColors[Math.floor(Math.random() * allColors.length)]);
    setIconText(symbols[Math.floor(Math.random() * symbols.length)]);
    setSelectedFont(PRO_FONTS[Math.floor(Math.random() * PRO_FONTS.length)].family);
    setShadowIntensity(Math.floor(Math.random() * 40));
    setNoiseIntensity(Math.floor(Math.random() * 15));
    setGlassOverlay(Math.random() > 0.8);
    setGlossyEffect(Math.random() > 0.7);
    setLongShadow(Math.random() > 0.8);
    setFontSize(Math.floor(Math.random() * 30) + 30);
    setTextOffsetX(0);
    setTextOffsetY(0);
    setTextColor("#ffffff");
    setSecondaryTextColor("#ffffff");
    if (Math.random() > 0.6) {
      setSecondarySymbol(symbols[Math.floor(Math.random() * symbols.length)]);
      setSecondarySize(Math.floor(Math.random() * 20) + 15);
      setSecOffsetX(Math.random() > 0.5 ? 25 : -25);
      setSecOffsetY(Math.random() > 0.5 ? 25 : -25);
    } else {
      setSecondarySymbol("");
    }
    setPreviewBackground(bgs[Math.floor(Math.random() * bgs.length)]);
  };
  const generateSVGString = useCallback((size = 512) => {
    const shape = SHAPES.find(s => s.id === selectedShape) || SHAPES[0];
    const patternData = PATTERNS.find(p => p.id === selectedPattern);
    let content = "";
    let templateDefs = "";
    if (selectedTemplate === "mesh-gradient") {
      templateDefs = `
                <radialGradient id="mesh1" cx="20%" cy="20%" r="70%">
                    <stop offset="0%" stop-color="${primaryColor}" />
                    <stop offset="100%" stop-color="${primaryColor}00" />
                </radialGradient>
                <radialGradient id="mesh2" cx="80%" cy="80%" r="70%">
                    <stop offset="0%" stop-color="${secondaryColor}" />
                    <stop offset="100%" stop-color="${secondaryColor}00" />
                </radialGradient>
                <filter id="mesh-blur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
                </filter>
            `;
      content = `
                <rect width="100" height="100" fill="${primaryColor}44" />
                <g filter="url(#mesh-blur)">
                    <rect width="100" height="100" fill="url(#mesh1)" />
                    <rect width="100" height="100" fill="url(#mesh2)" />
                </g>
            `;
    } else if (selectedTemplate === "isometric-3d") {
      templateDefs = `
                <linearGradient id="top-face" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff44" />
                    <stop offset="100%" stop-color="#ffffff11" />
                </linearGradient>
            `;
      content = `
                <path d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z" fill="${primaryColor}" />
                <path d="M50 15 L85 32.5 L50 50 L15 32.5 Z" fill="url(#top-face)" />
                <path d="M15 32.5 L50 50 L50 85 L15 67.5 Z" fill="#00000022" />
                <path d="M85 32.5 L85 67.5 L50 85 L50 50 Z" fill="#00000011" />
            `;
    } else if (selectedTemplate === "inner-glow") {
      templateDefs = `
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feFlood flood-color="white" result="flood" />
                    <feComposite in="flood" in2="SourceGraphic" operator="out" result="mask" />
                    <feGaussianBlur in="mask" stdDeviation="4" result="blurred" />
                    <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
                </filter>
                <linearGradient id="base-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${primaryColor}" />
                    <stop offset="100%" stop-color="${secondaryColor}" />
                </linearGradient>
            `;
      content = `<rect x="10" y="10" width="80" height="80" rx="25" fill="url(#base-grad)" filter="url(#glow)" />`;
    } else if (selectedTemplate === "neon-outer") {
      templateDefs = `
                <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feBlend in="SourceGraphic" in2="blur" mode="screen" />
                </filter>
            `;
      content = `
                <rect width="100" height="100" fill="#020617" />
                <path d="${shape.path}" fill="none" stroke="${primaryColor}" stroke-width="3" filter="url(#neon-glow)" />
                <path d="${shape.path}" fill="${primaryColor}11" />
            `;
    } else {
      // Default Classic / Solid
      content = `<path d="${shape.path}" fill="${primaryColor}" />`;
    }
    const textContent = iconText ? `
            <text x="${50 + textOffsetX}" y="${52 + textOffsetY}" 
                text-anchor="middle" 
                dominant-baseline="middle" 
                font-family="${selectedFont}" 
                font-weight="900" 
                font-size="${fontSize}" 
                fill="${textColor}"
                style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            >${iconText}</text>
        ` : "";
    const secondaryContent = secondarySymbol ? `
            <text x="${50 + secOffsetX}" y="${52 + secOffsetY}" 
                text-anchor="middle" 
                dominant-baseline="middle" 
                font-size="${secondarySize}" 
                fill="${secondaryTextColor}"
                style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            >${secondarySymbol}</text>
        ` : "";
    const imageContent = uploadedImage ? `
            <image href="${uploadedImage}" x="25" y="25" width="50" height="50" preserveAspectRatio="xMidYMid slice" clip-path="url(#shape-clip)" />
        ` : "";
    const glassShineDef = glassOverlay ? `
            <linearGradient id="glass-shine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffffff88" />
                <stop offset="45%" stop-color="#ffffff00" />
                <stop offset="55%" stop-color="#ffffff00" />
                <stop offset="100%" stop-color="#ffffff44" />
            </linearGradient>
        ` : "";
    return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
                <defs>
                    <clipPath id="shape-clip">
                        <path d="${shape.path}" />
                    </clipPath>
                    <filter id="outer-shadow">
                        <feDropShadow dx="0" dy="${shadowIntensity / 10}" stdDeviation="${shadowIntensity / 5}" flood-opacity="0.3"/>
                    </filter>
                    ${patternData.path ? patternData.path : ""}
                    ${noiseIntensity > 0 ? `
                        <filter id="noise">
                            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="${noiseIntensity / 100}" />
                            </feComponentTransfer>
                            <feComposite operator="in" in2="SourceGraphic" />
                        </filter>
                    ` : ""}
                    ${templateDefs}
                    ${glassShineDef}
                </defs>
                <g filter="url(#outer-shadow)">
                    <g clip-path="url(#shape-clip)">
                        ${content}
                        ${patternData.id !== "none" ? `<rect width="100" height="100" fill="url(#pattern-${patternData.id})" />` : ""}
                        ${imageContent}
                        ${noiseIntensity > 0 ? '<rect width="100" height="100" filter="url(#noise)" opacity="0.5" />' : ''}
                        ${glassOverlay ? `
                            <rect width="100" height="100" fill="white" opacity="0.1" />
                            <rect width="100" height="100" fill="url(#glass-shine)" opacity="0.2" />
                        ` : ''}
                        ${glossyEffect ? `
                            <path d="M 0,0 Q 50,25 100,0 L 100,0 L 0,0 Z" fill="white" opacity="0.2" />
                        ` : ""}
                    </g>
                </g>
                ${longShadow ? `
                    <g opacity="0.2">
                        ${[...Array(15)].map((_, i) => `
                            <text x="${50 + textOffsetX + i * 0.4}" y="${52 + textOffsetY + i * 0.4}" text-anchor="middle" dominant-baseline="middle" font-family="${selectedFont}" font-weight="900" font-size="${fontSize}" fill="black">${iconText}</text>
                        `).join("")}
                    </g>
                ` : ""}
                ${textContent}
                ${secondaryContent}
            </svg>
        `.trim();
  }, [selectedTemplate, selectedShape, selectedPattern, primaryColor, secondaryColor, iconText, fontSize, textOffsetX, textOffsetY, secondarySymbol, secondarySize, secOffsetX, secOffsetY, shadowIntensity, noiseIntensity, glassOverlay, glossyEffect, longShadow, selectedFont, uploadedImage, textColor, secondaryTextColor]);
  const renderPreview = useMemo(() => {
    return generateSVGString(400);
  }, [generateSVGString]);
  const contrastInfo = useMemo(() => {
    const hex = primaryColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return {
      isGood: brightness < 200,
      // Si es muy claro, el blanco no se verá bien
      score: Math.round(brightness)
    };
  }, [primaryColor]);
  const handleDownload = format => {
    const svg = generateSVGString(iconSize);
    const fileName = `icon-${iconText.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'custom'}-${iconSize}px`;
    if (format === "svg") {
      const blob = new Blob([svg], {
        type: "image/svg+xml"
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = iconSize;
      canvas.height = iconSize;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgBlob = new Blob([svg], {
        type: "image/svg+xml;charset=utf-8"
      });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${fileName}.${format === 'ico' ? 'ico' : 'png'}`;
        downloadLink.click();
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };
  const runBatchExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    const EXPORT_CONFIG = [{
      size: 16,
      name: "favicon-16x16.png"
    }, {
      size: 32,
      name: "favicon-32x32.png"
    }, {
      size: 48,
      name: "favicon.ico"
    }, {
      size: 180,
      name: "apple-touch-icon.png"
    }, {
      size: 192,
      name: "android-chrome-192x192.png"
    }, {
      size: 512,
      name: "android-chrome-512x512.png"
    }, {
      size: 1024,
      name: "icon-1024x1024.png"
    }];
    const zip = new JSZip();
    for (let i = 0; i < EXPORT_CONFIG.length; i++) {
      const {
        size,
        name
      } = EXPORT_CONFIG[i];
      const svg = generateSVGString(size);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgBlob = new Blob([svg], {
        type: "image/svg+xml;charset=utf-8"
      });
      const url = URL.createObjectURL(svgBlob);
      await new Promise(resolve => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(blob => {
            zip.file(name, blob);
            URL.revokeObjectURL(url);
            resolve();
          });
        };
        img.src = url;
      });
      setExportProgress(Math.round((i + 1) / EXPORT_CONFIG.length * 100));
    }

    // Generar Manifest PWA
    const manifestContent = {
      name: "IconStudio Generated App",
      short_name: "App",
      icons: [{
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      }, {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }],
      theme_color: primaryColor,
      background_color: "#ffffff",
      display: "standalone"
    };
    zip.file("manifest.json", JSON.stringify(manifestContent, null, 2));

    // Instrucciones HTML
    const htmlSnippet = `<!-- Agrega esto a tu <head> -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="${primaryColor}">`;
    zip.file("readme_html.txt", htmlSnippet);
    const content = await zip.generateAsync({
      type: "blob"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `pwa-bundle-${iconText || 'icon'}.zip`;
    link.click();
    setIsExporting(false);
  };
  const handleExportSVG = () => {
    const svg = generateSVGString(512);
    const blob = new Blob([svg], {
      type: "image/svg+xml;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `icon-${iconText || "custom"}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex h-screen w-full overflow-hidden font-sans selection:bg-pink-200"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "w-[380px] h-full glass-panel border-r border-slate-200 dark:border-slate-800 z-20 flex flex-col shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-gradient-to-br from-pink-500 to-violet-600 w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20"
  }, "I"), "IconStudio ", /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full"
  }, "Pro")), /*#__PURE__*/React.createElement("button", {
    onClick: handleRandomize,
    className: "w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center shadow-sm",
    title: "Generar Aleatorio"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M13 10V3L4 14h7v7l9-11h-7z"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2 mb-4"
  }, Object.entries(UI_ICONS).map(([name, icon]) => /*#__PURE__*/React.createElement("button", {
    key: name,
    onClick: () => setActiveSection(name),
    className: `flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${activeSection === name ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl" : "bg-white/50 dark:bg-slate-800/50 text-slate-500 hover:bg-white dark:hover:bg-slate-800"}`,
    title: name
  }, icon, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] mt-1 font-bold"
  }, name)))), activeSection === "Style" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6 animate-in slide-in-from-left-4 duration-300"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block"
  }, "Patrones de Fondo"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2 mb-6"
  }, PATTERNS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    onClick: () => setSelectedPattern(p.id),
    className: `p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedPattern === p.id ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden relative"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 40 40",
    className: "w-full h-full"
  }, /*#__PURE__*/React.createElement("defs", {
    dangerouslySetInnerHTML: {
      __html: p.path.replace('id="pattern-', `id="preview-${p.id}`)
    }
  }), /*#__PURE__*/React.createElement("rect", {
    width: "40",
    height: "40",
    fill: p.id !== "none" ? `url(#preview-${p.id})` : "transparent"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-bold uppercase tracking-tighter"
  }, p.name)))), /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block"
  }, "Presets R\xE1pidos"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mb-8"
  }, PRESETS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.name,
    onClick: () => {
      setSelectedTemplate(p.template);
      setSelectedShape(p.shape);
      setPrimaryColor(p.primary);
      setSecondaryColor(p.secondary);
      setNoiseIntensity(p.noise || 0);
      setGlassOverlay(p.glass || false);
      setGlossyEffect(p.gloss || false);
      setSelectedPattern(p.pattern || "none");
    },
    className: "p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-500 hover:border-pink-500 hover:text-pink-500 transition-all text-center"
  }, p.name))), /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block"
  }, "Plantillas Maestras"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 gap-4"
  }, ADVANCED_TEMPLATES.map(tpl => /*#__PURE__*/React.createElement("button", {
    key: tpl.id,
    onClick: () => setSelectedTemplate(tpl.id),
    className: `group relative p-4 rounded-3xl border-2 transition-all flex items-start gap-4 ${selectedTemplate === tpl.id ? "border-pink-500 bg-pink-50 dark:bg-pink-500/10" : "border-transparent bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 flex-shrink-0 shadow-inner",
    dangerouslySetInnerHTML: {
      __html: tpl.preview(primaryColor, secondaryColor)
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: `font-bold text-sm ${selectedTemplate === tpl.id ? "text-pink-600" : "text-slate-900 dark:text-white"}`
  }, tpl.name), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-slate-500 mt-1 leading-relaxed"
  }, tpl.description)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block"
  }, "Paleta Primaria"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-6 gap-2 mb-6"
  }, PRIMARY_COLORS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => setPrimaryColor(c),
    className: `w-full aspect-square rounded-full border-2 transition-transform hover:scale-125 ${primaryColor === c ? "border-slate-900 dark:border-white scale-110" : "border-transparent"}`,
    style: {
      backgroundColor: c
    },
    title: `Seleccionar color ${c}`
  })), /*#__PURE__*/React.createElement("div", {
    className: "relative w-full aspect-square rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800"
  }, /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: primaryColor,
    onChange: e => setPrimaryColor(e.target.value),
    className: "absolute inset-[-10px] w-[150%] h-[150%] cursor-pointer",
    title: "Selector de color personalizado",
    "aria-label": "Color primario personalizado"
  }))), /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block"
  }, "Gradients Reales (Nivel Pro)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 mb-6"
  }, GRADIENT_PALETTES.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.name,
    onClick: () => {
      setPrimaryColor(p.colors[0]);
      setSecondaryColor(p.colors[1]);
    },
    className: "h-12 rounded-2xl flex flex-col items-center justify-center gap-1 border border-slate-200 dark:border-slate-800 hover:scale-105 transition-all overflow-hidden group relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity",
    style: {
      background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})`
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "relative z-10 text-[8px] font-black text-white uppercase drop-shadow-md"
  }, p.name)))), /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block"
  }, "Brand Gradients"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 mb-6"
  }, BRAND_GRADIENTS.map(g => /*#__PURE__*/React.createElement("button", {
    key: g.name,
    onClick: () => {
      setPrimaryColor(g.colors[0]);
      setSecondaryColor(g.colors[1]);
    },
    className: "h-12 rounded-2xl flex flex-col items-center justify-center gap-1 border border-slate-200 dark:border-slate-800 hover:scale-105 transition-all overflow-hidden group relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity",
    style: {
      background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})`
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "relative z-10 text-[8px] font-black text-white uppercase drop-shadow-md"
  }, g.name)))), /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block"
  }, "Modos de Color"), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase dark:text-slate-400"
  }, "Color Secundario"), /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: secondaryColor,
    onChange: e => setSecondaryColor(e.target.value),
    className: "w-8 h-8 rounded-lg overflow-hidden cursor-pointer",
    title: "Color secundario",
    "aria-label": "Color secundario"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setSecondaryColor(primaryColor),
    className: "py-2 rounded-xl bg-white dark:bg-slate-800 text-[9px] font-bold text-slate-500 uppercase"
  }, "Monocromo"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setPrimaryColor(secondaryColor);
      setSecondaryColor(primaryColor);
    },
    className: "py-2 rounded-xl bg-white dark:bg-slate-800 text-[9px] font-bold text-slate-500 uppercase"
  }, "Invertir"))))), activeSection === "Content" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6 animate-in slide-in-from-left-4 duration-300"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block"
  }, "Forma del Contenedor"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2"
  }, SHAPES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => setSelectedShape(s.id),
    className: `p-3 rounded-2xl border-2 transition-all flex flex-col items-center ${selectedShape === s.id ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600" : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"}`
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-6 h-6 mb-1",
    viewBox: "0 0 100 100"
  }, /*#__PURE__*/React.createElement("path", {
    d: s.path,
    fill: "currentColor",
    opacity: "0.8"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-bold uppercase"
  }, s.name))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block"
  }, "Icono / S\xEDmbolo"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("input", {
    className: "flex-1 bg-slate-50 dark:bg-slate-900 border-0 rounded-2xl px-4 py-3 text-lg font-bold focus:ring-2 ring-pink-500 outline-none transition-all dark:text-white",
    value: iconText,
    onChange: e => setIconText(e.target.value),
    placeholder: "Emoji o Texto...",
    title: "Contenido del icono",
    "aria-label": "Contenido del icono"
  }), /*#__PURE__*/React.createElement("select", {
    value: selectedFont,
    onChange: e => setSelectedFont(e.target.value),
    className: "bg-slate-50 dark:bg-slate-900 border-0 rounded-2xl px-3 font-bold text-xs dark:text-white outline-none",
    title: "Seleccionar fuente",
    "aria-label": "Seleccionar fuente"
  }, PRO_FONTS.map(f => /*#__PURE__*/React.createElement("option", {
    key: f.id,
    value: f.family
  }, f.name))), /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: textColor,
    onChange: e => setTextColor(e.target.value),
    className: "w-12 h-12 rounded-2xl border-0 p-1 bg-slate-50 dark:bg-slate-900 cursor-pointer shadow-sm hover:scale-105 transition-transform",
    title: "Color del texto principal",
    "aria-label": "Color del texto principal"
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-slate-50 dark:bg-slate-900 rounded-[32px] mb-6 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] font-black uppercase text-slate-400"
  }, "Tama\xF1o"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-black text-pink-500 bg-pink-500/10 px-2 py-1 rounded-lg"
  }, fontSize, "px")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "10",
    max: "80",
    value: fontSize,
    onChange: e => setFontSize(Number(e.target.value)),
    className: "w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500",
    "aria-label": "Tama\xF1o de fuente",
    title: "Tama\xF1o de fuente"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[9px] font-black uppercase text-slate-400"
  }, "Posici\xF3n X"), /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-bold text-indigo-500"
  }, textOffsetX)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "-40",
    max: "40",
    value: textOffsetX,
    onChange: e => setTextOffsetX(Number(e.target.value)),
    className: "w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500",
    "aria-label": "Posici\xF3n horizontal del texto",
    title: "Posici\xF3n horizontal"
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[9px] font-black uppercase text-slate-400"
  }, "Posici\xF3n Y"), /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-bold text-indigo-500"
  }, textOffsetY)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "-40",
    max: "40",
    value: textOffsetY,
    onChange: e => setTextOffsetY(Number(e.target.value)),
    className: "w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500",
    "aria-label": "Posici\xF3n vertical del texto",
    title: "Posici\xF3n vertical"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setTextOffsetX(0);
      setTextOffsetY(0);
    },
    className: "w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:text-indigo-500 transition-colors"
  }, "Centrar S\xEDmbolo")), /*#__PURE__*/React.createElement("div", {
    className: "p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[32px] text-white shadow-xl mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-black uppercase tracking-widest"
  }, "S\xEDmbolo Extra / Decoraci\xF3n"), secondarySymbol && /*#__PURE__*/React.createElement("button", {
    onClick: () => setSecondarySymbol(""),
    className: "text-[10px] bg-white/20 px-2 py-1 rounded-lg font-bold hover:bg-white/30"
  }, "ELIMINAR")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("input", {
    className: "flex-1 bg-white/10 border-0 rounded-2xl px-4 py-3 text-lg font-bold placeholder:text-white/40 outline-none focus:ring-2 ring-white/50 transition-all text-white",
    value: secondarySymbol,
    onChange: e => setSecondarySymbol(e.target.value),
    placeholder: "Emoji extra...",
    "aria-label": "S\xEDmbolo secundario"
  }), /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: secondaryTextColor,
    onChange: e => setSecondaryTextColor(e.target.value),
    className: "w-12 h-12 rounded-2xl border-0 p-1 bg-white/10 cursor-pointer shadow-sm hover:scale-105 transition-transform",
    title: "Color del s\xEDmbolo secundario",
    "aria-label": "Color del s\xEDmbolo secundario"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-20 bg-white/10 rounded-2xl flex flex-col items-center justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[8px] font-black uppercase opacity-60"
  }, "Size"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: secondarySize,
    onChange: e => setSecondarySize(Number(e.target.value)),
    className: "bg-transparent text-center font-bold outline-none w-full",
    "aria-label": "Tama\xF1o del s\xEDmbolo secundario"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2 mb-4"
  }, [{
    label: "Encima",
    x: 0,
    y: -25
  }, {
    label: "Debajo",
    x: 0,
    y: 25
  }, {
    label: "Izq",
    x: -25,
    y: 0
  }, {
    label: "Der",
    x: 25,
    y: 0
  }].map(pos => /*#__PURE__*/React.createElement("button", {
    key: pos.label,
    onClick: () => {
      setSecOffsetX(pos.x);
      setSecOffsetY(pos.y);
    },
    className: "py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/20 transition-all"
  }, pos.label))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-[9px] font-black uppercase opacity-60"
  }, /*#__PURE__*/React.createElement("span", null, "Ajuste Fino X/Y")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4"
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "-50",
    max: "50",
    value: secOffsetX,
    onChange: e => setSecOffsetX(Number(e.target.value)),
    className: "flex-1 accent-white",
    "aria-label": "Ajuste fino X s\xEDmbolo secundario"
  }), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "-50",
    max: "50",
    value: secOffsetY,
    onChange: e => setSecOffsetY(Number(e.target.value)),
    className: "flex-1 accent-white",
    "aria-label": "Ajuste fino Y s\xEDmbolo secundario"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-4 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveLayer("main"),
    className: `flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeLayer === "main" ? "bg-white dark:bg-slate-800 text-pink-500 shadow-md scale-[1.02]" : "text-slate-400"}`
  }, "Texto Principal"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveLayer("sec"),
    className: `flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeLayer === "sec" ? "bg-white dark:bg-slate-800 text-indigo-500 shadow-md scale-[1.02]" : "text-slate-400"}`
  }, "Extra / Emoji")), Object.entries(SYMBOL_CATEGORIES).map(([cat, symbols]) => /*#__PURE__*/React.createElement("div", {
    key: cat,
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold text-slate-400 uppercase mb-2 block"
  }, cat), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, symbols.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => activeLayer === "main" ? setIconText(s) : setSecondarySymbol(s),
    className: `w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:scale-110 transition-all flex items-center justify-center text-xl ${(activeLayer === "main" ? iconText === s : secondarySymbol === s) ? "ring-2 ring-pink-500" : ""}`
  }, s)))))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 bg-indigo-500/10 border-2 border-indigo-500/20 rounded-[32px] relative overflow-hidden group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 block"
  }, "Subir Imagen"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    onChange: handleFileUpload,
    className: "hidden",
    id: "file-upload"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "file-upload",
    className: "flex flex-col items-center justify-center p-4 border-2 border-dashed border-indigo-400/50 rounded-2xl cursor-pointer hover:bg-indigo-500/5 transition-all"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-8 h-8 text-indigo-500 mb-2",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 4v16m8-8H4"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-indigo-600 dark:text-indigo-400"
  }, "Explorar Archivos")), uploadedImage && /*#__PURE__*/React.createElement("button", {
    onClick: () => setUploadedImage(null),
    className: "absolute top-2 right-2 text-red-500 hover:text-red-600 p-1",
    title: "Eliminar imagen subida",
    "aria-label": "Eliminar imagen subida"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "currentColor",
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
    clipRule: "evenodd"
  }))))), activeSection === "Mockups" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6 animate-in slide-in-from-left-4 duration-300"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block"
  }, "Visualizaci\xF3n en Dispositivo"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, MOCKUP_TEMPLATES.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    onClick: () => setSelectedMockup(m.id),
    className: `p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${selectedMockup === m.id ? "border-pink-500 bg-pink-50 dark:bg-pink-500/10" : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-3xl"
  }, m.icon), /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] font-black uppercase tracking-widest ${selectedMockup === m.id ? "text-pink-600" : "text-slate-500"}`
  }, m.name)))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 bg-slate-900 dark:bg-slate-800 rounded-[32px] text-white/50 text-[10px] leading-relaxed italic"
  }, "\"Usa los mockups para validar el contraste y legibilidad del icono en entornos reales antes de exportar.\"")), activeSection === "Effects" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-8 animate-in slide-in-from-left-4 duration-300"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 leading-none"
  }, "Ruido / Textura"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-black text-slate-900 dark:text-white px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
  }, noiseIntensity, "%")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    value: noiseIntensity,
    onChange: e => setNoiseIntensity(Number(e.target.value)),
    className: "w-full accent-emerald-500",
    "aria-label": "Intensidad de ruido"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 leading-none"
  }, "Tama\xF1o del Texto"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-black text-slate-900 dark:text-white px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
  }, fontSize, "px")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "10",
    max: "80",
    value: fontSize,
    onChange: e => setFontSize(Number(e.target.value)),
    className: "w-full accent-pink-500",
    "aria-label": "Tama\xF1o de fuente efectos"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 leading-none"
  }, "Intensidad de Sombra"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-black text-slate-900 dark:text-white px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
  }, shadowIntensity)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "50",
    value: shadowIntensity,
    onChange: e => setShadowIntensity(Number(e.target.value)),
    className: "w-full accent-violet-500",
    "aria-label": "Intensidad de sombra"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setGlossyEffect(!glossyEffect),
    className: `w-full p-4 rounded-3xl flex items-center justify-between transition-all ${glossyEffect ? "bg-white dark:bg-slate-800 border-2 border-amber-400" : "bg-slate-100 dark:bg-slate-800 border-2 border-transparent"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 rounded-full bg-gradient-to-t from-transparent to-white/60 border border-white/20"
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-sm font-bold ${glossyEffect ? "text-amber-600" : "text-slate-600 dark:text-slate-300"}`
  }, "Efecto Glossy")), /*#__PURE__*/React.createElement("div", {
    className: `w-10 h-6 rounded-full relative transition-colors ${glossyEffect ? "bg-amber-400" : "bg-slate-300 dark:bg-slate-600"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${glossyEffect ? "left-5" : "left-1"}`
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLongShadow(!longShadow),
    className: `w-full p-4 rounded-3xl flex items-center justify-between transition-all ${longShadow ? "bg-white dark:bg-slate-800 border-2 border-indigo-500" : "bg-slate-100 dark:bg-slate-800 border-2 border-transparent"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-8 h-8 text-indigo-500",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 3L3 21",
    stroke: "currentColor",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 12l9 9",
    opacity: "0.5",
    stroke: "currentColor",
    strokeWidth: "2"
  })), /*#__PURE__*/React.createElement("span", {
    className: `text-sm font-bold ${longShadow ? "text-indigo-600" : "text-slate-600 dark:text-slate-300"}`
  }, "Sombra Larga")), /*#__PURE__*/React.createElement("div", {
    className: `w-10 h-6 rounded-full relative transition-colors ${longShadow ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${longShadow ? "left-5" : "left-1"}`
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSafeGuide(!showSafeGuide),
    className: `w-full p-4 rounded-3xl flex items-center justify-between transition-all ${showSafeGuide ? "bg-white dark:bg-slate-800 border-2 border-rose-500" : "bg-slate-100 dark:bg-slate-800 border-2 border-transparent"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 border-2 border-rose-500 border-dashed rounded-lg"
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-sm font-bold ${showSafeGuide ? "text-rose-600" : "text-slate-600 dark:text-slate-300"}`
  }, "Gu\xEDas Safe-Area")), /*#__PURE__*/React.createElement("div", {
    className: `w-10 h-6 rounded-full relative transition-colors ${showSafeGuide ? "bg-rose-500" : "bg-slate-300 dark:bg-slate-600"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showSafeGuide ? "left-5" : "left-1"}`
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setGlassOverlay(!glassOverlay),
    className: `w-full p-4 rounded-3xl flex items-center justify-between transition-all ${glassOverlay ? "bg-white dark:bg-slate-800 border-2 border-pink-500" : "bg-slate-100 dark:bg-slate-800 border-2 border-transparent"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 rounded-xl bg-gradient-to-br from-white/80 to-white/20 backdrop-blur-md shadow-inner border border-white/50"
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-sm font-bold ${glassOverlay ? "text-pink-600" : "text-slate-600 dark:text-slate-300"}`
  }, "Glassmorphism")), /*#__PURE__*/React.createElement("div", {
    className: `w-10 h-6 rounded-full relative transition-colors ${glassOverlay ? "bg-pink-500" : "bg-slate-300 dark:bg-slate-600"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${glassOverlay ? "left-5" : "left-1"}`
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPreviewBackground(previewBackground === 'checker' ? 'light' : 'checker'),
    className: `w-full p-4 rounded-3xl flex items-center justify-between transition-all ${previewBackground === 'checker' ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-600"}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-bold"
  }, "Fondo Checkerboard"), /*#__PURE__*/React.createElement("div", {
    className: `w-10 h-6 rounded-full relative transition-colors ${previewBackground === 'checker' ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${previewBackground === 'checker' ? "left-5" : "left-1"}`
  }))))), activeSection === "Export" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6 animate-in slide-in-from-left-4 duration-300"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block"
  }, "Descarga R\xE1pida"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDownload('png'),
    className: "bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
  }, "PNG ", iconSize, "px"), /*#__PURE__*/React.createElement("button", {
    onClick: handleExportSVG,
    className: "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 p-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-sm"
  }, "VECTOR SVG"))), /*#__PURE__*/React.createElement("div", {
    className: "h-px bg-slate-100 dark:bg-slate-800"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block"
  }, "Kit Completo Web / PWA"), /*#__PURE__*/React.createElement("button", {
    onClick: runBatchExport,
    disabled: isExporting,
    className: "w-full relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-[32px] font-black text-sm flex flex-col items-center justify-center gap-3 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all disabled:opacity-70 group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner"
  }, "\uD83D\uDCE6"), /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-black tracking-tight text-base"
  }, "BUNDLE PWA & FAVICON"), /*#__PURE__*/React.createElement("div", {
    className: "text-[9px] opacity-70 mt-1 uppercase tracking-widest"
  }, "Incluye Manifest + 192px + 512px + ICO")), isExporting && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-x-0 bottom-0 h-1.5 bg-white/20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-white shadow-[0_0_10px_white] transition-all duration-300",
    style: {
      width: `${exportProgress}%`
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[32px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-500 text-lg"
  }, "\u2705"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-black text-emerald-600 uppercase tracking-wider"
  }, "Optimizado para SEO")), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 italic"
  }, "Generamos autom\xE1ticamente los archivos para cumplir est\xE1ndares de Google PWA y Apple iOS.")))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDarkMode(!darkMode),
    className: "w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-slate-600 dark:text-slate-300 hover:border-pink-300 dark:hover:border-pink-800 transition-all"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold uppercase tracking-tight"
  }, darkMode ? "Modo Claro" : "Modo Oscuro"), darkMode ? /*#__PURE__*/React.createElement("span", {
    className: "text-xl text-yellow-500"
  }, "\u2600\uFE0F") : /*#__PURE__*/React.createElement("span", {
    className: "text-xl text-indigo-400"
  }, "\uD83C\uDF19")), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-center mt-4 text-slate-400 font-medium tracking-[0.2em] uppercase opacity-60"
  }, "v3.0 \u2022 Advanced Design System"))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 relative bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-500 rounded-full blur-[120px]"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-600 rounded-full blur-[120px]"
  })), /*#__PURE__*/React.createElement("div", {
    className: `relative z-10 transition-all duration-500 ${isExporting ? 'scale-90 opacity-50 blur-sm' : 'scale-100 opacity-100'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-xl flex items-center gap-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: `w-2 h-2 rounded-full ${contrastInfo.isGood ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-wider"
  }, contrastInfo.isGood ? 'Contraste Pro' : 'Bajo Contraste', " \u2022 ", iconSize, "px"))), /*#__PURE__*/React.createElement("div", {
    className: `p-12 rounded-[60px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] transition-all duration-500 relative overflow-hidden ${previewBackground === "light" ? "bg-white" : previewBackground === "dark" ? "bg-slate-900" : "bg-slate-50"}`,
    style: previewBackground === "checker" ? {
      backgroundImage: `linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)`,
      backgroundSize: '32px 32px',
      backgroundPosition: '0 0, 0 16px, 16px -16px, -16px 0px'
    } : previewBackground === "mesh" ? {
      background: `radial-gradient(at 0% 0%, ${primaryColor}11 0px, transparent 50%), radial-gradient(at 100% 100%, ${secondaryColor}11 0px, transparent 50%)`
    } : {}
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-6 left-6 flex gap-2 z-30"
  }, [{
    id: 'checker',
    icon: '🏁'
  }, {
    id: 'light',
    icon: '⚪'
  }, {
    id: 'dark',
    icon: '⚫'
  }, {
    id: 'mesh',
    icon: '🌈'
  }].map(btn => /*#__PURE__*/React.createElement("button", {
    key: btn.id,
    onClick: () => setPreviewBackground(btn.id),
    className: `w-10 h-10 rounded-xl flex items-center justify-center text-sm border transition-all ${previewBackground === btn.id ? "bg-white dark:bg-slate-800 border-pink-500 shadow-lg scale-110" : "bg-white/50 dark:bg-slate-800/50 border-white/20 hover:bg-white dark:hover:bg-slate-800"}`,
    title: `Fondo: ${btn.id}`
  }, btn.icon))), showSafeGuide && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-x-0 inset-y-0 m-auto w-[280px] h-[280px] border-2 border-dashed border-rose-500/30 rounded-[80px] pointer-events-none z-50 animate-pulse"
  }), selectedMockup === "iphone" ? /*#__PURE__*/React.createElement("div", {
    className: "w-[300px] h-[600px] border-[8px] border-slate-900 dark:border-slate-800 rounded-[50px] relative overflow-hidden bg-[#222] shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-b from-blue-400 to-indigo-600 opacity-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-20 grid grid-cols-4 gap-4 p-4"
  }, [...Array(12)].map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `w-full aspect-square rounded-2xl ${i === 2 ? "" : "bg-white/20 backdrop-blur-md animate-pulse"}`
  }, i === 2 && /*#__PURE__*/React.createElement("div", {
    className: "w-full h-full scale-[0.8] drop-shadow-lg",
    dangerouslySetInnerHTML: {
      __html: renderPreview.replace('width="400"', 'width="100%"').replace('height="400"', 'height="100%"')
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-white/20"
  })) : selectedMockup === "macos" ? /*#__PURE__*/React.createElement("div", {
    className: "w-[600px] h-[300px] flex items-end justify-center pb-8 bg-gradient-to-br from-orange-400 to-rose-500 rounded-3xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4 p-4 bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl scale-125"
  }, [...Array(5)].map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `w-12 h-12 rounded-xl ${i === 2 ? "" : "bg-white/30"}`
  }, i === 2 && /*#__PURE__*/React.createElement("div", {
    className: "w-full h-full scale-[1.1] drop-shadow-xl",
    dangerouslySetInnerHTML: {
      __html: renderPreview.replace('width="400"', 'width="100%"').replace('height="400"', 'height="100%"')
    }
  }))))) : selectedMockup === "browser" ? /*#__PURE__*/React.createElement("div", {
    className: "w-[500px] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 p-3 bg-slate-200 dark:bg-slate-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-3 h-3 rounded-full bg-rose-500"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-3 h-3 rounded-full bg-amber-500"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-3 h-3 rounded-full bg-emerald-500"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ml-4 flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] text-slate-500 font-bold min-w-[200px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-4 h-4",
    dangerouslySetInnerHTML: {
      __html: renderPreview.replace('width="400"', 'width="100%"').replace('height="400"', 'height="100%"')
    }
  }), "Mi Nueva App - Dashboard")), /*#__PURE__*/React.createElement("div", {
    className: "h-40 bg-white dark:bg-slate-950 p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-1/2 h-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-3/4 h-2 bg-slate-50 dark:bg-slate-900 rounded-full mb-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-2/3 h-2 bg-slate-50 dark:bg-slate-900 rounded-full"
  }))) : selectedMockup === "social" ? /*#__PURE__*/React.createElement("div", {
    className: "w-[400px] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative h-24 bg-gradient-to-r from-pink-400 to-indigo-500"
  }), /*#__PURE__*/React.createElement("div", {
    className: "px-6 pb-6 mt-[-40px] relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-white dark:bg-slate-800 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full h-full scale-[1.2]",
    dangerouslySetInnerHTML: {
      __html: renderPreview.replace('width="400"', 'width="100%"').replace('height="400"', 'height="100%"')
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-lg mb-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 w-1/5 bg-slate-50 dark:bg-slate-900 rounded-lg"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4 mt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-3 bg-slate-50 dark:bg-slate-900 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-3 bg-slate-50 dark:bg-slate-900 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-3 bg-slate-50 dark:bg-slate-900 rounded-full"
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "relative transform hover:scale-[1.02] transition-transform duration-500",
    dangerouslySetInnerHTML: {
      __html: renderPreview
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-12 flex items-center justify-center gap-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setIconText(""),
    className: "px-6 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-white dark:hover:bg-slate-900 transition-all flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  })), "LIMPIAR"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDownload('png'),
    className: "px-8 py-4 rounded-3xl bg-pink-500 text-white font-black text-xs shadow-2xl shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 tracking-widest"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
  })), "SNAP RENDER"))), isExporting && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-slate-900 p-12 rounded-[48px] shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full border border-white/10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-24 h-24"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-full h-full rotate-[-90deg]"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "48",
    cy: "48",
    r: "40",
    stroke: "currentColor",
    strokeWidth: "8",
    fill: "transparent",
    className: "text-slate-100 dark:text-slate-800"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "48",
    cy: "48",
    r: "40",
    stroke: "currentColor",
    strokeWidth: "8",
    fill: "transparent",
    strokeDasharray: "251.2",
    strokeDashoffset: 251.2 - 251.2 * exportProgress / 100,
    className: "text-pink-500 transition-all duration-300",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex items-center justify-center font-black text-xl dark:text-white"
  }, exportProgress, "%")), /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight"
  }, "Procesando Lote"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-2 font-medium"
  }, "Generando resoluciones multi-formato..."))))), /*#__PURE__*/React.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
                
                @keyframes in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .animate-in { animation: in 0.4s ease-out forwards; }
                .slide-in-from-left-4 { animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                input[type="range"] {
                    -webkit-appearance: none;
                    height: 6px;
                    border-radius: 5px;
                    background: #e2e8f0;
                }
                .dark input[type="range"] { background: #1e293b; }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    border: 2px solid currentColor;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
            `
    }
  }));
};
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(err => {
      console.log("Service worker registration failed: ", err);
    });
  });
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(IconStudio));
