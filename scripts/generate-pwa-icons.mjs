import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const sourceIcon = path.join(projectRoot, 'src', 'app', 'icon.png');
const iconsDir = path.join(projectRoot, 'public', 'icons');
const publicDir = path.join(projectRoot, 'public');

async function generateIcon(outputPath, size, padding = 0) {
  // Calculate the icon size within the canvas (with padding for maskable)
  const iconSize = size - padding * 2;

  // Resize the brain icon
  const resizedIcon = await sharp(sourceIcon)
    .resize(iconSize, iconSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Create a black background and composite the icon on top
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 255 }
    }
  })
    .composite([{
      input: resizedIcon,
      top: padding,
      left: padding,
    }])
    .png()
    .toFile(outputPath);

  console.log(`✅ Generated: ${path.basename(outputPath)} (${size}x${size})`);
}

async function main() {
  try {
    // Generate standard icons (brain fills most of the canvas)
    await generateIcon(path.join(iconsDir, 'icon-192.png'), 192, 16);
    await generateIcon(path.join(iconsDir, 'icon-512.png'), 512, 40);

    // Generate maskable icon with extra padding (safe zone is ~80% of canvas)
    // For a 512px maskable icon, safe zone is ~410px, so padding is ~51px
    await generateIcon(path.join(iconsDir, 'icon-maskable.png'), 512, 80);

    // Generate apple touch icon (180x180 is standard)
    await generateIcon(path.join(iconsDir, 'apple-touch-icon.png'), 180, 16);

    // Also update the root-level icons  
    await generateIcon(path.join(publicDir, 'icon-192x192.png'), 192, 16);
    await generateIcon(path.join(publicDir, 'icon-512x512.png'), 512, 40);

    console.log('\n🎉 All PWA icons generated with solid black background!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

main();
