import { chromium } from "playwright";
const URL = process.env.SHOT_URL ?? "http://127.0.0.1:5173/";
const browser = await chromium.launch();
const errors = [];
const checks = [];
const check = (name, ok) => { checks.push([name, ok]); if (!ok) errors.push(name); };

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(URL, { waitUntil: "load" });
await page.waitForTimeout(1200);
check("slides", await page.evaluate(() => document.querySelectorAll(".slide").length === 8));
check("images", await page.evaluate(() => [...document.querySelectorAll(".slide img")].every((img) => img.complete && img.naturalWidth > 0)));
check("cover", await page.evaluate(() => document.querySelector(".slide.is-active")?.dataset.slide === "intro"));
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(1400);
check("roof", await page.evaluate(() => document.querySelector(".slide.is-active")?.dataset.slide === "roof"));
check("next-label", await page.evaluate(() => document.querySelector("[data-deck-next-title]")?.textContent === "Kukur Tihar"));
await page.click(".slide.is-active [data-light-diya]");
check("diya", await page.evaluate(() => document.querySelector(".slide.is-active [data-light-diya]")?.classList.contains("is-lit")));
await page.click('.chapter-nav__item[data-target="attic"]');
await page.waitForTimeout(1400);
check("attic-garland", await page.evaluate(() => !!document.querySelector(".slide.is-active .slide__garland")));
check("attic-deva", await page.evaluate(() => !!document.querySelector(".slide.is-active .slide__kicker-ne")?.textContent?.trim()));
await page.click('.chapter-nav__item[data-target="kitchen"]');
await page.waitForTimeout(1400);
check("kitchen-selroti", await page.evaluate(() => !!document.querySelector(".slide.is-active .slide__selroti")));
check("kitchen-grid", await page.evaluate(() => getComputedStyle(document.querySelector(".slide.is-active .slide__chapter")).display === "grid"));
await page.click('.chapter-nav__item[data-target="puja"]');
await page.waitForTimeout(1800);
check("puja", await page.evaluate(() => document.querySelectorAll(".slide.is-active .slide__lamps svg.is-lit").length === 5));
await page.click('.chapter-nav__item[data-target="garden"]');
await page.waitForTimeout(2000);
check("rangoli", await page.evaluate(() => {
  const p = document.querySelector(".slide.is-active .slide__rangoli [data-rangoli-draw]");
  return !!p && getComputedStyle(p).strokeDashoffset === "0px";
}));
await page.keyboard.press("End");
await page.waitForTimeout(1400);
check("finale-garland", await page.evaluate(() => !!document.querySelector(".slide.is-active .slide__garland--finale")));
await page.click(".slide.is-active .slide__credits summary");
await page.waitForTimeout(250);
check("finale-credits", await page.evaluate(() => {
  const credits = document.querySelector(".slide.is-active .slide__credits");
  const copy = document.querySelector(".slide.is-active .slide__copy");
  const header = document.querySelector(".header").getBoundingClientRect();
  return credits?.open === true && credits.querySelectorAll("li").length === 8 && copy.getBoundingClientRect().top >= header.bottom;
}));
await page.keyboard.press("Home");
await page.waitForTimeout(1200);
await page.click(".guide-btn");
await page.waitForTimeout(500);
check("guide-open", await page.evaluate(() => document.querySelector("#guide").classList.contains("is-open")));
await page.click("#tab-days");
check("guide-tab", await page.evaluate(() => !document.querySelector("#panel-days").hidden));
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
check("guide-close", await page.evaluate(() => document.querySelector("#guide").getAttribute("aria-hidden") === "true"));
await page.click(".lang__btn[data-lang='ne']");
check("nepali", await page.evaluate(() => document.documentElement.lang === "ne"));
await page.click(".lang__btn[data-lang='en']");

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(URL, { waitUntil: "load" });
await mobile.waitForTimeout(900);
check("mobile-overflow", await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
check("mobile-art", await mobile.evaluate(() => document.querySelector(".slide.is-active img")?.currentSrc.includes("portrait")));
await mobile.keyboard.press("End");
await mobile.waitForTimeout(1000);
await mobile.click(".slide.is-active .slide__credits summary");
await mobile.waitForTimeout(250);
check("mobile-finale-credits", await mobile.evaluate(() => {
  const copy = document.querySelector(".slide.is-active .slide__copy");
  const header = document.querySelector(".header").getBoundingClientRect();
  return copy.getBoundingClientRect().top >= header.bottom && getComputedStyle(copy).overflowY === "auto";
}));

const tablet = await browser.newPage({ viewport: { width: 768, height: 1024 } });
await tablet.goto(URL, { waitUntil: "load" });
await tablet.waitForTimeout(900);
check("tablet-overflow", await tablet.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await reduced.goto(URL, { waitUntil: "load" });
await reduced.waitForTimeout(700);
await reduced.keyboard.press("End");
await reduced.waitForTimeout(300);
check("reduced-finale", await reduced.evaluate(() => document.querySelector(".slide.is-active")?.dataset.slide === "finale"));

await reduced.emulateMedia({ media: "print" });
check("print", await reduced.evaluate(() => getComputedStyle(document.querySelector(".deck")).display === "none" && getComputedStyle(document.querySelector("#guide")).display === "block"));

console.log(checks.map(([n, ok]) => `${ok ? "PASS" : "FAIL"} ${n}`).join("\n"));
console.log(errors.length ? `ERRORS: ${errors.join(" | ")}` : "No errors.");
await browser.close();
process.exit(errors.length ? 1 : 0);
