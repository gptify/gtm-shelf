import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // 1. Notebook screen (1366x768) - Home page
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
    await page.screenshot({
      path: path.resolve('public', 'notebook_homepage.png')
    });
    console.log('Saved public/notebook_homepage.png');

    // 2. Guides page
    await page.goto('http://localhost:3001/guides', { waitUntil: 'networkidle2' });
    await page.screenshot({
      path: path.resolve('public', 'guides_page.png')
    });
    console.log('Saved public/guides_page.png');

    // 3. Submit page
    await page.goto('http://localhost:3001/submit', { waitUntil: 'networkidle2' });
    await page.screenshot({
      path: path.resolve('public', 'submit_page.png')
    });
    console.log('Saved public/submit_page.png');

    // 4. Guide VS page
    await page.goto('http://localhost:3001/guides/instantly-vs-smartlead', { waitUntil: 'networkidle2' });
    await page.screenshot({
      path: path.resolve('public', 'guide_vs_page.png')
    });
    console.log('Saved public/guide_vs_page.png');

    console.log('All verification screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
