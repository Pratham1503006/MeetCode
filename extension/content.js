// Content script for LeetCode AI Hint Helper
(function() {
  'use strict';

  // Function to extract problem information from the page
  function extractProblemInfo() {
    try {
      // Get problem title
      const titleElement = document.querySelector('[data-cy="question-title"]') || 
                          document.querySelector('.css-v3d350') ||
                          document.querySelector('h1') ||
                          document.querySelector('.question-title');
      
      const title = titleElement ? titleElement.textContent.trim() : null;

      // Get problem difficulty
      let difficulty = null;
      const difficultyElement = document.querySelector('[diff]') ||
                               document.querySelector('.css-10o4wqw') ||
                               document.querySelector('.difficulty') ||
                               document.querySelector('[data-difficulty]');
      
      if (difficultyElement) {
        difficulty = difficultyElement.textContent.trim();
      } else {
        // Try to find difficulty in various possible locations
        const possibleDiffElements = document.querySelectorAll('div, span');
        for (const elem of possibleDiffElements) {
          const text = elem.textContent.toLowerCase();
          if (text === 'easy' || text === 'medium' || text === 'hard') {
            difficulty = elem.textContent.trim();
            break;
          }
        }
      }

      // Get problem description
      let description = null;
      const descriptionElement = document.querySelector('[data-track-load="description_content"]') ||
                                document.querySelector('.question-content') ||
                                document.querySelector('.css-1umo9hd') ||
                                document.querySelector('.description');
      
      if (descriptionElement) {
        description = descriptionElement.textContent.trim();
        // Limit description length for API efficiency
        if (description.length > 1000) {
          description = description.substring(0, 1000) + '...';
        }
      }

      // Get problem number/slug from URL
      const urlMatch = window.location.pathname.match(/\/problems\/([^\/]+)/);
      const problemSlug = urlMatch ? urlMatch[1] : null;

      return {
        title,
        difficulty,
        description,
        problemSlug,
        url: window.location.href
      };
    } catch (error) {
      console.error('Error extracting problem info:', error);
      return null;
    }
  }

  // Add visual indicator that the extension is active
  function addExtensionIndicator() {
    // Remove existing indicator if present
    const existingIndicator = document.getElementById('leetcode-hint-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }

    const indicator = document.createElement('div');
    indicator.id = 'leetcode-hint-indicator';
    indicator.innerHTML = '💡 AI Hints Available';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-family: 'Segoe UI', sans-serif;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      transition: all 0.3s ease;
      opacity: 0.9;
    `;

    indicator.addEventListener('mouseenter', () => {
      indicator.style.opacity = '1';
      indicator.style.transform = 'scale(1.05)';
    });

    indicator.addEventListener('mouseleave', () => {
      indicator.style.opacity = '0.9';
      indicator.style.transform = 'scale(1)';
    });

    indicator.addEventListener('click', () => {
      // Open the extension popup (this won't work directly, but provides feedback)
      indicator.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
      indicator.innerHTML = '💡 Click extension icon!';
      setTimeout(() => {
        indicator.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        indicator.innerHTML = '💡 AI Hints Available';
      }, 2000);
    });

    document.body.appendChild(indicator);
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getProblemInfo') {
      const problemInfo = extractProblemInfo();
      if (problemInfo) {
        sendResponse({ success: true, data: problemInfo });
      } else {
        sendResponse({ success: false, error: 'Could not extract problem information' });
      }
    }
    return true; // Keep message channel open for async response
  });

  // Initialize when page loads
  function initialize() {
    // Wait a bit for the page to fully load
    setTimeout(() => {
      if (window.location.pathname.includes('/problems/')) {
        addExtensionIndicator();
        console.log('LeetCode AI Hint Helper: Ready on problem page');
      }
    }, 1000);
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Reinitialize on navigation (for SPA behavior)
  let currentUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      initialize();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
