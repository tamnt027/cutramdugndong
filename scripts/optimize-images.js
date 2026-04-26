// One-shot script: resize + recompress images in public/img/site
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('public/img/site');

const presets = {
  hero: { width: 1600, quality: 78 },
  products: { width: 800, quality: 80 },
  activities: { width: 1200, quality: 75 },
  news: { width: 800, quality: 80 },
};

async function processDir(dir, preset) {
  const full = path.join(ROOT, dir);
  const files = await fs.readdir(full);
  for (const f of files) {
    if (!/\.(jpe?g|png)$/i.test(f)) continue;
    const filePath = path.join(full, f);
    const tmp = filePath + '.tmp';
    const before = (await fs.stat(filePath)).size;
    await sharp(filePath)
      .rotate()
      .resize({ width: preset.width, withoutEnlargement: true })
      .jpeg({ quality: preset.quality, mozjpeg: true })
      .toFile(tmp);
    await fs.rename(tmp, filePath.replace(/\.png$/i, '.jpg'));
    if (filePath.endsWith('.png')) await fs.unlink(filePath).catch(() => {});
    const after = (await fs.stat(filePath.replace(/\.png$/i, '.jpg'))).size;
    console.log(`  ${dir}/${f}: ${(before/1024).toFixed(0)}K -> ${(after/1024).toFixed(0)}K`);
  }
}

for (const [dir, preset] of Object.entries(presets)) {
  console.log(`== ${dir} ==`);
  await processDir(dir, preset);
}
console.log('Done.');
