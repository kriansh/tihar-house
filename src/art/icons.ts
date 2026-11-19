/* Diya artwork from "withicons:diya" by With Icons (MIT).
   https://github.com/withevergrow/withicons · inlined so it inherits currentColor
   and can share the existing flame/glow animation hooks. */

export const DIYA_PATHS = {
  bowl: "M2.5 12.5c4 1.25 7 1.5 9.5 1.5s5.5-.25 9.5-1.5c-.75 5.25-4.75 8.25-9.5 8.25s-8.75-3-9.5-8.25",
  rim: "M7.25 16.75c3 .75 6.5.75 9.5 0",
  flame: "M12 11c-2 0-3-1.5-2.75-3S11 5 12 2.5c1 2.5 2.5 4 2.75 5.5S14 11 12 11"
} as const;

export type DiyaIconOptions = {
  className?: string;
  glow?: boolean;
  animFlame?: boolean;
};

export function diyaIcon(options: DiyaIconOptions = {}): string {
  const { className = "", glow = false, animFlame = false } = options;
  const flame = animFlame
    ? `<g class="diya__flame-wrap"><path d="${DIYA_PATHS.flame}"/></g>`
    : `<path d="${DIYA_PATHS.flame}"/>`;
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    ${glow ? '<circle class="diya__glow" cx="12" cy="11" r="10" fill="url(#warmGlow)" opacity="0"/>' : ""}
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75">
      <path d="${DIYA_PATHS.bowl}"/>
      <path d="${DIYA_PATHS.rim}"/>
      ${flame}
    </g>
  </svg>`;
}
