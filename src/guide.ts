import { list, obj, t, type Lang } from "./i18n";
import { FESTIVAL_DAYS, todayDayId, type DayId } from "./festival";

export type GuideTab = "dates" | "days" | "celebrate" | "kitchen" | "words";

type DateRow = { date: string; bs: string; name: string; note: string };
type DayItem = {
  id: string;
  day: string;
  date: string;
  name: string;
  ne: string;
  body: string;
  practice: string;
};
type CelebrateItem = { title: string; body: string };
type Etiquette = { title: string; items: string[] };
type Recipe = {
  name: string;
  ne: string;
  meta: string;
  ingredients: string[];
  steps: string[];
  note: string;
};
type GlossaryItem = { word: string; pron: string; meaning: string };
type Source = { label: string; url: string };

const TABS: GuideTab[] = ["dates", "days", "celebrate", "kitchen", "words"];
const DAY_IDS = FESTIVAL_DAYS.map((day) => day.id);

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });

function isGuideTab(value: string | undefined): value is GuideTab {
  return !!value && (TABS as string[]).includes(value);
}

export class Guide {
  private readonly el: HTMLElement;
  private readonly backdrop: HTMLElement;
  private readonly body: HTMLElement;
  private readonly tabs: HTMLButtonElement[];
  private readonly panels = new Map<GuideTab, HTMLElement>();
  private readonly closeButton: HTMLButtonElement;
  private readonly pagerCount: HTMLElement;
  private readonly pagerDots: HTMLElement;
  private readonly prevButton: HTMLButtonElement;
  private readonly nextButton: HTMLButtonElement;
  private readonly reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  private lang: Lang;
  private active: GuideTab = "dates";
  private openState = false;
  private lastFocus: HTMLElement | null = null;

  onOpenChange: ((open: boolean) => void) | null = null;

