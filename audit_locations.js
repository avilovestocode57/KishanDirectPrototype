import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('farmer_stitch_screens');
const forbidden = [
  'mumbai', 'delhi', 'pune', 'bangalore', 'bengaluru', 'hyderabad', 'gujarat', 
  'maharashtra', 'karnataka', 'punjab', 'haryana', 'chennai', 'jaipur', 'ahmedabad', 
  'surat', 'noida', 'gurgaon', 'chandigarh', 'indore', 'bhopal', 'lucknow', 'kanpur'
];

for (const file of files) {
  const content = fs.readFileSync(path.join('farmer_stitch_screens', file), 'utf-8');
  console.log(`\n=== Checking ${file} ===`);
  forbidden.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    let match;
    while ((match = regex.exec(content)) !== null) {
      console.log(`Found non-WB location "${match[0]}" in ${file} at char ${match.index}`);
    }
  });
}
