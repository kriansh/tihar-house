type Powder = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  phase: number;
  alpha: number;
  color: string;
};

const COLORS = ["#e79a35", "#c34a30", "#f1e4c8", "#cf6f72", "#3f7a70", "#f0b04a", "#e8b16a"];

const pick = (): string => COLORS[Math.floor(Math.random() * COLORS.length)];
const between = (min: number, max: number): number => min + Math.random() * (max - min);

/**
 * A small Canvas 2D powder field for the rangoli. It is intentionally cheap:
 * no textures, no glow filters, just drifting coloured motes that fade out.
 */
export class PowderField {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private particles: Powder[] = [];
  private frame = 0;
  private running = false;
  private last = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private ambientTimer = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D is unavailable");
    this.ctx = context;
  }

  start(): void {
    if (this.running) return;
    this.resize();
    this.running = true;
    this.last = performance.now();
    this.frame = requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /** Origin and spread are normalised to the canvas (0–1). */
  burst(originX = 0.5, originY = 0.52, count = 34): void {
    const cx = originX * this.width;
    const cy = originY * this.height;
    const ring = Math.min(this.width, this.height) * 0.27;

    for (let i = 0; i < count; i += 1) {
      const angle = between(0, Math.PI * 2);
      const radius = ring * between(0.86, 1.08);
      const speed = between(10, 54);
      this.particles.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - between(2, 18),
        radius: between(0.8, 2.4),
        life: 0,
        maxLife: between(1.1, 2.6),
        phase: between(0, Math.PI * 2),
        alpha: between(0.45, 0.9),
        color: pick()
      });
    }

    if (this.particles.length > 260) this.particles.splice(0, this.particles.length - 260);
  }

  private emitAmbient(): void {
    const cx = this.width * 0.5;
    const cy = this.height * 0.52;
    const ring = Math.min(this.width, this.height) * between(0.24, 0.34);
    const angle = between(0, Math.PI * 2);

    this.particles.push({
      x: cx + Math.cos(angle) * ring,
      y: cy + Math.sin(angle) * ring,
      vx: between(-7, 7),
      vy: between(-18, -5),
      radius: between(0.6, 1.6),
      life: 0,
      maxLife: between(3.2, 6.5),
      phase: between(0, Math.PI * 2),
      alpha: between(0.18, 0.5),
      color: pick()
    });
  }

  private readonly loop = (time: number): void => {
    if (!this.running) return;

    const dt = Math.min(0.05, (time - this.last) / 1000);
    this.last = time;
    this.ambientTimer += dt;

    if (this.ambientTimer > 0.24) {
      this.ambientTimer = 0;
      if (this.particles.length < 90) this.emitAmbient();
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const particle = this.particles[i];
      particle.life += dt;

      if (particle.life >= particle.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      particle.x += particle.vx * dt + Math.sin((particle.life + particle.phase) * 2.4) * 0.22;
      particle.y += particle.vy * dt;
      particle.vy += 7 * dt;
      particle.vx *= 0.994;

      const progress = particle.life / particle.maxLife;
      const fade = Math.sin(Math.PI * progress);
      this.ctx.globalAlpha = particle.alpha * fade;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
    this.frame = requestAnimationFrame(this.loop);
  };
}
