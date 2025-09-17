# YouTube Glossary Extension - Project Requirements Document

## Project Overview

### Name
YouTube Timestamped Glossary Extension (o3-mini)

### Purpose
A Chrome browser extension that automatically generates intelligent glossaries of sophisticated terms from YouTube video transcripts, displaying them in an interactive sidebar with timestamp navigation.

### Target Users
- Students watching educational content
- Researchers consuming academic videos
- General users encountering complex terminology
- Language learners studying advanced vocabulary

---

## 1. Core Features & Functionality

### 1.1 Video Analysis
- **Transcript Extraction**: Automatically fetch YouTube video transcripts using Apify's transcript scraper
- **AI-Powered Analysis**: Process transcripts with OpenAI's o3-mini model to identify sophisticated vocabulary
- **Term Classification**: Focus on literary, philosophical, academic, and technical terminology
- **Context Preservation**: Maintain timestamp associations for each identified term

### 1.2 Glossary Generation
- **Structured Output**: Generate JSON entries with term, definition, timestamp, context, and frequency data
- **Plain Language Definitions**: Provide 1-2 sentence explanations in accessible English
- **Timestamp Mapping**: Convert time formats to both human-readable and seconds-based formats
- **Frequency Tracking**: Count term appearances throughout the transcript

### 1.3 User Interface Integration
- **Non-Intrusive Button**: Inject "Open Glossify" button on YouTube video pages
- **Slide-Out Sidebar**: 400px wide panel (max 42% screen width) with smooth animations
- **Real-Time Status**: Display processing progress and system status
- **Search Functionality**: Filter terms with live search capabilities

### 1.4 Video Navigation
- **Clickable Timestamps**: Jump to specific video moments when terms are mentioned
- **Visual Highlighting**: Highlight active terms during video playback
- **Automatic Synchronization**: Track video position and update term highlights
- **Smooth Transitions**: Seamless video seeking with user feedback

---

## 2. Technical Architecture

### 2.1 Extension Structure
```
yt-glossary-extension/
├── manifest.json              # Extension configuration
├── src/
│   ├── background.js          # Service worker (API handling)
│   ├── content.js            # UI injection and video integration
│   ├── popup.html            # Settings interface
│   ├── popup.js              # Settings logic
│   ├── sidebar.html          # Glossary sidebar template
│   ├── sidebar.css           # Sidebar styling
│   └── icons/               # Extension icons
└── README.md                # Documentation
```

### 2.2 Core Components

#### 2.2.1 Manifest Configuration
- **Version**: Manifest V3 compliance
- **Permissions**: `storage`, `scripting`, `activeTab`, `tabs`
- **Host Permissions**: OpenAI API, Apify API, YouTube domains
- **Content Scripts**: YouTube page injection
- **Web Accessible Resources**: Sidebar assets

#### 2.2.2 Background Service Worker
- **API Key Management**: Secure storage of OpenAI and Apify tokens
- **Transcript Processing**: Handle Apify API communications
- **AI Integration**: Manage OpenAI o3-mini API calls
- **Error Handling**: Comprehensive error catching and user feedback
- **JSON Parsing**: Extract and validate AI response data

#### 2.2.3 Content Script
- **UI Injection**: Dynamic button and sidebar creation
- **YouTube Integration**: Video player interaction and control
- **Event Management**: Handle user interactions and video events
- **State Management**: Maintain sidebar state across page navigation
- **Real-Time Updates**: Synchronize with video playback

#### 2.2.4 Settings Interface
- **API Configuration**: Input fields for required API keys
- **Local Storage**: Secure credential management
- **Validation**: Input validation and error messaging
- **User Guidance**: Clear instructions and help text

---

## 3. API Integration Specifications

### 3.1 Apify Integration
- **Service**: `scrape-creators~best-youtube-transcripts-scraper`
- **Endpoint**: `https://api.apify.com/v2/acts/{actorId}/run-sync-get-dataset-items`
- **Input Format**: `{ videoUrls: [string] }`
- **Output Processing**: Extract transcript array with timestamps and text
- **Error Handling**: Network failures, missing transcripts, API limits

### 3.2 OpenAI Integration
- **Model**: o3-mini with medium reasoning effort
- **Endpoint**: `https://api.openai.com/v1/responses`
- **Request Format**:
  ```json
  {
    "model": "o3-mini",
    "reasoning": { "effort": "medium" },
    "input": "<structured_prompt>"
  }
  ```
- **Response Processing**: Extract JSON from various response formats
- **Prompt Engineering**: Detailed instructions for term extraction and formatting

### 3.3 Expected Data Structure
```json
{
  "timestamp": "HH:MM:SS",
  "seconds": 123,
  "term": "phenomenology",
  "meaning": "The philosophical study of experience and consciousness.",
  "context_excerpt": "when discussing phenomenology in relation to...",
  "tally": 3
}
```

---

## 4. User Experience Requirements

