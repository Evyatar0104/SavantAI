const Jimp = require('jimp');

console.log('Jimp keys:', Object.keys(Jimp));

async function run() {
  try {
    const img = await Jimp.read('c:/Users/evyat/OneDrive/Desktop/Savant/src/app/icon.png');
    img.autocrop();
    await img.writeAsync('c:/Users/evyat/OneDrive/Desktop/Savant/src/app/icon.png');
    console.log('DONE');
  } catch(e) { console.error(e); }
}
run();
