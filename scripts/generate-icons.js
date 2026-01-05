const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#3B82F6');
  gradient.addColorStop(1, '#1E40AF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Rounded corners
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  // Calendar body
  const calendarSize = size * 0.65;
  const calendarX = (size - calendarSize) / 2;
  const calendarY = size * 0.2;
  const radius = calendarSize * 0.06;

  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.roundRect(calendarX, calendarY, calendarSize, calendarSize, radius);
  ctx.fill();

  // Calendar header
  const headerHeight = calendarSize * 0.25;
  ctx.fillStyle = '#DBEAFE';
  ctx.beginPath();
  ctx.roundRect(calendarX, calendarY, calendarSize, headerHeight, [radius, radius, 0, 0]);
  ctx.fill();

  // Calendar holes
  ctx.fillStyle = 'white';
  const holeRadius = calendarSize * 0.08;
  const holeY = calendarY + headerHeight / 2;

  ctx.beginPath();
  ctx.arc(calendarX + calendarSize * 0.25, holeY, holeRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(calendarX + calendarSize * 0.75, holeY, holeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Checkmark
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = size * 0.07;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const checkSize = calendarSize * 0.6;
  const checkX = calendarX + (calendarSize - checkSize) / 2;
  const checkY = calendarY + headerHeight + (calendarSize - headerHeight - checkSize) / 2;

  ctx.beginPath();
  ctx.moveTo(checkX + checkSize * 0.15, checkY + checkSize * 0.5);
  ctx.lineTo(checkX + checkSize * 0.45, checkY + checkSize * 0.8);
  ctx.lineTo(checkX + checkSize * 0.85, checkY + checkSize * 0.25);
  ctx.stroke();

  return canvas;
}

// Generate icons
const sizes = [192, 512];
const publicDir = path.join(__dirname, '../public');

sizes.forEach(size => {
  const canvas = generateIcon(size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, `icon-${size}.png`), buffer);
  console.log(`Generated icon-${size}.png`);
});

console.log('Icons generated successfully!');
