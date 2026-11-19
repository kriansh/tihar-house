import { diya, garland, latticeWindow, marigold } from "./helpers";

const COLORS = {
  rice: "#f1e4c8",
  marigold: "#d98a2c",
  saffron: "#f0b04a",
  vermilion: "#b8442c",
  leaf: "#5d6f4e",
  teal: "#3c6f68",
  rose: "#b8646a",
  gold: "#e8b16a"
};

function petal(
  angle: number,
  r1: number,
  r2: number,
  width: number,
  color: string,
  cls: string,
  fill = false
): string {
  const d = `M0 ${-r1} C ${width} ${-(r1 + (r2 - r1) * 0.32)} ${width * 0.78} ${-r2} 0 ${-r2} C ${-width * 0.78} ${-r2} ${-width} ${-(r1 + (r2 - r1) * 0.32)} 0 ${-r1} Z`;
  if (fill) {
    return `<path class="${cls}" transform="rotate(${angle})" d="${d}" fill="${color}" opacity="0"/>`;
  }
  return `<path class="${cls}" data-draw data-color="${color}" pathLength="1" transform="rotate(${angle})" d="${d}" fill="none" stroke="${color}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function ring(r: number, color: string, cls = "rangoli__ring"): string {
  return `<circle class="${cls}" data-draw data-color="${color}" pathLength="1" cx="0" cy="0" r="${r}" fill="none" stroke="${color}" stroke-width="3.4" stroke-linecap="round"/>`;
}

function dot(x: number, y: number, r: number, color: string, cls = "rangoli__dot"): string {
  return `<circle class="${cls}" data-color="${color}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}" fill="${color}" opacity="0"/>`;
}

/**
 * The rangoli is drawn flat, then laid onto the courtyard with a vertical
 * squash so it reads as a circle seen from standing height. The whole group is
 * centred at 800 / 670; the border diyas are positioned separately so they
 * stay upright while sitting on the same ellipse.
 */
function rangoliMarkup(): string {
  const outerPalette = [COLORS.marigold, COLORS.vermilion, COLORS.leaf, COLORS.rose, COLORS.teal, COLORS.saffron];

  const outerPetals = Array.from({ length: 12 }, (_, i) =>
    petal(i * 30, 86, 244, 48, outerPalette[i % outerPalette.length], "rangoli__petal")
  ).join("");

  const outerFills = Array.from({ length: 12 }, (_, i) =>
    petal(i * 30, 86, 244, 48, outerPalette[i % outerPalette.length], "rangoli__fill", true)
  ).join("");

  const innerPalette = [COLORS.gold, COLORS.rose, COLORS.leaf, COLORS.marigold];

  const innerPetals = Array.from({ length: 8 }, (_, i) =>
    petal(i * 45 + 22.5, 30, 108, 28, innerPalette[i % innerPalette.length], "rangoli__inner")
  ).join("");

  const innerFills = Array.from({ length: 8 }, (_, i) =>
    petal(i * 45 + 22.5, 30, 108, 28, innerPalette[i % innerPalette.length], "rangoli__fill", true)
  ).join("");

  const dotsOuter = Array.from({ length: 24 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 24;
    return dot(Math.cos(a) * 286, Math.sin(a) * 286, 4, i % 2 ? COLORS.marigold : COLORS.rice);
  }).join("");

  const dotsMid = Array.from({ length: 12 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 12 + Math.PI / 12;
    return dot(Math.cos(a) * 206, Math.sin(a) * 206, 3.2, i % 2 ? COLORS.rice : COLORS.rose);
  }).join("");

  const petals = Array.from({ length: 12 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 12;
    return marigold(Math.cos(a) * 254, Math.sin(a) * 254, 7, i % 2 ? COLORS.marigold : COLORS.saffron);
  }).join("");

  return `
  <g class="rangoli" transform="translate(800 645) scale(1 0.52)">
    <circle cx="0" cy="0" r="300" fill="#07100b" opacity="0.5"/>
    <circle cx="0" cy="0" r="300" fill="url(#rice)" opacity="0.16"/>
    ${ring(270, COLORS.rice)}
    ${ring(258, COLORS.gold)}
    ${outerPetals}
    ${outerFills}
    ${ring(140, COLORS.rice)}
    ${ring(120, COLORS.marigold)}
    ${innerPetals}
    ${innerFills}
    ${ring(74, COLORS.gold)}
    ${ring(52, COLORS.rose)}
    <g class="rangoli__center">
      <circle class="rangoli__fill" cx="0" cy="0" r="26" fill="${COLORS.vermilion}" opacity="0"/>
      <circle class="rangoli__fill" cx="0" cy="0" r="16" fill="${COLORS.marigold}" opacity="0"/>
      <circle class="rangoli__fill" cx="0" cy="0" r="7" fill="${COLORS.rice}" opacity="0"/>
      <circle class="rangoli__dot" data-color="${COLORS.gold}" cx="0" cy="0" r="3" fill="${COLORS.gold}" opacity="0"/>
    </g>
    ${dotsOuter}
    ${dotsMid}
    ${petals}
  </g>`;
}

function tikaMarkup(): string {
  const bands = [
    { y: -24, w: 30, color: COLORS.saffron },
    { y: -16, w: 34, color: COLORS.vermilion },
    { y: -8, w: 36, color: COLORS.marigold },
    { y: 0, w: 36, color: COLORS.leaf },
    { y: 8, w: 34, color: COLORS.teal },
    { y: 16, w: 30, color: COLORS.rose },
    { y: 24, w: 24, color: COLORS.rice }
  ];
  const bowls = Array.from({ length: 7 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 7 - Math.PI / 2;
    const x = Math.cos(a) * 94;
    const y = Math.sin(a) * 30 + 12;
    return `<circle class="tika__bowl" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${bands[i].color}" opacity="0.85"/>`;
  }).join("");

  return `
  <g class="tika-tray" transform="translate(800 820)">
    <ellipse cx="0" cy="20" rx="150" ry="28" fill="#050302" opacity="0.6"/>
    <rect x="-132" y="-12" width="264" height="54" rx="10" fill="#2e1a0e" stroke="#120a07" stroke-width="3"/>
    <ellipse cx="0" cy="14" rx="104" ry="20" fill="#1c0f08"/>
    <ellipse cx="0" cy="12" rx="96" ry="17" fill="url(#brass)" opacity="0.6"/>
    <g class="tika" transform="translate(0 4)">
      <ellipse cx="0" cy="0" rx="24" ry="36" fill="#c99b74" opacity="0.92"/>
      ${bands
        .map(
          (b) =>
            `<rect class="tika__band" x="${-b.w / 2}" y="${b.y}" width="${b.w}" height="6" rx="3" fill="${b.color}" opacity="0"/>`
        )
        .join("")}
      <circle class="tika__band" cx="0" cy="0" r="3.2" fill="${COLORS.gold}" opacity="0"/>
    </g>
    ${bowls}
    <path d="M-116 34 Q0 50 116 34" fill="none" stroke="#e0a65a" stroke-width="1.4" opacity="0.36"/>
    ${marigold(-112, 4, 6, COLORS.marigold)}
    ${marigold(112, 2, 5.4, COLORS.saffron)}
  </g>`;
}

