import "@fontsource-variable/cormorant-garamond/index.css";
import "@fontsource-variable/dm-sans/index.css";
import "@fontsource/mukta/400.css";
import "@fontsource/mukta/600.css";
import "@fontsource/noto-serif-devanagari/400.css";
import "@fontsource/noto-serif-devanagari/600.css";
import "./styles/main.css";

import { AudioController } from "./audio";
import { Deck } from "./deck";
import { festivalIndex, todayDayId } from "./festival";
import { Guide } from "./guide";
import {
  applyStaticI18n,
  isLang,
  preferredLang,
  rememberLang,
  t,
  type Lang
} from "./i18n";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lang: Lang = preferredLang();
applyStaticI18n(lang);

const audio = new AudioController();
const guide = new Guide(lang);
const deck = new Deck(lang, {
  reduceMotion,
  onFirstLight: () => audio.playChime()
});

deck.init();

const soundButton = document.querySelector<HTMLButtonElement>("[data-sound-toggle]");
const soundLabel = document.querySelector<HTMLElement>("[data-sound-label]");
const toast = document.querySelector<HTMLElement>("[data-toast]");
let toastTimer: number | null = null;

function showToast(message: string): void {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  if (toastTimer !== null) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toastTimer = null;
  }, 3200);
}

function updateSoundUI(): void {
  if (!soundButton || !soundLabel) return;
  const enabled = audio.isEnabled;
  const unavailable = audio.isUnavailable;
  const label = unavailable ? t(lang, "ui.soundUnavailable") : enabled ? t(lang, "ui.soundOn") : t(lang, "ui.soundOff");
  soundButton.setAttribute("aria-pressed", String(enabled));
  soundButton.setAttribute("aria-label", label);
  soundButton.classList.toggle("is-on", enabled);
  soundButton.classList.toggle("is-unavailable", unavailable);
  soundButton.disabled = unavailable;
  soundLabel.textContent = label;
}

audio.onStateChange = updateSoundUI;
updateSoundUI();

soundButton?.addEventListener("click", () => {
  if (audio.isUnavailable) { showToast(t(lang, "ui.soundUnavailable")); return; }
  const enabled = audio.toggle();
  updateSoundUI();
  if (enabled) showToast(t(lang, "ui.soundOn"));
});

function updateLangButtons(): void {
  document.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  });
}

function updateTodayChip(): void {
  const chip = document.querySelector<HTMLElement>("#today-chip");
  const nameElement = document.querySelector<HTMLElement>("#today-name");
  if (!chip || !nameElement) return;
  const id = todayDayId();
  if (!id) { chip.hidden = true; return; }
  const index = festivalIndex(id);
  const name = t(lang, `guide.days.items.${index}.name`);
  chip.hidden = false;
  chip.dataset.openDay = id;
  nameElement.textContent = name;
  chip.setAttribute("aria-label", `${t(lang, "ui.todayIs")} ${name}`);
}

function setLanguage(next: Lang): void {
  lang = next;
  applyStaticI18n(next);
  guide.setLang(next);
  deck.setLang(next);
  updateLangButtons();
  updateTodayChip();
  updateSoundUI();
  rememberLang(next);
}

document.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    const next = button.dataset.lang;
    if (isLang(next)) setLanguage(next);
  });
});

updateLangButtons();
updateTodayChip();

window.addEventListener("hashchange", () => guide.openFromHash());
requestAnimationFrame(() => {
  document.documentElement.classList.add("is-ready");
  guide.openFromHash();
});
