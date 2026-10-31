import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  executablePath:
    'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5174/projects/3/episodes/1', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.click('[data-testid="open-video-panel"]');
await page.waitForTimeout(6000);

// 检查每个缩略图 img 是否真的加载成功（naturalWidth>0）
const report = await page.$$eval('[data-testid="panel-refs"] img', (imgs) =>
  imgs.map((i) => ({
    src: i.getAttribute('src')?.slice(-24),
    loaded: i.naturalWidth > 0,
    w: i.naturalWidth,
    h: i.naturalHeight,
  })),
);
console.log(JSON.stringify(report, null, 1));
await page.screenshot({ path: 'shot-panel-video.png' });
await browser.close();