import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const sourceIcon = path.join(projectRoot, 'src', 'app', 'icon.png');
const publicDir = path.join(projectRoot, 'public');

async function main() {
  try {
    // Generate a clean transparent PNG for the web favicon
    await sharp(sourceIcon)
      .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'favicon-transparent.png'));

    console.log('✅ Generated transparent web favicon');
  } catch (error) {
    console.error('Error generating web favicon:', error);
    process.exit(1);
  }
}

main();
