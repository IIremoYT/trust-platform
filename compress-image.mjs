import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, 'public', 'shield.png');
const outputPath = join(__dirname, 'public', 'shield.webp');

sharp(inputPath)
  .resize(900, null, { withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 })
  .toFile(outputPath)
  .then(info => {
    console.log('Compressed successfully:', info);
  })
  .catch(err => {
    console.error('Error:', err);
  });
