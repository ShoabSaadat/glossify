# Smart Brain - YouTube Glossary Extension
## Project Requirements Document v2.0.0

## Project Overview

### Name
Smart Brain - YouTube Glossary Extension (GPT-4o-mini Enhanced)

### Purpose
A Chrome browser extension that automatically generates comp6. **Navigation**: Click timestamps for precise video jumping
7. **Library Management**: Save terms (🤍→❤️), browse collection (📚), export library
8. **Cross-Video Learning**: Access saved terms from any video session
9. **Reset**: "Start Over" button for new video analysissive, interactive glossaries of 20-50 sophisticated terms from YouTube video transcripts, featuring a modern pistachio green theme, resizable interface, witty waiting quotes, and delightful user experience.

### Target Users
- Students consuming educational YouTube content
- Researchers and academics watching lectures
- Professionals learning new domain terminology
- Language learners studying advanced vocabulary
- Educators seeking teaching enhancement tools

### Key Differentiators
- **Comprehensive Analysis**: 20-50 terms per video (vs typical 5-10)
- **Delightful UX**: Witty quotes, smooth animations, interactive onboarding
- **Modern Design**: Pistachio theme with glass morphism effects
- **Resizable Interface**: Personalized sidebar width (300-800px)
- **Smart Interactions**: Intuitive button states and auto-flow

---

## 1. Enhanced Features & Functionality

### 1.1 Advanced Video Analysis
- **Enhanced Transcript Extraction**: Reliable Apify-powered YouTube transcript fetching
- **GPT-4o-mini Integration**: Advanced AI model for sophisticated term identification
- **Comprehensive Term Extraction**: Targets 20-50 terms minimum per analysis
- **Multi-Domain Coverage**: Literary, philosophical, academic, technical, and cultural terminology
- **Context Preservation**: Maintains precise timestamp associations and excerpt context

### 1.2 Intelligent Glossary Generation
- **Structured JSON Output**: Well-formatted entries with term, definition, timestamp, context, and frequency
- **Educational Definitions**: Clear, accessible explanations (1-2 sentences) for complex concepts
- **Timestamp Precision**: Accurate time mapping with both human-readable and seconds formats
- **Frequency Analysis**: Statistical tracking of term appearances throughout content
- **Quality Filtering**: AI-powered relevance scoring and duplicate elimination

