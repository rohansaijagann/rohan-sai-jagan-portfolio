import { chromium } from 'playwright';

async function testCube() {
  console.log('Starting Playwright Rubik\'s Cube Automation Test...');

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

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
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

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  try {
    const boot = page.locator('#boot-screen');
    if (await boot.isVisible({ timeout: 500 })) await boot.click();
  } catch {}

  // Wait for Rubik's cube to mount in DOM
  const sceneSelector = '#rubik-cube-scene';
  await page.waitForSelector(sceneSelector, { state: 'attached', timeout: 10000 });
  await page.locator(sceneSelector).scrollIntoViewIfNeeded();
  await page.waitForSelector('#rubik-scramble-btn', { state: 'visible', timeout: 8000 });

  // Wait for model on window
  await page.waitForFunction(() => {
    return window.__RUBIK_MODEL__ && (typeof window.__RUBIK_MODEL__.isSolved === 'boolean' || typeof window.__RUBIK_MODEL__.isSolved === 'function');
  }, { timeout: 8000 });

  const getSolved = () => page.evaluate(() => {
    const m = window.__RUBIK_MODEL__;
    return typeof m.isSolved === 'function' ? m.isSolved() : m.isSolved;
  });

  const getBusy = () => page.evaluate(() => {
    const m = window.__RUBIK_MODEL__;
    return typeof m.isBusy === 'function' ? m.isBusy() : m.isBusy;
  });

  // 1. Initial State Assert
  const initialSolved = await getSolved();
  console.log(`Initial Cube isSolved: ${initialSolved}`);
  if (initialSolved !== true) {
    throw new Error(`Expected initial cube state to be solved, got ${initialSolved}`);
  }

  const initialShot = await page.locator(sceneSelector).screenshot();
  console.log(`Captured initial screenshot (${initialShot.length} bytes).`);

  // 2. Click Scramble
  console.log('Clicking Scramble button (20 random moves)...');
  await page.click('#rubik-scramble-btn');

  // Wait for scramble to finish (queue to empty)
  console.log('Waiting for scramble execution to finish...');
  await page.waitForFunction(() => {
    const m = window.__RUBIK_MODEL__;
    if (!m) return false;
    const busy = typeof m.isBusy === 'function' ? m.isBusy() : m.isBusy;
    const solved = typeof m.isSolved === 'function' ? m.isSolved() : m.isSolved;
    return !busy && !solved;
  }, { timeout: 8000 });

  const postScrambleSolved = await getSolved();
  console.log(`Post-scramble Cube isSolved: ${postScrambleSolved}`);
  if (postScrambleSolved !== false) {
    throw new Error('Expected cube to NOT be solved after scramble!');
  }

  const scrambledShot = await page.locator(sceneSelector).screenshot();
  console.log(`Captured scrambled screenshot (${scrambledShot.length} bytes).`);

  const shotsIdentical = initialShot.equals(scrambledShot);
  if (shotsIdentical) {
    throw new Error('Scramble visual test failed: Screenshot did not change after scramble!');
  }
  console.log('Visual screenshot diff confirmed: Cube rotated cubies visibly.');

  // 3. Click Solve
  console.log('Clicking Solve button (replaying inverse move sequence)...');
  await page.waitForSelector('#rubik-solve-btn:not([disabled])', { timeout: 4000 });
  const solveStartTime = Date.now();
  await page.click('#rubik-solve-btn');

  // Wait up to 6s for cube to return to identity
  console.log('Waiting for cube to reach solved identity within 6s...');
  await page.waitForFunction(() => {
    const m = window.__RUBIK_MODEL__;
    if (!m) return false;
    return typeof m.isSolved === 'function' ? m.isSolved() : m.isSolved;
  }, { timeout: 6000 });

  const solveElapsedMs = Date.now() - solveStartTime;
  console.log(`Cube reached identity in ${solveElapsedMs}ms! (Spec allows up to 6000ms)`);

  // Verify final identity
  const finalSolved = await getSolved();
  if (finalSolved !== true) {
    throw new Error('Cube failed to reach identity state!');
  }

  // 4. Verify 0 console errors
  console.log(`Console error count during test: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console errors encountered:', consoleErrors);
    throw new Error(`Encountered ${consoleErrors.length} console errors during test.`);
  }

  await browser.close();
  console.log('ALL PLAYWRIGHT RUBIK\'S CUBE TESTS PASSED CLEANLY!');
}

testCube().catch((err) => {
  console.error('Playwright Cube Test FAILED:', err);
  process.exit(1);
});
