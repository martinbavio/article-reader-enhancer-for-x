# Article Reader Enhancer for X

A Chrome extension that transforms X's native article reader into a refined, distraction-free reading experience with enhanced typography, elegant layout, and a reading progress indicator.

## Features

### 🎨 Editorial Design
- **Sophisticated Typography**: Serif fonts (Iowan Old Style, Palatino, Georgia) for body text combined with sans-serif headings for a literary magazine aesthetic
- **Warm Color Palette**: Paper-like cream background with terracotta accents, designed for comfortable long-form reading
- **Dark Mode Support**: Automatically adapts to your system's dark mode preference

### 📖 Enhanced Readability
- **Optimal Line Length**: Content constrained to ~700px (65-75 characters per line) for maximum readability
- **Perfect Typography Scale**: 19px base font size with 1.75 line height for comfortable reading
- **Drop Cap**: First paragraph features an elegant drop cap for editorial flair
- **Generous Spacing**: Carefully crafted margins and padding throughout

### 📊 Reading Progress Indicator
- **Visual Progress Bar**: Thin, elegant bar at the top of the page shows your reading progress
- **Smooth Animation**: Uses requestAnimationFrame for buttery-smooth updates
- **Accessible**: Includes proper ARIA labels for screen readers

### ✨ Thoughtful Details
- Ornamental section dividers (***) for visual breaks
- Beautiful blockquote styling with left border accent
- Refined link treatments with hover effects
- Enhanced code blocks with syntax highlighting preparation
- Smooth scroll behavior
- Print-optimized styles

## Installation

### Development Mode (Load Unpacked)

1. **Download or Clone** this repository
   ```bash
   git clone <repository-url>
   cd twitter-article-enhancer
   ```

2. **Generate Icons** (optional but recommended)
   - See `icons/README.md` for instructions on converting the SVG to PNG
   - The extension will work with the placeholder icons for testing

3. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)

4. **Load the Extension**
   - Click **Load unpacked**
   - Select the `twitter-article-enhancer` folder
   - The extension should now appear in your extensions list

5. **Test It Out**
   - Go to [X](https://x.com)
   - Open any article in X's native article reader
   - Enjoy the enhanced reading experience!

## Usage

Simply browse X as normal. When you open an article in X's native article reader, the extension will automatically:

1. Apply enhanced typography and layout
2. Show a reading progress indicator at the top
3. Center content for optimal reading
4. Add elegant spacing and visual hierarchy

No configuration needed - it works automatically!

## Customization

### Modifying Styles

Edit `content-scripts/styles.css` to customize the appearance:

```css
:root {
  --bg-primary: #faf8f5;        /* Page background */
  --text-primary: #2b2826;      /* Main text color */
  --progress-bar: #c7522a;      /* Progress bar color */
  --font-size-base: 19px;       /* Base font size */
  --line-height-base: 1.75;     /* Line height */
  --content-max-width: 700px;   /* Maximum content width */
}
```

### Changing Fonts

To use different fonts, modify the font stacks in `styles.css`:

```css
:root {
  /* Serif fonts for body text */
  --font-serif: "Your Serif Font", Georgia, serif;

  /* Sans-serif fonts for headings */
  --font-sans: "Your Sans Font", -apple-system, sans-serif;
}
```

### Adjusting the Progress Bar

Modify the progress bar appearance:

```css
#twitter-reader-progress {
  height: 3px;  /* Change thickness */
}

#twitter-reader-progress::after {
  background: linear-gradient(90deg, #c7522a, #8b4513);  /* Change colors */
}
```

## Browser Compatibility

- ✅ **Chrome** (Version 88+): Fully supported
- ✅ **Edge** (Chromium-based): Fully supported
- ✅ **Brave**: Fully supported
- ✅ **Opera**: Fully supported
- ❌ **Firefox**: Not supported (requires Manifest V2 adaptation)
- ❌ **Safari**: Not supported (requires different extension format)

## Technical Details

### Manifest V3
This extension uses Manifest V3, the latest Chrome extension platform with improved security and performance.

### Content Scripts
- **CSS Injection**: `styles.css` is injected at `document_end` for optimal performance
- **JavaScript Enhancement**: `enhancer.js` handles dynamic features like the progress indicator
- **Efficient Updates**: Uses `requestAnimationFrame` and passive event listeners for smooth performance

### Twitter Compatibility
- Works with both **twitter.com** and **x.com** domains
- Handles Twitter's single-page application (SPA) navigation
- Uses `MutationObserver` to detect dynamically loaded articles
- Robust selectors that work with Twitter's frequently changing class names

## File Structure

```
twitter-article-enhancer/
├── manifest.json                 # Extension configuration
├── content-scripts/
│   ├── styles.css               # Typography and layout styles
│   └── enhancer.js              # Reading progress indicator logic
├── icons/
│   ├── icon.svg                 # Source icon (editorial book design)
│   ├── icon-16.png              # Small icon
│   ├── icon-48.png              # Medium icon
│   ├── icon-128.png             # Large icon
│   └── README.md                # Icon generation instructions
└── README.md                     # This file
```

## Development

### Testing Changes

1. Make your changes to CSS or JavaScript files
2. Go to `chrome://extensions/`
3. Click the **Reload** button for the extension
4. Refresh the Twitter article page to see changes

### Debugging

- **Console Logs**: The extension logs events with `[Twitter Enhancer]` prefix
- **DevTools**: Right-click on any article page and select "Inspect" to debug
- **CSS Inspection**: Use Chrome DevTools to inspect applied styles

### Performance Monitoring

The extension is designed to be lightweight:
- CSS does most of the work (zero JavaScript overhead for styling)
- Progress bar updates are throttled with `requestAnimationFrame`
- Event listeners use passive mode for better scrolling performance
- MutationObserver is efficiently scoped

## Troubleshooting

### Extension Not Working

1. **Check Extension is Enabled**: Go to `chrome://extensions/` and ensure it's active
2. **Verify URL**: Make sure you're on twitter.com or x.com
3. **Reload Extension**: Click reload on the extension card
4. **Check Console**: Look for `[Twitter Enhancer]` logs in DevTools console

### Progress Bar Not Showing

1. **Verify Article View**: The extension only activates in Twitter's article reader
2. **Check Console Logs**: Look for "Article detected" message
3. **Inspect Element**: Look for `#twitter-reader-progress` in the DOM

### Styles Not Applied

1. **Clear Cache**: Sometimes CSS caching can interfere - try hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
2. **Check Selector Specificity**: Twitter's styles might override - use `!important` if needed
3. **Verify File Path**: Ensure `content-scripts/styles.css` exists and is referenced in manifest

## Future Enhancements

Potential features for future versions:

- [ ] User preferences panel (font size, theme, width adjustments)
- [ ] Multiple theme options (light, dark, sepia, high contrast)
- [ ] Reading time estimate
- [ ] Custom font selection
- [ ] Export/save articles
- [ ] Reading statistics
- [ ] Focus mode (hide all UI elements)
- [ ] Text-to-speech integration

## Contributing

Feel free to fork this project and submit pull requests for:
- Bug fixes
- New features
- Documentation improvements
- Additional themes

## License

MIT License - feel free to modify and use as you wish.

## Acknowledgments

- Inspired by reading-focused platforms like Medium and Instapaper
- Typography principles from *The Elements of Typographic Style* by Robert Bringhurst
- Color palette inspired by literary magazines and fine book design

---

**Enjoy your enhanced Twitter reading experience!** 📚✨
