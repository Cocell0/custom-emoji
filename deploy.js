const playwright = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await playwright.chromium.launch({
    "headless": false,
    "args": [
      "--start-maximized",
      "--force-dark-mode",
      "--enable-features=WebContentsForceDark",
      "--user-agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.138 Safari/537.36'",
      "--lang=en-US",
      "--disable-features=FileSystemAccess"
    ]
  });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  await page.goto('https://perchance.org/upload');

  page.on('dialog', dialog => dialog.accept());

  const frameElement = await page.waitForSelector('iframe');
  const frame = await frameElement.contentFrame();

  await frame.waitForSelector('#expiresSelectEl');
  await frame.selectOption('#expiresSelectEl', '86400000');

  const list = path.resolve('./list.txt');

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    frame.click('#dropzoneEl')
  ]);

  await fileChooser.setFiles(list);

  await frame.waitForFunction(() => {
    const displayFormattedFileListButtonCtn = document.getElementById('displayFormattedFileListButtonCtn');
    return displayFormattedFileListButtonCtn && displayFormattedFileListButtonCtn.style.display !== 'none';
  })

  await browser.close();
})();