import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const viewports = [
    { name: '1440', width: 1440, height: 900 },
    { name: '1024', width: 1024, height: 768 },
    { name: '390', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.addInitScript(() => {
      sessionStorage.setItem('rohan_portfolio_overture', 'true');
      localStorage.setItem('rohan_portfolio_motion', 'full');
    });
    await page.goto('http://localhost:3000/#home', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/home-' + vp.name + '.png' });
    await page.close();
  }

  await browser.close();
  console.log('Screenshots at 1440, 1024, 390 saved successfully');
})();
