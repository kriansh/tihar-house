import { Howl } from "howler";

type AudioState = {
  enabled: boolean;
  unavailable: boolean;
};

/**
 * Sound is opt-in. Nothing is created or fetched until the visitor asks for it,
 * which keeps the first paint quiet and avoids autoplay surprises.
 */
export class AudioController {
  private ambience: Howl | null = null;
  private chime: Howl | null = null;
  private enabled = false;
  private unavailable = false;
  private pauseTimer: number | null = null;

  private readonly base = import.meta.env.BASE_URL;
  private readonly ambienceVolume = 0.26;
  private readonly chimeVolume = 0.42;

  onStateChange: ((state: AudioState) => void) | null = null;

  get isEnabled(): boolean {
    return this.enabled;
  }

  get isUnavailable(): boolean {
    return this.unavailable;
  }

  toggle(): boolean {
    if (this.enabled) {
      this.disable();
      return false;
    }
    this.enable();
    return true;
  }

  enable(): void {
    this.ensureAmbience();
    if (!this.ambience || this.unavailable) return;

    if (this.pauseTimer !== null) {
      window.clearTimeout(this.pauseTimer);
      this.pauseTimer = null;
    }

    this.enabled = true;
    const id = this.ambience.playing() ? null : this.ambience.play();
    this.ambience.volume(0);
    this.ambience.fade(0, this.ambienceVolume, 1400, id ?? undefined);
    this.emit();
  }

  disable(): void {
    this.enabled = false;
    this.emit();
    if (!this.ambience) return;

    const howl = this.ambience;
    howl.fade(howl.volume(), 0, 700);
    if (this.pauseTimer !== null) window.clearTimeout(this.pauseTimer);
    this.pauseTimer = window.setTimeout(() => {
      howl.pause();
      this.pauseTimer = null;
    }, 760);
  }

  playChime(): void {
    if (!this.enabled) return;
    this.ensureChime();
    if (!this.chime) return;
    const id = this.chime.play();
    this.chime.volume(this.chimeVolume, id);
  }

  private ensureAmbience(): void {
    if (this.ambience || this.unavailable) return;
    this.ambience = new Howl({
      src: [`${this.base}audio/ambience.ogg`, `${this.base}audio/ambience.mp3`],
      loop: true,
      preload: true,
      volume: 0,
      html5: false,
      onloaderror: () => this.markUnavailable(),
      onplayerror: () => this.markUnavailable()
    });
  }

  private ensureChime(): void {
    if (this.chime) return;
    this.chime = new Howl({
      src: [`${this.base}audio/chime.ogg`, `${this.base}audio/chime.mp3`],
      preload: true,
      volume: this.chimeVolume,
      html5: false
    });
  }

  private markUnavailable(): void {
    this.unavailable = true;
    this.enabled = false;
    this.emit();
  }

  private emit(): void {
    this.onStateChange?.({ enabled: this.enabled, unavailable: this.unavailable });
  }
}
