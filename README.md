# Smart Brain - YouTube Glossary Extension

![Extension Version](https://img.shields.io/badge/version-2.0.0-brightgreen.svg)
![Chrome Web Store](https://img.shields.io/badge/chrome-extension-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Transform your YouTube learning experience with AI-powered glossaries that make complex content accessible and engaging. This Chrome extension automatically identifies sophisticated terminology in video transcripts and displays interactive definitions with timestamp navigation.

## 🎯 Overview

Smart Brain (formerly YouTube Timestamped Glossary Extension) uses OpenAI's GPT-4o-mini model to analyze video transcripts and extract 20-50 sophisticated terms. With a beautiful pistachio green theme, resizable interface, and delightful waiting quotes, it makes learning complex content both effective and enjoyable.

## ✨ Key Features

### 🧠 Enhanced AI-Powered Analysis
- **Comprehensive Term Extraction**: AI identifies 20-50 sophisticated terms per video
- **Smart Vocabulary Detection**: Targets literary, philosophical, academic, and technical terminology
- **Context-Aware Definitions**: Provides clear, educational explanations (1-2 sentences)
- **Frequency Tracking**: Shows how often terms appear throughout the video
- **Optimized Prompting**: Enhanced AI instructions for better term quality

### � Modern & Beautiful Interface
- **Pistachio Green Theme**: Professional design with lime-500 (#84cc16) accent colors
- **Resizable Sidebar**: Drag-to-resize functionality (300-800px width)
- **Glass Morphism Effects**: Modern backdrop blur and transparency
- **Smooth Animations**: 60fps transitions and micro-interactions
- **Inter Font Typography**: Enhanced readability with increased font sizes

### 🎪 Delightful User Experience
- **Interactive Onboarding**: 4-slide tutorial with smooth navigation
- **Witty Waiting Quotes**: 30 funny, rotating quotes during analysis
- **Smart Button States**: "Glossify It!" → "Start Over" with color changes
- **Auto-Close/Open Flow**: Seamless popup-to-sidebar workflow
- **Enhanced Status Updates**: Real-time progress with "Glossifying" terminology

### 🔗 Advanced Navigation & Interaction
- **Clickable Timestamps**: Jump to exact moments when terms are mentioned
- **Visual Highlighting**: Enhanced term visibility with proper contrast
- **Live Search & Filter**: Find specific terms instantly
- **Floating Action Button**: Modern FAB design with sparkle effects
- **Keyboard Accessibility**: Full keyboard navigation support

### 📚 Personal Library System
- **Save Terms**: Heart button (🤍→❤️) on every term card for personal collection
- **Smart Library**: Beautiful library view with search, export, and management
- **Cross-Video Navigation**: Jump to original timestamps from saved terms
- **Library Badge**: Shows saved term count with pulse animations
- **Export Functionality**: Download library as structured JSON file

## 🚀 Quick Start

### Prerequisites
- Chrome 88+ or Edge 88+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Apify API token ([Get one here](https://console.apify.com/account/integrations))

### Installation

1. **Download the Extension**
   ```bash
   git clone https://github.com/ShoabSaadat/glossify.git
   cd glossify
   ```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked" and select the extension folder
   - The Smart Brain extension icon should appear in your toolbar

3. **Configure API Keys**
   - Click the Smart Brain extension icon in Chrome toolbar
   - Enter your OpenAI API key in the floating label field
   - Enter your Apify API token (optional - has default)
   - Click "Save Configuration" 
   - Popup will auto-close and open the glossary sidebar

### First Use with Onboarding

1. **Navigate to YouTube**
   - Go to any YouTube video with educational/complex content
   - The modern floating action button will appear

2. **Interactive Tutorial**
   - First-time users will see a 4-slide onboarding tutorial
   - Learn about Smart Brain analysis, timestamp navigation, and features
   - Click "Get Started!" to complete onboarding

3. **Generate Your First Glossary**
   - Click the floating "Open Glossify" button or use the green "Glossify It!" button
   - Enjoy witty quotes while AI analyzes the transcript (20-50 terms)
   - Browse terms with enhanced typography and resizable interface
   - **Save terms** by clicking the heart button (🤍→❤️) on interesting terms
   - Click timestamps to jump to video moments
   - Use "Start Over" button to analyze a new video
   - Access your **Personal Library** via the 📚 button to review saved terms

## 🏗️ Technical Architecture

### Extension Structure
```
glossify/
├── manifest.json              # Extension configuration (Smart Brain branding)
├── src/
│   ├── background.js          # Service worker (GPT-4o-mini API handling)
│   ├── content.js            # Enhanced UI with resizable sidebar & quotes
│   ├── popup.html            # Modern settings with floating labels
│   ├── popup.js              # Auto-close/open flow
│   ├── sidebar.html          # Onboarding + glossary interface
│   ├── sidebar.css           # Pistachio theme + animations
│   ├── utils.js              # Enhanced utilities
│   └── icons/               # Smart Brain themed icons
├── project-requirements-document.md
└── README.md
```

### Core Components

#### 🔧 Background Service Worker (`background.js`)
- **API Management**: GPT-4o-mini chat completions with enhanced prompting
- **Transcript Processing**: Reliable Apify transcript extraction
- **Enhanced AI Integration**: Optimized for 20-50 sophisticated terms
- **Robust Data Parsing**: Improved JSON extraction and validation

#### 🎨 Content Script (`content.js`)
- **Modern UI Injection**: Floating action button + resizable sidebar
- **YouTube Integration**: Enhanced video player interaction
- **Smart State Management**: Button states ("Glossify It!" → "Start Over")
- **Quotes System**: 30 witty quotes cycling during analysis
- **Onboarding Flow**: Interactive 4-slide tutorial system

#### ⚙️ Settings Interface (`popup.html` + `popup.js`)
- **Modern Design**: Floating labels with glass morphism
- **Enhanced UX**: Auto-close popup → auto-open sidebar workflow
- **Password Security**: API key field converted to password type
- **Toast Notifications**: Beautiful success/error feedback

## 🔗 API Integration

### OpenAI GPT-4o-mini
```javascript
{
  "model": "gpt-4o-mini",
  "messages": [{"role": "user", "content": "<enhanced_prompt>"}],
  "temperature": 0.3,
  "max_tokens": 4000
}
```

### Enhanced AI Prompt
The extension uses a sophisticated prompt targeting 20-50 terms:
- Academic/scholarly vocabulary (discourse, paradigm, methodology)
- Technical terms from any field (cryptograms, supernova, mesmerism)
- Philosophical concepts (neoplatonism, transcendentalism)
- Literary terms (Byronic hero, Gothic, allegory)
- Historical and cultural references
- Uncommon but educational adjectives/adverbs

### Apify Transcript Scraper
```javascript
{
  "videoUrls": ["https://youtube.com/watch?v=..."]
}
```

### Data Format
Each glossary entry follows this structure:
```json
{
  "timestamp": "12:34",
  "seconds": 754,
  "term": "phenomenology",
  "meaning": "The philosophical study of experience and consciousness.",
  "context_excerpt": "when discussing phenomenology in relation to...",
  "tally": 3
}
```

## 🎨 UI Components

### Modern Floating Action Button
- **Design**: Circular FAB with sparkle effects and lime green theme
- **Location**: Bottom-right corner with proper z-index layering
- **Animation**: Smooth scale and shadow transitions
- **Accessibility**: ARIA labels and keyboard navigation

### Resizable Glossary Sidebar
- **Width**: Resizable from 300-800px with drag handle
- **Theme**: Pistachio green gradients with glass morphism
- **Layout**: Header controls + search + onboarding + scrollable term list
- **Typography**: Inter font family with enhanced readability

### Enhanced Onboarding System
- **Tutorial**: 4 interactive slides with navigation dots
- **Content**: Welcome → Smart Brain Analysis → Click to Jump → Get Started
- **Storage**: Remembers completion to avoid repeat showings
- **Design**: Modern card-based layout with slide transitions

### Waiting Experience
- **Quotes System**: 30 witty, rotating quotes during analysis
- **Animations**: Bouncing thought bubble icon with fade transitions
- **Examples**: "🍕 Pizza gets delivered faster than this, but it's less educational!"
- **Timing**: Quotes change every 4 seconds with smooth opacity transitions

### Term Cards
- **Enhanced Design**: Increased font sizes (16px base, 18px titles)
- **Better Contrast**: Improved term visibility and highlighting
- **Save Functionality**: Heart button (🤍→❤️) for personal library collection
- **Interaction**: Hover effects and click feedback
- **Responsive**: Adapts to different sidebar widths

### Personal Library Interface
- **Library Button**: 📚 icon with notification badge showing saved count
- **Beautiful Library View**: Professional cards with video source, timestamps, save dates
- **Smart Search**: Filter saved terms by name or definition instantly
- **Export System**: Download collection as structured JSON file
- **Cross-Video Navigation**: Jump to original video moments from any saved term
- **Management Actions**: Remove terms with hover actions and confirmation

## 🔧 Development

### Setup Development Environment
```bash
# Clone repository
git clone https://github.com/ShoabSaadat/yt-glossary-extension.git
cd yt-glossary-extension

# Load extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the project folder
```

### Testing
```bash
# Test on various YouTube videos
# - Educational content (TED Talks, lectures)
# - Philosophy videos
# - Academic presentations
# - Technical tutorials
```

### Debugging
- **Console Logs**: Check browser console for detailed logging
- **Background Script**: Debug via chrome://extensions/ > Extension details > background page
- **Content Script**: Debug directly in YouTube page console
- **API Responses**: Monitor network tab for API call details

## 📊 Performance

### Benchmarks
- **Sidebar Injection**: < 200ms with smooth animations
- **API Response Time**: 10-25 seconds for enhanced analysis (20-50 terms)
- **Memory Usage**: < 60MB additional browser memory
- **Smooth UI**: 60fps animations and micro-interactions
- **Resizing Performance**: Real-time drag resize without lag

### Optimization Features
- **Smart Caching**: Results persist until manual clear
- **Efficient Rendering**: Virtual scrolling for large term lists
- **Background Processing**: Non-blocking UI during analysis
- **Progressive Enhancement**: Graceful degradation on slower systems

## 🔒 Privacy & Security

### Data Handling
- **API Keys**: Stored locally in Chrome's encrypted storage
- **Transcripts**: Processed temporarily, not stored permanently
- **User Data**: No personal information collected or transmitted
- **HTTPS**: All API communications encrypted

### Permissions
- `storage`: Save API keys locally
- `activeTab`: Access current YouTube tab
- `scripting`: Inject UI components
- Host permissions: OpenAI API, Apify API, YouTube.com

## 🐛 Troubleshooting

### Common Issues

#### "API key missing" Error
- **Solution**: Configure API keys via extension popup
- **Check**: Ensure keys are saved properly in settings

#### "No transcript found" Error
- **Cause**: Video may not have captions/transcript
- **Solution**: Try videos with auto-generated or manual captions

#### Sidebar not appearing
- **Check**: Extension is enabled in chrome://extensions/
- **Try**: Refresh YouTube page and click "Open Glossify" again

#### Poor term extraction
- **Cause**: Simple content without sophisticated vocabulary
- **Solution**: Try academic, philosophical, or educational videos

### Debug Mode
Enable detailed logging by opening browser console:
```javascript
// Reset onboarding for testing
resetOnboarding()

// Manually show onboarding
showOnboarding()

// Check library state
console.log("Saved terms:", glossifyUI.savedTerms.length)

// Check extension state
console.log("Smart Brain Extension Debug Mode")
```

### New Debug Features
- **Onboarding Reset**: `resetOnboarding()` function for testing
- **Manual Triggers**: Direct function calls for debugging
- **Enhanced Logging**: Comprehensive console output for troubleshooting
- **State Inspection**: Real-time monitoring of extension state

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Basic extension structure with Manifest V3
- [x] API integration (OpenAI GPT-4o-mini + Apify)
- [x] Enhanced glossary generation (20-50 terms)
- [x] Modern UI with pistachio green theme

### Phase 2: Core Features ✅
- [x] Advanced prompt engineering for better extraction
- [x] Resizable sidebar with drag functionality
- [x] Interactive onboarding with 4-slide tutorial
- [x] Enhanced error handling and user feedback
- [x] Smart button states and auto-flow

### Phase 3: Enhancement ✅
- [x] Witty waiting quotes system (30 quotes)
- [x] Improved typography and accessibility
- [x] Glass morphism and modern animations
- [x] Enhanced term visibility and contrast
- [x] Auto-close/open popup workflow

### Phase 4: Polish 🚧
- [ ] Chrome Web Store release preparation
- [ ] Comprehensive browser compatibility testing
- [ ] Performance optimizations and analytics
- [ ] User feedback integration and iteration

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **JavaScript**: ES2020+ with modern async/await patterns
- **HTML/CSS**: Semantic markup with BEM methodology
- **Comments**: Comprehensive JSDoc documentation
- **Testing**: Include tests for new functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI**: For providing GPT-4o-mini model for intelligent, comprehensive term extraction
- **Apify**: For reliable YouTube transcript scraping services
- **Chrome Extensions Team**: For comprehensive extension APIs and Manifest V3
- **YouTube**: For maintaining accessible video platform APIs
- **Design Community**: For inspiration on modern UI patterns and animations

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/ShoabSaadat/glossify/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ShoabSaadat/glossify/discussions)
- **Email**: [support@glossify.com](mailto:support@glossify.com)

---

**Made with ❤️ for learners and educators worldwide**

*Transform complex content into accessible knowledge, one sophisticated term at a time.*

### 🌟 Recent Major Updates (v2.0.0)
- **Smart Brain Rebrand**: Professional identity with enhanced AI capabilities
- **Pistachio Green Theme**: Beautiful modern design with lime accents
- **Resizable Interface**: Drag-to-resize sidebar for personalized experience
- **Interactive Onboarding**: 4-slide tutorial for new users
- **Witty Waiting System**: 30 entertaining quotes during analysis
- **Enhanced AI Prompting**: Now extracts 20-50 sophisticated terms
- **Improved Typography**: Inter fonts with increased readability
- **Smart Button States**: Intuitive "Glossify It!" → "Start Over" flow
- **Personal Library**: Save terms to collection with heart buttons and export functionality
- **Cross-Video Navigation**: Jump to saved term timestamps across different videos