function borderDiyas(): string {
  // Kept upright, but placed on the same ground ellipse as the rangoli.
  return Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 16 - Math.PI / 2;
    const x = 800 + Math.cos(a) * 300;
    const y = 645 + Math.sin(a) * 300 * 0.52;
    const depth = (Math.sin(a) + 1) / 2;
    return `<g class="border-diya" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(0.82 + depth * 0.26).toFixed(2)})">
      <ellipse cx="0" cy="9" rx="20" ry="5" fill="#050302" opacity="0.55"/>
      ${diya(0, 0, 1.05)}
    </g>`;
  }).join("");
}

function fireflies(): string {
  return Array.from({ length: 18 }, (_, i) => {
    const x = 120 + ((i * 137) % 1360);
    const y = 220 + ((i * 193) % 600);
    const d = (i * 0.7).toFixed(2);
    return `<circle class="firefly" cx="${x}" cy="${y}" r="${i % 3 === 0 ? 2.2 : 1.5}" fill="#f6c25a" opacity="0" style="animation-delay:-${d}s"/>`;
  }).join("");
}

function stringLights(baseY = 264): string {
  const points = Array.from({ length: 17 }, (_, i) => {
    const t = i / 16;
    const x = 470 + t * 660;
    const y = baseY + Math.sin(t * Math.PI) * 46;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 3 === 0 ? 3 : 2.2}" fill="#ffd489" opacity="${(0.55 + (i % 4) * 0.1).toFixed(2)}"/>`;
  }).join("");
  return `<g class="garden-string-lights">
    <path d="M470 ${baseY} Q800 ${baseY + 86} 1130 ${baseY}" fill="none" stroke="#22140c" stroke-width="1.6" opacity="0.6"/>
    ${points}
  </g>`;
}

