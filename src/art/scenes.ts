import { crowFly, crowPerched, diya, dog, footprint, garland, latticeWindow, marigold } from "./helpers";

function starField(count: number, width: number, height: number, seed = 7, maxY = height): string {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return Array.from({ length: count }, () => {
    const x = (rand() * width).toFixed(1);
    const y = (rand() * maxY).toFixed(1);
    const r = (0.7 + rand() * 1.5).toFixed(2);
    const o = (0.25 + rand() * 0.6).toFixed(2);
    const delay = (rand() * 6).toFixed(2);
    return `<circle class="star" cx="${x}" cy="${y}" r="${r}" fill="#f7eedf" opacity="${o}" style="animation-delay:-${delay}s"/>`;
  }).join("");
}

function selRoti(x: number, y: number, scale = 1, cls = ""): string {
  return `<g class="sel-roti ${cls}" transform="translate(${x} ${y}) scale(${scale})">
    <circle r="34" fill="none" stroke="#8a4a1e" stroke-width="18" opacity="0.35"/>
    <circle r="34" fill="none" stroke="#c98a3a" stroke-width="14"/>
    <circle r="34" fill="none" stroke="#e7b15a" stroke-width="5" stroke-dasharray="8 11" opacity="0.55"/>
    <circle r="34" fill="none" stroke="#5a2f13" stroke-width="1.5" opacity="0.4"/>
  </g>`;
}

function hangingDiya(x: number, y: number, chain = 90, scale = 0.8): string {
  return `<g class="hanging-diya" transform="translate(${x} ${y})">
    <path d="M0 0 V${chain}" stroke="#6b4a2a" stroke-width="2" opacity="0.65"/>
    ${diya(0, chain, scale, { lit: true })}
  </g>`;
}

export function roofScene(): string {
  // Pre-dawn on the roof of one house. A single crow is being fed; no person
  // is shown. The same roof silhouette introduced here recurs through every room.
  return `
<svg class="scene-svg scene-svg--roof" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="1600" height="900" fill="url(#skyDawn)"/>
  ${starField(38, 1600, 600, 12)}

  <!-- one weak warm point on the horizon, far from the roof -->
  <circle cx="1240" cy="220" r="220" fill="url(#warmGlow)" opacity="0.10"/>
  <circle cx="1240" cy="220" r="42" fill="#f0e2bd" opacity="0.55"/>
  <circle cx="1256" cy="210" r="40" fill="#0a0d1c"/>

  <!-- valley mist, cool and low -->
  <path d="M0 640 Q 220 566 440 612 T 860 584 T 1240 612 T 1600 586 V900 H0Z" fill="#0a0c1c" opacity="0.92"/>
  <path d="M0 700 Q 280 640 580 676 T 1060 660 T 1600 684 V900 H0Z" fill="#070a14"/>

  <!-- the house: same silhouette used in every scene -->
  <g class="roof">
    <path d="M160 790 L 420 452 L 1180 452 L 1440 790 Z" fill="#150b06"/>
    <path d="M176 778 L 432 464 L 1168 464 L 1424 778 Z" fill="url(#thatchDark)"/>
    <path d="M420 452 H1180 L1196 484 H404 Z" fill="#0c0704"/>
    <path d="M404 484 Q800 502 1196 484" fill="none" stroke="#3e2614" stroke-width="6" opacity="0.55"/>
    <path d="M220 720 Q800 688 1380 720" fill="none" stroke="#0c0704" stroke-width="5" opacity="0.5"/>
    <path d="M260 664 Q800 634 1340 664" fill="none" stroke="#0c0704" stroke-width="4" opacity="0.4"/>
    <path d="M300 606 Q800 578 1300 606" fill="none" stroke="#0c0704" stroke-width="3" opacity="0.34"/>
    <path d="M338 550 Q800 526 1262 550" fill="none" stroke="#0c0704" stroke-width="3" opacity="0.28"/>
    <path d="M156 790 L1444 790 L1412 822 L188 822 Z" fill="#0a0604"/>
    <path d="M188 822 H1412" stroke="#341f10" stroke-width="4" opacity="0.7"/>

    <!-- house walls under the roof: the same walls seen later inside -->
    <rect x="300" y="790" width="1000" height="110" fill="url(#woodDark)"/>
    <rect x="300" y="790" width="1000" height="6" fill="#341f10" opacity="0.6"/>

    <!-- a small offering on the roof: rice + a little grain, beside the diya -->
    <g transform="translate(742 470)">
      <ellipse cx="0" cy="2" rx="30" ry="6" fill="#0a0604" opacity="0.55"/>
      <path d="M-26 0 H26" stroke="#341f10" stroke-width="1.5" opacity="0.6"/>
      <g fill="#e9dfc0" opacity="0.9">
        <circle cx="-14" cy="-2" r="1.6"/>
        <circle cx="-6" cy="-3" r="1.4"/>
        <circle cx="2" cy="-2" r="1.6"/>
        <circle cx="10" cy="-3" r="1.3"/>
        <circle cx="17" cy="-1" r="1.5"/>
      </g>
      <g fill="#d98a2c" opacity="0.92">
        <circle cx="-10" cy="-1" r="1.3"/>
        <circle cx="4" cy="-2" r="1.2"/>
        <circle cx="13" cy="-1" r="1.3"/>
      </g>
    </g>

    <!-- a single crow being fed, close to the offering -->
    <g class="ridge-crow" transform="translate(742 448)">
      ${crowPerched(0, 0, 1.25)}
    </g>
  </g>

  <!-- a carved window in the wall, not yet lit -->
  <g class="facade">
    ${latticeWindow(640, 800, 224, 84, { warm: false })}
    <rect x="356" y="810" width="150" height="78" rx="2" fill="#150b06" stroke="#341f10" stroke-width="2"/>
    <path d="M376 886 V822 H486 V886" fill="none" stroke="#4a2e18" stroke-width="2" opacity="0.5"/>
    <circle cx="466" cy="852" r="4" fill="#c08440" opacity="0.8"/>
  </g>

  <!-- ladder to the roof -->
  <g class="ladder" transform="translate(1326 806) rotate(-9)">
    <path d="M0 0 V-330 M58 0 V-330" stroke="#4a2e18" stroke-width="9" stroke-linecap="round"/>
    <path d="M0 -56 H58 M0 -116 H58 M0 -176 H58 M0 -236 H58 M0 -296 H58" stroke="#2e1a0e" stroke-width="7" stroke-linecap="round"/>
  </g>

  <!-- ridge diya: unlit, waiting -->
  <g class="ridge-diya" transform="translate(980 446)">
    <rect x="-28" y="0" width="56" height="16" rx="3" fill="#2a170d" stroke="#0c0704" stroke-width="2"/>
    <path d="M-24 0 H24" stroke="#3e2614" stroke-width="3" opacity="0.6"/>
    ${diya(0, -2, 1.5, { lit: false, interactive: true, id: "first" })}
  </g>
  <circle class="first-light" cx="980" cy="410" r="220" fill="url(#warmBloom)" opacity="0"/>

  <!-- a few distant crows, cold and small; one passes -->
  ${crowFly(296, 186, 0.72, false)}
  ${crowFly(382, 140, 0.5, true)}
  ${crowFly(218, 262, 0.42, false)}

  <path d="M0 900 V864 Q800 834 1600 864 V900Z" fill="#070504"/>
</svg>`;
}

