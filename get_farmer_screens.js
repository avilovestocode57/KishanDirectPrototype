import fs from 'fs';

const screens = [
  { name: 'Farmer Dashboard', id: '41609542ea614fcaa1ed84d12fde7bd0' },
  { name: 'Enterprise Requirements', id: '357c8e9eadec431198609784a41ae0a1' },
  { name: 'My Shop', id: 'c10efc3af9e648c786cce23863d1c85b' },
  { name: 'Product Management', id: 'c53f9823158941529c91a781c223b85b' },
  { name: 'Add Product', id: '2c8e59a55bb7412aa396983476847cdc' },
  { name: 'Orders', id: 'cd62328393f4444e9ec6eab1c3f46c5a' },
  { name: 'Farmer Profile', id: 'd59d362901654e5ba519d123bf0dd864' },
];

async function callMcp(method, params = {}) {
  const res = await fetch("https://stitch.googleapis.com/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      "X-Goog-Api-Key": process.env.GCP_API_KEY || ''
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params
    })
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

async function main() {
  if (!fs.existsSync("farmer_stitch_screens")) {
    fs.mkdirSync("farmer_stitch_screens");
  }

  for (const screen of screens) {
    console.log(`Fetching screen info: ${screen.name} (${screen.id})...`);
    const screenRes = await callMcp("tools/call", {
      name: "get_screen",
      arguments: {
        name: `projects/2588230859836268722/screens/${screen.id}`
      }
    });

    const struct = screenRes.result?.structuredContent || {};
    const downloadUrl = struct.htmlCode?.downloadUrl;
    
    if (downloadUrl) {
      console.log(`Downloading HTML for ${screen.name}...`);
      const htmlRes = await fetch(downloadUrl);
      const htmlText = await htmlRes.text();
      const filename = screen.name.toLowerCase().replace(/ /g, '_') + '.html';
      fs.writeFileSync(`farmer_stitch_screens/${filename}`, htmlText);
      console.log(`Saved farmer_stitch_screens/${filename} (${htmlText.length} bytes)`);
    } else {
      console.log(`No downloadUrl found for ${screen.name}`, screenRes);
    }
  }
}

main().catch(console.error);
