import en from "./en.json";
import ne from "./ne.json";

export type Lang = "en" | "ne";

const dictionaries: Record<Lang, unknown> = { en, ne };
const STORAGE_KEY = "tihar-house-lang";

function readPath(root: unknown, path: string): unknown {
  let cursor = root;
  for (const segment of path.split(".")) {
    if (Array.isArray(cursor)) {
      const index = Number(segment);
      cursor = Number.isInteger(index) ? cursor[index] : undefined;
    } else if (cursor && typeof cursor === "object") {
      cursor = (cursor as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
    if (cursor === undefined) return undefined;
  }
  return cursor;
}

/** Raw value at a dotted path, e.g. "guide.days.items". */
export function raw(lang: Lang, path: string): unknown {
  return readPath(dictionaries[lang], path);
}

/** A translated string. Returns an empty string if the key is missing. */
export function t(lang: Lang, path: string): string {
  const value = raw(lang, path);
  return typeof value === "string" ? value : "";
}

/** A translated array. */
export function list<T>(lang: Lang, path: string): T[] {
  const value = raw(lang, path);
  return Array.isArray(value) ? (value as T[]) : [];
}

/** A translated object, cast to the expected shape. */
export function obj<T>(lang: Lang, path: string): T {
  return (raw(lang, path) ?? {}) as T;
}

export function isLang(value: string | null | undefined): value is Lang {
  return value === "en" || value === "ne";
}

export function storedLang(): Lang | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isLang(value) ? value : null;
  } catch {
    return null;
  }
}

export function preferredLang(): Lang {
  const stored = storedLang();
  if (stored) return stored;
  return navigator.language?.toLowerCase().startsWith("ne") ? "ne" : "en";
}

export function rememberLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage can be unavailable in private modes */
  }
}

/** Update every element carrying a data-i18n / data-i18n-aria-label attribute. */
export function applyStaticI18n(lang: Lang): void {
  document.documentElement.lang = lang;

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!key) return;
    const value = t(lang, key);
    if (value) element.textContent = value;
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (!key) return;
    const value = t(lang, key);
    if (value) element.setAttribute("aria-label", value);
  });

  const title = t(lang, "meta.title");
  if (title) document.title = title;

  const description = t(lang, "meta.description");
  const metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (description && metaDescription) metaDescription.content = description;

  const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  if (title && ogTitle) ogTitle.content = title;

  const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
  if (description && ogDescription) ogDescription.content = description;
}

export function isNepali(lang: Lang): boolean {
  return lang === "ne";
}