function houseMarkup(): string {
  // The same roof silhouette that opens the story, now seen from the garden:
  // one house, one warm door, the courtyard in front of it.
  return `
  <g class="garden-house">
    <circle class="garden-house-glow" cx="800" cy="220" r="380" fill="url(#warmGlow)" opacity="0"/>

    <!-- the house: same silhouette, smaller, further back -->
    <g class="garden-roof">
      <path d="M456 350 L640 92 L960 92 L1144 350 Z" fill="#120b07"/>
      <path d="M474 338 L654 106 L946 106 L1126 338 Z" fill="url(#thatchDark)"/>
      <path d="M640 92 H960 L974 122 H626 Z" fill="#0a0704"/>
      <path d="M626 122 Q800 134 974 122" fill="none" stroke="#3e2614" stroke-width="4" opacity="0.5"/>
      <path d="M456 350 H1144 L1128 372 H472 Z" fill="#0a0604"/>
      <path d="M472 372 H1128" stroke="#341f10" stroke-width="3" opacity="0.7"/>
    </g>

    <!-- the lit room under the thatch -->
    <rect x="560" y="350" width="480" height="120" fill="url(#woodDark)"/>
    <rect x="560" y="350" width="480" height="5" fill="#341f10" opacity="0.6"/>

    <!-- door, open onto warmth -->
    <path d="M730 470 V390 Q800 338 870 390 V470 Z" fill="#0a0605" stroke="#2e1a0e" stroke-width="3"/>
    <path d="M744 470 V396 Q800 350 856 396 V470 Z" fill="url(#doorLight)" opacity="0.92"/>
    <path d="M758 470 V402 Q800 362 842 402 V470 Z" fill="url(#warmGlow)" opacity="0.4"/>
    <path d="M730 470 V398 Q744 374 762 362 V470 Z" fill="url(#wood)" stroke="#120a07" stroke-width="2"/>
    <path d="M870 470 V398 Q856 374 838 362 V470 Z" fill="url(#wood)" stroke="#120a07" stroke-width="2"/>
    <circle class="garden-house-lamp" cx="800" cy="428" r="92" fill="url(#warmGlow)" opacity="0"/>

    <!-- two carved windows, the same lattice as the rooms inside -->
    ${latticeWindow(600, 380, 92, 58, { warm: true })}
    ${latticeWindow(908, 380, 92, 58, { warm: true })}

    <!-- eaves garland and a line of small lights -->
    ${garland("M468 366 Q800 420 1132 366", "#d98a2c")}
    ${stringLights()}

    <!-- diyas at the step -->
    ${diya(694, 464, 0.95, { lit: true })}
    ${diya(906, 464, 0.95, { lit: true })}

    <!-- threshold step -->
    <rect x="512" y="470" width="576" height="18" rx="3" fill="#2a170d" stroke="#0c0704" stroke-width="2"/>
    <path d="M540 488 H1060" stroke="#5a351d" stroke-width="3" opacity="0.4"/>
  </g>`;
}

