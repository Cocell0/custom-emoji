const fs = require('fs');
const path = require('path');
const axios = require('axios');
const countTime = require('./count-time.js');

const startTime = Date.now();

console.log('=== download started ===');

const outputDir = './emojis/';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function getList() {
  return new Promise((resolve, reject) => {
    fs.readFile('list.txt', 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data.split('\n').map(line => line.trim()).filter(line => line));
    });
  });
}

function parse(item) {
  const match = item.match(/(\S+)\s*=\s*(\S+)(?=\.(\w+)\b)/);
  return match ? {
    name: match[1],
    filename: match[1] + '.' + match[3],
    address: match[2] + '.' + match[3],
    extension: match[3]
  } : null;
}

(async () => {
  const list = await getList();
  const pLimit = (await import('p-limit')).default;
  const dir = './emojis/';
  const limit = pLimit(22);
  let serial = 0;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await Promise.all(
    list.map((item) =>
      limit(async () => {
        const data = parse(item);
        const startTime = Date.now();
        serial++;
        if (data) {
          const filePath = path.join(dir, data.filename);
          try {
            const response = await axios.get(data.address, { responseType: 'arraybuffer' });
            fs.writeFileSync(filePath, response.data);
            console.log(`Downloaded in ${countTime(startTime)}: ${data.name}.`);
          } catch (error) {
            console.error(`Failed to download ${data.name}:`, error.message);
          }
        }
      })
    )
  );

  console.log(`=== ${serial} Download fiinished in ${countTime(startTime)} ===`);
})();