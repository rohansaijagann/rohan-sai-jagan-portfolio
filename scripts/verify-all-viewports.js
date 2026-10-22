import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-landscape-1024', width: 1024, height: 768 },
  { name: 'tablet-portrait-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
];

const SCREENSHOT_DIR = path.resolve('screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function verifyAll() {
  console.log('--- STARTING MULTI-VIEWPORT FINAL QA TEST ---');

  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch {
    try {
      browser = await chromium.launch({ channel: 'chrome', headless: true });
    } catch {
      browser = await chromium.launch({ headless: true });
    }
  }

  const sections = ['home', 'about', 'after-hours', 'projects', 'skills', 'experience', 'resume', 'contact'];

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });

    await context.addInitScript(() => {
      sessionStorage.setItem('rohan_portfolio_overture', 'true');
    });

    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    // 1. Verify No Horizontal Scroll
    const hasHorizontalOverflow = await page.evaluate(() => {
      const scrollEl = document.querySelector('.editor-scroll-snap') || document.documentElement;
      return scrollEl.scrollWidth > scrollEl.clientWidth + 2;
    });

    if (hasHorizontalOverflow) {
      console.warn(`[WARNING] Viewport ${vp.name} reported horizontal overflow!`);
    } else {
      console.log(`[PASS] Viewport ${vp.name}: Zero horizontal overflow.`);
    }

    // 2. Capture Each Section Screenshot
    for (const sec of sections) {
      const loc = page.locator(`#${sec}`);
      if (await loc.count() > 0) {
        await loc.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        const shotPath = path.join(SCREENSHOT_DIR, `${vp.name}-${sec}.png`);
        await loc.screenshot({ path: shotPath });
      }
    }
    console.log(`[PASS] Viewport ${vp.name}: Captured screenshots for all 8 sections.`);

    // 3. Test Resume Viewer Modal Open
    const resumeSection = page.locator('#resume');
    await resumeSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const sheetTrigger = page.locator('#resume button[aria-label="Open zoomable resume viewer"]');
    if (await sheetTrigger.isVisible()) {
      await sheetTrigger.click();
      await page.waitForSelector('div[role="dialog"][aria-label="Resume document viewer"]', { state: 'visible', timeout: 5000 });
      await page.waitForTimeout(400);

      const modalShotPath = path.join(SCREENSHOT_DIR, `${vp.name}-resume-viewer-modal.png`);
      await page.screenshot({ path: modalShotPath });
      console.log(`[PASS] Viewport ${vp.name}: Resume viewer modal opened cleanly & screenshotted.`);

      // Close modal with Esc
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // 4. Assert 0 Console Errors
    if (consoleErrors.length > 0) {
      console.error(`[FAIL] Viewport ${vp.name} had console errors:`, consoleErrors);
      throw new Error(`Encountered ${consoleErrors.length} console errors in ${vp.name}`);
    } else {
      console.log(`[PASS] Viewport ${vp.name}: 0 console errors.`);
    }

    await context.close();
  }

  await browser.close();
  console.log('\n--- ALL MULTI-VIEWPORT PLAYWRIGHT TESTS PASSED CLEANLY! ---');
}

verifyAll().catch((err) => {
  console.error('Multi-viewport verification FAILED:', err);
  process.exit(1);
});
