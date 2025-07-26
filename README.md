# LeetCode AI Hint Helper

A Chrome extension that provides AI-powered hints for LeetCode problems using Google's Gemini API. Get smart hints at different difficulty levels without spoiling the solution!

## Features

- 🧠 **AI-Powered Hints**: Uses Google Gemini API to generate intelligent hints
- 📊 **Three Difficulty Levels**: Easy, Medium, and Hard hints to match your learning pace
- 🎨 **Beautiful UI**: Modern, gradient-based design that's easy on the eyes
- 🔒 **Privacy-Focused**: Your API key is stored locally and securely
- ⚡ **Fast Integration**: Seamlessly integrates with LeetCode problem pages
- 🚫 **No Spoilers**: Designed to guide your thinking without giving away solutions

## Installation

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key for Gemini Pro
   - Copy the API key for later use

2. **Install the Extension**:
   - Download or clone this repository
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the extension folder
   - The extension icon should appear in your Chrome toolbar

3. **Configure the Extension**:
   - Click the extension icon in your Chrome toolbar
   - Enter your Gemini API key in the popup
   - Click "Save API Key"

## Usage

1. **Navigate to LeetCode**: Go to any LeetCode problem page (e.g., `https://leetcode.com/problems/two-sum/`)

2. **Open the Extension**: Click the extension icon in your Chrome toolbar

3. **Get Hints**: Choose from three hint difficulty levels:
   - **🟢 Easy**: General direction and approach hints
   - **🟡 Medium**: More specific algorithmic guidance
   - **🔴 Hard**: Detailed approach with key insights

4. **Learn and Solve**: Use the hints to guide your thinking and solve the problem yourself!

## How It Works

- **Content Script**: Detects LeetCode problem pages and extracts problem information
- **AI Processing**: Sends problem context to Gemini API with carefully crafted prompts
- **Smart Hints**: Returns hints tailored to the requested difficulty level
- **No Spoilers**: Designed to help you learn rather than just get answers

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Only requests access to LeetCode domains and Gemini API
- **Storage**: Uses Chrome's sync storage for secure API key management
- **Architecture**: Clean separation of content scripts, background service worker, and popup UI

## Privacy & Security

- Your Gemini API key is stored locally using Chrome's secure storage
- No data is sent to any servers other than Google's Gemini API
- Problem information is only used to generate hints and is not stored
- Open source - you can review all code for transparency

## Development

### File Structure
```
leetcode-ai-hint-helper/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI interface
├── popup.js              # Popup functionality
├── content.js            # LeetCode page integration
├── content.css           # Content script styles
├── background.js         # API communication service worker
├── icons/                # Extension icons
└── README.md            # This file
```

### Key Technologies
- **JavaScript**: Core extension logic
- **Chrome Extensions API**: Browser integration
- **Google Gemini API**: AI hint generation
- **CSS3**: Modern UI styling with gradients and animations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Test thoroughly on different LeetCode problems
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Disclaimer

This extension is designed to help you learn and improve your problem-solving skills. It provides hints and guidance rather than direct solutions. The goal is to enhance your learning experience while maintaining the educational value of solving LeetCode problems.

---

**Note**: You'll need to add actual icon files (16x16, 48x48, 128x128 PNG images) to the `icons/` directory for the extension to display properly in Chrome.