export function atticScene(): string {
  // The same house's roof space, seen from inside. The thatch halves are the
  // very roof we stood on in the roof scene; a dog is honoured here with a
  // garland and a meal. One warm lamp, cool moonlight at the window.
  return `
<svg class="scene-svg scene-svg--attic" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="1600" height="900" fill="url(#skyNight)"/>
  ${starField(26, 1600, 320, 4, 300)}

  <!-- moonlight, cool and restrained -->
  <circle cx="820" cy="110" r="170" fill="url(#moonGlow)" opacity="0.5"/>

  <!-- the back wall of the house, same wood as the roof wall -->
  <rect y="140" width="1600" height="760" fill="url(#wallAttic)"/>
  <path d="M0 140 H1600 V200 H0Z" fill="#0a0704"/>
  <path d="M0 300 H1600 V318 H0Z" fill="#140a06"/>
  <path d="M0 650 H1600 V662 H0Z" fill="#140a06" opacity="0.75"/>
  <g stroke="#24140c" stroke-width="2" opacity="0.5">
    <path d="M140 140 V820 M360 140 V820 M580 140 V820 M800 140 V820 M1020 140 V820 M1240 140 V820 M1460 140 V820"/>
  </g>

  <!-- the roof we stood on, now above us: same thatch silhouette -->
  <g class="roof-halves">
    <g class="roof-half roof-half--left">
      <path d="M0 0 H820 L758 300 Q380 332 0 286 Z" fill="url(#thatchDark)"/>
      <path d="M0 286 Q380 332 758 300" fill="none" stroke="#3e2614" stroke-width="7" opacity="0.6"/>
      <path d="M0 220 Q380 260 780 236" fill="none" stroke="#0c0704" stroke-width="4" opacity="0.5"/>
      <path d="M0 150 Q380 186 800 166" fill="none" stroke="#0c0704" stroke-width="4" opacity="0.46"/>
      <path d="M0 0 H820 L808 28 H0Z" fill="#0a0704"/>
    </g>
    <g class="roof-half roof-half--right">
      <path d="M1600 0 H780 L842 300 Q1220 332 1600 286 Z" fill="url(#thatchDark)"/>
      <path d="M1600 286 Q1220 332 842 300" fill="none" stroke="#3e2614" stroke-width="7" opacity="0.6"/>
      <path d="M1600 220 Q1220 260 820 236" fill="none" stroke="#0c0704" stroke-width="4" opacity="0.5"/>
      <path d="M1600 150 Q1220 186 800 166" fill="none" stroke="#0c0704" stroke-width="4" opacity="0.46"/>
      <path d="M1600 0 H780 L792 28 H1600Z" fill="#0a0704"/>
    </g>
  </g>

  <!-- rafters: the bones of the same roof -->
  <g class="rafters" opacity="0.9">
    <path d="M0 280 Q400 250 800 270 Q1200 250 1600 280" fill="none" stroke="#341f10" stroke-width="14"/>
    <path d="M0 280 L800 30 L1600 280" fill="none" stroke="#24140c" stroke-width="8" opacity="0.7"/>
    <path d="M180 270 L800 40 M400 272 L800 44 M620 270 L800 48 M980 270 L800 48 M1200 272 L800 44 M1420 270 L800 40" stroke="#1c0f08" stroke-width="4" opacity="0.55"/>
  </g>

  <!-- attic floor: the same wood as the house wall below -->
  <g class="attic-floor">
    <rect y="760" width="1600" height="140" fill="url(#floorWood)"/>
    <path d="M0 800 H1600 M0 846 H1600 M0 890 H1600" stroke="#080503" stroke-width="3" opacity="0.6"/>
    <path d="M160 760 V900 M420 760 V900 M680 760 V900 M940 760 V900 M1200 760 V900 M1460 760 V900" stroke="#140a06" stroke-width="2" opacity="0.45"/>
  </g>

  <!-- the warm room beyond the carved attic window (the same facade window) -->
  <g class="attic-window">
    <path d="M1030 560 L 760 850 H1280 Z" fill="url(#warmGlow)" opacity="0.28"/>
    ${latticeWindow(1050, 292, 360, 330, { moon: true })}
    ${garland("M1040 280 Q1230 340 1430 278", "#d98a2c")}
  </g>

  <!-- a single hanging lamp: the warm source of the attic -->
  <g class="attic-lamp">
    <path d="M690 140 V246" stroke="#4a2e18" stroke-width="3"/>
    ${diya(690, 250, 1.15, { lit: true })}
  </g>

  <!-- dried herbs at the eaves -->
  <g class="hanging-herbs" transform="translate(244 140)">
    <path d="M0 0 V76" stroke="#4a2e18" stroke-width="3"/>
    <g fill="#4b5c3c" opacity="0.9">
      <path d="M0 70 C-24 92 -30 126 -12 146 C2 122 8 96 0 70Z"/>
      <path d="M4 68 C26 88 34 118 20 142 C8 120 2 94 4 68Z"/>
      <path d="M-2 66 C-10 92 -4 120 8 138 C16 112 12 86 -2 66Z"/>
    </g>
  </g>

  <!-- an old trunk: wood, brass, thatch of a lid -->
  <g class="attic-trunk" transform="translate(170 760)">
    <rect x="0" y="-90" width="170" height="90" rx="5" fill="url(#woodDark)" stroke="#0c0704" stroke-width="3"/>
    <path d="M0 -66 H170 M0 -30 H170" stroke="#341f10" stroke-width="2" opacity="0.6"/>
    <rect x="66" y="-102" width="38" height="12" rx="4" fill="#b0763c" opacity="0.85"/>
    <path d="M66 -102 H104" stroke="#5a3418" stroke-width="1.2" opacity="0.6"/>
  </g>

  <!-- dog mat: a place prepared for the dog -->
  <g class="dog-mat" transform="translate(430 790)">
    <ellipse cx="0" cy="0" rx="156" ry="34" fill="#1d120a"/>
    <ellipse cx="0" cy="-4" rx="136" ry="24" fill="none" stroke="#4a2e18" stroke-width="3" opacity="0.5"/>
    <path d="M-124 -4 H124 M-98 12 H98" stroke="#2e1a0e" stroke-width="2" opacity="0.5"/>
  </g>
  ${dog(430, 760, 1.06)}
  <g class="dog-bowl" transform="translate(636 772)">
    <ellipse cx="0" cy="0" rx="42" ry="11" fill="#070503" opacity="0.5"/>
    <path d="M-36 -10 Q0 18 36 -10 L30 6 Q0 24 -30 6 Z" fill="url(#brass)" stroke="#3a2010" stroke-width="1.5"/>
    <ellipse cx="0" cy="-10" rx="36" ry="9" fill="#1d1008"/>
    <ellipse cx="0" cy="-11" rx="27" ry="6" fill="#6b4a2a" opacity="0.8"/>
    <path d="M-30 -10 H30" stroke="#3a2010" stroke-width="1" opacity="0.6"/>
  </g>

  <!-- dust in the lamp light -->
  <g class="dust" fill="#e9dfc0">
    <circle cx="900" cy="430" r="2" opacity="0.5" style="animation-delay:-1s"/>
    <circle cx="960" cy="500" r="1.5" opacity="0.4" style="animation-delay:-3s"/>
    <circle cx="840" cy="560" r="2.2" opacity="0.34" style="animation-delay:-5s"/>
    <circle cx="1180" cy="620" r="1.6" opacity="0.44" style="animation-delay:-2s"/>
    <circle cx="1080" cy="380" r="1.3" opacity="0.48" style="animation-delay:-4s"/>
  </g>

  <!-- a copper pot on the floor -->
  <g class="attic-pots" transform="translate(1380 760)">
    <path d="M-54 0 C-64 -42 -40 -74 0 -74 C40 -74 64 -42 54 0Z" fill="url(#copper)"/>
    <ellipse cx="0" cy="-74" rx="30" ry="8" fill="#3a1e10"/>
    <path d="M-38 -40 Q0 -28 38 -40" fill="none" stroke="#d4884a" stroke-width="2" opacity="0.34"/>
    <path d="M-22 -8 C-26 -26 -14 -38 0 -38 C14 -38 26 -26 22 -8Z" fill="#1d0f08" opacity="0.5"/>
  </g>
</svg>`;
}

