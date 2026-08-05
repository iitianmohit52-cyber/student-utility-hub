const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to generate a simple placeholder SVG
function generateSvg(size, text) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <rect width="${size}" height="${size}" fill="#238636" rx="${size * 0.2}" />
        <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="${size * 0.3}" font-weight="bold" fill="#ffffff" dominant-baseline="middle" text-anchor="middle">${text || size}</text>
    </svg>`;
}

sizes.forEach(size => {
    fs.writeFileSync(path.join(outputDir, `icon-${size}x${size}.svg`), generateSvg(size, size));
});

// Maskable icon
fs.writeFileSync(path.join(outputDir, 'icon-maskable.svg'), generateSvg(512, 'M'));

// Apple Touch Icon
fs.writeFileSync(path.join(outputDir, 'apple-touch-icon.svg'), generateSvg(180, 'Apple'));

console.log('Icons generated successfully.');
