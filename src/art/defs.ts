export const SVG_DEFS = `
<defs>
  <!-- Cinematic sky: near-black with a single warm source. -->
  <linearGradient id="skyDawn" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#04060f"/>
    <stop offset="0.45" stop-color="#0a0d1f"/>
    <stop offset="0.72" stop-color="#141126"/>
    <stop offset="1" stop-color="#1d1530"/>
  </linearGradient>

  <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#03050b"/>
    <stop offset="0.6" stop-color="#080b1c"/>
    <stop offset="1" stop-color="#0f1024"/>
  </linearGradient>

  <!-- Single warm light, tight. -->
  <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#ffe6b0" stop-opacity="0.86"/>
    <stop offset="0.32" stop-color="#ffcf7a" stop-opacity="0.34"/>
    <stop offset="0.66" stop-color="#ff9c3e" stop-opacity="0.08"/>
    <stop offset="1" stop-color="#ff7a2a" stop-opacity="0"/>
  </radialGradient>

  <radialGradient id="warmBloom" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#ffcf86" stop-opacity="0.9"/>
    <stop offset="0.4" stop-color="#ffb45e" stop-opacity="0.4"/>
    <stop offset="1" stop-color="#ff9c3e" stop-opacity="0"/>
  </radialGradient>

  <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#f4e7c4" stop-opacity="0.85"/>
    <stop offset="0.4" stop-color="#f4e7c4" stop-opacity="0.12"/>
    <stop offset="1" stop-color="#f4e7c4" stop-opacity="0"/>
  </radialGradient>

  <radialGradient id="coolGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#9fb6e6" stop-opacity="0.26"/>
    <stop offset="0.55" stop-color="#6f89c4" stop-opacity="0.08"/>
    <stop offset="1" stop-color="#6f89c4" stop-opacity="0"/>
  </radialGradient>

  <!-- House materials: dark wood, brass, copper, thatch, stone, rice. -->
  <linearGradient id="wallAttic" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#120c08"/>
    <stop offset="0.5" stop-color="#1a110a"/>
    <stop offset="1" stop-color="#0e0a06"/>
  </linearGradient>

  <linearGradient id="wallPuja" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#170b0c"/>
    <stop offset="0.42" stop-color="#2c1210"/>
    <stop offset="0.72" stop-color="#3a1714"/>
    <stop offset="1" stop-color="#1c0b08"/>
  </linearGradient>

  <linearGradient id="wallKitchen" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0f0b07"/>
    <stop offset="0.5" stop-color="#1e130c"/>
    <stop offset="1" stop-color="#120a05"/>
  </linearGradient>

  <linearGradient id="wallDoor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0c0806"/>
    <stop offset="0.5" stop-color="#18100b"/>
    <stop offset="1" stop-color="#0a0604"/>
  </linearGradient>

  <linearGradient id="floorWood" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#26160c"/>
    <stop offset="1" stop-color="#0f0804"/>
  </linearGradient>

  <linearGradient id="floorPuja" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#331712"/>
    <stop offset="1" stop-color="#140805"/>
  </linearGradient>

  <linearGradient id="floorStone" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#26201a"/>
    <stop offset="1" stop-color="#0f0c09"/>
  </linearGradient>

  <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e6b066"/>
    <stop offset="0.36" stop-color="#9a6430"/>
    <stop offset="0.7" stop-color="#c08440"/>
    <stop offset="1" stop-color="#502e16"/>
  </linearGradient>

  <linearGradient id="copper" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#cc7240"/>
    <stop offset="0.42" stop-color="#763a1e"/>
    <stop offset="0.74" stop-color="#b45830"/>
    <stop offset="1" stop-color="#441f10"/>
  </linearGradient>

  <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#dd5f2a"/>
    <stop offset="0.42" stop-color="#ffbf5c"/>
    <stop offset="1" stop-color="#fff0bd"/>
  </linearGradient>

  <linearGradient id="doorLight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffe0a8"/>
    <stop offset="0.4" stop-color="#ef9a44"/>
    <stop offset="0.76" stop-color="#9c4a24"/>
    <stop offset="1" stop-color="#24120c"/>
  </linearGradient>

  <linearGradient id="lightSpill" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffd687" stop-opacity="0.7"/>
    <stop offset="1" stop-color="#ffae4e" stop-opacity="0"/>
  </linearGradient>

  <linearGradient id="gardenGround" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0c1812"/>
    <stop offset="0.55" stop-color="#0f2219"/>
    <stop offset="1" stop-color="#070f0b"/>
  </linearGradient>

  <radialGradient id="gardenLight" cx="50%" cy="40%" r="58%">
    <stop offset="0" stop-color="#ffc980" stop-opacity="0.26"/>
    <stop offset="0.5" stop-color="#7fa886" stop-opacity="0.05"/>
    <stop offset="1" stop-color="#070f0b" stop-opacity="0"/>
  </radialGradient>

  <!-- Shared house silhouette: the same roof/arch that appears everywhere. -->
  <pattern id="thatch" width="30" height="20" patternUnits="userSpaceOnUse">
    <rect width="30" height="20" fill="#2a1a0e"/>
    <path d="M-3 20 L11 0 M6 20 L22 0 M15 20 L33 0 M24 20 L40 0" stroke="#56361e" stroke-width="2" opacity="0.5"/>
    <path d="M0 3.5 H30 M0 10 H30 M0 16.5 H30" stroke="#1a0f08" stroke-width="1" opacity="0.5"/>
  </pattern>

  <pattern id="thatchDark" width="30" height="20" patternUnits="userSpaceOnUse">
    <rect width="30" height="20" fill="#1c110a"/>
    <path d="M-3 20 L11 0 M6 20 L22 0 M15 20 L33 0 M24 20 L40 0" stroke="#3e2614" stroke-width="2" opacity="0.5"/>
    <path d="M0 3.5 H30 M0 10 H30 M0 16.5 H30" stroke="#0f0a05" stroke-width="1" opacity="0.55"/>
  </pattern>

  <pattern id="wood" width="44" height="44" patternUnits="userSpaceOnUse">
    <rect width="44" height="44" fill="#2e1a0e"/>
    <path d="M6 0 C10 12 2 26 8 44 M20 0 C24 14 16 30 22 44 M34 0 C38 12 30 28 36 44" stroke="#4a2e18" stroke-width="1.4" fill="none" opacity="0.55"/>
    <path d="M0 13 H44 M0 31 H44" stroke="#1c0f08" stroke-width="1" opacity="0.4"/>
  </pattern>

  <pattern id="woodDark" width="44" height="44" patternUnits="userSpaceOnUse">
    <rect width="44" height="44" fill="#1c100a"/>
    <path d="M6 0 C10 12 2 26 8 44 M20 0 C24 14 16 30 22 44 M34 0 C38 12 30 28 36 44" stroke="#341f10" stroke-width="1.3" fill="none" opacity="0.55"/>
    <path d="M0 13 H44 M0 31 H44" stroke="#0e0804" stroke-width="1" opacity="0.45"/>
  </pattern>

  <pattern id="lattice" width="40" height="40" patternUnits="userSpaceOnUse">
    <rect width="40" height="40" fill="#080b18"/>
    <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="#56361e" stroke-width="2.6"/>
    <circle cx="20" cy="20" r="4.4" fill="none" stroke="#7a4a22" stroke-width="1.6"/>
    <path d="M0 0 L40 40 M40 0 L0 40" stroke="#2a170d" stroke-width="1" opacity="0.4"/>
  </pattern>

  <pattern id="latticeWarm" width="40" height="40" patternUnits="userSpaceOnUse">
    <rect width="40" height="40" fill="#24110c"/>
    <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="#9a6430" stroke-width="2.4"/>
    <circle cx="20" cy="20" r="4.4" fill="none" stroke="#c88a44" stroke-width="1.5"/>
    <path d="M0 0 L40 40 M40 0 L0 40" stroke="#56301a" stroke-width="1" opacity="0.4"/>
  </pattern>

  <pattern id="stone" width="86" height="62" patternUnits="userSpaceOnUse">
    <rect width="86" height="62" fill="#1f1812"/>
    <path d="M0 20 H86 M0 42 H86 M26 0 V20 M58 20 V42 M16 42 V62 M68 42 V62" stroke="#0c0804" stroke-width="2.6" opacity="0.7"/>
    <path d="M5 7 C12 4 20 6 23 10 M40 28 C47 22 54 26 56 31 M7 50 C14 46 22 48 25 53" stroke="#2e241c" stroke-width="1.2" fill="none" opacity="0.45"/>
  </pattern>

  <pattern id="paving" width="110" height="90" patternUnits="userSpaceOnUse">
    <rect width="110" height="90" fill="#121d17"/>
    <path d="M0 28 H110 M0 56 H110 M36 0 V28 M74 28 V56 M22 56 V90 M86 56 V90" stroke="#080d0a" stroke-width="3.4" opacity="0.6"/>
    <path d="M7 10 C19 7 28 11 31 15 M49 38 C60 33 69 36 73 41 M7 72 C18 68 27 71 30 75 M63 76 C74 71 81 74 85 78" stroke="#243529" stroke-width="1.1" fill="none" opacity="0.4"/>
  </pattern>

  <pattern id="rice" width="24" height="24" patternUnits="userSpaceOnUse">
    <rect width="24" height="24" fill="none"/>
    <circle cx="4" cy="6" r="1" fill="#e9dfc0" opacity="0.55"/>
    <circle cx="16" cy="12" r="0.85" fill="#d98a2c" opacity="0.6"/>
    <circle cx="8" cy="19" r="0.9" fill="#b8442c" opacity="0.5"/>
  </pattern>

  <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="8"/>
  </filter>
</defs>
`;