export function pujaScene(): string {
  // The same house, now its puja room, lit warm for the evening. A shrine with
  // a diya, marigold garland, footprints leading inward, and diyas on every ledge.
  return `
<svg class="scene-svg scene-svg--puja" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="1600" height="900" fill="url(#wallPuja)"/>
  <circle class="warm-bloom" cx="1100" cy="470" r="420" fill="url(#warmBloom)" opacity="0"/>

  <!-- carved band at the top of the wall, same wood tones -->
  <g class="wall-carving" opacity="0.6">
    <path d="M0 120 H1600 V150 H0Z" fill="#140808"/>
    <path d="M0 150 Q80 190 160 150 T320 150 T480 150 T640 150 T800 150 T960 150 T1120 150 T1280 150 T1440 150 T1600 150" fill="none" stroke="#6b3124" stroke-width="3"/>
    <g fill="none" stroke="#5a2a1e" stroke-width="2">
      <circle cx="120" cy="96" r="18"/><circle cx="240" cy="96" r="18"/><circle cx="360" cy="96" r="18"/>
      <circle cx="1240" cy="96" r="18"/><circle cx="1360" cy="96" r="18"/><circle cx="1480" cy="96" r="18"/>
    </g>
  </g>

  <!-- two wood pillars, same as the house walls -->
  <g class="pillars">
    <rect x="48" y="120" width="76" height="700" fill="url(#woodDark)" stroke="#0c0704" stroke-width="3"/>
    <rect x="30" y="120" width="112" height="30" rx="3" fill="#2e1a0e"/>
    <rect x="30" y="790" width="112" height="30" rx="3" fill="#2e1a0e"/>
    <path d="M64 180 H108 M64 260 H108 M64 340 H108 M64 420 H108 M64 500 H108 M64 580 H108 M64 660 H108 M64 740 H108" stroke="#3e2614" stroke-width="2" opacity="0.6"/>
    <rect x="1476" y="120" width="76" height="700" fill="url(#woodDark)" stroke="#0c0704" stroke-width="3"/>
    <rect x="1458" y="120" width="112" height="30" rx="3" fill="#2e1a0e"/>
    <rect x="1458" y="790" width="112" height="30" rx="3" fill="#2e1a0e"/>
    <path d="M1492 180 H1536 M1492 260 H1536 M1492 340 H1536 M1492 420 H1536 M1492 500 H1536 M1492 580 H1536 M1492 660 H1536 M1492 740 H1536" stroke="#3e2614" stroke-width="2" opacity="0.6"/>
  </g>

  <!-- moonlit window at the side, garland across -->
  <g class="puja-window">
    ${latticeWindow(232, 236, 292, 286, { moon: true })}
    ${garland("M218 220 Q378 290 538 218", "#d98a2c")}
  </g>

  <!-- garlands across the room -->
  <g class="garlands">
    ${garland("M0 170 Q 400 270 800 190 T 1600 170", "#d98a2c")}
    ${garland("M-20 300 Q 300 390 620 320 T 1280 340 T 1620 300", "#b8641e")}
    ${garland("M700 120 Q 850 220 1000 120", "#efb04a")}
  </g>

  <!-- the shrine: a small altar with a diya, offerings, a bell -->
  <g class="shrine">
    <rect x="934" y="552" width="430" height="208" rx="4" fill="#2a1310" stroke="#0c0704" stroke-width="3"/>
    <rect x="954" y="572" width="390" height="168" fill="#1c0c08"/>
    <path d="M954 572 H1344 M954 612 H1344" stroke="#5a2a1e" stroke-width="2" opacity="0.5"/>
    <path d="M1000 560 V420 Q1139 330 1278 420 V560" fill="#1c0c08" stroke="#4a2416" stroke-width="4"/>
    <path d="M1020 560 V432 Q1139 356 1258 432 V560" fill="none" stroke="#7a3a26" stroke-width="2" opacity="0.6"/>
    <circle cx="1139" cy="470" r="98" fill="url(#warmBloom)" opacity="0.5"/>
    ${diya(1139, 512, 2.4, { lit: false, id: "shrine" })}
    <g class="offerings" transform="translate(1139 626)">
      <ellipse cx="0" cy="20" rx="112" ry="22" fill="#0c0704" opacity="0.55"/>
      <path d="M-96 0 Q0 30 96 0 L82 18 Q0 44 -82 18 Z" fill="url(#brass)" stroke="#3a2010" stroke-width="1.5"/>
      <g>
        <circle cx="-58" cy="-2" r="13" fill="#b8442c"/><circle cx="-58" cy="-2" r="6" fill="#e8b16a"/>
        <circle cx="-22" cy="-6" r="12" fill="#d98a2c"/><circle cx="-22" cy="-6" r="5" fill="#f0c25a"/>
        <circle cx="16" cy="-3" r="13" fill="#8a5a2a"/><circle cx="16" cy="-3" r="6" fill="#e8b16a"/>
        <circle cx="52" cy="-1" r="11" fill="#b8641e"/>
        <path d="M-78 -4 Q-58 -30 -38 -4" fill="#5d6f4e" opacity="0.9"/>
      </g>
    </g>
    <g class="bell" transform="translate(1278 628)">
      <path d="M0 0 V22" stroke="#4a2e18" stroke-width="3"/>
      <path d="M-18 22 Q0 8 18 22 L22 42 Q0 50 -22 42 Z" fill="url(#brass)" stroke="#3a2010" stroke-width="1.5"/>
      <circle cx="0" cy="46" r="4" fill="#3a2010"/>
    </g>
  </g>

  <!-- a low puja table with lamps and fruit -->
  <g class="puja-table" transform="translate(520 742)">
    <ellipse cx="0" cy="16" rx="172" ry="26" fill="#0c0704" opacity="0.5"/>
    <rect x="-150" y="-16" width="300" height="28" rx="5" fill="url(#woodDark)" stroke="#0c0704" stroke-width="3"/>
    <path d="M-118 12 V58 M118 12 V58" stroke="#1c0f08" stroke-width="10"/>
    <g transform="translate(-78 -20)">
      <ellipse cx="0" cy="0" rx="42" ry="12" fill="#1c0c08"/>
      <path d="M-36 -4 Q0 -26 36 -4 Q20 8 0 8 Q-20 8 -36 -4Z" fill="url(#brass)" stroke="#3a2010" stroke-width="1.2"/>
      <circle cx="-12" cy="-8" r="8" fill="#b8442c"/><circle cx="10" cy="-10" r="7" fill="#d98a2c"/>
    </g>
    <g transform="translate(48 -20)">
      <ellipse cx="0" cy="4" rx="28" ry="8" fill="#1c0c08"/>
      <path d="M-24 -6 Q0 12 24 -6 L18 4 Q0 18 -18 4 Z" fill="url(#brass)" stroke="#3a2010" stroke-width="1.2"/>
      <circle cx="0" cy="-8" r="6" fill="#f0c25a"/>
    </g>
    <g transform="translate(118 -22)">
      <path d="M0 0 C-10 -18 -6 -34 0 -44 C8 -32 10 -16 0 0Z" fill="#e8b16a" opacity="0.7"/>
      <path d="M0 -2 V18" stroke="#4a2e18" stroke-width="2"/>
    </g>
  </g>

  <!-- Laxmi's footprints leading inward -->
  <g class="footprints">
    ${footprint(742, 866, 0.9, -12)}
    ${footprint(790, 846, 0.9, -6, "#e3d4b0")}
    ${footprint(842, 826, 0.9, 0)}
    ${footprint(892, 808, 0.9, 5, "#e3d4b0")}
    ${footprint(944, 790, 0.9, 10)}
    ${footprint(994, 774, 0.9, 15, "#e3d4b0")}
  </g>

  <!-- diyas on the floor -->
  <g class="floor-diyas">
    ${diya(180, 790, 1.1)}
    ${diya(350, 806, 0.95)}
    ${diya(520, 792, 1.05)}
    ${diya(690, 812, 0.9)}
    ${diya(860, 798, 1.1)}
    ${diya(1030, 812, 0.9)}
    ${diya(1200, 798, 1.05)}
    ${diya(1370, 810, 0.95)}
    ${diya(1490, 790, 1.1)}
  </g>
  ${hangingDiya(700, 290, 92, 0.85)}
  ${hangingDiya(890, 340, 70, 0.75)}
  ${hangingDiya(330, 540, 64, 0.7)}

  <!-- a wooden shelf with two more lamps -->
  <g class="shelf-diyas">
    <rect x="1290" y="500" width="160" height="12" rx="2" fill="url(#woodDark)" stroke="#0c0704" stroke-width="2"/>
    ${diya(1330, 500, 0.8)}
    ${diya(1410, 500, 0.8)}
  </g>

  <!-- incense smoke -->
  <g class="smoke" fill="none" stroke="#e9dfc0" stroke-linecap="round" opacity="0.2">
    <path d="M572 696 C552 650 592 620 572 574 C556 540 580 512 570 486" stroke-width="3"/>
    <path d="M594 700 C612 660 578 630 600 590 C618 556 596 532 606 506" stroke-width="2"/>
  </g>

  <!-- fallen marigold petals on the floor -->
  <g class="floor-petals" fill="#d98a2c" opacity="0.55">
    <circle cx="430" cy="850" r="3"/><circle cx="610" cy="868" r="2.4"/><circle cx="1140" cy="860" r="2.8"/>
    <circle cx="1280" cy="842" r="2.2"/><circle cx="360" cy="862" r="2.6"/>
  </g>

  <!-- floor -->
  <rect y="740" width="1600" height="160" fill="url(#floorPuja)" opacity="0.72"/>
  <path d="M0 760 H1600 M0 812 H1600 M0 866 H1600" stroke="#0a0503" stroke-width="3" opacity="0.5"/>
  <path d="M0 742 H1600" stroke="#5a2a1e" stroke-width="4" opacity="0.4"/>
</svg>`;
}

