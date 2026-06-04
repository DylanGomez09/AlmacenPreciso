const sharp = require("sharp");
const path = require("path");

const ASSETS = path.join(__dirname, "..", "assets", "images");

const BRAND = "#00875A";
const BG_LIGHT = "#E8F5E9";

function svgText(size, color, bg) {
  const half = size / 2;
  const r = size * 0.38;
  const fontSize = Math.round(size * 0.32);

  return Buffer.from(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      ${bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ""}
      <circle cx="${half}" cy="${half}" r="${r}" fill="${color}"/>
      <text x="${half}" y="${half + fontSize * 0.35}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="${fontSize}" fill="white">AP</text>
    </svg>
  `);
}

async function generate() {
  // icon.png - 1024x1024, circle + AP on transparent
  await sharp(svgText(1024, BRAND)).resize(1024, 1024).png().toFile(path.join(ASSETS, "icon.png"));
  console.log("✓ icon.png");

  // android-icon-foreground.png - 1024x1024, same as icon
  await sharp(svgText(1024, BRAND)).resize(1024, 1024).png().toFile(path.join(ASSETS, "android-icon-foreground.png"));
  console.log("✓ android-icon-foreground.png");

  // android-icon-background.png - 1024x1024, solid light green
  await sharp(svgText(1024, BRAND, BG_LIGHT)).resize(1024, 1024).png().toFile(path.join(ASSETS, "android-icon-background.png"));
  console.log("✓ android-icon-background.png");

  // android-icon-monochrome.png - 1024x1024, black on white
  await sharp(svgText(1024, "#000000", "#FFFFFF")).resize(1024, 1024).png().toFile(path.join(ASSETS, "android-icon-monochrome.png"));
  console.log("✓ android-icon-monochrome.png");

  // favicon.png - 48x48
  await sharp(svgText(48, BRAND)).resize(48, 48).png().toFile(path.join(ASSETS, "favicon.png"));
  console.log("✓ favicon.png");

  // splash-icon.png - 1284x2778, just AP logo centered, no bg (splash uses backgroundColor)
  await sharp(svgText(1024, BRAND)).resize(512, 512).png().toFile(path.join(ASSETS, "splash-icon.png"));
  console.log("✓ splash-icon.png");

  console.log("\nAll icons generated!");
}

generate().catch(console.error);
