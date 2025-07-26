// Background service worker for LeetCode AI Hint Helper
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getHint') {
    getHintFromGemini(request.apiKey, request.difficulty, request.problemData)
      .then(hint => {
        sendResponse({ success: true, hint: hint });
      })
      .catch(error => {
        console.error('Error getting hint:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

async function getHintFromGemini(apiKey, difficulty, problemData) {
  const { title, description, difficulty: problemDifficulty } = problemData;
  
  // Construct the prompt based on difficulty level
  let prompt = `You are an AI coding assistant helping with LeetCode problems. Your job is to provide helpful hints WITHOUT giving away the complete solution.

Problem: ${title}
Problem Difficulty: ${problemDifficulty}
Description: ${description}

Please provide a ${difficulty} level hint for this problem:

- EASY hint: Give a very general direction or approach without specific implementation details
- MEDIUM hint: Provide more specific guidance about the algorithm or data structure to use, but still require thinking
- HARD hint: Give detailed algorithmic approach and key insights, but stop short of actual code

Rules:
1. DO NOT provide complete code solutions
2. DO NOT give step-by-step implementation details
3. Focus on concepts, patterns, and approaches
4. Keep hints concise (2-3 sentences max)
5. Encourage thinking and learning

Provide a ${difficulty} hint now:`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    const hint = data.candidates[0].content.parts[0].text.trim();
    
    // Add difficulty level prefix to the hint
    const difficultyEmoji = {
      'easy': '🟢',
      'medium': '🟡', 
      'hard': '🔴'
    };
    
    return `${difficultyEmoji[difficulty]} ${difficulty.toUpperCase()} HINT:\n\n${hint}`;
    
  } catch (error) {
    if (error.message.includes('API_KEY_INVALID')) {
      throw new Error('Invalid API key. Please check your Gemini API key.');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      throw new Error('API quota exceeded. Please check your Gemini API usage.');
    } else if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }
}