export function kitchenScene(): string {
  return `
<svg class="scene-svg scene-svg--kitchen" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="1600" height="900" fill="url(#wallKitchen)"/>
  <rect y="120" width="1600" height="780" fill="url(#stone)" opacity="0.72"/>
  <circle class="fire-glow" cx="1100" cy="640" r="360" fill="url(#warmGlow)" opacity="0.55"/>

  <g class="kitchen-beams">
    <rect y="120" width="1600" height="34" fill="#1a0f09"/>
    <rect y="300" width="1600" height="22" fill="#2a170d" opacity="0.85"/>
    <rect y="620" width="1600" height="18" fill="#2a170d" opacity="0.7"/>
    <path d="M120 154 V620 M420 154 V620 M720 154 V620 M1020 154 V620 M1320 154 V620 M1520 154 V620" stroke="#3e2414" stroke-width="10" opacity="0.5"/>
  </g>

  <g class="kitchen-window">
    ${latticeWindow(160, 208, 280, 270, { moon: true })}
    ${garland("M146 194 Q300 258 452 192", "#d9822b")}
  </g>

  <g class="kitchen-shelf" transform="translate(510 250)">
    <rect x="0" y="0" width="300" height="12" rx="2" fill="#3a2113" stroke="#1a0f09" stroke-width="2"/>
    <g>
      <path d="M18 0 C8 -36 28 -58 46 -58 C64 -58 82 -36 72 0Z" fill="url(#copper)"/>
      <path d="M108 0 C100 -28 116 -46 132 -46 C148 -46 164 -28 156 0Z" fill="url(#brass)"/>
      <path d="M196 0 C190 -20 202 -34 214 -34 C226 -34 238 -20 232 0Z" fill="#6b4a2a"/>
      <rect x="252" y="-44" width="34" height="44" rx="4" fill="#8a5a2a"/>
    </g>
    <g fill="#f1e4c8" opacity="0.55">
      <circle cx="46" cy="-62" r="2"/><circle cx="132" cy="-50" r="1.8"/><circle cx="214" cy="-38" r="1.6"/>
    </g>
  </g>

  <g class="hanging-kitchen" transform="translate(700 154)">
    <path d="M0 0 V90" stroke="#5a351d" stroke-width="3"/>
    <path d="M-40 80 Q0 120 40 80" fill="none" stroke="#5a351d" stroke-width="3"/>
    <g fill="#c34a30">
      <path d="M-34 82 C-42 108 -34 138 -22 156 C-10 134 -14 104 -34 82Z"/>
      <path d="M-8 90 C-14 116 -6 142 4 160 C14 136 10 110 -8 90Z"/>
      <path d="M18 84 C12 110 20 138 30 156 C40 132 36 104 18 84Z"/>
    </g>
    <path d="M-30 84 Q-22 118 -22 156 M-4 90 Q4 124 4 160 M22 86 Q28 118 30 156" stroke="#7a3a1e" stroke-width="1.2" opacity="0.6"/>
  </g>

  <g class="kitchen-shelf-2" transform="translate(1160 300)">
    <rect x="0" y="0" width="280" height="12" rx="2" fill="#3a2113" stroke="#1a0f09" stroke-width="2"/>
    <g>
      <path d="M22 0 C14 -30 28 -50 44 -50 C60 -50 74 -30 66 0Z" fill="url(#brass)"/>
      <path d="M102 0 C96 -24 108 -40 122 -40 C136 -40 148 -24 142 0Z" fill="#6b4a2a"/>
      <rect x="176" y="-54" width="40" height="54" rx="5" fill="#3a2113" stroke="#1a0f09" stroke-width="2"/>
      <path d="M186 -36 H206 M186 -20 H206" stroke="#8a5a2a" stroke-width="2" opacity="0.6"/>
    </g>
  </g>

  <g class="hearth" transform="translate(1090 760)">
    <path d="M-190 0 V-210 Q0 -270 190 -210 V0Z" fill="#24140d" stroke="#120a07" stroke-width="4"/>
    <path d="M-160 0 V-196 Q0 -246 160 -196 V0Z" fill="#140b08"/>
    <path d="M-130 0 V-172 Q0 -214 130 -172 V0Z" fill="#0a0605"/>
    <path d="M-160 -196 Q0 -246 160 -196" fill="none" stroke="#5a351d" stroke-width="4" opacity="0.6"/>
    <g class="fire">
      <path class="fire__flame fire__flame--a" d="M0 0 C-40 -44 -22 -100 8 -128 C4 -82 34 -54 24 -18 C18 4 8 10 0 0Z" fill="#e0662e" opacity="0.9"/>
      <path class="fire__flame fire__flame--b" d="M-6 0 C-24 -34 -10 -72 10 -92 C10 -58 28 -40 18 -14 C12 2 2 8 -6 0Z" fill="#ffb45e" opacity="0.9"/>
      <path class="fire__flame fire__flame--c" d="M0 0 C-12 -22 -2 -46 10 -58 C12 -34 22 -22 14 -8 C8 2 4 4 0 0Z" fill="#fff3c4" opacity="0.95"/>
    </g>
    <g class="hearth-stand" transform="translate(0 -168)">
      <path d="M-150 0 H150" stroke="#3a2113" stroke-width="16" stroke-linecap="round"/>
      <path d="M-118 0 V24 M118 0 V24" stroke="#2a170d" stroke-width="8"/>
      <ellipse cx="0" cy="-4" rx="92" ry="18" fill="#2a170d"/>
      <ellipse cx="0" cy="-8" rx="84" ry="14" fill="#5a2f13"/>
      ${selRoti(-38, -12, 0.62, "sel-roti--fry")}
      ${selRoti(42, -10, 0.56)}
      <path d="M-96 -8 Q0 -30 96 -8" fill="none" stroke="#e0a65a" stroke-width="2" opacity="0.25"/>
    </g>
    <g class="hearth-pots" transform="translate(-126 -6)">
      <path d="M-34 0 C-42 -34 -24 -58 0 -58 C24 -58 42 -34 34 0Z" fill="url(#copper)"/>
      <ellipse cx="0" cy="-58" rx="20" ry="6" fill="#4a2112"/>
      <path d="M-24 -30 Q0 -20 24 -30" fill="none" stroke="#e0a65a" stroke-width="2" opacity="0.35"/>
    </g>
  </g>

  <g class="kitchen-table" transform="translate(420 744)">
    <ellipse cx="0" cy="14" rx="150" ry="24" fill="#0a0604" opacity="0.5"/>
    <rect x="-132" y="-8" width="264" height="22" rx="5" fill="#3a2113" stroke="#1a0f09" stroke-width="3"/>
    <path d="M-100 14 V52 M100 14 V52" stroke="#2a170d" stroke-width="9"/>
    <g transform="translate(-44 -24)">
      <ellipse cx="0" cy="6" rx="44" ry="12" fill="#1a0f09"/>
      ${selRoti(0, 0, 0.58)}
      ${selRoti(-14, -16, 0.48)}
      ${selRoti(18, -14, 0.44)}
    </g>
    <g transform="translate(64 -20)">
      <path d="M-22 0 Q0 12 22 0 L16 8 Q0 18 -16 8 Z" fill="url(#brass)" stroke="#4a2a14" stroke-width="1.2"/>
      <ellipse cx="0" cy="0" rx="22" ry="6" fill="#2a170d"/>
      <path d="M-10 -4 C-10 -18 -2 -26 4 -32 C10 -22 12 -12 8 -4Z" fill="#f1e4c8" opacity="0.18"/>
    </g>
  </g>

  <g class="steam" fill="none" stroke="#f1e4c8" stroke-linecap="round" opacity="0.24">
    <path class="steam__line" d="M1040 660 C1024 620 1052 596 1038 560 C1028 534 1046 514 1038 492" stroke-width="4"/>
    <path class="steam__line" d="M1100 650 C1114 612 1088 586 1102 552 C1112 526 1096 506 1104 484" stroke-width="3"/>
    <path class="steam__line" d="M384 700 C368 668 392 646 380 618 C372 596 386 580 380 562" stroke-width="3"/>
  </g>

  <g class="embers" fill="#ffb45e">
    <circle cx="1030" cy="600" r="2.4" opacity="0.8" style="animation-delay:-1s"/>
    <circle cx="1110" cy="570" r="1.8" opacity="0.7" style="animation-delay:-2.5s"/>
    <circle cx="1070" cy="520" r="2" opacity="0.6" style="animation-delay:-4s"/>
    <circle cx="1160" cy="610" r="1.6" opacity="0.7" style="animation-delay:-3s"/>
    <circle cx="990" cy="540" r="1.4" opacity="0.6" style="animation-delay:-5s"/>
  </g>

  <g class="utensils" transform="translate(1460 360)">
    <path d="M0 0 V240" stroke="#3e2414" stroke-width="4"/>
    <path d="M-30 40 Q-54 80 -34 120" fill="none" stroke="#8a5a2a" stroke-width="5"/>
    <path d="M-34 120 L-50 158 M-34 120 L-18 158" stroke="#8a5a2a" stroke-width="4"/>
    <path d="M22 60 C22 40 54 40 54 60 L48 96 H28Z" fill="url(#brass)" stroke="#4a2a14" stroke-width="1.5"/>
    <path d="M18 140 H58 L52 190 H24Z" fill="#3a2113" stroke="#1a0f09" stroke-width="2"/>
  </g>

  <g class="sacks" transform="translate(250 760)">
    <path d="M-80 0 C-92 -54 -58 -84 -6 -84 C46 -84 82 -54 70 0Z" fill="#6b5a3a"/>
    <path d="M-64 -54 Q-6 -42 52 -54" fill="none" stroke="#8a7448" stroke-width="2" opacity="0.6"/>
    <path d="M-16 -84 Q-6 -102 4 -84" fill="#4a3a24"/>
    <path d="M-28 -84 Q-6 -96 16 -84" fill="none" stroke="#3a2a18" stroke-width="3"/>
  </g>

  <rect y="760" width="1600" height="140" fill="url(#floorStone)"/>
  <path d="M0 790 H1600 M0 842 H1600 M0 888 H1600" stroke="#0a0705" stroke-width="3" opacity="0.55"/>
  <path d="M0 762 H1600" stroke="#5a351d" stroke-width="3" opacity="0.4"/>
</svg>`;
}

