const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = path.join(__dirname, '../public/logo.png');
const iconsDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [16, 32, 48, 180, 192, 512];

async function generateIcons() {
    console.log('Generating resized icons...');
    for (const size of sizes) {
        let outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
        
        if (size === 192 || size === 512) {
            outputPath = path.join(iconsDir, `pwa-${size}x${size}.png`);
        }
        if (size === 180) {
            outputPath = path.join(iconsDir, `apple-touch-icon.png`);
        }
        
        await sharp(inputImagePath)
            .resize(size, size, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 0 }
            })
            .toFile(outputPath);
            
        console.log(`Generated: ${outputPath}`);
    }
    
    // Copy the logo.png as an icon reference
    const faviconPath = path.join(__dirname, '../public/favicon.ico');
    await sharp(inputImagePath).resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).toFile(faviconPath);
    console.log(`Generated: ${faviconPath}`);
}

generateIcons().catch(err => {
    console.error('Error generating icons:', err);
    process.exit(1);
});
