import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const bannedTerms = [
  'internship',
  'intern',
  'entry-level',
  'open to',
  'available',
  'looking for',
  'seeking',
  'student',
  'third-year',
  '3rd year',
  'fresher',
  'hire me',
  'contribute from day one',
  'é',
  'passionate',
  'leverage',
  'seamless',
  'synergy',
  'world-class',
  'robust',
  'cutting-edge',
  'guru',
  'ninja',
  'rockstar',
  'arsenal',
  'production-grade',
  'architected',
  'architecting',
  '1,420',
  '0.94',
  '98.2',
  '45+',
  '10K',
  '200+',
  'four projects',
  'four things',
];

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    if (['node_modules', '.git', 'dist', 'coverage', 'scripts'].includes(item)) continue;
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (/\.(tsx?|jsx?|html|json)$/.test(item)) {
      files.push(full);
    }
  }
  return files;
}

const files = walk(path.join(root, 'src')).concat([path.join(root, 'index.html')]);

let violations = [];

for (const file of files) {
  const rel = path.relative(root, file);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, lineIdx) => {
    // Ignore internal code comments that are not part of user UI
    const lower = line.toLowerCase();
    for (const term of bannedTerms) {
      // Use word boundaries or substring depending on term
      let regex;
      if (term === 'é') {
        regex = /é/i;
      } else if (term === 'intern') {
        // match 'intern' as whole word or in 'internship', but not internal like 'internal'
        regex = /\b(intern|interns|internship)\b/i;
      } else {
        regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      }

      if (regex.test(line)) {
        // Special case: ignore internal variables or node_modules if any
        violations.push({
          file: rel,
          line: lineIdx + 1,
          term,
          content: line.trim(),
        });
      }
    }
  });
}

if (violations.length > 0) {
  console.error(`Found ${violations.length} banned term violations:`);
  violations.forEach((v) => {
    console.error(`- [${v.term}] ${v.file}:${v.line} -> "${v.content}"`);
  });
  process.exit(1);
} else {
  console.log(`PASS: Zero banned terms found across ${files.length} site source files!`);
}
