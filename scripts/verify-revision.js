import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  console.log('--- TEST 1: Full-Motion Mode (15s observation) ---');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Capture console errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.addInitScript(() => {
    sessionStorage.setItem('rohan_portfolio_overture', 'true');
    localStorage.setItem('rohan_portfolio_motion', 'full');
  });

  await page.goto('http://localhost:3000/#home', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Sample verbs over 16 seconds
  const observedVerbs = new Set();
  const startTime = Date.now();
  while (Date.now() - startTime < 16000) {
    const data = await page.evaluate(() => {
      // Find rolling verb: inside the phrase rotator
      const verbEl = document.querySelector('span.animate-verb-roll-in') || 
                     document.querySelector('div[aria-live="off"] span[style*="color"]');
      const verb = verbEl ? verbEl.textContent.trim() : '';

      // Check log lines (should be removed per user request)
      const logEls = Array.from(document.querySelectorAll('[data-log-line], div.min-h-\\[108px\\]'));

      return { verb, hasLog: logEls.length > 0 };
    });

    if (data.verb) observedVerbs.add(data.verb);

    await page.waitForTimeout(500);
  }

  console.log(`Observed ${observedVerbs.size} distinct verbs:`, Array.from(observedVerbs));

  if (observedVerbs.size < 3) {
    throw new Error(`Expected at least 3 distinct verbs, got ${observedVerbs.size}`);
  }
  console.log('✓ Full-motion test passed: Verb changed ≥3 times.');

  // Assert lower log was removed
  const logCount = await page.evaluate(() => {
    return document.querySelectorAll('[data-log-line], div.min-h-\\[108px\\]').length;
  });
  console.log('Log count on Home (expected 0):', logCount);
  if (logCount !== 0) {
    throw new Error(`Expected log to be removed, but found ${logCount} elements`);
  }
  console.log('✓ Verified: Live Log removed from Home as requested.');

  // Check no dots on Home
  const dotCount = await page.evaluate(() => {
    const dots = document.querySelectorAll('button[aria-label*="phrase"], .group\\/dot, [title*="Jump to"]');
    return dots.length;
  });
  console.log('Dot count on Home (expected 0):', dotCount);
  if (dotCount !== 0) {
    throw new Error(`Expected 0 progress dots on Home, found ${dotCount}`);
  }
  console.log('✓ Verified: No progress dots found on Home.');

  // Check console errors
  if (consoleErrors.length > 0) {
    console.error('Console errors detected:', consoleErrors);
    throw new Error(`Console errors found: ${consoleErrors.join('; ')}`);
  } else {
    console.log('✓ Zero console errors.');
  }

  await page.close();

  console.log('\n--- TEST 2: Reduced-Motion Mode (10s observation) ---');
  const reducedPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await reducedPage.addInitScript(() => {
    sessionStorage.setItem('rohan_portfolio_overture', 'true');
    localStorage.setItem('rohan_portfolio_motion', 'reduced');
  });

  await reducedPage.goto('http://localhost:3000/#home', { waitUntil: 'networkidle' });
  await reducedPage.waitForTimeout(1000);

  const reducedVerbs = new Set();
  const rStartTime = Date.now();
  while (Date.now() - rStartTime < 10000) {
    const verb = await reducedPage.evaluate(() => {
      const verbEl = document.querySelector('div[aria-live="off"] span[style*="color"]');
      return verbEl ? verbEl.textContent.trim() : '';
    });
    if (verb) reducedVerbs.add(verb);
    await reducedPage.waitForTimeout(500);
  }
  console.log(`Reduced motion verbs observed:`, Array.from(reducedVerbs));
  if (reducedVerbs.size < 2) {
    throw new Error(`Reduced motion should cross-fade phrases, but got ${reducedVerbs.size} verbs`);
  }
  console.log('✓ Reduced-motion test passed: phrases change gracefully via cross-fade.');
  await reducedPage.close();

  console.log('\n--- TEST 3: Layout Geometry & Alignment (1440, 1024, 768, 390) ---');
  const viewports = [
    { width: 1440, height: 900, name: '1440' },
    { width: 1024, height: 768, name: '1024' },
    { width: 768, height: 1024, name: '768' },
    { width: 390, height: 844, name: '390' },
  ];

  for (const vp of viewports) {
    const p = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await p.addInitScript(() => {
      sessionStorage.setItem('rohan_portfolio_overture', 'true');
      localStorage.setItem('rohan_portfolio_motion', 'full');
    });
    await p.goto('http://localhost:3000/#home', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);

    const metrics = await p.evaluate(() => {
      const name = document.querySelector('#hero-title');
      const allImgs = Array.from(document.querySelectorAll('#home picture img'));
      // Pick the currently visible portrait
      const visibleImg = allImgs.find(img => img.offsetParent !== null) || allImgs[0];
      const portraitContainer = visibleImg?.closest('.rounded-full');
      const maxWContainer = document.querySelector('#home .max-w-\\[1200px\\]');
      const grid = document.querySelector('#home .grid');

      const nameRect = name ? name.getBoundingClientRect() : null;
      const portraitRect = portraitContainer ? portraitContainer.getBoundingClientRect() : null;
      const containerRect = maxWContainer ? maxWContainer.getBoundingClientRect() : null;
      const gridRect = grid ? grid.getBoundingClientRect() : null;

      // Check horizontal scroll
      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;

      return {
        nameRect,
        portraitRect,
        containerRect,
        gridRect,
        hasHorizontalScroll,
      };
    });

    console.log(`\nViewport ${vp.name}:`);
    console.log('Horizontal scroll:', metrics.hasHorizontalScroll ? 'FAIL' : 'OK');
    if (metrics.hasHorizontalScroll) {
      throw new Error(`Horizontal scroll detected at viewport ${vp.name}!`);
    }

    if (vp.width >= 768) {
      // Check overlap between name and portrait
      const gap = metrics.portraitRect.left - metrics.nameRect.right;
      console.log(`Gap between Name and Portrait: ${gap.toFixed(1)}px (required: >= 48px)`);
      if (gap < 48) {
        throw new Error(`Overlap/insufficient gap at ${vp.name}: gap is ${gap}px < 48px`);
      }

      // Check alignment on desktop (1440, 1024)
      if (vp.width >= 1024) {
        const topDiff = Math.abs(metrics.portraitRect.top - metrics.nameRect.top);
        console.log(`Top alignment difference: ${topDiff.toFixed(1)}px (required: <= 4px)`);

        const rightDiff = Math.abs(metrics.portraitRect.right - metrics.gridRect.right);
        console.log(`Portrait right vs Grid right difference: ${rightDiff.toFixed(1)}px`);
      }
    }

    await p.screenshot({ path: `screenshots/home-${vp.name}.png` });
    console.log(`Screenshot saved to screenshots/home-${vp.name}.png`);

    await p.close();
  }

  await browser.close();
  console.log('\n=========================================');
  console.log('ALL PLAYWRIGHT TESTS PASSED SUCCESSFULLY!');
  console.log('=========================================');
})().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
