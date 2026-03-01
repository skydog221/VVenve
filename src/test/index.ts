import { chromium } from "playwright";
import fs from "fs/promises";

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://ccw.site/detail/6981fc23e8d17f1df9eaccd1");
    const code = await fs.readFile("index.js", "utf-8");
    await page.evaluate(eval, code);
})();