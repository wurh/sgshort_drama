import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  executablePath:
    'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
const fails = [];
page.on('console', (m) => {
  const t = m.text();
  if (m.type() === 'error' && !t.includes('antd v5 support React')) errors.push(t.slice(0, 200));
});
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)));
page.on('response', (r) => {
  if (r.status() >= 400 && !r.url().includes('favicon')) fails.push(r.status() + ' ' + r.url());
});

await page.goto('http://localhost:5174/projects/3/episodes/1', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'shot-ep1.png' });

// 图片面板
await page.click('[data-testid="keyframe-card-gen"]');
await page.waitForTimeout(900);
await page.screenshot({ path: 'shot-panel-image.png' });
// 打开风格库，确认复用同一套
await page.click('[data-testid="panel-style"]');
await page.waitForTimeout(900);
await page.screenshot({ path: 'shot-style.png' });
const styleCount = await page.locator('[data-testid^="style-item-"]').count();
console.log('style items:', styleCount);
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
await page.click('[data-testid="generate-panel-close"]');
await page.waitForTimeout(500);

// 视频面板
await page.click('[data-testid="open-video-panel"]');
await page.waitForTimeout(1000);
await page.screenshot({ path: 'shot-panel-video.png' });
console.log('VIDEO submit:', await page.textContent('[data-testid="panel-submit"]'));
console.log('refs count:', await page.locator('[data-testid="panel-refs"] > div').count());
console.log('shot-ref img:', await page.locator('[data-testid="panel-shot-ref"] img').count());

console.log('ERRORS', JSON.stringify(errors));
console.log('FAILED', JSON.stringify(fails));
await browser.close();