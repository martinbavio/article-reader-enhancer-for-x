#!/bin/bash
# Move screenshots from Desktop to screenshots folder

echo "Moving screenshots from Desktop to screenshots folder..."
cd ~/Desktop

# Move any recent screenshots (you can adjust the pattern)
mv Screenshot*.png /Users/paradoja/Mecha/projects/twitter-article-enhancer/screenshots/ 2>/dev/null

echo "Done! Screenshots moved to:"
echo "/Users/paradoja/Mecha/projects/twitter-article-enhancer/screenshots/"
ls -lh /Users/paradoja/Mecha/projects/twitter-article-enhancer/screenshots/