### 1.3 Modern User Interface Design
- **Pistachio Green Theme**: Professional design with lime-500 (#84cc16) accent colors
- **Resizable Sidebar**: Drag-to-resize functionality (300-800px width) with visual handles
- **Glass Morphism Effects**: Modern backdrop blur, transparency, and depth
- **Enhanced Typography**: Inter font family with optimized sizes (16px base, 18px titles)
- **Smooth Animations**: 60fps transitions, micro-interactions, and state changes

### 1.4 Interactive User Experience
- **4-Slide Onboarding**: Welcome → Smart Brain Analysis → Click to Jump → Get Started
- **Witty Waiting System**: 30 rotating, entertaining quotes during AI processing
- **Smart Button States**: "Glossify It!" → "Start Over" with color-coded feedback
- **Auto-Flow Workflow**: Popup auto-close → sidebar auto-open seamless transition
- **Enhanced Accessibility**: Keyboard navigation, ARIA labels, screen reader support

### 1.5 Advanced Video Navigation
- **Precision Timestamps**: Jump to exact moments (down to the second) when terms appear
- **Visual Highlighting**: Enhanced term visibility with improved contrast ratios
- **Smart Synchronization**: Real-time video position tracking and term highlighting
- **Smooth Seeking**: Seamless video navigation with visual feedback and loading states

### 1.6 Personal Library System
- **Term Collection**: Save interesting terms with heart button interactions (🤍→❤️)
- **Persistent Storage**: Chrome local storage for cross-session term persistence
- **Library Management**: Beautiful interface for browsing, searching, and organizing saved terms
- **Cross-Video Navigation**: Jump to original timestamps from any saved term
- **Export Functionality**: Download personal library as structured JSON file
- **Smart Metadata**: Track video source, save date, and context for each term
- **Search & Filter**: Real-time filtering of saved terms by name or definition

---

## 2. Technical Architecture

### 2.1 Extension Structure
```
smart-brain-glossify/
├── manifest.json              # Extension configuration (Smart Brain branding)
├── src/
│   ├── background.js          # Service worker (GPT-4o-mini API handling)
│   ├── content.js            # Enhanced UI with resizable sidebar & quotes
│   ├── popup.html            # Modern settings with floating labels
│   ├── popup.js              # Auto-close/open flow logic
│   ├── sidebar.html          # Onboarding + glossary interface
│   ├── sidebar.css           # Pistachio theme + animations
│   ├── utils.js              # Enhanced animation utilities
│   └── icons/               # Smart Brain themed icons (brain emoji)
├── project-requirements-document.md
└── README.md
```

### 2.2 Enhanced Core Components

#### 2.2.1 Manifest Configuration (Smart Brain Edition)
- **Version**: Manifest V3 compliance with latest standards
- **Branding**: "Smart Brain" name and description updates
- **Permissions**: `storage`, `scripting`, `activeTab`, `tabs`
- **Host Permissions**: OpenAI API, Apify API, YouTube domains
- **Content Scripts**: Enhanced YouTube page injection with timing optimization
- **Web Accessible Resources**: Sidebar assets with proper CSP

#### 2.2.2 Enhanced Background Service Worker
- **GPT-4o-mini Integration**: Upgraded from o3-mini to more reliable chat completions
- **Advanced Prompt Engineering**: Optimized instructions for 20-50 term extraction
- **Robust Error Handling**: Comprehensive retry logic and fallback mechanisms
- **Enhanced JSON Parsing**: Improved extraction from various AI response formats
- **Performance Monitoring**: Logging and analytics for optimization

#### 2.2.3 Advanced Content Script
- **Modern UI Injection**: Floating action button + resizable sidebar architecture
- **Quotes Management System**: 30 witty quotes with smooth cycling animations
- **Onboarding Flow Controller**: 4-slide tutorial with navigation and persistence
- **Smart State Management**: Button state transitions with visual feedback
- **Resize Handle Logic**: Drag-to-resize with constraints and smooth performance
- **Enhanced Event Handling**: Debounced interactions and smooth animations
- **Personal Library System**: Term saving, library view, cross-video navigation
- **Export Management**: JSON library export with structured metadata

#### 2.2.4 Modern Settings Interface
- **Floating Label Design**: Contemporary form inputs with smooth animations
- **Glass Morphism Styling**: Modern backdrop blur and transparency effects
- **Auto-Flow UX**: Popup auto-close → sidebar auto-open workflow
- **Enhanced Validation**: Real-time input validation with visual feedback
- **Toast Notification System**: Beautiful success/error messages with animations

---

## 3. API Integration Specifications

### 3.1 Apify Integration
- **Service**: `scrape-creators~best-youtube-transcripts-scraper`
- **Endpoint**: `https://api.apify.com/v2/acts/{actorId}/run-sync-get-dataset-items`
- **Input Format**: `{ videoUrls: [string] }`
- **Output Processing**: Extract transcript array with timestamps and text
- **Error Handling**: Network failures, missing transcripts, API limits

### 3.2 OpenAI Integration (GPT-4o-mini)
- **Model**: GPT-4o-mini (upgraded for reliability and performance)
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Request Format**:
  ```json
  {
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "<enhanced_prompt>"}],
    "temperature": 0.3,
    "max_tokens": 4000
  }
  ```
- **Enhanced Prompting**: Comprehensive instructions targeting 20-50 sophisticated terms
- **Response Processing**: Robust parsing of chat completion format
- **Error Recovery**: Intelligent retry logic and fallback handling

### 3.3 Enhanced AI Prompt Engineering
The system uses sophisticated prompting to extract diverse terminology:

**Target Categories:**
- Academic/scholarly vocabulary (discourse, paradigm, methodology, synthesis)
- Technical terms from any field (cryptograms, supernova, mesmerism, empirical)
- Philosophical concepts (neoplatonism, transcendentalism, idealism, epistemology)
- Literary terms (Byronic hero, Gothic, allegory, symbolism, metaphor)
- Historical terms (milieu, epoch, antiquity, renaissance)
- Scientific concepts (quantum, paradigm, hypothesis, methodology)
- Uncommon adjectives/adverbs (prodigiously, enigmatic, esoteric, ubiquitous)
- Cultural references (Sage of Concord, Corpus Hermeticum, zeitgeist)

**Quality Requirements:**
- Minimum 20-50 terms per video
- Educational value for general audiences
- Clear, accessible definitions
- Contextual relevance to video content

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

## 4. Personal Library System Requirements

### 4.1 Term Collection & Storage
- **Save Functionality**: Heart button (🤍→❤️) on every term card for instant saving
- **Chrome Storage Integration**: Persistent term storage across browser sessions
- **Metadata Enrichment**: Automatically capture video URL, title, timestamp, and save date
- **Duplicate Prevention**: Smart detection to avoid saving the same term multiple times
- **Storage Efficiency**: Optimized data structure for fast retrieval and minimal memory usage

### 4.2 Library Interface Design
- **Toggle Navigation**: 📚 Library button in sidebar header with notification badge
- **Beautiful Library View**: Professional card-based layout with enhanced typography
- **Empty State**: Engaging instructions to encourage first saves
- **Search Functionality**: Real-time filtering by term name or definition
- **Export Controls**: One-click JSON export with structured metadata

### 4.3 Library Term Management
- **Rich Term Cards**: Display term, definition, video source, timestamp, and save date
- **Action Buttons**: Hover-revealed edit and delete controls
- **Video Navigation**: Click timestamps to jump to original video moments
- **Cross-Video Support**: Open different videos in new tabs with timestamp parameters
- **Bulk Operations**: Future support for bulk export, delete, and categorization

### 4.4 Library User Experience
- **Seamless Integration**: Library view fits naturally within existing sidebar design
- **State Management**: Proper view switching without losing context or data
- **Visual Feedback**: Toast notifications for save, remove, and export actions
- **Progressive Enhancement**: Library features enhance but don't interfere with core glossary functionality
- **Performance Optimization**: Efficient rendering for libraries with 100+ saved terms

---

## 5. Enhanced User Experience Requirements

### 4.1 Modern Visual Design
- **Pistachio Green Theme**: Primary colors lime-500 (#84cc16), lime-600 (#65a30d), lime-700 (#4d7c0f)
- **Glass Morphism Effects**: Backdrop blur, transparency, and depth layering
- **Typography**: Inter font family with enhanced readability (16px base, 18px titles)
- **Animations**: 60fps smooth transitions with micro-interactions
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation

### 4.2 Interactive Onboarding Experience
1. **Slide 1 - Welcome**: "Welcome to Glossify!" with feature overview
2. **Slide 2 - Smart Brain**: AI analysis explanation with brain emoji
3. **Slide 3 - Navigation**: Timestamp clicking demonstration
4. **Slide 4 - Get Started**: Call-to-action with "Glossify It!" button reference

**Features:**
- Smooth slide transitions with navigation dots
- Previous/Next buttons with proper state management
- Skip functionality for returning users
- Local storage persistence to avoid repetition

### 4.3 Delightful Waiting Experience
**Witty Quotes System** (30 rotating quotes):
- "🍕 Pizza gets delivered faster than this, but it's less educational!"
- "🧠 Your brain is about to get a vocabulary upgrade!"
- "🎪 Step right up to the greatest vocabulary show on earth!"
- "🚀 Rome wasn't built in a day, but this glossary might be!"

**Animation Features:**
- 4-second cycling with smooth fade transitions
- Bouncing thought bubble (💭) icon
- Gradient background with subtle pulsing
- Auto-stop when analysis completes

### 4.4 Smart Interaction Flow
1. **Configuration**: Modern popup with floating labels and auto-close
2. **Activation**: Floating action button or auto-opened sidebar
3. **Onboarding**: First-time tutorial (skippable for returning users)
4. **Processing**: AI analysis with entertaining quotes and progress
5. **Results**: Resizable sidebar with 20-50 interactive terms
6. **Term Saving**: Click heart buttons (🤍→❤️) to save interesting terms
7. **Navigation**: Click timestamps for precise video jumping
8. **Library Access**: Toggle to library view (📚) to review saved collection
9. **Cross-Video Learning**: Access saved terms from any video session
10. **Export & Backup**: Download personal library for offline access
11. **Reset**: "Start Over" button for new video analysis

### 4.5 Enhanced Performance Requirements
- **Sidebar Injection**: < 200ms with smooth animation
- **Resize Performance**: Real-time drag without lag or stuttering
- **Quote Cycling**: Smooth 4-second transitions without blocking
- **Memory Efficiency**: < 60MB additional browser memory usage
- **Animation Performance**: Consistent 60fps for all UI interactions

---

## 5. Development Phases (Updated Status)

### Phase 1: Foundation ✅ (Completed)
- [x] Extension structure with Manifest V3 compliance
- [x] API key storage and secure management
- [x] Reliable transcript fetching from Apify
- [x] GPT-4o-mini integration with chat completions
- [x] Basic sidebar with modern design foundation

### Phase 2: Core Features ✅ (Completed)
- [x] Advanced prompt engineering for 20-50 term extraction
- [x] Resizable sidebar with drag-to-resize functionality
- [x] Enhanced AI integration with robust error handling
- [x] Smart button states ("Glossify It!" → "Start Over")
- [x] Modern floating action button with sparkle effects

### Phase 3: User Experience Enhancement ✅ (Completed)
- [x] Pistachio green theme with glass morphism effects
- [x] Interactive 4-slide onboarding tutorial system
- [x] Witty waiting quotes (30 rotating quotes during analysis)
- [x] Enhanced typography with Inter fonts and improved readability
- [x] Auto-close popup → auto-open sidebar workflow
- [x] Personal Library system with term saving and collection management
- [x] Cross-video navigation and export functionality

### Phase 4: Polish & Optimization 🚧 (In Progress)
- [x] Comprehensive debugging utilities (resetOnboarding, showOnboarding)
- [x] Enhanced state management and error recovery
- [x] Personal vocabulary collection with persistent storage
- [ ] Performance optimizations and memory management
- [ ] Cross-browser compatibility testing
- [ ] Chrome Web Store preparation and submission

### Phase 5: Future Enhancements 📋 (Planned)
- [ ] Advanced library features (categories, tags, notes)
- [ ] Collaborative sharing of term collections
- [ ] Progress tracking and learning analytics
- [ ] Multi-language support and internationalization
- [ ] Integration with external vocabulary learning platforms

---

## 6. Technical Specifications

### 6.1 Browser Compatibility
- **Primary**: Chrome 88+
- **Secondary**: Edge 88+, Firefox (with Manifest V3 support)
- **Mobile**: Not initially supported

### 6.2 Enhanced Dependencies
- **External APIs**: OpenAI GPT-4o-mini API, Apify YouTube transcript scraper
- **Chrome APIs**: `chrome.storage.local`, `chrome.runtime`, `chrome.scripting`, `chrome.tabs`
- **Web Standards**: ES2020+, Fetch API, ResizeObserver, Intersection Observer
- **Fonts**: Inter font family from Google Fonts CDN
- **Icons**: Unicode emoji for consistent cross-platform rendering

### 6.3 Advanced Security Considerations
- **API Key Storage**: Chrome's encrypted local storage with proper scoping
- **Content Security Policy**: Strict CSP preventing XSS and injection attacks
- **Permission Principle**: Minimal required permissions with explicit declarations
- **HTTPS Enforcement**: All external communications over secure connections
- **Input Sanitization**: Comprehensive validation of all user inputs and API responses

### 6.4 Enhanced Performance Targets
- **Bundle Size**: < 600KB total extension size (includes enhanced features)
- **Memory Footprint**: < 60MB runtime memory (accommodates quotes and animations)
- **API Costs**: < $0.08 per video analysis (optimized prompt efficiency)
- **Network Usage**: Smart caching and efficient API call management
- **Animation Performance**: Consistent 60fps across all UI interactions
- **Resize Performance**: Real-time drag operations without performance degradation
- **Library Performance**: < 100ms rendering for libraries with 100+ terms
- **Search Performance**: Real-time filtering with < 50ms response time

### 6.5 Personal Library Data Architecture
```json
{
  "term": "phenomenology",
  "meaning": "The philosophical study of experience and consciousness.",
  "timestamp": "12:34",
  "seconds": 754,
  "context_excerpt": "when discussing phenomenology in relation to...",
  "tally": 3,
  "savedAt": "2025-09-17T10:30:00.000Z",
  "videoUrl": "https://youtube.com/watch?v=abc123",
  "videoTitle": "Philosophy Lecture - Consciousness and Reality"
}
```

**Storage Strategy:**
- Chrome local storage for persistence across sessions
- Efficient JSON serialization for fast read/write operations
- Automatic cleanup of orphaned or corrupted entries
- Export compatibility with standard vocabulary learning formats

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

## 9. Enhanced Success Metrics

### 9.1 User Engagement & Satisfaction
- **Daily Active Users**: Target 2,000+ within 6 months (increased from 1,000+)
- **Session Duration**: Average 20+ minutes per session (enhanced engagement)
- **Feature Adoption**: 
  - 90%+ try onboarding tutorial
  - 85%+ use resize functionality
  - 95%+ click timestamps for navigation
  - 70%+ read waiting quotes during analysis
- **Retention Rate**: 70%+ weekly retention (improved UX impact)

### 9.2 Technical Performance & Quality
- **Error Rate**: < 3% failed analyses (improved from 5%)
- **Response Time**: 95th percentile < 25 seconds (enhanced AI efficiency)
- **User Experience**: 4.7+ star rating on Chrome Web Store
- **Performance**: No UI lag during resize operations or quote cycling
- **Memory Efficiency**: Stay within 60MB memory budget across all features

### 9.3 Feature-Specific Metrics
- **Term Quality**: Average 25-35 terms per video (significant increase from ~10)
- **Onboarding Completion**: 80%+ complete full 4-slide tutorial
- **Sidebar Resize Usage**: 60%+ customize sidebar width at least once
- **Quote Engagement**: Users wait through average 3+ quote cycles
- **Auto-Flow Success**: 95%+ successful popup→sidebar transitions
- **Library Adoption**: 70%+ users save at least 5 terms to personal library
- **Cross-Video Usage**: 40%+ users access saved terms from different videos
- **Export Usage**: 25%+ users export their library at least once

### 9.4 Personal Library Success Metrics
- **Saving Behavior**: Average 8-12 terms saved per user session
- **Library Retention**: 85%+ of saved terms remain in library after 30 days
- **Cross-Session Usage**: 60%+ users access library across multiple browser sessions
- **Export Engagement**: 30%+ users export library within first month of usage
- **Search Utilization**: 50%+ users search their library when it contains 10+ terms

### 9.4 Operational Excellence
- **API Costs**: Maintain under $150/month operational costs (scaled for higher usage)
- **Chrome Web Store**: Achieve "Featured" status within 12 months
- **Support Requests**: < 2% of users require technical support
- **Update Adoption**: 90%+ users update within 1 week of release

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

## Conclusion

Smart Brain represents a significant evolution from a basic glossary tool to a comprehensive, delightful learning companion with persistent vocabulary collection. The v2.0.0 release establishes new standards for educational browser extensions through:

### 🎯 **Technical Excellence**
- Robust GPT-4o-mini integration with 20-50 term extraction
- Modern Manifest V3 architecture with enhanced security
- Performance-optimized UI with 60fps animations
- Comprehensive error handling and recovery systems
- Persistent personal library with cross-session term management

### 🎨 **Design Innovation** 
- Professional pistachio green theme with glass morphism
- Resizable interface for personalized user experience
- Interactive onboarding that educates and delights
- Witty waiting system that transforms analysis time into entertainment
- Beautiful library interface with smart metadata and export capabilities

### 🚀 **User Experience Leadership**
- Seamless auto-flow from configuration to usage
- Smart button states that guide user actions
- Enhanced accessibility and keyboard navigation
- Comprehensive debugging and testing utilities
- Personal vocabulary collection that grows with learning journey

### 📚 **Learning Platform Evolution**
- **From Single-Video Tool** → **Comprehensive Learning Platform**
- **From Temporary Analysis** → **Persistent Knowledge Building**
- **From Basic Definitions** → **Rich Educational Experience**
- **From Isolated Terms** → **Connected Learning Journey**

This requirements document serves as the definitive reference for Smart Brain's current capabilities and future development roadmap. All core features have been implemented and tested, with the Personal Library system representing a major advancement toward comprehensive vocabulary learning platform.

**Next Phase**: Focus on advanced library features (categorization, sharing), performance optimization, and Chrome Web Store preparation to share this transformative learning ecosystem with educators and students worldwide.

---

*Document Version: 2.1.0 | Last Updated: September 2025 | Status: Personal Library System Complete*