import { chromium } from 'playwright-core';

const url = process.argv[2];
const out = process.argv[3];
const browser = await chromium.launch({
  executablePath:
    'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
const fails = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text().slice(0, 300));
});
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 300)));
page.on('response', (r) => {
  if (r.status() >= 400) fails.push(r.status() + ' ' + r.url());
});
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);
if (out) await page.screenshot({ path: out, fullPage: false });
console.log('ERRORS', JSON.stringify(errors, null, 1));
console.log('FAILED', JSON.stringify(fails, null, 1));
await browser.close();