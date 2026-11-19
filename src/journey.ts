import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import { SVG_DEFS } from "./art/defs";
import { gardenScene } from "./art/garden";
import { sceneMarkup } from "./art/scenes";
import { t, type Lang } from "./i18n";
import { PowderField } from "./particles";

gsap.registerPlugin(ScrollTrigger);

const SCENE_IDS = ["roof", "attic", "puja", "kitchen", "doorway", "garden"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

const WARMTH: Record<SceneId, number> = {
  roof: 0.16,
  attic: 0.26,
  puja: 0.56,
  kitchen: 0.68,
  doorway: 0.78,
  garden: 1
};

function isScene(value: string | undefined): value is SceneId {
  return !!value && (SCENE_IDS as readonly string[]).includes(value);
}

function q<T extends Element>(root: ParentNode, selector: string): T | null {
  return root.querySelector<T>(selector);
}

function qa<T extends Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

function primeStroke(element: SVGGeometryElement): void {
  const length = element.getTotalLength();
  gsap.set(element, { strokeDasharray: length, strokeDashoffset: length });
}

export class Journey {
  private readonly lenis: Lenis | null;
  private readonly reduceMotion: boolean;
  private lang: Lang;

  private readonly layers = new Map<SceneId, HTMLElement>();
  private readonly navItems: HTMLButtonElement[];
  private readonly sectionById = new Map<SceneId, HTMLElement>();
  private readonly cameraProxies = new Map<HTMLElement, { drift: number; zoom: number }>();

  private sceneBounds: Array<{ id: SceneId; top: number }> = [];
  private lastScrollY = 0;

  private active: SceneId = "roof";
  private particle: PowderField | null = null;
  private firstDiyaLit = false;
  private pujaDiyasOn = false;
  private borderDiyasOn = false;
  private burstIndex = 0;

  onFirstLight: (() => void) | null = null;

  constructor(lang: Lang, lenis: Lenis | null, reduceMotion: boolean) {
    this.lang = lang;
    this.lenis = lenis;
    this.reduceMotion = reduceMotion;
    this.navItems = Array.from(document.querySelectorAll<HTMLButtonElement>(".chapter-nav__item"));

    document.querySelectorAll<HTMLElement>(".stage__layer").forEach((layer) => {
      const id = layer.dataset.scene;
      if (isScene(id)) this.layers.set(id, layer);
    });

    document.querySelectorAll<HTMLElement>("[data-chapter]").forEach((section) => {
      const id = section.dataset.chapter;
      if (isScene(id)) this.sectionById.set(id, section);
    });
  }

  init(): void {
    this.mountScenes();
    document.documentElement.style.setProperty("--warmth", String(WARMTH.roof));
    document.body.dataset.scene = "roof";
    this.setActiveNav("roof");

    this.setupIntro();
    this.setupSceneActivation();
    this.setupRoof();
    this.setupAttic();
    this.setupPuja();
    this.setupKitchen();
    this.setupDoorway();
    this.setupGarden();
    this.setupLinks();
    this.setupProgress();

    window.addEventListener("resize", () => {
      this.measureSceneBounds();
      this.updateActiveScene();
      this.particle?.resize();
    });
    requestAnimationFrame(() => {
      this.measureSceneBounds();
      ScrollTrigger.refresh();
      this.measureSceneBounds();
      this.updateActiveScene();
    });
  }

  setLang(lang: Lang): void {
    this.lang = lang;
    if (this.firstDiyaLit) {
      const label = document.querySelector<HTMLElement>("[data-light-diya-label]");
      if (label) label.textContent = t(lang, "ui.diyaLit");
      const button = document.querySelector<HTMLButtonElement>("[data-light-diya]");
      if (button) button.classList.add("is-lit");
    }
  }

  refresh(): void {
    this.measureSceneBounds();
    ScrollTrigger.refresh();
    this.measureSceneBounds();
    this.updateActiveScene();
    this.particle?.resize();
  }

  private mountScenes(): void {
    const defsHost = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    defsHost.setAttribute("aria-hidden", "true");
    defsHost.setAttribute("focusable", "false");
    defsHost.classList.add("svg-defs");
    defsHost.innerHTML = SVG_DEFS;
    document.body.prepend(defsHost);

    const [roof, attic, puja, kitchen, doorway] = sceneMarkup();
    const scenes: Record<SceneId, string> = {
      roof,
      attic,
      puja,
      kitchen,
      doorway,
      garden: gardenScene()
    };

    this.layers.forEach((layer, id) => {
      const frame = document.createElement("div");
      frame.className = "scene-frame";
      frame.innerHTML = scenes[id];
      layer.append(frame);
    });

    const garden = this.layers.get("garden");
    if (!garden) return;

    const canvas = document.createElement("canvas");
    canvas.className = "garden-particles";
    canvas.setAttribute("aria-hidden", "true");
    garden.append(canvas);

    if (!this.reduceMotion) this.particle = new PowderField(canvas);
  }

  private setupIntro(): void {
    if (this.reduceMotion) return;

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline
      .from(".header", { opacity: 0, y: -14, duration: 0.7 }, 0)
      .from(".intro__title > span", { opacity: 0, y: 34, stagger: 0.08, duration: 1 }, 0.12)
      .from(".intro__subtitle", { opacity: 0, y: 16, duration: 0.7 }, 0.48)
      .from(".intro__meta", { opacity: 0, y: 14, duration: 0.6 }, 0.58)
      .from(".intro__foot", { opacity: 0, y: 14, duration: 0.6 }, 0.68);
  }

  /**
   * Scene changes are decided from measured document offsets, not from
   * ScrollTrigger callbacks. ScrollTrigger still drives the in-room animation,
   * but layer activation is a single deterministic lookup on every scroll
   * tick: no callback ordering, no refresh recursion, no crossed transitions.
   */
  private setupSceneActivation(): void {
    this.measureSceneBounds();
    this.lastScrollY = window.scrollY;
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.updateActiveScene();
  }

  private readonly handleScroll = (): void => {
    this.updateActiveScene();
  };

  private measureSceneBounds(): void {
    const bounds: Array<{ id: SceneId; top: number }> = [];
    this.sectionById.forEach((section, id) => {
      const rect = section.getBoundingClientRect();
      bounds.push({ id, top: rect.top + window.scrollY });
    });
    bounds.sort((a, b) => a.top - b.top);
    this.sceneBounds = bounds;
  }

  private updateActiveScene(): void {
    const next = this.pickScene();
    const scrollY = window.scrollY;
    if (next === this.active) {
      this.lastScrollY = scrollY;
      return;
    }

    const direction = scrollY >= this.lastScrollY ? 1 : -1;
    this.lastScrollY = scrollY;
    this.setScene(next, direction);
  }

  private pickScene(): SceneId {
    if (!this.sceneBounds.length) return this.active;

    // Probe a little above the middle of the viewport so a chapter takes over
    // as its card settles in, matching the old "top 60%" handover.
    const probe = window.scrollY + window.innerHeight * 0.58;
    let id: SceneId = "roof";
    for (const entry of this.sceneBounds) {
      if (probe < entry.top) break;
      id = entry.id;
    }
    return id;
  }

  private setScene(id: SceneId, direction = 1): void {
    if (id === this.active) return;

    const previous = this.layers.get(this.active);
    const next = this.layers.get(id);
    if (!previous || !next) return;

    previous.classList.remove("is-active");
    next.classList.add("is-active");
    this.active = id;
    document.body.dataset.scene = id;
    this.setActiveNav(id);
    this.settleCamera(next, direction);
    this.setWarmth(WARMTH[id]);

    if (id === "garden") {
      this.particle?.start();
    } else {
      this.particle?.stop();
    }
  }

  /** A short dolly/settle on the incoming room: the frame drifts and zooms a
   *  few pixels into place while the layers cross-fade. */
  private settleCamera(layer: HTMLElement, direction: number): void {
    if (this.reduceMotion) return;
    const frame = q<HTMLElement>(layer, ".scene-frame");
    if (!frame) return;

    let existing = this.cameraProxies.get(frame);
    if (!existing) {
      existing = { drift: 0, zoom: 1 };
      this.cameraProxies.set(frame, existing);
    }
    const proxy = existing;

    gsap.killTweensOf(proxy);
    proxy.drift = direction >= 0 ? 16 : -16;
    proxy.zoom = 1.028;
    frame.style.setProperty("--drift", `${proxy.drift}px`);
    frame.style.setProperty("--zoom", proxy.zoom.toFixed(4));

    gsap.to(proxy, {
      drift: 0,
      zoom: 1,
      duration: 1.45,
      ease: "power3.out",
      onUpdate: () => {
        frame.style.setProperty("--drift", `${proxy.drift.toFixed(2)}px`);
        frame.style.setProperty("--zoom", proxy.zoom.toFixed(4));
      }
    });
  }

  private setWarmth(value: number): void {
    if (this.reduceMotion) {
      document.documentElement.style.setProperty("--warmth", String(value));
      return;
    }

    gsap.to(document.documentElement, {
      "--warmth": value,
      duration: 1.25,
      ease: "power2.out",
      overwrite: true
    });
  }

  private setActiveNav(id: SceneId): void {
    this.navItems.forEach((button) => {
      const active = button.dataset.target === id;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  }

  private setupRoof(): void {
    const layer = this.layers.get("roof");
    const section = this.sectionById.get("roof");
    if (!layer || !section) return;

    const svg = q<SVGSVGElement>(layer, ".scene-svg--roof");
    const firstLight = q<SVGCircleElement>(layer, ".first-light");
    const firstDiya = q<SVGGElement>(layer, '[data-diya="first"]');
    const button = document.querySelector<HTMLButtonElement>("[data-light-diya]");

    firstDiya?.addEventListener("click", () => this.lightFirstDiya(true));
    button?.addEventListener("click", () => this.lightFirstDiya(true));

    if (this.reduceMotion) {
      this.lightFirstDiya(false);
      return;
    }

    const crow = qa<SVGGElement>(layer, ".crow--fly");
    const roof = q<SVGGElement>(layer, ".roof");

    if (svg && firstLight) {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 85%", end: "bottom 35%", scrub: 0.7 }
      });
      timeline.fromTo(svg, { scale: 1.035 }, { scale: 1, ease: "none" }, 0);
      timeline.to(firstLight, { opacity: 0.95, ease: "none" }, 0.12);
      if (roof) timeline.to(roof, { y: -6, ease: "none" }, 0);
      if (crow.length) timeline.to(crow, { y: -14, x: 12, stagger: 0.2, ease: "none" }, 0);
    }

    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "bottom 40%",
      onUpdate: (self) => {
        if (self.progress > 0.24) this.lightFirstDiya(false);
      }
    });
  }

  private lightFirstDiya(playSound: boolean): void {
    const layer = this.layers.get("roof");
    if (!layer) return;

    const diya = q<SVGGElement>(layer, '[data-diya="first"]');
    if (!diya) return;

    const wasLit = diya.classList.contains("is-lit");
    diya.classList.add("is-lit");
    this.firstDiyaLit = true;

    const button = document.querySelector<HTMLButtonElement>("[data-light-diya]");
    const label = document.querySelector<HTMLElement>("[data-light-diya-label]");
    if (button) {
      button.classList.add("is-lit");
      button.setAttribute("aria-pressed", "true");
    }
    if (label) label.textContent = t(this.lang, "ui.diyaLit");

    if (!wasLit) {
      gsap.fromTo(diya, { scale: 0.92 }, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" });
      const firstLight = q<SVGCircleElement>(layer, ".first-light");
      if (firstLight) gsap.to(firstLight, { opacity: 0.95, duration: 1.2, ease: "power2.out" });
      if (playSound) this.onFirstLight?.();
    } else if (playSound) {
      this.onFirstLight?.();
    }
  }

  private setupAttic(): void {
    const layer = this.layers.get("attic");
    const section = this.sectionById.get("attic");
    if (!layer || !section) return;

    const left = q<SVGGElement>(layer, ".roof-half--left");
    const right = q<SVGGElement>(layer, ".roof-half--right");
    const dog = q<SVGGElement>(layer, ".dog");
    const windowGroup = q<SVGGElement>(layer, ".attic-window");
    const garlands = [...qa<SVGGeometryElement>(layer, "[data-garland]"), ...qa<SVGGeometryElement>(layer, ".garland > path:first-child")];

    garlands.forEach(primeStroke);

    if (this.reduceMotion) {
      if (left) gsap.set(left, { x: -150, rotation: -3.5, transformOrigin: "50% 100%" });
      if (right) gsap.set(right, { x: 150, rotation: 3.5, transformOrigin: "50% 100%" });
      if (dog) gsap.set(dog, { opacity: 1, y: 0 });
      if (windowGroup) gsap.set(windowGroup, { opacity: 1 });
      gsap.set(garlands, { strokeDashoffset: 0 });
      return;
    }

    if (left) gsap.set(left, { transformOrigin: "50% 100%" });
    if (right) gsap.set(right, { transformOrigin: "50% 100%" });
    if (dog) gsap.set(dog, { opacity: 0, y: 18 });
    if (windowGroup) gsap.set(windowGroup, { opacity: 0.35 });

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 78%", end: "bottom 30%", scrub: 0.8 }
    });

    if (left) timeline.to(left, { x: -150, rotation: -3.5, ease: "power2.inOut" }, 0);
    if (right) timeline.to(right, { x: 150, rotation: 3.5, ease: "power2.inOut" }, 0);
    if (windowGroup) timeline.to(windowGroup, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.2);
    if (dog) timeline.to(dog, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.38);
    if (garlands.length) timeline.to(garlands, { strokeDashoffset: 0, stagger: 0.04, duration: 0.5, ease: "none" }, 0.3);
  }

  private setupPuja(): void {
    const layer = this.layers.get("puja");
    const section = this.sectionById.get("puja");
    if (!layer || !section) return;

    const warmBloom = q<SVGCircleElement>(layer, ".warm-bloom");
    const footprints = qa<SVGGElement>(layer, ".footprint");
    const diyas = [
      ...qa<SVGGElement>(layer, ".floor-diyas .diya"),
      ...qa<SVGGElement>(layer, ".shelf-diyas .diya"),
      ...qa<SVGGElement>(layer, '[data-diya="shrine"]')
    ];
    const garlands = [...qa<SVGGeometryElement>(layer, "[data-garland]"), ...qa<SVGGeometryElement>(layer, ".garland > path:first-child")];
    const hanging = qa<SVGGElement>(layer, ".hanging-diya");

    diyas.forEach((diya, index) => {
      const flame = q<SVGGElement>(diya, ".diya__flame-wrap");
      if (flame) flame.style.transitionDelay = `${index * 55}ms`;
    });
    garlands.forEach(primeStroke);

    if (this.reduceMotion) {
      if (warmBloom) gsap.set(warmBloom, { opacity: 0.95 });
      gsap.set(footprints, { opacity: 1, y: 0 });
      gsap.set(garlands, { strokeDashoffset: 0 });
      this.setPujaDiyas(true);
      return;
    }

    gsap.set(footprints, { opacity: 0, y: 8 });

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 80%", end: "bottom 35%", scrub: 0.8 }
    });

    if (warmBloom) timeline.to(warmBloom, { opacity: 0.95, ease: "none" }, 0);
    timeline.to(footprints, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power2.out" }, 0.12);
    if (garlands.length) timeline.to(garlands, { strokeDashoffset: 0, stagger: 0.03, duration: 0.5, ease: "none" }, 0.18);
    if (hanging.length) timeline.to(hanging, { y: 7, stagger: 0.08, ease: "none" }, 0);

    ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      end: "bottom 35%",
      onUpdate: (self) => {
        const on = self.progress > 0.26;
        if (on !== this.pujaDiyasOn) {
          this.pujaDiyasOn = on;
          this.setPujaDiyas(on);
        }
      }
    });
  }

  private setPujaDiyas(on: boolean): void {
    const layer = this.layers.get("puja");
    if (!layer) return;

    const diyas = [
      ...qa<SVGGElement>(layer, ".floor-diyas .diya"),
      ...qa<SVGGElement>(layer, ".shelf-diyas .diya"),
      ...qa<SVGGElement>(layer, '[data-diya="shrine"]')
    ];

    diyas.forEach((diya, index) => {
      diya.classList.toggle("is-lit", on);
      const flame = q<SVGGElement>(diya, ".diya__flame-wrap");
      if (flame) flame.style.transitionDelay = on ? `${index * 55}ms` : "0ms";
    });
  }

  private setupKitchen(): void {
    const layer = this.layers.get("kitchen");
    const section = this.sectionById.get("kitchen");
    if (!layer || !section) return;

    const fireGlow = q<SVGCircleElement>(layer, ".fire-glow");
    const steam = qa<SVGPathElement>(layer, ".steam__line");
    const hearth = q<SVGGElement>(layer, ".hearth");
    const svg = q<SVGSVGElement>(layer, ".scene-svg--kitchen");

    if (this.reduceMotion) {
      if (fireGlow) gsap.set(fireGlow, { opacity: 0.85 });
      if (steam.length) gsap.set(steam, { opacity: 0.24 });
      return;
    }

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 82%", end: "bottom 35%", scrub: 0.8 }
    });

    if (fireGlow) timeline.to(fireGlow, { opacity: 0.9, ease: "none" }, 0);
    if (steam.length) timeline.fromTo(steam, { opacity: 0 }, { opacity: 0.24, stagger: 0.1, ease: "none" }, 0.1);
    if (hearth) timeline.to(hearth, { scale: 1.015, transformOrigin: "50% 100%", ease: "none" }, 0);
    if (svg) timeline.to(svg, { y: -8, ease: "none" }, 0);
  }

  private setupDoorway(): void {
    const layer = this.layers.get("doorway");
    const section = this.sectionById.get("doorway");
    if (!layer || !section) return;

    const left = q<SVGGElement>(layer, ".door--left");
    const right = q<SVGGElement>(layer, ".door--right");
    const spill = q<SVGPathElement>(layer, ".door-spill");
    const glow = q<SVGCircleElement>(layer, ".door-glow");
    const camera = q<SVGGElement>(layer, ".door-camera");
    const diyas = qa<SVGGElement>(layer, ".door-camera > .diya");

    if (this.reduceMotion) {
      if (left) gsap.set(left, { scaleX: 0.07, svgOrigin: "548 484" });
      if (right) gsap.set(right, { scaleX: 0.07, svgOrigin: "1052 484" });
      if (spill) gsap.set(spill, { opacity: 0.85 });
      if (glow) gsap.set(glow, { opacity: 0.8 });
      diyas.forEach((diya) => diya.classList.add("is-lit"));
      return;
    }

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 80%", end: "bottom 30%", scrub: 0.8 }
    });

    if (left) timeline.to(left, { scaleX: 0.07, svgOrigin: "548 484", ease: "power2.inOut" }, 0);
    if (right) timeline.to(right, { scaleX: 0.07, svgOrigin: "1052 484", ease: "power2.inOut" }, 0);
    if (spill) timeline.to(spill, { opacity: 0.85, ease: "none" }, 0.2);
    if (glow) timeline.to(glow, { opacity: 0.8, ease: "none" }, 0.1);
    if (camera) timeline.to(camera, { scale: 1.06, transformOrigin: "50% 50%", ease: "none" }, 0);

    ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      end: "bottom 35%",
      onUpdate: (self) => {
        if (self.progress > 0.42) diyas.forEach((diya) => diya.classList.add("is-lit"));
      }
    });
  }

  private setupGarden(): void {
    const layer = this.layers.get("garden");
    const intro = document.querySelector<HTMLElement>("[data-garden-intro]");
    if (!layer || !intro) return;

    const svg = q<SVGSVGElement>(layer, ".garden-svg");
    const drawPaths = qa<SVGGeometryElement>(layer, ".rangoli [data-draw]");
    const fills = qa<SVGElement>(layer, ".rangoli__fill");
    const dots = qa<SVGElement>(layer, ".rangoli__dot");
    const marigolds = qa<SVGElement>(layer, ".rangoli .marigold");
    const tikaBands = qa<SVGElement>(layer, ".tika__band");
    const houseGlow = q<SVGCircleElement>(layer, ".garden-house-glow");
    const houseLamp = q<SVGCircleElement>(layer, ".garden-house-lamp");
    const card = q<HTMLElement>(intro, ".garden__card");
    const finalInner = document.querySelector<HTMLElement>(".garden__final-inner");

    if (this.reduceMotion) {
      if (svg) gsap.set(svg, { scale: 1 });
      gsap.set(drawPaths, { strokeDasharray: 1, strokeDashoffset: 0 });
      gsap.set(fills, { opacity: 1 });
      gsap.set(dots, { opacity: 1 });
      gsap.set(marigolds, { opacity: 1 });
      gsap.set(tikaBands, { opacity: 1 });
      if (houseGlow) gsap.set(houseGlow, { opacity: 1 });
      if (houseLamp) gsap.set(houseLamp, { opacity: 1 });
      if (card) gsap.set(card, { opacity: 1 });
      if (finalInner) gsap.set(finalInner, { opacity: 1 });
      this.setBorderDiyas(true);
      return;
    }

    if (svg) gsap.set(svg, { scale: 1.28, transformOrigin: "50% 62%" });
    gsap.set(drawPaths, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(fills, { opacity: 0 });
    gsap.set(dots, { opacity: 0 });
    gsap.set(marigolds, { opacity: 0 });
    gsap.set(tikaBands, { opacity: 0 });
    if (houseGlow) gsap.set(houseGlow, { opacity: 0 });

    const rings = qa<SVGGeometryElement>(layer, ".rangoli__ring");
    const petals = qa<SVGGeometryElement>(layer, ".rangoli__petal");
    const inner = qa<SVGGeometryElement>(layer, ".rangoli__inner");

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: intro,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.9,
        onUpdate: (self) => this.gardenProgress(self.progress)
      }
    });

    if (svg) timeline.to(svg, { scale: 1, ease: "none", duration: 1.2 }, 0);
    if (rings.length) timeline.to(rings, { strokeDashoffset: 0, stagger: 0.06, duration: 0.5, ease: "none" }, 0.04);
    if (petals.length) timeline.to(petals, { strokeDashoffset: 0, stagger: 0.02, duration: 0.5, ease: "none" }, 0.16);
    if (inner.length) timeline.to(inner, { strokeDashoffset: 0, stagger: 0.03, duration: 0.4, ease: "none" }, 0.32);
    if (fills.length) timeline.to(fills, { opacity: 1, stagger: 0.006, duration: 0.3, ease: "none" }, 0.44);
    if (dots.length) timeline.to(dots, { opacity: 1, stagger: 0.004, duration: 0.25, ease: "none" }, 0.5);
    if (marigolds.length) timeline.to(marigolds, { opacity: 1, stagger: 0.02, duration: 0.35, ease: "none" }, 0.54);
    if (tikaBands.length) timeline.to(tikaBands, { opacity: 1, stagger: 0.07, duration: 0.2, ease: "none" }, 0.64);
    if (houseGlow) timeline.to(houseGlow, { opacity: 1, duration: 0.5, ease: "none" }, 0.78);
    if (houseLamp) timeline.to(houseLamp, { opacity: 1, duration: 0.4, ease: "none" }, 0.78);

    if (card) {
      gsap.to(card, {
        opacity: 0,
        y: -22,
        ease: "none",
        scrollTrigger: { trigger: intro, start: "top top", end: "+=34%", scrub: true }
      });
    }

    if (finalInner) {
      gsap.from(finalInner, {
        opacity: 0,
        y: 34,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".garden__final", start: "top 78%", toggleActions: "play none none reverse" }
      });
    }
  }

  private gardenProgress(progress: number): void {
    const borderOn = progress > 0.72;
    if (borderOn !== this.borderDiyasOn) {
      this.borderDiyasOn = borderOn;
      this.setBorderDiyas(borderOn);
    }

    if (!this.particle) return;

    const thresholds = [0.16, 0.34, 0.52, 0.7, 0.86];
    while (this.burstIndex < thresholds.length && progress >= thresholds[this.burstIndex]) {
      this.particle.burst(0.5, 0.71, this.burstIndex === 0 ? 18 : 28);
      this.burstIndex += 1;
    }
    if (progress < 0.08) this.burstIndex = 0;
  }

  private setBorderDiyas(on: boolean): void {
    const layer = this.layers.get("garden");
    if (!layer) return;

    qa<SVGGElement>(layer, ".border-diya .diya").forEach((diya, index) => {
      diya.classList.toggle("is-lit", on);
      const flame = q<SVGGElement>(diya, ".diya__flame-wrap");
      if (flame) flame.style.transitionDelay = on ? `${index * 45}ms` : "0ms";
    });
  }

  private setupLinks(): void {
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const scrollLink = target.closest<HTMLElement>("[data-scroll-to]");
      if (scrollLink) {
        event.preventDefault();
        this.scrollToId(scrollLink.dataset.scrollTo ?? "top");
        return;
      }

      const navItem = target.closest<HTMLElement>(".chapter-nav__item");
      if (navItem) {
        event.preventDefault();
        this.scrollToId(navItem.dataset.target ?? "top");
        return;
      }

      const replay = target.closest<HTMLElement>("[data-replay]");
      if (replay) {
        event.preventDefault();
        this.scrollToId("top");
      }
    });
  }

  private scrollToId(id: string): void {
    if (id === "top") {
      if (this.lenis) {
        this.lenis.scrollTo(0, { duration: 1.4, easing: (time) => 1 - Math.pow(1 - time, 3) });
      } else {
        window.scrollTo({ top: 0, behavior: this.reduceMotion ? "auto" : "smooth" });
      }
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    if (this.lenis) {
      this.lenis.scrollTo(element, { duration: 1.4, easing: (time) => 1 - Math.pow(1 - time, 3) });
    } else {
      element.scrollIntoView({ behavior: this.reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }

  private setupProgress(): void {
    const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
    if (bar) {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          bar.style.transform = `scaleX(${self.progress})`;
        }
      });
    }

    const header = document.querySelector<HTMLElement>("[data-header]");
    if (header) {
      ScrollTrigger.create({
        start: 24,
        end: "max",
        onToggle: (self) => header.classList.toggle("is-scrolled", self.isActive)
      });
    }
  }
}
