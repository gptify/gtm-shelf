import puppeteer from 'puppeteer';
import path from 'node:path';

async function main() {
  const artifactDir = 'C:\\Users\\Shuxrat\\.gemini\\antigravity\\brain\\7f2cb2bb-a72c-4384-a0d7-64bd55498edb';
  console.log('Launching browser to capture screenshots of GTM Shelf...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Desktop full page
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });

  const desktopPath = path.join(artifactDir, 'gtm_shelf_desktop.png');
  await page.screenshot({ path: desktopPath, fullPage: true });
  console.log(`Saved desktop screenshot: ${desktopPath}`);

  // 2. Open details drawer (click the first tool name: Jasper)
  const jasperBtn = await page.$('.open');
  if (jasperBtn) {
    await jasperBtn.click();
    await new Promise((r) => setTimeout(r, 600)); // wait for drawer slide animation

    const drawerPath = path.join(artifactDir, 'gtm_shelf_drawer.png');
    await page.screenshot({ path: drawerPath, fullPage: false });
    console.log(`Saved drawer screenshot: ${drawerPath}`);

    // Close drawer
    const closeBtn = await page.$('.close');
    if (closeBtn) await closeBtn.click();
    await new Promise((r) => setTimeout(r, 300));
  }

  // 3. Switch to Grid View
  const gridBtn = await page.$('[data-view="grid"]');
  if (gridBtn) {
    await gridBtn.click();
    await new Promise((r) => setTimeout(r, 300));
    const gridPath = path.join(artifactDir, 'gtm_shelf_grid.png');
    await page.screenshot({ path: gridPath, fullPage: false });
    console.log(`Saved grid view screenshot: ${gridPath}`);
  }

  // 4. Switch to Table View
  const tableBtn = await page.$('[data-view="table"]');
  if (tableBtn) {
    await tableBtn.click();
    await new Promise((r) => setTimeout(r, 300));
    const tablePath = path.join(artifactDir, 'gtm_shelf_table.png');
    await page.screenshot({ path: tablePath, fullPage: false });
    console.log(`Saved table view screenshot: ${tablePath}`);
  }

  // 5. Mobile 390px view
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
  const mobilePath = path.join(artifactDir, 'gtm_shelf_mobile.png');
  await page.screenshot({ path: mobilePath, fullPage: true });
  console.log(`Saved mobile screenshot: ${mobilePath}`);

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
