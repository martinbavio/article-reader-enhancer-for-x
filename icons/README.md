# Icon Generation Instructions

The `icon.svg` file contains the source icon design. You need to convert it to PNG format at three sizes: 16x16, 48x48, and 128x128.

## Using Online Tools

1. Go to [CloudConvert](https://cloudconvert.com/svg-to-png) or similar SVG-to-PNG converter
2. Upload `icon.svg`
3. Set dimensions to 16x16, convert, and save as `icon-16.png`
4. Repeat for 48x48 → `icon-48.png`
5. Repeat for 128x128 → `icon-128.png`

## Using ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
convert icon.svg -resize 16x16 icon-16.png
convert icon.svg -resize 48x48 icon-48.png
convert icon.svg -resize 128x128 icon-128.png
```

## Using Inkscape (Command Line)

If you have Inkscape installed:

```bash
inkscape icon.svg -w 16 -h 16 -o icon-16.png
inkscape icon.svg -w 48 -h 48 -o icon-48.png
inkscape icon.svg -w 128 -h 128 -o icon-128.png
```

## Using Node.js

Install sharp: `npm install sharp`

Then create a script:

```javascript
const sharp = require('sharp');
const fs = require('fs');

const sizes = [16, 48, 128];
const svg = fs.readFileSync('icon.svg');

sizes.forEach(size => {
  sharp(svg)
    .resize(size, size)
    .png()
    .toFile(`icon-${size}.png`)
    .then(() => console.log(`Generated icon-${size}.png`));
});
```

## Temporary Placeholder

For testing purposes, you can temporarily copy `icon.svg` to all three sizes (Chrome can handle SVG in manifests, though PNG is recommended):

```bash
cp icon.svg icon-16.png
cp icon.svg icon-48.png
cp icon.svg icon-128.png
```
