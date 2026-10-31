import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  executablePath:
    'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5174/projects/3/episodes/1', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const box = async (sel) => {
  const el = await page.$(sel);
  if (!el) return sel + ' => (none)';
  const b = await el.boundingBox();
  return `${sel} => x${Math.round(b.x)} y${Math.round(b.y)} w${Math.round(b.width)} h${Math.round(b.height)}`;
};
console.log(await box('[data-testid="episode-detail"]'));
console.log(await box('[data-testid="segment-rail"]'));
console.log(await box('[data-testid="segment-card-1"]'));
console.log(await box('[data-testid="keyframe-card"]'));
console.log(await box('[data-testid="shot-card"]'));
console.log('viewport 1440x900');
await browser.close();