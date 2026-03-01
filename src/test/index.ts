import { chromium } from "playwright";
import fs from "fs/promises";

const mill = async (time: number) => new Promise<void>(resolve => setTimeout(resolve, time));
(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://ccw.site/detail/6981fc23e8d17f1df9eaccd1");
    await page.waitForSelector("div[class*='progress'][style*='width: 100%']");
    await mill(100);
    await page.evaluate(() => {
        const btn = document.querySelector("button[class*='runWorksOuterBtn']");
        if (btn instanceof HTMLButtonElement) {
            btn.click();
        }
    });
    await mill(100);//防止ccw的猎奇加载器出一些莫名其妙bug
    const code = await fs.readFile("dist/index.js", "utf-8");
    await page.evaluate(code => eval(code), code);
})();