import { gsap } from "gsap";
import { t, type Lang } from "./i18n";
import { SLIDES, type SlideId, type SlideSpec } from "./deck-data";
import { SVG_DEFS } from "./art/defs";
import { crowFly, crowPerched, marigold } from "./art/helpers";
import { diyaIcon } from "./art/icons";

const BASE = import.meta.env.BASE_URL;

type DeckOptions = {
  reduceMotion: boolean;
  onFirstLight?: () => void;
  onSlideChange?: (id: SlideId) => void;
};

type CardState = {
  maximized: boolean;
  restoreX: number;
  restoreY: number;
};

export class Deck {
  private readonly root: HTMLElement;
  private readonly viewport: HTMLElement;
  private readonly prevButton: HTMLButtonElement;
  private readonly nextButton: HTMLButtonElement;
  private readonly counter: HTMLElement;
  private readonly progress: HTMLElement;
  private readonly navItems: HTMLButtonElement[];
  private readonly reduceMotion: boolean;
  private readonly onFirstLight?: () => void;
  private readonly onSlideChange?: (id: SlideId) => void;

  private slides: HTMLElement[] = [];
  private readonly cardStates = new WeakMap<HTMLElement, CardState>();
  private lang: Lang;
  private active = 0;
  private diyaLit = false;
  private wheelLock = 0;

  constructor(lang: Lang, opts: DeckOptions) {
    this.lang = lang;
    this.reduceMotion = opts.reduceMotion;
    this.onFirstLight = opts.onFirstLight;
    this.onSlideChange = opts.onSlideChange;
    this.root = document.querySelector<HTMLElement>("#deck")!;
    this.viewport = this.root.querySelector<HTMLElement>("[data-deck-viewport]")!;
    this.prevButton = this.root.querySelector<HTMLButtonElement>("[data-deck-prev]")!;
    this.nextButton = this.root.querySelector<HTMLButtonElement>("[data-deck-next]")!;
    this.counter = this.root.querySelector<HTMLElement>("[data-deck-counter]")!;
    this.progress = this.root.querySelector<HTMLElement>("[data-deck-progress]")!;
    this.navItems = Array.from(document.querySelectorAll<HTMLButtonElement>(".chapter-nav__item"));
  }

  init(): void {
    this.mountDefs();
    this.render();
    this.bind();
    this.goTo(this.indexFromHash(), true);
    requestAnimationFrame(() => this.root.classList.add("is-ready"));
  }

  setLang(lang: Lang): void {
    if (lang === this.lang) return;
    this.lang = lang;
    const current = this.active;
    this.render();
    this.goTo(current, true);
  }

  private mountDefs(): void {
    if (document.querySelector(".svg-defs")) return;
    const host = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    host.setAttribute("aria-hidden", "true");
    host.classList.add("svg-defs");
    host.innerHTML = SVG_DEFS;
    document.body.prepend(host);
  }