export function gardenScene(): string {
  return `
<svg class="scene-svg garden-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="1600" height="900" fill="url(#skyNight)"/>
  <rect width="1600" height="470" fill="url(#gardenLight)" opacity="0.75"/>

  <!-- a low moon and a cold valley behind the one warm house -->
  <circle cx="1268" cy="150" r="150" fill="url(#moonGlow)" opacity="0.32"/>
  <circle cx="1268" cy="150" r="34" fill="#eadfc2" opacity="0.72"/>
  <circle cx="1280" cy="142" r="33" fill="#070a16"/>

  <g class="garden-valley">
    <path d="M0 400 Q220 336 430 374 T860 350 T1260 378 T1600 348 V470 H0Z" fill="#081410" opacity="0.94"/>
    <path d="M0 436 Q280 384 560 414 T1080 398 T1600 420 V480 H0Z" fill="#06100c"/>
    <g fill="#f0b04a" opacity="0.34">
      <circle cx="286" cy="410" r="1.4"/><circle cx="342" cy="422" r="1.1"/>
      <circle cx="1210" cy="406" r="1.3"/><circle cx="1290" cy="418" r="1"/>
      <circle cx="1080" cy="424" r="1.1"/>
    </g>
  </g>

  <!-- trees flanking the house -->
  <g class="garden-trees">
    <g transform="translate(374 466)">
      <path d="M-8 0 C-16 -64 6 -122 0 -168" stroke="#12231a" stroke-width="9" fill="none"/>
      <circle cx="-38" cy="-150" r="58" fill="#14271b"/>
      <circle cx="14" cy="-186" r="46" fill="#1a3021"/>
      <circle cx="42" cy="-138" r="40" fill="#0f2016"/>
      <circle cx="-10" cy="-114" r="36" fill="#112419"/>
    </g>
    <g transform="translate(1228 462)">
      <path d="M8 0 C16 -72 -6 -126 0 -174" stroke="#12231a" stroke-width="9" fill="none"/>
      <circle cx="38" cy="-156" r="60" fill="#14271b"/>
      <circle cx="-16" cy="-192" r="46" fill="#1a3021"/>
      <circle cx="-44" cy="-142" r="40" fill="#0f2016"/>
      <circle cx="10" cy="-116" r="36" fill="#112419"/>
    </g>
  </g>

  ${houseMarkup()}

  <!-- courtyard: ground, paving, warm spill from the open door -->
  <rect y="470" width="1600" height="430" fill="url(#gardenGround)"/>
  <rect y="470" width="1600" height="430" fill="url(#paving)" opacity="0.52"/>
  <ellipse cx="800" cy="620" rx="540" ry="180" fill="url(#warmGlow)" opacity="0.16"/>
  <path d="M0 470 H1600" stroke="#3e2614" stroke-width="2" opacity="0.35"/>

  <!-- low garden wall at the sides, keeping the courtyard open -->
  <g class="garden-wall" opacity="0.78">
    <path d="M0 470 H214 M1386 470 H1600" stroke="#1a2a20" stroke-width="16"/>
    <path d="M0 470 H214 M1386 470 H1600" stroke="#2f4634" stroke-width="3" opacity="0.5"/>
  </g>

  <!-- plants and pots at the edge of the light -->
  <g class="garden-plants" opacity="0.92">
    <g transform="translate(206 700)">
      <path d="M0 0 C-42 -32 -54 -84 -30 -120 C-10 -90 -8 -48 0 0Z" fill="#1f3a29"/>
      <path d="M6 0 C38 -38 44 -90 18 -126 C2 -94 0 -48 6 0Z" fill="#27462f"/>
      <path d="M-6 0 C-18 -52 -4 -96 18 -118 C20 -78 10 -36 -6 0Z" fill="#183022"/>
    </g>
    <g transform="translate(1398 690)">
      <path d="M0 0 C-40 -36 -48 -90 -22 -124 C-4 -92 -4 -46 0 0Z" fill="#1f3a29"/>
      <path d="M6 0 C40 -40 44 -94 16 -128 C0 -94 0 -46 6 0Z" fill="#27462f"/>
      <path d="M-8 0 C-20 -54 -4 -98 16 -120 C20 -80 10 -36 -8 0Z" fill="#183022"/>
    </g>
    <g transform="translate(326 792)">
      <path d="M-36 0 C-44 -34 -24 -56 0 -56 C24 -56 44 -34 36 0Z" fill="url(#copper)"/>
      <ellipse cx="0" cy="-56" rx="21" ry="6" fill="#3a1e10"/>
      <path d="M-26 -30 Q0 -20 26 -30" fill="none" stroke="#e0a65a" stroke-width="2" opacity="0.3"/>
    </g>
    <g transform="translate(1272 800)">
      <path d="M-32 0 C-40 -28 -22 -48 0 -48 C22 -48 40 -28 32 0Z" fill="url(#brass)"/>
      <ellipse cx="0" cy="-48" rx="18" ry="5" fill="#3a1e10"/>
    </g>
  </g>

  <!-- a few low cushions where the family sits -->
  <g class="garden-cushions">
    <g transform="translate(412 742)">
      <rect x="-62" y="-34" width="124" height="68" rx="12" fill="#4a221b" stroke="#24100c" stroke-width="3"/>
      <path d="M-46 -18 H46 M-46 0 H46 M-46 18 H46" stroke="#7a3a26" stroke-width="2" opacity="0.5"/>
      ${marigold(-46, -24, 6, COLORS.marigold)}
      ${marigold(46, -24, 6, COLORS.saffron)}
    </g>
    <g transform="translate(1188 748)">
      <rect x="-62" y="-34" width="124" height="68" rx="12" fill="#233527" stroke="#0f1e16" stroke-width="3"/>
      <path d="M-46 -18 H46 M-46 0 H46 M-46 18 H46" stroke="#3f5a42" stroke-width="2" opacity="0.5"/>
      ${marigold(-46, -24, 6, COLORS.gold)}
      ${marigold(46, -24, 6, COLORS.marigold)}
    </g>
  </g>

  ${rangoliMarkup()}
  ${borderDiyas()}
  ${tikaMarkup()}

  <!-- fallen petals around the drawing -->
  <g class="garden-petals" opacity="0.66">
    <ellipse cx="410" cy="620" rx="8" ry="4" fill="#d98a2c" transform="rotate(-22 410 620)"/>
    <ellipse cx="1210" cy="690" rx="7" ry="3.5" fill="#b8646a" transform="rotate(34 1210 690)"/>
    <ellipse cx="572" cy="806" rx="8" ry="4" fill="#f0b04a" transform="rotate(18 572 806)"/>
    <ellipse cx="1046" cy="592" rx="6" ry="3" fill="#f1e4c8" transform="rotate(-40 1046 592)"/>
    <ellipse cx="984" cy="826" rx="7" ry="3.5" fill="#b8442c" transform="rotate(-15 984 826)"/>
  </g>

  ${fireflies()}

  <!-- near-dark foreground corners -->
  <path d="M0 900 V818 Q200 790 380 900 Z" fill="#040906" opacity="0.9"/>
  <path d="M1600 900 V818 Q1400 790 1220 900 Z" fill="#040906" opacity="0.9"/>
</svg>`;
}
