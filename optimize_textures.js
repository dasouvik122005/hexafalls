const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const texturesDir = path.join(__dirname, 'public', 'textures');

async function optimize() {
  const files = fs.readdirSync(texturesDir).filter(f => f.endsWith('.png'));
  for (const file of files) {
    const inputPath = path.join(texturesDir, file);
    const outputPath = path.join(texturesDir, file.replace('.png', '.webp'));
    console.log(`Converting ${file}...`);
    await sharp(inputPath)
      .webp({ quality: 60 }) // High compression for textures
      .toFile(outputPath);
    console.log(`Saved ${outputPath}`);
  }
}

optimize().catch(console.error);
