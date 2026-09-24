import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '1366x650', width: 1366, height: 650 },
  { name: '1280x600', width: 1280, height: 600 },
  { name: '1440x790', width: 1440, height: 790 },
  { name: '1920x950', width: 1920, height: 950 },
  { name: '390px', width: 390, height: 844 },
];

const outDir = path.resolve('public', 'hero-audit');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const prefix = process.argv[2] || 'before';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = [];

  for (const vp of VIEWPORTS) {
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height });
      if (theme === 'dark') {
        await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
      } else {
        await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
      }

      await page.goto('http://localhost:3001/?stage=1', { waitUntil: 'networkidle0' });
      // Wait for animations to finish (intro animations are ~0.7s - 1.0s)
      await new Promise((r) => setTimeout(r, 1200));

      const metrics = await page.evaluate(() => {
        const toolbar = document.querySelector('.toolbar');
        const firstTool = document.querySelector('.list .row, .tgrid .card, .dt tbody tr');
        const h1 = document.querySelector('h1');
        const fq = document.querySelector('.fq');
        const leftCol = document.querySelector('.hero-text, .hero > div:first-child');
        const rightCol = document.querySelector('.hero > div:last-child');
        const lede = document.querySelector('.lede');
        const search = document.querySelector('.search');
        const firstStage = document.querySelector('.stage');
        const fseeBtn = document.querySelector('.fnav .btn-soft');

        const tbRect = toolbar ? toolbar.getBoundingClientRect() : null;
        const ftRect = firstTool ? firstTool.getBoundingClientRect() : null;
        const h1Rect = h1 ? h1.getBoundingClientRect() : null;
        const fqRect = fq ? fq.getBoundingClientRect() : null;
        const leftRect = leftCol ? leftCol.getBoundingClientRect() : null;
        const rightRect = rightCol ? rightCol.getBoundingClientRect() : null;
        const ledeRect = lede ? lede.getBoundingClientRect() : null;
        const searchRect = search ? search.getBoundingClientRect() : null;
        const stageRect = firstStage ? firstStage.getBoundingClientRect() : null;
        const fseeVisible = fseeBtn ? window.getComputedStyle(fseeBtn).display !== 'none' : false;

        const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;

        return {
          toolbarTop: tbRect ? Math.round(tbRect.top + window.scrollY) : null,
          firstToolTop: ftRect ? Math.round(ftRect.top + window.scrollY) : null,
          h1Top: h1Rect ? Math.round(h1Rect.top + window.scrollY) : null,
          fqTop: fqRect ? Math.round(fqRect.top + window.scrollY) : null,
          leftBottom: leftRect ? Math.round(leftRect.bottom + window.scrollY) : null,
          rightBottom: rightRect ? Math.round(rightRect.bottom + window.scrollY) : null,
          introSearchGap: (ledeRect && searchRect) ? Math.round(searchRect.top - ledeRect.bottom) : null,
          barHeight: stageRect ? Math.round(stageRect.height) : null,
          fseeVisible,
          hasHorizontalScroll,
        };
      });

      const shotPath = path.join(outDir, `${prefix}_${vp.name}_${theme}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      results.push({
        viewport: vp.name,
        theme,
        ...metrics,
        headlineFunnelDiff: metrics.h1Top !== null && metrics.fqTop !== null ? Math.abs(metrics.h1Top - metrics.fqTop) : null,
        columnsBottomDiff: metrics.leftBottom !== null && metrics.rightBottom !== null ? Math.abs(metrics.leftBottom - metrics.rightBottom) : null,
      });

      await page.close();
    }
  }

  await browser.close();

  console.log(`\n=== MEASUREMENTS (${prefix.toUpperCase()}) ===`);
  console.table(results);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
