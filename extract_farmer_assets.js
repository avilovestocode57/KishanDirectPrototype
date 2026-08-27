import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('farmer_stitch_screens');
const urlSet = new Set();

for (const file of files) {
  const content = fs.readFileSync(path.join('farmer_stitch_screens', file), 'utf-8');
  const matches = content.match(/https:\/\/lh3\.googleusercontent\.com\/[^\s"'<>]+/g);
  if (matches) {
    matches.forEach(url => urlSet.add(url));
  }
}

console.log(`Found ${urlSet.size} unique Google image URLs in Stitch farmer screens.`);

const urlArray = Array.from(urlSet);
const mapping = {};

async function downloadAll() {
  let idx = 1;
  for (const url of urlArray) {
    const filename = `farmer-asset-${idx}.png`;
    const dest = path.join('src', 'assets', filename);
    console.log(`[${idx}/${urlArray.length}] Downloading ${url.slice(0, 60)}...`);
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buffer);
        mapping[url] = `./assets/${filename}`;
        console.log(`  -> Saved ${filename} (${buffer.length} bytes)`);
      } else {
        console.log(`  -> HTTP error ${res.status}`);
      }
    } catch (e) {
      console.log(`  -> Error: ${e.message}`);
    }
    idx++;
  }

  fs.writeFileSync('farmer_asset_mapping.json', JSON.stringify(mapping, null, 2));
  console.log('Saved farmer_asset_mapping.json');
}

downloadAll().catch(console.error);