### 4.1 Visual Design
- **Color Scheme**: Professional blue (#0078d4) with neutral grays
- **Typography**: Segoe UI for Windows compatibility
- **Layout**: Clean, minimal design with clear hierarchy
- **Responsiveness**: Adapt to different screen sizes and resolutions
- **Accessibility**: Keyboard navigation and screen reader support

### 4.2 Interaction Flow
1. **Initial Setup**: User installs extension and configures API keys
2. **Video Discovery**: User navigates to YouTube video
3. **Activation**: User clicks "Open Glossify" button
4. **Processing**: Extension shows progress while analyzing transcript
5. **Results**: Glossary appears in sidebar with interactive timestamps
6. **Navigation**: User clicks terms to jump to video moments
7. **Cleanup**: Clear button resets glossary for new analysis

### 4.3 Performance Requirements
- **Loading Time**: Sidebar injection < 200ms
- **API Response**: Complete analysis < 30 seconds for typical videos
- **Memory Usage**: < 50MB additional browser memory
- **Smooth Animations**: 60fps transitions and interactions
- **Responsive UI**: No blocking of main browser thread

---

## 5. Development Phases

### Phase 1: Foundation (MVP)
- [ ] Basic extension structure and manifest
- [ ] API key storage and management
- [ ] Simple transcript fetching from Apify
- [ ] Basic OpenAI integration
- [ ] Minimal sidebar with term display

### Phase 2: Core Features
- [ ] Advanced prompt engineering for better term extraction
- [ ] Timestamp navigation and video synchronization
- [ ] Improved UI design and animations
- [ ] Search and filter functionality
- [ ] Error handling and user feedback

### Phase 3: Enhancement
- [ ] Performance optimizations
- [ ] Advanced term categorization
- [ ] Export functionality (PDF, text)
- [ ] User preferences and customization
- [ ] Analytics and usage tracking

### Phase 4: Polish
- [ ] Comprehensive testing across browsers
- [ ] Accessibility improvements
- [ ] Documentation and help system
- [ ] Chrome Web Store preparation
- [ ] User onboarding flow

---

## 6. Technical Specifications

### 6.1 Browser Compatibility
- **Primary**: Chrome 88+
- **Secondary**: Edge 88+, Firefox (with Manifest V3 support)
- **Mobile**: Not initially supported

### 6.2 Dependencies
- **External APIs**: OpenAI API, Apify API
- **Chrome APIs**: `chrome.storage`, `chrome.runtime`, `chrome.scripting`
- **Web Standards**: ES2020+, Fetch API, DOM manipulation

### 6.3 Security Considerations
- **API Key Storage**: Chrome local storage (encrypted by browser)
- **HTTPS Requirements**: All API communications over HTTPS
- **Content Security Policy**: Strict CSP for extension security
- **Permission Principle**: Minimal required permissions only

### 6.4 Performance Targets
- **Bundle Size**: < 500KB total extension size
- **Memory Footprint**: < 50MB runtime memory
- **API Costs**: < $0.10 per video analysis (typical)
- **Network Usage**: Efficient caching to minimize API calls

---

## 7. Quality Assurance

### 7.1 Testing Strategy
- **Unit Tests**: Core functions (JSON parsing, timestamp conversion)
- **Integration Tests**: API communications and error handling
- **UI Tests**: Sidebar injection and user interactions
- **Performance Tests**: Memory usage and response times
- **Compatibility Tests**: Multiple YouTube layouts and video types

### 7.2 Error Scenarios
- **Network Failures**: Offline handling and retry mechanisms
- **API Errors**: Clear error messages and fallback options
- **Invalid Responses**: Graceful handling of malformed data
- **YouTube Changes**: Robust selectors and layout adaptation
- **Extension Conflicts**: Isolation from other extensions

---

## 8. Future Enhancements

### 8.1 Advanced Features
- **Multi-Language Support**: Process non-English content
- **Term Difficulty Levels**: Beginner, intermediate, advanced classifications
- **Personal Glossaries**: Save and organize terms across videos
- **Social Features**: Share glossaries with others
- **Offline Mode**: Cache glossaries for offline viewing

### 8.2 Platform Expansion
- **Other Video Platforms**: Extend to Vimeo, educational sites
- **Mobile Apps**: Companion apps for mobile viewing
- **Desktop Integration**: Standalone application option
- **API for Developers**: Allow third-party integrations

### 8.3 AI Improvements
- **Custom Models**: Fine-tuned models for specific domains
- **Contextual Learning**: Improve definitions based on video context
- **Visual Processing**: Analyze slides and visual content
- **Real-Time Processing**: Live glossary generation during streaming

---

## 9. Success Metrics

### 9.1 User Engagement
- **Daily Active Users**: Target 1,000+ within 6 months
- **Session Duration**: Average 15+ minutes per session
- **Feature Usage**: 80%+ of users try timestamp navigation
- **Retention Rate**: 60%+ weekly retention

### 9.2 Technical Performance
- **Error Rate**: < 5% failed analyses
- **Response Time**: 95th percentile < 30 seconds
- **User Satisfaction**: 4.5+ star rating on Chrome Web Store
- **API Costs**: Maintain under $100/month operational costs

---

## 10. Maintenance & Support

### 10.1 Regular Updates
- **YouTube Compatibility**: Monitor and adapt to YouTube changes
- **API Updates**: Stay current with OpenAI and Apify changes
- **Security Patches**: Regular security reviews and updates
- **Performance Optimization**: Ongoing performance improvements

### 10.2 User Support
- **Documentation**: Comprehensive user guide and FAQ
- **Issue Tracking**: GitHub issues for bug reports and features
- **Community**: Discord or forum for user discussions
- **Feedback Loop**: Regular user surveys and feature requests

---

This requirements document serves as the central reference for all development activities and will be updated as features evolve and user feedback is incorporated.