import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();

await page.goto(`file://${process.cwd()}/.github/generate/workflow-graph-app/build/index.html`, {
  waitUntil: 'networkidle0'
});
await page.screenshot({ path: '.github/generate/workflow_diagram.png' });

await browser.close();
