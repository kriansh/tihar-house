import { firefox, chromium } from "playwright";
import fs from "node:fs";

const URL = process.env.SHOT_URL ?? "http://127.0.0.1:5173/";
const OUT = process.env.SHOT_DIR ?? "/tmp/opencode/tihar-shots";
fs.mkdirSync(OUT, { recursive: true });
const preferred = process.env.SHOT_BROWSER ?? "chromium";
let browser;
try {
  browser = await (preferred === "firefox" ? firefox : chromium).launch();
} catch {
  browser = await firefox.launch();
}
const errors = [];
const capture = async (page, name) => {
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log(`shot ${name}`);
};

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
await page.goto(URL, { waitUntil: "load" });
await page.waitForTimeout(1400);
const ids = ["intro", "roof", "attic", "puja", "kitchen", "doorway", "garden", "finale"];
for (let i = 0; i < ids.length; i += 1) {
  if (i > 0) { await page.keyboard.press("ArrowRight"); await page.waitForTimeout(1400); }
  await capture(page, `0${i + 1}-${ids[i]}`);
}
await page.click(".slide.is-active .slide__credits summary");
await page.waitForTimeout(400);
await capture(page, "10-finale-credits");
await page.click(".guide-btn");
await page.waitForTimeout(700);
await capture(page, "11-guide-dates");
await page.click("#tab-days");
await page.waitForTimeout(400);
await capture(page, "12-guide-days");
await page.click("#tab-kitchen");
await page.waitForTimeout(400);
await capture(page, "13-guide-kitchen");
await page.click("#tab-words");
await page.waitForTimeout(400);
await capture(page, "14-guide-words");
await page.click(".guide__close");
await page.waitForTimeout(400);
await page.keyboard.press("Home");
await page.click(".lang__btn[data-lang='ne']");
await page.waitForTimeout(700);
await capture(page, "15-nepali-cover");

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("pageerror", (e) => errors.push(`mobile pageerror: ${e.message}`));
await mobile.goto(URL, { waitUntil: "load" });
await mobile.waitForTimeout(1000);
await capture(mobile, "20-mobile-cover");
for (const [key, name] of [["ArrowRight", "21-mobile-roof"], ["ArrowRight", "22-mobile-attic"]]) {
  await mobile.keyboard.press(key);
  await mobile.waitForTimeout(1200);
  await capture(mobile, name);
}
for (let i = 0; i < 4; i += 1) { await mobile.keyboard.press("ArrowRight"); await mobile.waitForTimeout(800); }
await mobile.waitForTimeout(800);
await capture(mobile, "23-mobile-garden");
console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "No page errors.");
console.log(`screenshots in ${OUT}`);
await browser.close();
