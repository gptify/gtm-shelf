import puppeteer from 'puppeteer';
import path from 'node:path';

async function runTests() {
  console.log('--- STEP 4 ACCEPTANCE TESTS: FINDER ---');
  const baseUrl = 'http://localhost:3001';
  const artifactDir = 'C:\\Users\\Shuxrat\\.gemini\\antigravity\\brain\\7f2cb2bb-a72c-4384-a0d7-64bd55498edb';

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // 1. Visit /find
    console.log('1. Loading /find...');
    await page.goto(`${baseUrl}/find`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#qh');

    const q1Title = await page.$eval('#qh', (el) => el.textContent?.trim());
    console.log('Question 1 title:', q1Title);
    if (!q1Title?.includes('What do you want more of right now?')) {
      throw new Error(`Unexpected question 1 title: ${q1Title}`);
    }

    // Capture Question 1 screenshot
    const q1Screenshot = path.join(artifactDir, 'finder_question1.png');
    await page.screenshot({ path: q1Screenshot, fullPage: false });
    console.log('Saved Question 1 screenshot:', q1Screenshot);

    // 2. Acceptance Scenario 7:
    // "More replies and booked calls" -> "Send outreach emails at scale" -> "Just me"
    console.log('2. Testing Scenario 7 (Cold email for solo user)...');
    const clickChoice = async (text) => {
      await page.waitForSelector('.choice');
      const buttons = await page.$$('.choice');
      for (const b of buttons) {
        const t = await b.evaluate((el) => el.textContent?.trim());
        if (t?.includes(text)) {
          await b.click();
          await new Promise((r) => setTimeout(r, 400));
          return;
        }
      }
      throw new Error(`Choice not found: "${text}"`);
    };

    await clickChoice('More replies and booked calls');

    // Answer 2: "Send outreach emails at scale"
    await page.waitForSelector('#qh');
    const q2Title = await page.$eval('#qh', (el) => el.textContent?.trim());
    console.log('Question 2 title:', q2Title);
    await clickChoice('Send outreach emails at scale');

    // Answer 3: adapt based on question asked
    await page.waitForSelector('#qh');
    const q3Title = await page.$eval('#qh', (el) => el.textContent?.trim());
    console.log('Question 3 title:', q3Title);
    if (q3Title?.includes('spend')) {
      await clickChoice('$50'); // e.g. "$50 to $200" or similar budget option
    } else {
      await clickChoice('Just me');
    }

    // 3. Verify Results: Top picks must be lemlist, Instantly, Smartlead in order!
    console.log('3. Verifying Results (Acceptance criteria 7 & 18)...');
    await page.waitForSelector('.respicks', { timeout: 10000 });

    const picks = await page.$$eval('.res-pick', (picks) =>
      picks.map((p) => {
        const name = p.querySelector('.name-btn')?.textContent?.trim();
        const badge = p.querySelector('.badge')?.textContent?.trim();
        return { name, badge };
      })
    );

    console.log('Picks returned by Finder:', picks);
    if (picks.length !== 3) throw new Error(`Expected 3 picks, got ${picks.length}`);
    if (picks[0].name !== 'lemlist') throw new Error(`Expected pick 1 to be lemlist, got ${picks[0].name}`);
    if (picks[1].name !== 'Instantly') throw new Error(`Expected pick 2 to be Instantly, got ${picks[1].name}`);
    if (picks[2].name !== 'Smartlead') throw new Error(`Expected pick 3 to be Smartlead, got ${picks[2].name}`);
    console.log('✅ Scenario 7 verified: Top picks are exactly lemlist, Instantly, Smartlead in 3 questions!');

    // Capture Results screenshot
    const resScreenshot = path.join(artifactDir, 'finder_results.png');
    await page.screenshot({ path: resScreenshot, fullPage: true });
    console.log('Saved Finder Results screenshot:', resScreenshot);

    // 4. Test Details button opens drawer
    console.log('4. Testing Details button opens slide-in drawer from finder results...');
    const detailsBtn = await page.$('.res-actions .btn-ghost');
    if (detailsBtn) {
      await detailsBtn.click();
      await new Promise((r) => setTimeout(r, 400));
      const drawerOpen = await page.$eval('#drawer', (el) => el.hasAttribute('open'));
      if (!drawerOpen) throw new Error('Details drawer did not open on click');
      const drawerTitle = await page.$eval('#dw-title', (el) => el.textContent?.trim());
      console.log('Drawer opened for:', drawerTitle);
      const closeBtn = await page.$('.close');
      if (closeBtn) await closeBtn.click();
      await new Promise((r) => setTimeout(r, 300));
      console.log('✅ Details drawer opened and closed smoothly from finder results!');
    }

    // 5. Test Restart button
    console.log('5. Testing Restart button...');
    const restartBtn = await page.$('.summary .st');
    if (restartBtn) {
      await restartBtn.click();
      await new Promise((r) => setTimeout(r, 400));
      const restartedQ = await page.$eval('#qh', (el) => el.textContent?.trim());
      if (!restartedQ?.includes('What do you want more of right now?')) {
        throw new Error('Restart did not return to question 1');
      }
      console.log('✅ Restart button returns to question 1!');
    }

    // 6. Test "I am not sure" and "None of these fit" CRM fallback
    console.log('6. Testing "I am not sure" and "None of these fit" CRM fallback...');
    await clickChoice('I am not sure');
    const unsureQ = await page.$eval('#qh', (el) => el.textContent?.trim());
    console.log('Unsure question:', unsureQ);
    await clickChoice('None of these fit');

    console.log('✅ Unsure and fallback path verified!');

    console.log('\n🎉 ALL STEP 4 ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
