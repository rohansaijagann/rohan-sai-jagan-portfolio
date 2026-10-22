import { chromium } from 'playwright';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1440 Viewport
  const ctx1440 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx1440.addInitScript(() => sessionStorage.setItem('rohan_portfolio_overture', 'true'));
  const page1440 = await ctx1440.newPage();
  await page1440.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page1440.waitForTimeout(1200);
  await page1440.locator('#home').screenshot({ path: path.resolve('screenshots/part-a-home-1440.png') });
  await ctx1440.close();

  // 390 Viewport
  const ctx390 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx390.addInitScript(() => sessionStorage.setItem('rohan_portfolio_overture', 'true'));
  const page390 = await ctx390.newPage();
  await page390.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page390.waitForTimeout(1200);
  await page390.locator('#home').screenshot({ path: path.resolve('screenshots/part-a-home-390.png') });
  await ctx390.close();

  await browser.close();
  console.log('Part A screenshots captured.');
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});
