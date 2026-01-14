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
   * Updates the reading progress bar based on article content scroll position
   */
  function updateProgress() {
    if (!progressBar) return;

    // Use requestAnimationFrame for smooth updates
    if (!isUpdatingProgress) {
      isUpdatingProgress = true;

      requestAnimationFrame(() => {
        // Find the article content element
        const articleContent = document.querySelector('[data-testid="longformRichTextComponent"]') ||
                               document.querySelector('article[data-testid="tweet"]');

        if (!articleContent) {
          isUpdatingProgress = false;
          return;
        }

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;

        // Get the article element's position and dimensions
        const rect = articleContent.getBoundingClientRect();
        const articleTop = rect.top + scrollTop;
        const articleBottom = articleTop + rect.height;

        // Calculate progress: 0% when article starts at viewport top, 100% when article end reaches viewport bottom
        const articleStart = articleTop;
        const articleEnd = articleBottom - viewportHeight;
        const scrollableArticleHeight = articleEnd - articleStart;

        let progress = 0;
        if (scrollableArticleHeight > 0) {
          progress = ((scrollTop - articleStart) / scrollableArticleHeight) * 100;
        } else if (scrollTop >= articleStart) {
          progress = 100;
        }

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
   * Moves the author bar into the sticky header
   */
  function setupStickyAuthorBar() {
    const main = document.querySelector('main');
    if (!main) return;

    // Check if already set up
    if (document.getElementById('enhancer-author-bar')) return;

    // Find the sticky header (contains "Article" heading)
    const h2s = main.querySelectorAll('h2');
    let stickyHeader = null;
    let articleH2 = null;

    for (const h2 of h2s) {
      if (h2.textContent?.trim() === 'Article') {
        articleH2 = h2;
        // Go up to find the row container (with Back button, Article text, etc.)
        stickyHeader = h2.parentElement?.parentElement?.parentElement;
        break;
      }
    }

    if (!stickyHeader || !articleH2) {
      console.log('[Twitter Enhancer] Sticky header not found');
      return;
    }

    // Find the author bar in the article
    const article = main.querySelector('article[data-testid="tweet"]');
    if (!article) return;

    // Find the row containing avatar and author info
    const avatarLink = article.querySelector('a[href][role="link"] img');
    if (!avatarLink) return;

    // Go up to find the full author row (contains avatar, name, and menu)
    let authorRow = avatarLink;
    for (let i = 0; i < 8; i++) {
      if (authorRow?.parentElement) {
        authorRow = authorRow.parentElement;
      }
    }

    // Clone the author bar
    const clonedAuthorBar = authorRow.cloneNode(true);
    clonedAuthorBar.id = 'enhancer-author-bar';

    // Hide the "Article" text and other elements, replace with author bar
    // Find the middle section of the sticky header (where "Article" text is)
    const headerContent = stickyHeader.querySelector('div');
    if (headerContent) {
      // Clear the existing content and add our author bar
      const existingContent = stickyHeader.innerHTML;

      // Keep the back button but replace the rest
      const backButton = stickyHeader.querySelector('button[aria-label="Back"]');

      // Create new header content
      stickyHeader.innerHTML = '';

      if (backButton) {
        stickyHeader.appendChild(backButton.cloneNode(true));
      }

      // Add the author bar
      clonedAuthorBar.style.flex = '1';
      clonedAuthorBar.style.minWidth = '0';
      stickyHeader.appendChild(clonedAuthorBar);

      // Style the sticky header as a flex row
      stickyHeader.style.display = 'flex';
      stickyHeader.style.alignItems = 'center';
      stickyHeader.style.gap = '12px';
      stickyHeader.style.padding = '8px 16px';
    }

    // Hide the original author row in the article
    authorRow.style.display = 'none';

    console.log('[Twitter Enhancer] Author bar moved to sticky header');
  }

  /**
   * Hides distracting elements for focus mode
   */
  function hideDistractingElements() {
    const main = document.querySelector('main');
    if (!main) return;

    // Set up the sticky author bar
    setupStickyAuthorBar();

    // Find all cells in the timeline
    const allCells = Array.from(main.querySelectorAll('[data-testid="cellInnerDiv"]'));

    // Find which cell contains "Discover more" heading
    let discoverMoreIndex = -1;
    allCells.forEach((cell, index) => {
      const h2 = cell.querySelector('h2');
      if (h2 && h2.textContent?.trim() === 'Discover more') {
        discoverMoreIndex = index;
      }
    });

    // Hide the "Discover more" cell and all cells after it
    if (discoverMoreIndex >= 0) {
      for (let i = discoverMoreIndex; i < allCells.length; i++) {
        allCells[i].style.display = 'none';
      }
      console.log(`[Twitter Enhancer] Hidden ${allCells.length - discoverMoreIndex} "Discover more" cells`);
    }

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
