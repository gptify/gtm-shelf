import puppeteer from 'puppeteer';

async function verifyHeroA11y() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto('http://localhost:3001/?stage=1', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  // Focus skip link or start tabbing
  await page.keyboard.press('Tab'); // skip link
  await page.keyboard.press('Tab'); // brand link
  await page.keyboard.press('Tab'); // Tools nav
  await page.keyboard.press('Tab'); // Guides nav
  await page.keyboard.press('Tab'); // Find my tools nav
  await page.keyboard.press('Tab'); // Submit a tool button

  const heroFocusOrder = [];

  // Tab through hero
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const focusedInfo = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id,
        className: el.className,
        text: (el.textContent || '').trim().slice(0, 30),
        outline: style.outline || style.outlineColor,
        outlineWidth: style.outlineWidth,
        visible: rect.width > 0 && rect.height > 0,
      };
    });
    if (focusedInfo) {
      heroFocusOrder.push(focusedInfo);
      if (focusedInfo.id === 'allstages' || focusedInfo.className.includes('ftoggle') || focusedInfo.className.includes('pill')) {
        // reached beyond hero controls
        break;
      }
    }
  }

  console.log('=== HERO TAB ORDER & FOCUS VERIFICATION ===');
  console.table(heroFocusOrder);

  // Check CLS
  const cls = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let clsValue = 0;
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => {
        observer.disconnect();
        resolve(clsValue);
      }, 500);
    });
  });

  console.log(`CLS score: ${cls}`);

  await browser.close();
}

verifyHeroA11y().catch(console.error);