  private render(): void {
    this.viewport.innerHTML = SLIDES.map((spec, i) => this.slideMarkup(spec, i)).join("");
    this.slides = Array.from(this.viewport.querySelectorAll<HTMLElement>(".slide"));
    this.slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === this.active);
      slide.setAttribute("aria-hidden", String(i !== this.active));
      if (i === this.active) slide.removeAttribute("inert"); else slide.setAttribute("inert", "");
    });
    this.bindCards();
  }

  private mediaMarkup(spec: SlideSpec): string {
    const img = spec.image;
    return `<picture class="slide__media">
      <source media="(max-aspect-ratio: 1/1)" srcset="${BASE}images/${img}-portrait.webp" />
      <img src="${BASE}images/${img}-1600.webp" srcset="${BASE}images/${img}-1600.webp 1600w, ${BASE}images/${img}-2400.webp 2400w"
        sizes="100vw" alt="${spec.alt}" ${spec.id === "intro" ? 'fetchpriority="high"' : 'fetchpriority="low"'} decoding="async" />
    </picture>`;
  }

  private creditMarkup(spec: SlideSpec): string {
    return `<a class="slide__credit" href="${spec.credit.sourceUrl}" target="_blank" rel="noopener noreferrer">
      ${t(this.lang, "ui.photoCredit")} · ${spec.credit.author} · ${spec.credit.license}
    </a>`;
  }

  private slideMarkup(spec: SlideSpec, index: number): string {
    const cover = spec.kind === "cover" ? this.coverCopy() : spec.kind === "finale" ? this.finaleCopy() : this.chapterCopy(spec);
    return `<article class="slide slide--${spec.kind} slide--v-${spec.id} slide--align-${spec.align}" data-slide="${spec.id}" role="group" aria-roledescription="slide" aria-label="${t(this.lang, "ui.slideOf").replace("{current}", String(index + 1)).replace("{total}", String(SLIDES.length))}">
      ${this.mediaMarkup(spec)}
      <div class="slide__scrim" aria-hidden="true"></div>
      ${this.ghostMarkup(spec)}
      <div class="slide__copy">${cover}${this.cardTools()}</div>
      ${this.creditMarkup(spec)}
      ${this.extraMarkup(spec)}
    </article>`;
  }

  private cardTools(): string {
    const move = t(this.lang, "ui.moveCard");
    const maximize = t(this.lang, "ui.maximizeCard");
    return `<div class="card-tools">
      <button class="card-tool card-tool--move" type="button" data-card-move aria-label="${move}" title="${move}">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="9" cy="6" r="1.35" fill="currentColor"/><circle cx="15" cy="6" r="1.35" fill="currentColor"/><circle cx="9" cy="12" r="1.35" fill="currentColor"/><circle cx="15" cy="12" r="1.35" fill="currentColor"/><circle cx="9" cy="18" r="1.35" fill="currentColor"/><circle cx="15" cy="18" r="1.35" fill="currentColor"/></svg>
      </button>
      <button class="card-tool card-tool--max" type="button" data-card-max aria-label="${maximize}" title="${maximize}" aria-pressed="false">
        <svg class="card-tool__expand" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <svg class="card-tool__collapse" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>`;
  }

  private bindCards(): void {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    this.slides.forEach((slide) => {
      const card = slide.querySelector<HTMLElement>(".slide__copy");
      if (!card) return;
      const state: CardState = { maximized: false, restoreX: 0, restoreY: 0 };
      this.cardStates.set(card, state);
      const handle = card.querySelector<HTMLElement>("[data-card-move]");
      const maxButton = card.querySelector<HTMLElement>("[data-card-max]");

      if (finePointer) {
        card.addEventListener("pointerenter", () => {
          card.classList.add("is-hovered");
          if (!state.maximized) gsap.to(card, { scale: 1.02, duration: 0.18, ease: "power2.out", overwrite: "auto" });
        });
        card.addEventListener("pointerleave", () => {
          card.classList.remove("is-hovered");
          if (!state.maximized) gsap.to(card, { scale: 1, duration: 0.18, ease: "power2.out", overwrite: "auto" });
        });
      }

      if (handle) {
        let dragging = false;
        let pointerX = 0;
        let pointerY = 0;
        let originX = 0;
        let originY = 0;

        handle.addEventListener("pointerdown", (event) => {
          if (state.maximized) return;
          event.preventDefault();
          event.stopPropagation();
          dragging = true;
          pointerX = event.clientX;
          pointerY = event.clientY;
          originX = Number(gsap.getProperty(card, "x"));
          originY = Number(gsap.getProperty(card, "y"));
          card.classList.add("is-dragging");
          handle.setPointerCapture(event.pointerId);
        });
        handle.addEventListener("pointermove", (event) => {
          if (!dragging) return;
          const next = this.clampPosition(
            card,
            originX + event.clientX - pointerX,
            originY + event.clientY - pointerY
          );
          gsap.set(card, next);
        });
        const endDrag = (event: PointerEvent): void => {
          if (!dragging) return;
          dragging = false;
          card.classList.remove("is-dragging");
          if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
        };
        handle.addEventListener("pointerup", endDrag);
        handle.addEventListener("pointercancel", endDrag);
      }

      maxButton?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.toggleMaximize(card);
      });
    });
  }

  /* Direct 1:1 tracking while the grip is held; clamped to the viewport with
     a little breathing room so the card can never be lost off-screen. */
  private clampPosition(card: HTMLElement, x: number, y: number): { x: number; y: number } {
    const scale = Number(gsap.getProperty(card, "scale")) || 1;
    const width = card.offsetWidth * scale;
    const height = card.offsetHeight * scale;
    const rect = card.getBoundingClientRect();
    const currentX = Number(gsap.getProperty(card, "x"));
    const currentY = Number(gsap.getProperty(card, "y"));
    const baseLeft = rect.left - currentX - (width - card.offsetWidth) / 2;
    const baseTop = rect.top - currentY - (height - card.offsetHeight) / 2;
    const margin = 20;
    const minX = margin - baseLeft;
    const maxX = window.innerWidth - margin - baseLeft - width;
    const minY = margin - baseTop;
    const maxY = window.innerHeight - margin - baseTop - height;
    const clamp = (min: number, max: number, value: number): number =>
      min > max ? (min + max) / 2 : Math.min(max, Math.max(min, value));
    return { x: clamp(minX, maxX, x), y: clamp(minY, maxY, y) };
  }

  private toggleMaximize(card: HTMLElement): void {
    const state = this.cardStates.get(card);
    if (!state) return;
    const maxButton = card.querySelector<HTMLElement>("[data-card-max]");

    if (!state.maximized) {
      state.restoreX = Number(gsap.getProperty(card, "x"));
      state.restoreY = Number(gsap.getProperty(card, "y"));
      const rect = card.getBoundingClientRect();
      const scale = Math.min(
        (window.innerWidth - 64) / card.offsetWidth,
        (window.innerHeight - 96) / card.offsetHeight,
        1.55
      );
      const targetX = state.restoreX + window.innerWidth / 2 - (rect.left + rect.width / 2);
      const targetY = state.restoreY + window.innerHeight / 2 - (rect.top + rect.height / 2);
      state.maximized = true;
      card.classList.remove("is-hovered");
      card.classList.add("is-maximized");
      maxButton?.setAttribute("aria-pressed", "true");
      maxButton?.setAttribute("aria-label", t(this.lang, "ui.restoreCard"));
      maxButton?.setAttribute("title", t(this.lang, "ui.restoreCard"));
      gsap.to(card, { scale, x: targetX, y: targetY, duration: this.reduceMotion ? 0.001 : 0.38, ease: "power3.inOut", overwrite: "auto" });
      return;
    }

    state.maximized = false;
    card.classList.remove("is-maximized");
    maxButton?.setAttribute("aria-pressed", "false");
    maxButton?.setAttribute("aria-label", t(this.lang, "ui.maximizeCard"));
    maxButton?.setAttribute("title", t(this.lang, "ui.maximizeCard"));
    gsap.to(card, {
      scale: 1,
      x: state.restoreX,
      y: state.restoreY,
      duration: this.reduceMotion ? 0.001 : 0.34,
      ease: "power3.out",
      overwrite: "auto"
    });
  }

  private resetCard(slide: HTMLElement): void {
    const card = slide.querySelector<HTMLElement>(".slide__copy");
    if (!card) return;
    const state = this.cardStates.get(card);
    if (!state) return;
    state.maximized = false;
    card.classList.remove("is-hovered", "is-maximized", "is-dragging");
    const maxButton = card.querySelector<HTMLElement>("[data-card-max]");
    maxButton?.setAttribute("aria-pressed", "false");
    maxButton?.setAttribute("aria-label", t(this.lang, "ui.maximizeCard"));
    maxButton?.setAttribute("title", t(this.lang, "ui.maximizeCard"));
    gsap.set(card, { x: 0, y: 0, scale: 1 });
  }

  private coverCopy(): string {
    return `<p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span>${t(this.lang, "intro.eyebrow")}</p>
      <h1 class="slide__title">${t(this.lang, "intro.title")}<span class="slide__title-ne" lang="ne">${t(this.lang, "intro.titleNe")}</span></h1>
      <p class="slide__lead">${t(this.lang, "intro.subtitle")}</p>
      <p class="slide__meta"><span class="date-chip">${t(this.lang, "intro.dates")}</span></p>
      <div class="slide__actions">
        <button class="btn btn--primary" type="button" data-deck-next>${t(this.lang, "ui.begin")}<span class="btn__arrow" aria-hidden="true">→</span></button>
      </div>
      <button class="guide-teaser" type="button" data-open-guide>
        <span class="guide-teaser__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M12 6.5C10 5 7.5 4.5 4 5v13c3.5-.5 6 0 8 1.5 2-1.5 4.5-2 8-1.5V5c-3.5-.5-6 0-8 1.5Zm0 0v13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <span class="guide-teaser__copy"><strong>${t(this.lang, "guide.teaserTitle")}</strong><span>${t(this.lang, "guide.teaserBody")}</span></span>
        <span class="guide-teaser__cta">${t(this.lang, "guide.teaserCta")}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </button>
      <p class="slide__note">${t(this.lang, "intro.note")}</p>`;
  }

  private ghostMarkup(spec: SlideSpec): string {
    if (!spec.chapter) return "";
    const num = spec.chapter === "garden" ? "06" : t(this.lang, `chapters.${spec.chapter}.num`);
    return `<span class="slide__ghost slide__ghost--${spec.chapter}" aria-hidden="true">${num}</span>`;
  }

  private chapterCopy(spec: SlideSpec): string {
    const key = spec.chapter ?? "roof";
    const garden = key === "garden";
    const base = garden ? "garden" : `chapters.${key}`;
    const chips = (garden ? ["garden.chips.0", "garden.chips.1", "garden.chips.2"] : [0, 1, 2].map((i) => `${base}.chips.${i}`))
      .map((path) => t(this.lang, path)).filter(Boolean);
    const kicker = t(this.lang, garden ? "garden.kicker" : `${base}.kicker`);
    const kickerNe = garden ? "" : t(this.lang, `${base}.kickerNe`);
    const title = t(this.lang, `${base}.title`);
    const body = t(this.lang, `${base}.body`);
    const num = garden ? "06" : t(this.lang, `${base}.num`);
    const day = garden ? "" : t(this.lang, `${base}.day`);
    const note = garden ? "" : t(this.lang, `${base}.note`);
    const action = garden
      ? `<button class="btn btn--primary" type="button" data-open-guide>${t(this.lang, "garden.cta")}</button>`
      : `<button class="btn btn--ghost" type="button" data-open-day="${t(this.lang, `${base}.guideDay`)}">${t(this.lang, "ui.readDay")}</button>`;
    return `<div class="slide__chapter">
        <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span>${num}${day ? ` <span class="eyebrow__sep" aria-hidden="true"></span> ${day}` : ""}</p>
        <p class="slide__kicker">${kicker}${kickerNe ? `<span class="slide__kicker-ne" lang="ne">${kickerNe}</span>` : ""}</p>
        <h2 class="slide__title">${title}</h2>
        <p class="slide__lead">${body}</p>
        <ul class="chips">${chips.map((chip) => `<li class="chip">${chip}</li>`).join("")}</ul>
        <div class="slide__actions">${action}<button class="btn btn--primary" type="button" data-deck-next>${t(this.lang, "ui.next")}<span class="btn__arrow" aria-hidden="true">→</span></button></div>
        ${note ? `<p class="slide__meta"><span class="date-chip">${note}</span></p>` : ""}
      </div>`;
  }

  private finaleCopy(): string {
    const credits = SLIDES.map((s) => `<li><span>${s.id}</span><span><a href="${s.credit.sourceUrl}" target="_blank" rel="noopener noreferrer">${s.credit.author}</a> · <a href="${s.credit.licenseUrl}" target="_blank" rel="noopener noreferrer">${s.credit.license}</a></span></li>`).join("");
    return `<p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span>${t(this.lang, "garden.kicker")}</p>
      <h2 class="slide__title">${t(this.lang, "garden.final")}</h2>
      <p class="slide__lead">${t(this.lang, "garden.note")}</p>
      <div class="slide__actions">
        <button class="btn btn--primary" type="button" data-open-guide>${t(this.lang, "garden.cta")}</button>
        <button class="btn btn--ghost" type="button" data-deck-go="0">${t(this.lang, "ui.replay")}</button>
      </div>
      <details class="slide__credits">
        <summary>${t(this.lang, "ui.photoCredits")}</summary>
        <p>${t(this.lang, "ui.creditsNote")}</p>
        <ul>${credits}</ul>
      </details>`;
  }

  private garlandSvg(finale = false): string {
    const flowers = Array.from({ length: 24 }, (_, i) => {
      const t = i / 23;
      const x = 14 + t * 1172;
      const y = 30 + Math.sin(t * Math.PI) * (finale ? 54 : 42);
      return marigold(x, y, finale ? 9 : 8.5, i % 4 === 0 ? "#c7402c" : "#d98a2c");
    }).join("");
    return `<svg class="slide__garland${finale ? " slide__garland--finale" : ""}" viewBox="0 0 1200 130" aria-hidden="true">
      <path d="M0 30 Q600 ${finale ? 118 : 100} 1200 30" fill="none" stroke="#1a0f08" stroke-width="2" opacity="0.45"/>
      ${flowers}
    </svg>`;
  }

  private extraMarkup(spec: SlideSpec): string {
    if (spec.id === "roof") {
      return `<svg class="slide__crows" viewBox="0 0 220 120" aria-hidden="true">
          ${crowFly(38, 52, 1.15)}
          ${crowFly(124, 26, 0.82)}
          ${crowFly(178, 74, 0.6, true)}
        </svg>
        <svg class="slide__crow" viewBox="0 0 140 120" aria-hidden="true">${crowPerched(70, 70, 1.7)}</svg>
        <button class="slide__diya" type="button" data-light-diya aria-pressed="false">
        ${diyaIcon({ className: "slide__diya-icon", glow: true, animFlame: true })}
        <span data-light-diya-label>${t(this.lang, "ui.lightFirstDiya")}</span>
      </button>`;
    }
    if (spec.id === "attic") {
      return this.garlandSvg();
    }
    if (spec.id === "puja") {
      return `<div class="slide__lamps" aria-hidden="true">${[-2, -1, 0, 1, 2].map((n) => diyaIcon({ className: "slide__lamp", glow: true, animFlame: true }).replace("<svg", `<svg style="--lamp-delay:${(Math.abs(n) * 0.12).toFixed(2)}s"`)).join("")}</div>`;
    }
    if (spec.id === "kitchen") {
      return `<svg class="slide__selroti" viewBox="0 0 200 200" aria-hidden="true">
        <g fill="none" stroke="#ecb873" stroke-linecap="round">
          <circle cx="100" cy="116" r="64" stroke-width="1.8" opacity="0.6"/>
          <circle cx="100" cy="116" r="47" stroke-width="1.3" opacity="0.46"/>
          <circle cx="100" cy="116" r="29" stroke-width="1" opacity="0.34"/>
          <path d="M76 34c11-11 11-22 0-33M100 26c11-11 11-22 0-33M124 34c11-11 11-22 0-33" stroke-width="1.5" opacity="0.4"/>
        </g>
        <g fill="#d98a2c" opacity="0.7">
          <circle cx="66" cy="150" r="2.4"/><circle cx="88" cy="166" r="2"/><circle cx="118" cy="172" r="2.6"/>
          <circle cx="144" cy="156" r="2"/><circle cx="154" cy="128" r="2.2"/>
        </g>
      </svg>`;
    }
    if (spec.id === "doorway") {
      return this.garlandSvg().replace('class="slide__garland"', 'class="slide__garland slide__garland--door"');
    }
    if (spec.id === "garden") return `<div class="slide__rangoli" aria-hidden="true">${this.rangoliSvg()}</div>`;
    if (spec.id === "finale") return this.garlandSvg(true);
    return "";
  }

  next(): void { this.goTo(this.active + 1); }
  prev(): void { this.goTo(this.active - 1); }

  private goTo(index: number, immediate = false): void {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, index));
    if (clamped === this.active && !immediate) return;
    const previous = this.active;
    this.active = clamped;
    this.slides.forEach((slide) => this.resetCard(slide));
    this.slides.forEach((slide, i) => {
      const active = i === clamped;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      if (active) slide.removeAttribute("inert"); else slide.setAttribute("inert", "");
    });
    this.updateChrome();
    if (immediate || this.reduceMotion) {
      this.slides.forEach((slide, i) => gsap.set(slide, { autoAlpha: i === clamped ? 1 : 0, scale: 1, x: 0, y: 0, zIndex: i === clamped ? 2 : 1 }));
      const panel = this.slides[clamped]?.querySelector<HTMLElement>(".slide__copy");
      if (panel) gsap.set(panel, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
      return;
    }
    this.transition(previous, clamped);
  }

  /* A short bottom-to-top pull: the incoming scene rises into place as the
     outgoing one lifts away. Keeping both on the same axis makes the swoosh
     read as one movement instead of a directional slide. */
  private transition(previous: number, next: number): void {
    const out = this.slides[previous];
    const incoming = this.slides[next];
    const panel = incoming.querySelector<HTMLElement>(".slide__copy");
    gsap.killTweensOf(this.slides);
    if (panel) gsap.killTweensOf(panel);
    this.slides.forEach((slide, index) => {
      if (index !== previous && index !== next) gsap.set(slide, { autoAlpha: 0, x: 0, y: 0, scale: 1, zIndex: 1 });
    });
    gsap.set(out, { autoAlpha: 1, scale: 1, x: 0, y: 0, zIndex: 1 });
    gsap.set(incoming, { autoAlpha: 0, scale: 1, x: 0, y: 28, zIndex: 2 });
    if (panel) gsap.set(panel, { autoAlpha: 0, y: 12 });
    gsap.to(out, { autoAlpha: 0, y: -18, duration: 0.28, ease: "power2.inOut", overwrite: true });
    gsap.to(incoming, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", overwrite: true });
    if (panel) gsap.to(panel, { autoAlpha: 1, y: 0, duration: 0.28, delay: 0.04, ease: "power2.out", overwrite: true });
  }

  private updateChrome(): void {
    const spec = SLIDES[this.active];
    this.counter.textContent = t(this.lang, "ui.slideOf").replace("{current}", String(this.active + 1)).replace("{total}", String(SLIDES.length));
    this.progress.style.transform = `scaleX(${this.active / Math.max(1, SLIDES.length - 1)})`;
    const nextTitle = this.root.querySelector<HTMLElement>("[data-deck-next-title]");
    const nextSlide = SLIDES[this.active + 1];
    const nextButton = this.root.querySelector<HTMLElement>(".deck__next");
    if (nextTitle && nextSlide) {
      nextTitle.textContent = nextSlide.chapter === "garden"
        ? t(this.lang, "garden.kicker")
        : nextSlide.chapter
          ? t(this.lang, `chapters.${nextSlide.chapter}.kicker`)
          : t(this.lang, "garden.final");
    }
    if (nextButton) nextButton.hidden = !nextSlide;
    this.prevButton.disabled = this.active === 0;
    this.nextButton.disabled = this.active === SLIDES.length - 1;
    this.navItems.forEach((button) => {
      const active = button.dataset.target === spec.chapter;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    document.body.dataset.scene = spec.chapter ?? spec.id;
    const activeSlide = this.slides[this.active];
    if (activeSlide) this.lightExtras(activeSlide);
    this.onSlideChange?.(spec.id);
    if (location.hash !== `#${spec.id}` && location.hash !== "#guide") history.replaceState(null, "", `#${spec.id}`);
  }

  private indexFromHash(): number {
    const id = location.hash.replace("#", "");
    const index = SLIDES.findIndex((slide) => slide.id === id);
    return index >= 0 ? index : 0;
  }

  private bind(): void {
    this.root.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest("[data-deck-next]")) { event.preventDefault(); this.next(); return; }
      if (target.closest("[data-deck-prev]")) { event.preventDefault(); this.prev(); return; }
      const jump = target.closest<HTMLElement>("[data-deck-go]");
      if (jump) { event.preventDefault(); this.goTo(Number(jump.dataset.deckGo ?? 0)); return; }
      if (target.closest("[data-light-diya]")) { event.preventDefault(); this.lightDiya(); return; }
      if (target.closest(".slide__media") && !target.closest("a, button, summary")) this.next();
    });

    this.navItems.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const index = SLIDES.findIndex((slide) => slide.chapter === button.dataset.target);
        if (index >= 0) this.goTo(index);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (document.documentElement.classList.contains("guide-open")) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.closest("input, textarea, select, [contenteditable='true']"))) return;
      if (event.key === "Escape") {
        const maximized = this.slides[this.active]?.querySelector<HTMLElement>(".slide__copy.is-maximized");
        if (maximized) { event.preventDefault(); this.toggleMaximize(maximized); return; }
      }
      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") { event.preventDefault(); this.next(); }
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") { event.preventDefault(); this.prev(); }
      else if (event.key === "Home") { event.preventDefault(); this.goTo(0); }
      else if (event.key === "End") { event.preventDefault(); this.goTo(SLIDES.length - 1); }
      else if (event.key === " " && !target?.closest("button, a, summary")) { event.preventDefault(); this.next(); }
    });

    this.root.addEventListener("wheel", (event) => {
      if (document.documentElement.classList.contains("guide-open")) return;
      if (Math.abs(event.deltaY) < 30) return;
      const now = performance.now();
      if (now < this.wheelLock) return;
      this.wheelLock = now + 520;
      if (event.deltaY > 0) this.next(); else this.prev();
    }, { passive: true });

    let startX = 0, startY = 0, tracking = false;
    this.root.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse") return;
      if ((event.target as Element).closest("button, a, summary")) return;
      tracking = true; startX = event.clientX; startY = event.clientY;
    });
    this.root.addEventListener("pointercancel", () => { tracking = false; });
    this.root.addEventListener("pointerup", (event) => {
      if (!tracking) return; tracking = false;
      const dx = event.clientX - startX, dy = event.clientY - startY;
      if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) this.next(); else this.prev();
    });

    window.addEventListener("hashchange", () => {
      if (location.hash === "#guide") return;
      this.goTo(this.indexFromHash());
    });
  }

  private rangoliSvg(): string {
    const petals = Array.from({ length: 12 }, (_, i) => {
      const a = i * 30;
      return `<path data-rangoli-draw pathLength="1" transform="rotate(${a})" d="M0 -70 C34 -104 30 -156 0 -178 C-30 -156 -34 -104 0 -70Z" fill="none" stroke="#f1e4c8" stroke-width="2.2"/>`;
    }).join("");
    return `<svg viewBox="0 0 600 600" aria-hidden="true">
      <g transform="translate(300 300)">
        <circle data-rangoli-draw pathLength="1" r="220" fill="none" stroke="#e8b16a" stroke-width="2.4"/>
        <circle data-rangoli-draw pathLength="1" r="196" fill="none" stroke="#f1e4c8" stroke-width="1.6"/>
        ${petals}
        <circle data-rangoli-draw pathLength="1" r="68" fill="none" stroke="#b8442c" stroke-width="2.6"/>
        <circle data-rangoli-draw pathLength="1" r="38" fill="none" stroke="#d98a2c" stroke-width="2"/>
        <circle cx="0" cy="0" r="8" fill="#f0c25a"/>
      </g>
    </svg>`;
  }

  private lightDiya(): void {
    const button = this.slides[this.active]?.querySelector<HTMLElement>("[data-light-diya]");
    if (!button || button.classList.contains("is-lit")) return;
    button.classList.add("is-lit");
    button.setAttribute("aria-pressed", "true");
    this.diyaLit = true;
    const label = button.querySelector<HTMLElement>("[data-light-diya-label]");
    if (label) label.textContent = t(this.lang, "ui.diyaLit");
    this.onFirstLight?.();
  }

  private lightExtras(slide: HTMLElement): void {
    if (slide.dataset.slide === "roof" && this.diyaLit) {
      const diyaButton = slide.querySelector<HTMLElement>("[data-light-diya]");
      diyaButton?.classList.add("is-lit");
      diyaButton?.setAttribute("aria-pressed", "true");
      const label = diyaButton?.querySelector<HTMLElement>("[data-light-diya-label]");
      if (label) label.textContent = t(this.lang, "ui.diyaLit");
    }
    const lamps = slide.querySelectorAll<HTMLElement>(".slide__lamps svg");
    lamps.forEach((lamp, i) => window.setTimeout(() => lamp.classList.add("is-lit"), 240 + i * 130));
    const rangoli = slide.querySelector<SVGElement>(".slide__rangoli svg");
    if (!rangoli) return;
    const paths = Array.from(rangoli.querySelectorAll<SVGGeometryElement>("[data-rangoli-draw]"));
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
    gsap.to(paths, { strokeDashoffset: 0, duration: 1.2, stagger: 0.05, ease: "power2.inOut" });
  }

}
