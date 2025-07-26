// Popup script for LeetCode AI Hint Helper
document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveApiKeyBtn = document.getElementById('saveApiKey');
  const statusIndicator = document.getElementById('statusIndicator');
  const apiKeyMessage = document.getElementById('apiKeyMessage');
  const problemInfo = document.getElementById('problemInfo');
  const problemTitle = document.getElementById('problemTitle');
  const problemDifficulty = document.getElementById('problemDifficulty');
  const hintContent = document.getElementById('hintContent');
  
  const easyBtn = document.getElementById('easyHint');
  const mediumBtn = document.getElementById('mediumHint');
  const hardBtn = document.getElementById('hardHint');

  // Load saved API key
  const result = await chrome.storage.sync.get(['geminiApiKey']);
  if (result.geminiApiKey) {
    apiKeyInput.value = result.geminiApiKey;
    statusIndicator.classList.add('active');
    apiKeyMessage.textContent = 'API key loaded';
    apiKeyMessage.className = 'success';
  } else {
    statusIndicator.classList.add('inactive');
    apiKeyMessage.textContent = 'API key required';
    apiKeyMessage.className = 'error';
  }

  // Check if we're on a LeetCode problem page
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url && tab.url.includes('leetcode.com/problems/')) {
      // Get problem information from content script
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getProblemInfo' });
      if (response && response.success) {
        problemInfo.style.display = 'block';
        problemTitle.textContent = response.data.title || 'Problem detected';
        problemDifficulty.textContent = `Difficulty: ${response.data.difficulty || 'Unknown'}`;
        hintContent.textContent = 'Ready to provide hints for this problem!';
      }
    } else {
      hintContent.textContent = 'Navigate to a LeetCode problem page to get hints.';
    }
  } catch (error) {
    console.log('Not on a LeetCode page or content script not loaded');
  }

  // Save API key
  saveApiKeyBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      apiKeyMessage.textContent = 'Please enter an API key';
      apiKeyMessage.className = 'error';
      return;
    }

    try {
      await chrome.storage.sync.set({ geminiApiKey: apiKey });
      statusIndicator.classList.remove('inactive');
      statusIndicator.classList.add('active');
      apiKeyMessage.textContent = 'API key saved successfully!';
      apiKeyMessage.className = 'success';
    } catch (error) {
      apiKeyMessage.textContent = 'Failed to save API key';
      apiKeyMessage.className = 'error';
    }
  });

  // Hint button handlers
  async function getHint(difficulty) {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      hintContent.textContent = 'Please save your Gemini API key first.';
      return;
    }

    // Show loading state
    hintContent.innerHTML = '<div class="loading">Getting hint...</div>';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.url || !tab.url.includes('leetcode.com/problems/')) {
        hintContent.textContent = 'Please navigate to a LeetCode problem page.';
        return;
      }

      // Get problem information
      const problemResponse = await chrome.tabs.sendMessage(tab.id, { action: 'getProblemInfo' });
      if (!problemResponse || !problemResponse.success) {
        hintContent.textContent = 'Could not extract problem information. Please refresh the page.';
        return;
      }

      // Send request to background script
      const response = await chrome.runtime.sendMessage({
        action: 'getHint',
        apiKey: apiKey,
        difficulty: difficulty,
        problemData: problemResponse.data
      });

      if (response.success) {
        hintContent.textContent = response.hint;
      } else {
        hintContent.textContent = `Error: ${response.error}`;
      }
    } catch (error) {
      hintContent.textContent = 'Failed to get hint. Please try again.';
      console.error('Error getting hint:', error);
    }
  }

  easyBtn.addEventListener('click', () => getHint('easy'));
  mediumBtn.addEventListener('click', () => getHint('medium'));
  hardBtn.addEventListener('click', () => getHint('hard'));
});
