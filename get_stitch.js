import fs from 'fs';

async function main() {
  const downloadUrl = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YTBjNTFlNmM1ZWEwMWE2MmU0M2FhMjI0ZDE0EgsSBxCDlrzsjw0YAZIBIwoKcHJvamVjdF9pZBIVQhMyNTg4MjMwODU5ODM2MjY4NzIy&filename=&opi=89354086";
  console.log("Downloading HTML code from Stitch...");
  const res = await fetch(downloadUrl);
  const text = await res.text();
  fs.writeFileSync("stitch_code.html", text);
  console.log(`Saved stitch_code.html (${text.length} bytes)`);
}

main().catch(console.error);
