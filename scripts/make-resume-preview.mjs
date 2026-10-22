import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const pdfPath = resolve(rootDir, 'public', 'Rohan_Sai_Jagan_Resume.pdf');
const shaPath = resolve(rootDir, 'scripts', 'resume.sha256');

if (!existsSync(pdfPath)) {
  console.error(`ERROR: Resume PDF not found at ${pdfPath}`);
  process.exit(1);
}

// 1. Verify SHA-256 matches the pristine original exactly
const pdfBytes = readFileSync(pdfPath);
const actualSha = createHash('sha256').update(pdfBytes).digest('hex');

if (existsSync(shaPath)) {
  const expectedSha = readFileSync(shaPath, 'utf-8').trim();
  if (actualSha !== expectedSha) {
    console.error('CRITICAL ERROR: public/Rohan_Sai_Jagan_Resume.pdf SHA-256 mismatch!');
    console.error(`Expected: ${expectedSha}`);
    console.error(`Actual:   ${actualSha}`);
    console.error('The resume PDF MUST NOT be edited, regenerated or modified.');
    process.exit(1);
  }
  console.log(`✓ SHA-256 verified (${actualSha.slice(0, 8)}... unchanged: true)`);
}

// 2. Render preview WebP images (1600px and 900px widths)
const renderPy = `
import pypdfium2 as pdfium
import os
from PIL import Image

pdf_path = os.path.join("public", "Rohan_Sai_Jagan_Resume.pdf")
out_dir = os.path.join("public", "resume")
os.makedirs(out_dir, exist_ok=True)

pdf = pdfium.PdfDocument(pdf_path)
for i, page in enumerate(pdf):
    page_num = i + 1
    width_pt, height_pt = page.get_size()
    scale_1600 = 1600.0 / width_pt
    scale_900 = 900.0 / width_pt
    
    img_1600 = page.render(scale=scale_1600).to_pil()
    img_900 = page.render(scale=scale_900).to_pil()
    
    img_1600.save(os.path.join(out_dir, f"page-{page_num}-1600.webp"), "WEBP", quality=95)
    img_900.save(os.path.join(out_dir, f"page-{page_num}-900.webp"), "WEBP", quality=95)
    img_1600.save(os.path.join(out_dir, f"page-{page_num}.webp"), "WEBP", quality=95)
    if page_num == 1:
        img_1600.save(os.path.join("public", "resume-preview.png"), "PNG")

print(f"Rendered {len(pdf)} page(s) to public/resume/ at 1600px and 900px.")
`;

console.log('Rendering resume preview pages (read-only)...');
try {
  const output = execSync('python -c "' + renderPy.replace(/"/g, '\\"') + '"', {
    cwd: rootDir,
    encoding: 'utf-8',
  });
  console.log(output.trim());
} catch (err) {
  console.error('Failed to render preview images:', err.message);
  process.exit(1);
}
