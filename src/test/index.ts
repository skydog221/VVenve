import { chromium } from "playwright";
import fs from "fs/promises";

const mill = async (time: number) => new Promise<void>(resolve => setTimeout(resolve, time));
(async () => {
    const browser = await chromium.launch({
        headless: false,
        args: [
            '--auto-open-devtools-for-tabs',
            "--start-maximized"
        ],
    });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    await page.goto("https://ccw.site/gandi");
    await mill(100);//防止ccw出一些莫名其妙bug

    const code = await fs.readFile("dist/index.js", "utf-8");
    await page.evaluate(code => window.injectVVenve = () => eval(code), code);
})();