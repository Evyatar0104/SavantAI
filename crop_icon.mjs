import Jimp from 'jimp';
import path from 'path';

async function cropIcon() {
  try {
    const inputPath = 'c:/Users/evyat/OneDrive/Desktop/Savant/src/app/icon.png';
    const outputPath = 'c:/Users/evyat/OneDrive/Desktop/Savant/src/app/icon.png';
    
    const image = await Jimp.read(inputPath);
    
    // Autocrop transparency
    image.autocrop();
    
    // Add a tiny bit of padding (e.g. 5%) to avoid cutting off glows
    const width = image.getWidth();
    const height = image.getHeight();
    const size = Math.max(width, height);
    
    // Create a new square image with a small margin
    const margin = Math.round(size * 0.05);
    const finalSize = size + margin * 2;
    
    const square = new Jimp(finalSize, finalSize, 0x00000000);
    square.composite(image, (finalSize - width) / 2, (finalSize - height) / 2);
    
    await square.writeAsync(outputPath);
    console.log('Successfully cropped icon.');
  } catch (err) {
    console.error('Error cropping icon:', err);
    process.exit(1);
  }
}

cropIcon();
