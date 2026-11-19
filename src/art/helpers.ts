export type DiyaOptions = {
  lit?: boolean;
  interactive?: boolean;
  id?: string;
  scale?: number;
  glow?: boolean;
};

export function diya(x: number, y: number, scale = 1, opts: DiyaOptions = {}): string {
  const { lit = false, interactive = false, id = "", glow = true } = opts;
  return `
  <g class="diya${lit ? " is-lit" : ""}${interactive ? " diya--interactive" : ""}" transform="translate(${x} ${y}) scale(${scale})"${id ? ` data-diya="${id}"` : ""}>
    ${glow ? `<circle class="diya__glow" cx="0" cy="-12" r="46" fill="url(#warmGlow)" opacity="0"/>` : ""}
    <ellipse cx="0" cy="7" rx="20" ry="4.2" fill="#050302" opacity="0.6"/>
    <path d="M-17 0 Q0 12 17 0 L13 7 Q0 17 -13 7 Z" fill="url(#brass)" stroke="#3a2010" stroke-width="1"/>
    <ellipse cx="0" cy="0" rx="17" ry="4.6" fill="#1d1008"/>
    <path d="M-17 0 H17" stroke="#3a2010" stroke-width="1" opacity="0.6"/>
    <path d="M0 -2 L0 -7" stroke="#1d1008" stroke-width="2"/>
    <g class="diya__flame-wrap">
      <path class="diya__flame" d="M0 -24 C8 -15 7 -5 0 -2 C-7 -5 -8 -15 0 -24Z" fill="url(#flame)"/>
      <path class="diya__flame-inner" d="M0 -16 C4 -12 4 -5 0 -3 C-4 -5 -4 -12 0 -16Z" fill="#fff4c8" opacity="0.94"/>
    </g>
  </g>`;
}

export function marigold(x: number, y: number, r = 8, color = "#d98a2c"): string {
  const petals = Array.from({ length: 7 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 7 - Math.PI / 2;
    const px = Math.cos(a) * r * 0.6;
    const py = Math.sin(a) * r * 0.6;
    return `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${(r * 0.34).toFixed(2)}" fill="${color}" opacity="0.97"/>`;
  }).join("");
  return `<g class="marigold" transform="translate(${x} ${y})">
    ${petals}
    <circle cx="0" cy="0" r="${(r * 0.26).toFixed(2)}" fill="#f0c25a"/>
  </g>`;
}

export function garland(d: string, color = "#d98a2c"): string {
  return `<g class="garland" data-garland-group data-flower="${color}">
    <path d="${d}" fill="none" stroke="#1a0f08" stroke-width="2.2" opacity="0.7"/>
    <path data-garland d="${d}" fill="none" stroke="${color}" stroke-width="2.8" opacity="0.28"/>
  </g>`;
}

export function footprint(
  x: number,
  y: number,
  scale = 1,
  rotation = 0,
  color = "#e9dfc0"
): string {
  return `<g class="footprint" transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})" fill="${color}" opacity="0.93">
    <path d="M0 0 C-4 -2 -6 -7 -3 -10 C0 -13 5 -10 5 -6 C5 -2 2 1 0 0Z"/>
    <circle cx="-3.2" cy="-14" r="1.9"/>
    <circle cx="0" cy="-16" r="1.7"/>
    <circle cx="3.1" cy="-15" r="1.5"/>
    <circle cx="5.4" cy="-12.6" r="1.2"/>
  </g>`;
}

export function crowPerched(x: number, y: number, scale = 1, flip = false): string {
  // A single crow being fed on the roof — confident silhouette, not a crowd.
  return `<g class="crow" transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})" fill="#06080d">
    <ellipse cx="0" cy="0" rx="25" ry="15"/>
    <circle cx="19" cy="-11" r="10"/>
    <path d="M26 -14 L41 -9 L26 -4 Z"/>
    <path d="M-19 4 L-46 22 L-28 1 Z"/>
    <path d="M-7 13 L-9 28 M7 13 L9 28" stroke="#06080d" stroke-width="2.4"/>
    <path d="M-14 0 C-4 -6 9 -6 17 0" stroke="#151a26" stroke-width="1" fill="none" opacity="0.5"/>
    <circle cx="22" cy="-13" r="1.5" fill="#d8cdb6" opacity="0.6"/>
  </g>`;
}

