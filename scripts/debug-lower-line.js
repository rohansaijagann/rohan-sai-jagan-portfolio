import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    sessionStorage.setItem('rohan_portfolio_overture', 'true');
    localStorage.setItem('rohan_portfolio_motion', 'full');
  });
  await page.goto('http://localhost:3000/#home');
  await page.waitForTimeout(3000);
  
  const result = await page.evaluate(() => {
    const srOnly = document.querySelectorAll('span.sr-only');
    const srTexts = Array.from(srOnly).map(s => s.textContent);
    const divs = Array.from(document.querySelectorAll('div[aria-live="off"]')).map(d => d.textContent);
    return { srTexts, divs };
  });
  
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
