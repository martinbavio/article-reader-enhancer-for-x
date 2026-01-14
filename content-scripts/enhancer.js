/**
 * Article Reader Enhancer for X - JavaScript
 * Handles dynamic content loading and reading progress indicator
 */

(function() {
  'use strict';

  let progressBar = null;
  let isUpdatingProgress = false;

  /**
   * Loads Google Fonts by injecting a link tag
   */
  function loadGoogleFonts() {
    // Check if already loaded
    if (document.getElementById('twitter-enhancer-fonts')) {
      return;
    }

    // Create link element for Google Fonts
    const link = document.createElement('link');
    link.id = 'twitter-enhancer-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap';

    // Inject into document head
    document.head.appendChild(link);

    console.log('[Twitter Enhancer] Google Fonts loaded');
  }

  /**
   * Creates and injects the reading progress bar
   */
  function createProgressBar() {
    // Remove existing progress bar if present
    const existing = document.getElementById('twitter-reader-progress');
    if (existing) {
      existing.remove();
    }

    // Create new progress bar
    progressBar = document.createElement('div');
    progressBar.id = 'twitter-reader-progress';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Reading progress');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.setAttribute('aria-valuenow', '0');

    // Inject at the start of body
    document.body.insertBefore(progressBar, document.body.firstChild);

    console.log('[Twitter Enhancer] Progress bar created');
  }

  /**
   * Updates the reading progress bar based on scroll position
   */
  function updateProgress() {
    if (!progressBar) return;

    // Use requestAnimationFrame for smooth updates
    if (!isUpdatingProgress) {
      isUpdatingProgress = true;

      requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // Calculate progress percentage
        const scrollableHeight = scrollHeight - clientHeight;
        const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

        // Update progress bar
        progressBar.style.setProperty('--progress', `${Math.min(100, Math.max(0, progress))}%`);
        progressBar.setAttribute('aria-valuenow', Math.round(progress));

        isUpdatingProgress = false;
      });
    }
  }

  /**
   * Checks if we're currently viewing an article
   */
  function isArticleView() {
    // Check if we're in article view by looking for "Article" heading
    const main = document.querySelector('main');
    if (!main) return false;

    // Look for a heading that says "Article"
    const allElements = main.querySelectorAll('*');
    const articleHeading = Array.from(allElements).find(el =>
      el.textContent?.trim() === 'Article' &&
      (el.tagName === 'H1' || el.tagName === 'H2' || el.getAttribute('role') === 'heading')
    );

    return !!articleHeading;
  }

  /**
   * Hides distracting elements for focus mode
   */
  function hideDistractingElements() {
    const main = document.querySelector('main');
    if (!main) return;

    // Hide "Discover more" sections
    const allText = main.querySelectorAll('*');
    allText.forEach(el => {
      const text = el.textContent?.trim() || '';
      if ((text === 'Discover more' || text.startsWith('Discover more')) &&
          (el.tagName === 'H2' || el.getAttribute('role') === 'heading')) {
        // Hide the parent section
        let parent = el.parentElement;
        while (parent && parent !== main) {
          if (parent.tagName === 'SECTION' || parent.tagName === 'DIV') {
            parent.style.display = 'none';
            break;
          }
          parent = parent.parentElement;
        }
      }
    });

    console.log('[Twitter Enhancer] Distracting elements hidden');
  }

  /**
   * Initializes the enhancement when article is detected
   */
  function initialize() {
    if (isArticleView()) {
      console.log('[Twitter Enhancer] Article detected, initializing enhancements');

      // Add class to body to scope CSS rules
      document.body.classList.add('twitter-article-view');

      // Create progress bar
      createProgressBar();

      // Hide distracting elements
      hideDistractingElements();

      // Set up scroll listener
      window.addEventListener('scroll', updateProgress, { passive: true });

      // Initial progress update
      updateProgress();

      // Add smooth scroll behavior
      document.documentElement.style.scrollBehavior = 'smooth';

      console.log('[Twitter Enhancer] Enhancements applied');
    }
  }

  /**
   * Observes DOM changes to detect when article reader is loaded
   * (Twitter loads content dynamically)
   */
  function observeArticleChanges() {
    const observer = new MutationObserver((mutations) => {
      // Check if article reader appeared
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          if (isArticleView() && !progressBar) {
            console.log('[Twitter Enhancer] Article loaded dynamically');
            initialize();
            break;
          } else if (isArticleView() && progressBar) {
            // Article is already loaded, but new content appeared (replies, etc.)
            // Re-hide distracting elements
            hideDistractingElements();
          }
        }
      }
    });

    // Observe the entire document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('[Twitter Enhancer] MutationObserver started');
  }

  /**
   * Clean up when navigating away from article
   */
  function cleanup() {
    // Remove the article view class
    document.body.classList.remove('twitter-article-view');

    window.removeEventListener('scroll', updateProgress);
    if (progressBar && progressBar.parentNode) {
      progressBar.remove();
      progressBar = null;
    }
    console.log('[Twitter Enhancer] Cleanup completed');
  }

  /**
   * Monitors URL changes (for Twitter's SPA navigation)
   */
  function monitorNavigation() {
    let lastUrl = location.href;

    const urlObserver = new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        console.log('[Twitter Enhancer] Navigation detected:', currentUrl);

        // Check if we're still on an article or need cleanup
        setTimeout(() => {
          if (!isArticleView() && progressBar) {
            cleanup();
          } else if (isArticleView() && !progressBar) {
            initialize();
          }
        }, 500); // Small delay to let Twitter's SPA finish loading
      }
    });

    urlObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Main initialization
   */
  function main() {
    console.log('[Twitter Enhancer] Extension loaded');

    // Load Google Fonts first
    loadGoogleFonts();

    // Check if article is already present
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initialize();
        observeArticleChanges();
        monitorNavigation();
      });
    } else {
      initialize();
      observeArticleChanges();
      monitorNavigation();
    }
  }

  // Start the extension
  main();
})();
