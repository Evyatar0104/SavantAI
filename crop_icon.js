const Jimp = require('jimp');

async function cropIcon() {
  try {
    const inputPath = 'c:/Users/evyat/OneDrive/Desktop/Savant/src/app/icon.png';
    const outputPath = 'c:/Users/evyat/OneDrive/Desktop/Savant/src/app/icon.png';
    
    console.log('Loading image...');
    const image = await Jimp.read(inputPath);
    
    console.log('Autocropping...');
    image.autocrop();
    
    const width = image.getWidth();
    const height = image.getHeight();
    const size = Math.max(width, height);
    
    // Create square with 3% margin to ensure glow is preserved
    const margin = Math.round(size * 0.03);
    const finalSize = size + margin * 2;
    
    const square = new Jimp(finalSize, finalSize, 0x00000000);
    square.composite(image, (finalSize - width) / 2, (finalSize - height) / 2);
    
    console.log('Writing image...');
    await square.writeAsync(outputPath);
    console.log('Successfully cropped icon.');
  } catch (err) {
    console.error('Error cropping icon:', err);
    process.exit(1);
  }
}

cropIcon();