  constructor(lang: Lang) {
    this.lang = lang;
    this.el = document.querySelector<HTMLElement>("#guide") as HTMLElement;
    this.backdrop = document.querySelector<HTMLElement>(".guide-backdrop") as HTMLElement;
    this.body = this.el.querySelector<HTMLElement>(".guide__body") as HTMLElement;
    this.closeButton = this.el.querySelector<HTMLButtonElement>("[data-close-guide]") as HTMLButtonElement;
    this.tabs = Array.from(this.el.querySelectorAll<HTMLButtonElement>(".guide__tabs [data-tab]"));
    this.pagerCount = this.el.querySelector<HTMLElement>("[data-guide-count]") as HTMLElement;
    this.pagerDots = this.el.querySelector<HTMLElement>("[data-guide-dots]") as HTMLElement;
    this.prevButton = this.el.querySelector<HTMLButtonElement>("[data-guide-prev]") as HTMLButtonElement;
    this.nextButton = this.el.querySelector<HTMLButtonElement>("[data-guide-next]") as HTMLButtonElement;

    this.el.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
      const id = panel.dataset.panel;
      if (isGuideTab(id)) this.panels.set(id, panel);
    });

    this.renderPager();
    this.renderAll();
    this.bind();
    this.updatePager();
  }

  get isOpen(): boolean {
    return this.openState;
  }

  setLang(lang: Lang): void {
    const scrollTop = this.body.scrollTop;
    this.lang = lang;
    this.renderAll();
    this.renderPager();
    this.body.scrollTop = scrollTop;
    if (this.openState) this.showTab(this.active, false);
  }

  open(tab: GuideTab = this.active, dayId?: string): void {
    const wasOpen = this.openState;

    if (!wasOpen) {
      this.lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      this.openState = true;
      this.el.inert = false;
      this.el.setAttribute("aria-hidden", "false");
      this.el.classList.add("is-open");
      this.backdrop.classList.add("is-open");
      document.documentElement.classList.add("guide-open");
      history.replaceState(null, "", "#guide");
      this.onOpenChange?.(true);
    }

    this.showTab(tab, !dayId);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (dayId) {
          this.scrollToDay(dayId);
        } else if (!wasOpen) {
          this.closeButton.focus({ preventScroll: true });
        }
      });
    });
  }

  close(): void {
    if (!this.openState) return;

    this.openState = false;
    this.el.classList.remove("is-open");
    this.backdrop.classList.remove("is-open");
    this.el.setAttribute("aria-hidden", "true");
    this.el.inert = true;
    document.documentElement.classList.remove("guide-open");
    this.onOpenChange?.(false);

    if (location.hash === "#guide") {
      history.replaceState(null, "", `${location.pathname}${location.search}`);
    }

    this.lastFocus?.focus({ preventScroll: true });
    this.lastFocus = null;
  }

  openFromHash(): void {
    if (location.hash === "#guide") this.open();
  }

  private showTab(tab: GuideTab, resetScroll = true): void {
    this.active = tab;

    this.tabs.forEach((button) => {
      const selected = button.dataset.tab === tab;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });

    this.panels.forEach((panel, id) => {
      panel.hidden = id !== tab;
    });

    this.updatePager();
    if (resetScroll) this.body.scrollTop = 0;
  }

  private renderPager(): void {
    this.pagerDots.innerHTML = TABS.map((tab, index) => {
      const label = t(this.lang, `guide.tabs.${tab}`);
      return `<button class="guide__dot" type="button" data-tab="${tab}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}"><span aria-hidden="true"></span></button>`;
    }).join("");
  }

  private updatePager(): void {
    const index = TABS.indexOf(this.active);
    this.pagerCount.textContent = `${index + 1} / ${TABS.length}`;
    this.prevButton.disabled = index === 0;
    this.nextButton.disabled = index === TABS.length - 1;
    this.pagerDots.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((dot) => {
      const selected = dot.dataset.tab === this.active;
      dot.classList.toggle("is-active", selected);
      dot.setAttribute("aria-current", String(selected));
    });
  }

  private step(direction: 1 | -1): void {
    const index = TABS.indexOf(this.active);
    const next = TABS[index + direction];
    if (next) this.showTab(next);
  }

  private scrollToDay(id: string): void {
    const card = this.el.querySelector<HTMLElement>(`#guide-day-${id}`);
    if (!card) return;

    const bodyRect = this.body.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const top = this.body.scrollTop + cardRect.top - bodyRect.top - 18;

    this.body.scrollTo({
      top,
      behavior: this.reduceMotion ? "auto" : "smooth"
    });
    card.focus({ preventScroll: true });
  }

  private bind(): void {
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const opener = target.closest<HTMLElement>("[data-open-guide]");
      if (opener) {
        event.preventDefault();
        this.open();
        return;
      }

      const closer = target.closest<HTMLElement>("[data-close-guide]");
      if (closer) {
        event.preventDefault();
        this.close();
        return;
      }

      const dayButton = target.closest<HTMLElement>("[data-open-day]");
      if (dayButton) {
        event.preventDefault();
        const id = dayButton.dataset.openDay;
        if (id) this.open("days", id);
        return;
      }

      const tabButton = target.closest<HTMLElement>("[data-tab]");
      if (tabButton) {
        const tab = tabButton.dataset.tab;
        if (isGuideTab(tab)) {
          this.showTab(tab);
          if (tabButton.classList.contains("guide__dot")) this.body.scrollTop = 0;
        }
        return;
      }

      if (target.closest("[data-guide-prev]")) { event.preventDefault(); this.step(-1); return; }
      if (target.closest("[data-guide-next]")) { event.preventDefault(); this.step(1); return; }

      const printButton = target.closest<HTMLElement>("[data-print]");
      if (printButton) {
        event.preventDefault();
        window.print();
      }
    });

    this.tabs.forEach((button, index) => {
      button.addEventListener("keydown", (event) => {
        const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
        if (!keys.includes(event.key)) return;
        event.preventDefault();

        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % this.tabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + this.tabs.length) % this.tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = this.tabs.length - 1;

        const tab = this.tabs[next].dataset.tab;
        if (isGuideTab(tab)) this.showTab(tab);
        this.tabs[next].focus();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (!this.openState) return;

      if (event.key === "Escape") {
        event.preventDefault();
        this.close();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = this.focusableElements();
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (!this.el.contains(current)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  private focusableElements(): HTMLElement[] {
    return Array.from(
      this.el.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), summary'
      )
    ).filter((element) => element.getClientRects().length > 0 && element.getAttribute("aria-hidden") !== "true");
  }

  private renderAll(): void {
    this.panels.get("dates")!.innerHTML = this.renderDates();
    this.panels.get("days")!.innerHTML = this.renderDays();
    this.panels.get("celebrate")!.innerHTML = this.renderCelebrate();
    this.panels.get("kitchen")!.innerHTML = this.renderKitchen();
    this.panels.get("words")!.innerHTML = this.renderWords();
  }

  private renderDates(): string {
    const rows = list<DateRow>(this.lang, "guide.dates.rows");
    const days = list<DayItem>(this.lang, "guide.days.items");
    const today = todayDayId();
    const todayName = today ? days.find((day) => day.id === today)?.name ?? "" : "";
    const base = import.meta.env.BASE_URL;

    const rowMarkup = rows
      .map((row, index) => {
        const id = DAY_IDS[index];
        const isCurrent = id === today;
        return `<button class="date-row${isCurrent ? " is-today" : ""}" type="button" data-open-day="${id}" aria-label="${escapeHtml(
          `${row.date} · ${row.name}`
        )}">
          <span class="date-row__date">${escapeHtml(row.date)}</span>
          <span class="date-row__main">
            <span class="date-row__name">${escapeHtml(row.name)}</span>
            <span class="date-row__note">${escapeHtml(row.note)}</span>
          </span>
          <span class="date-row__bs">${escapeHtml(row.bs)}</span>
          ${isCurrent ? `<span class="badge badge--today">${escapeHtml(t(this.lang, "ui.today"))}</span>` : ""}
        </button>`;
      })
      .join("");

    return `<div class="panel-head">
        <h3>${escapeHtml(t(this.lang, "guide.dates.title"))}</h3>
        <p class="panel-sub">${escapeHtml(t(this.lang, "guide.dates.range"))} · ${escapeHtml(
          t(this.lang, "guide.dates.bs")
        )}</p>
      </div>
      ${
        today
          ? `<p class="today-banner"><span class="today-banner__dot" aria-hidden="true"></span><span>${escapeHtml(
              t(this.lang, "ui.todayIs")
            )}</span><strong>${escapeHtml(todayName)}</strong></p>`
          : ""
      }
      <div class="date-list">${rowMarkup}</div>
      <p class="panel-note">${escapeHtml(t(this.lang, "guide.dates.note"))}</p>
      <p class="panel-note panel-note--quiet">${escapeHtml(t(this.lang, "guide.dates.holidays"))}</p>
      <div class="panel-actions">
        <a class="btn btn--small btn--primary" href="${escapeHtml(base)}tihar-2083.ics" download="tihar-2083.ics">
          <span>${escapeHtml(t(this.lang, "guide.dates.calendarCta"))}</span>
          <span aria-hidden="true">↓</span>
        </a>
        <button class="btn btn--small btn--ghost" type="button" data-print>${escapeHtml(
          t(this.lang, "ui.print")
        )}</button>
      </div>
      <p class="panel-source">${escapeHtml(t(this.lang, "guide.dates.source"))}</p>`;
  }

  private renderDays(): string {
    const items = list<DayItem>(this.lang, "guide.days.items");
    const today = todayDayId();

    const cards = items
      .map((item) => {
        const isCurrent = item.id === today;
        return `<article class="day-card${isCurrent ? " is-today" : ""}" id="guide-day-${escapeHtml(
          item.id
        )}" tabindex="-1">
          <header class="day-card__head">
            <span class="day-card__day">${escapeHtml(item.day)}</span>
            <span class="day-card__date">${escapeHtml(item.date)}</span>
            ${isCurrent ? `<span class="badge badge--today">${escapeHtml(t(this.lang, "ui.today"))}</span>` : ""}
          </header>
          <h3 class="day-card__title">${escapeHtml(item.name)} <span class="day-card__ne" lang="ne">${escapeHtml(
            item.ne
          )}</span></h3>
          <p class="day-card__body">${escapeHtml(item.body)}</p>
          <div class="day-card__practice">
            <h4>${escapeHtml(t(this.lang, "guide.practiceLabel"))}</h4>
            <p>${escapeHtml(item.practice)}</p>
          </div>
        </article>`;
      })
      .join("");

    return `<p class="panel-intro">${escapeHtml(t(this.lang, "guide.days.intro"))}</p>
      <div class="day-list">${cards}</div>`;
  }

  private renderCelebrate(): string {
    const items = list<CelebrateItem>(this.lang, "guide.celebrate.items");
    const etiquette = obj<Etiquette>(this.lang, "guide.celebrate.etiquette");

    const cards = items
      .map(
        (item) => `<article class="celebrate-card">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
        </article>`
      )
      .join("");

    return `<p class="panel-intro">${escapeHtml(t(this.lang, "guide.celebrate.intro"))}</p>
      <div class="celebrate-grid">${cards}</div>
      <aside class="etiquette">
        <h3>${escapeHtml(etiquette.title)}</h3>
        <ul>${etiquette.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </aside>`;
  }

  private renderKitchen(): string {
    const recipes = list<Recipe>(this.lang, "guide.kitchen.recipes");

    const cards = recipes
      .map(
        (recipe) => `<article class="recipe">
          <header class="recipe__head">
            <h3>${escapeHtml(recipe.name)} <span class="recipe__ne" lang="ne">${escapeHtml(recipe.ne)}</span></h3>
            <p class="recipe__meta">${escapeHtml(recipe.meta)}</p>
          </header>
          <div class="recipe__cols">
            <div class="recipe__block">
              <h4>${escapeHtml(t(this.lang, "guide.ingredientsLabel"))}</h4>
              <ul>${recipe.ingredients.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </div>
            <div class="recipe__block">
              <h4>${escapeHtml(t(this.lang, "guide.methodLabel"))}</h4>
              <ol>${recipe.steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
            </div>
          </div>
          <p class="recipe__note"><strong>${escapeHtml(
            t(this.lang, "guide.noteLabel")
          )}</strong> ${escapeHtml(recipe.note)}</p>
        </article>`
      )
      .join("");

    return `<p class="panel-intro">${escapeHtml(t(this.lang, "guide.kitchen.intro"))}</p>
      <div class="recipe-list">${cards}</div>`;
  }

  private renderWords(): string {
    const glossary = list<GlossaryItem>(this.lang, "guide.words.glossary");
    const sources = list<Source>(this.lang, "guide.words.sources");

    const glossaryMarkup = glossary
      .map(
        (item) => `<div class="gloss">
          <dt>${escapeHtml(item.word)} <span class="gloss__pron">${escapeHtml(item.pron)}</span></dt>
          <dd>${escapeHtml(item.meaning)}</dd>
        </div>`
      )
      .join("");

    const sourceMarkup = sources
      .map(
        (source) => `<li>
          <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">
            <span>${escapeHtml(source.label)}</span>
            <span class="source__arrow" aria-hidden="true">↗</span>
          </a>
        </li>`
      )
      .join("");

    return `<p class="panel-intro">${escapeHtml(t(this.lang, "guide.words.intro"))}</p>
      <dl class="glossary">${glossaryMarkup}</dl>
      <section class="sources">
        <h3>${escapeHtml(t(this.lang, "ui.source"))}</h3>
        <ul>${sourceMarkup}</ul>
        <p class="panel-note panel-note--quiet">${escapeHtml(t(this.lang, "guide.words.sourceNote"))}</p>
      </section>
      <aside class="verify-box verify-box--confirmed">
        <h3>${escapeHtml(t(this.lang, "guide.words.confirmTitle"))}</h3>
        <p>${escapeHtml(t(this.lang, "guide.words.confirmBody"))}</p>
      </aside>
      <p class="credits">${escapeHtml(t(this.lang, "guide.words.credits"))}</p>`;
  }
}