export function crowFly(x: number, y: number, scale = 1, flip = false): string {
  return `<g class="crow crow--fly" transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})" fill="#06080d">
    <path d="M0 0 C-17 -23 -46 -29 -64 -16 C-46 -10 -31 2 -19 13 C-9 8 -4 4 0 0Z"/>
    <path d="M0 0 C17 -23 46 -29 64 -16 C46 -10 31 2 19 13 C9 8 4 4 0 0Z"/>
    <ellipse cx="0" cy="4" rx="8.5" ry="15"/>
    <path d="M-4 19 L0 33 L4 19Z"/>
  </g>`;
}

export function dog(x: number, y: number, scale = 1): string {
  const garlandFlowers = [
    [-8, -49, 7],
    [2, -42, 7.5],
    [14, -39, 8],
    [26, -42, 7.5],
    [36, -49, 7]
  ]
    .map(([fx, fy, fr]) => marigold(fx, fy, fr))
    .join("");

  return `<g class="dog" transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="0" cy="9" rx="80" ry="13" fill="#050302" opacity="0.55"/>
    <path d="M-48 0 C-54 -44 -37 -70 -8 -74 C19 -78 44 -60 46 -30 L48 0 Z" fill="#9a6238"/>
    <path d="M-43 -4 C-48 -40 -31 -62 -8 -66 C13 -70 31 -55 36 -33" fill="none" stroke="#c08444" stroke-width="3" opacity="0.4"/>
    <rect x="-42" y="-21" width="24" height="36" rx="12" fill="#7e4c2c"/>
    <rect x="16" y="-19" width="24" height="34" rx="12" fill="#7e4c2c"/>
    <path d="M-45 -47 C-66 -51 -68 -29 -50 -21" fill="#7e4c2c"/>
    <circle cx="19" cy="-76" r="29" fill="#9a6238"/>
    <path d="M4 -96 C-9 -113 -32 -104 -26 -86 C-18 -75 -6 -80 4 -96Z" fill="#55301b"/>
    <path d="M32 -98 C48 -113 63 -100 55 -85 C48 -76 38 -81 32 -98Z" fill="#55301b"/>
    <ellipse cx="34" cy="-68" rx="20" ry="13.5" fill="#c08444"/>
    <circle cx="48" cy="-70" r="4.4" fill="#150c06"/>
    <circle cx="29" cy="-83" r="2.7" fill="#150c06"/>
    <path d="M28 -62 Q35 -57 41 -62" stroke="#150c06" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M-8 -53 Q19 -38 42 -55" stroke="#b8442c" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M-9 -52 Q19 -35 43 -54" stroke="#1d0f08" stroke-width="1.4" fill="none" opacity="0.5"/>
    ${garlandFlowers}
  </g>`;
}

export function latticeWindow(
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { warm?: boolean; moon?: boolean; label?: string } = {}
): string {
  const { warm = false, moon = false } = opts;
  return `<g class="window${warm ? " window--warm" : ""}" transform="translate(${x} ${y})">
    <rect x="-18" y="-18" width="${w + 36}" height="${h + 36}" rx="4" fill="#1c100a" stroke="#4a2e18" stroke-width="2"/>
    <rect x="-10" y="-10" width="${w + 20}" height="${h + 20}" fill="url(#wood)"/>
    <rect x="0" y="0" width="${w}" height="${h}" fill="#06080f"/>
    ${moon ? `<circle cx="${w * 0.7}" cy="${h * 0.28}" r="${Math.min(w, h) * 0.16}" fill="#f0e0bc" opacity="0.85"/><circle cx="${w * 0.74}" cy="${h * 0.25}" r="${Math.min(w, h) * 0.15}" fill="#070a16"/>` : ""}
    <rect x="0" y="0" width="${w}" height="${h}" fill="url(#${warm ? "latticeWarm" : "lattice"})"/>
    <rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#1c100a" stroke-width="5"/>
    <path d="M-10 0 H${w + 10} M-10 ${h} H${w + 10}" stroke="#4a2e18" stroke-width="4" opacity="0.8"/>
    <path d="M0 0 L${w} ${h} M${w} 0 L0 ${h}" stroke="#1c100a" stroke-width="3" opacity="0.45"/>
    <rect x="-26" y="${h + 18}" width="${w + 52}" height="14" rx="3" fill="#2e1a0e" stroke="#4a2e18" stroke-width="1.5"/>
    ${warm ? `<circle cx="${w / 2}" cy="${h / 2}" r="${Math.max(w, h) * 0.55}" fill="url(#warmGlow)" opacity="0.55"/>` : `<circle cx="${w / 2}" cy="${h / 2}" r="${Math.max(w, h) * 0.55}" fill="url(#coolGlow)" opacity="0.5"/>`}
  </g>`;
}