export function doorwayScene(): string {
  return `
<svg class="scene-svg scene-svg--doorway" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="1600" height="900" fill="url(#wallDoor)"/>
  <rect y="120" width="1600" height="780" fill="url(#woodDark)" opacity="0.42"/>
  <circle class="door-glow" cx="800" cy="470" r="520" fill="url(#warmGlow)" opacity="0"/>

  <g class="door-camera">
    <g class="door-frame">
      <rect x="510" y="130" width="580" height="670" fill="#24140c" stroke="#120a07" stroke-width="4"/>
      <rect x="548" y="168" width="504" height="632" fill="#0a0605"/>
      <rect x="548" y="168" width="504" height="632" fill="url(#doorLight)" opacity="0.95"/>
      <g class="door-garden" opacity="0.9">
        <path d="M548 800 V650 Q610 610 670 650 V800Z" fill="#16301f"/>
        <path d="M930 800 V620 Q990 580 1052 620 V800Z" fill="#16301f"/>
        <circle cx="800" cy="700" r="96" fill="#ffcf86" opacity="0.22"/>
        <circle cx="800" cy="700" r="62" fill="none" stroke="#f1e4c8" stroke-width="2" opacity="0.35"/>
        <circle cx="800" cy="700" r="40" fill="none" stroke="#e79a35" stroke-width="2" opacity="0.4"/>
        <path d="M730 660 C750 640 770 640 790 660 M810 740 C830 720 850 720 870 740" stroke="#5d7452" stroke-width="4" fill="none" opacity="0.6"/>
        <circle cx="690" cy="560" r="2.2" fill="#f6c25a" opacity="0.8"/>
        <circle cx="910" cy="590" r="1.8" fill="#f6c25a" opacity="0.7"/>
        <circle cx="860" cy="520" r="1.5" fill="#f6c25a" opacity="0.6"/>
      </g>

      <g class="door door--left">
        <rect x="548" y="168" width="252" height="632" fill="url(#wood)" stroke="#120a07" stroke-width="3"/>
        <rect x="574" y="198" width="200" height="250" rx="3" fill="none" stroke="#5a351d" stroke-width="5"/>
        <rect x="596" y="220" width="156" height="206" rx="2" fill="url(#latticeWarm)" opacity="0.55"/>
        <rect x="574" y="474" width="200" height="280" rx="3" fill="none" stroke="#5a351d" stroke-width="5"/>
        <path d="M640 514 C620 540 620 574 650 594 C680 574 680 540 660 514Z" fill="#8a5a2a" opacity="0.65"/>
        <path d="M640 514 C650 540 650 570 650 594 M660 514 C650 540 650 570 650 594" stroke="#3e2414" stroke-width="2" opacity="0.6"/>
        <circle cx="786" cy="500" r="10" fill="none" stroke="#c0833f" stroke-width="5"/>
        <path d="M548 168 V800" stroke="#120a07" stroke-width="5"/>
      </g>

      <g class="door door--right">
        <rect x="800" y="168" width="252" height="632" fill="url(#wood)" stroke="#120a07" stroke-width="3"/>
        <rect x="826" y="198" width="200" height="250" rx="3" fill="none" stroke="#5a351d" stroke-width="5"/>
        <rect x="848" y="220" width="156" height="206" rx="2" fill="url(#latticeWarm)" opacity="0.55"/>
        <rect x="826" y="474" width="200" height="280" rx="3" fill="none" stroke="#5a351d" stroke-width="5"/>
        <path d="M960 514 C940 540 940 574 970 594 C1000 574 1000 540 980 514Z" fill="#8a5a2a" opacity="0.65"/>
        <path d="M960 514 C970 540 970 570 970 594 M980 514 C970 540 970 570 970 594" stroke="#3e2414" stroke-width="2" opacity="0.6"/>
        <circle cx="814" cy="500" r="10" fill="none" stroke="#c0833f" stroke-width="5"/>
        <path d="M1052 168 V800" stroke="#120a07" stroke-width="5"/>
      </g>

      <path d="M510 130 H1090 V176 H510Z" fill="url(#wood)" stroke="#120a07" stroke-width="3"/>
      <g fill="none" stroke="#8a5a2a" stroke-width="2" opacity="0.6">
        <path d="M560 154 Q600 136 640 154 T720 154 T800 154 T880 154 T960 154 T1040 154"/>
        <circle cx="600" cy="150" r="7"/><circle cx="700" cy="150" r="7"/><circle cx="800" cy="150" r="7"/>
        <circle cx="900" cy="150" r="7"/><circle cx="1000" cy="150" r="7"/>
      </g>
      ${garland("M520 150 Q800 220 1080 150", "#e79a35")}
      <rect x="486" y="800" width="628" height="18" rx="3" fill="#3a2113" stroke="#120a07" stroke-width="2"/>
    </g>

    <path class="door-spill" d="M548 800 H1052 L1320 900 H280 Z" fill="url(#lightSpill)" opacity="0"/>
    ${diya(460, 780, 1.1)}
    ${diya(1140, 780, 1.1)}

    <g class="door-dust" fill="#f1e4c8">
      <circle cx="700" cy="500" r="2" opacity="0.5" style="animation-delay:-1s"/>
      <circle cx="760" cy="600" r="1.6" opacity="0.45" style="animation-delay:-3s"/>
      <circle cx="900" cy="550" r="2.2" opacity="0.4" style="animation-delay:-5s"/>
      <circle cx="840" cy="660" r="1.5" opacity="0.5" style="animation-delay:-2s"/>
    </g>
  </g>

  <rect y="800" width="1600" height="100" fill="url(#floorWood)"/>
  <path d="M0 828 H1600 M0 870 H1600" stroke="#0a0604" stroke-width="3" opacity="0.55"/>
  <path d="M0 802 H1600" stroke="#5a351d" stroke-width="3" opacity="0.45"/>
</svg>`;
}

export function sceneMarkup(): string[] {
  return [roofScene(), atticScene(), pujaScene(), kitchenScene(), doorwayScene()];
}

export { marigold };
