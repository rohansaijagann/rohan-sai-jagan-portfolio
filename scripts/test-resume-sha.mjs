import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const pdfPath = path.join(root, 'public', 'Rohan_Sai_Jagan_Resume.pdf');
const shaPath = path.join(root, 'scripts', 'resume.sha256');

if (!fs.existsSync(pdfPath)) {
  console.error('FAIL: Resume PDF not found at', pdfPath);
  process.exit(1);
}

if (!fs.existsSync(shaPath)) {
  console.error('FAIL: scripts/resume.sha256 not found');
  process.exit(1);
}

const expectedSha = fs.readFileSync(shaPath, 'utf8').trim();
const pdfBuffer = fs.readFileSync(pdfPath);
const actualSha = crypto.createHash('sha256').update(pdfBuffer).digest('hex');

if (actualSha !== expectedSha) {
  console.error(`FAIL: Resume SHA-256 mismatch!`);
  console.error(`Expected: ${expectedSha}`);
  console.error(`Actual:   ${actualSha}`);
  process.exit(1);
}

// Also verify preview images exist
const previews = [
  path.join(root, 'public', 'resume', 'page-1.webp'),
  path.join(root, 'public', 'resume', 'page-1-1600.webp'),
  path.join(root, 'public', 'resume', 'page-1-900.webp'),
];

for (const p of previews) {
  if (!fs.existsSync(p)) {
    console.error(`FAIL: Preview file missing: ${p}`);
    process.exit(1);
  }
}

console.log('PASS: Resume PDF SHA-256 matches expected untouched original hash:');
console.log(`SHA-256: ${actualSha}`);
console.log('unchanged: true');
