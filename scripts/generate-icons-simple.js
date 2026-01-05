const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcon(size) {
  // Create a simple gradient background using compositing
  const blue = { r: 59, g: 130, b: 246 };
  const darkBlue = { r: 30, g: 64, b: 175 };

  // Create a solid color image
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad1)"/>
      <!-- Calendar -->
      <rect x="${size * 0.15}" y="${size * 0.25}" width="${size * 0.7}" height="${size * 0.55}" rx="${size * 0.04}" fill="white"/>
      <!-- Header -->
      <rect x="${size * 0.15}" y="${size * 0.25}" width="${size * 0.7}" height="${size * 0.15}" rx="${size * 0.04}" fill="#DBEAFE"/>
      <!-- Holes -->
      <circle cx="${size * 0.35}" cy="${size * 0.325}" r="${size * 0.05}" fill="white"/>
      <circle cx="${size * 0.65}" cy="${size * 0.325}" r="${size * 0.05}" fill="white"/>
      <!-- Checkmark -->
      <path d="M ${size * 0.35} ${size * 0.5} L ${size * 0.45} ${size * 0.6} L ${size * 0.65} ${size * 0.4}" stroke="#3B82F6" stroke-width="${size * 0.05}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `;

  const buffer = Buffer.from(svg);
  const pngBuffer = await sharp(buffer)
    .png()
    .toBuffer();

  return pngBuffer;
}

async function generateIcons() {
  const sizes = [192, 512];
  const publicDir = path.join(__dirname, '../public');

  for (const size of sizes) {
    const pngBuffer = await generateIcon(size);
    fs.writeFileSync(path.join(publicDir, `icon-${size}.png`), pngBuffer);
    console.log(`Generated icon-${size}.png`);
  }

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
