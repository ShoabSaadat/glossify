// src/content.js
// Enhanced content script with modern UI and smooth interactions
// Injects UI into YouTube watch pages: Modern Glossify FAB and sidebar with enhanced UX

(async function(){
  // Enhanced UI class for modern interactions
  class GlossifyUI {
    constructor() {
      this.sidebarRootEl = null;
      this.syncTimer = null;
      this.video = null;
      this.lastUrl = location.href;
      this.isAnalyzing = false;
      this.isAnalyzed = false; // Track if video has been analyzed
      this.quotesTimer = null; // Timer for cycling quotes
      
      // Witty waiting quotes with emojis
      this.waitingQuotes = [
        "🍕 Pizza gets delivered faster than this, but it's less educational!",
        "🎬 Meanwhile, somewhere in Hollywood, a movie is being made...",
        "🐌 Even snails are wondering what's taking so long!",
        "☕ Perfect time for a coffee break! ☕",
        "🧠 Your brain is about to get a vocabulary upgrade!",
        "🎯 Good things come to those who wait... and analyze!",
        "🚀 Rome wasn't built in a day, but this glossary might be!",
        "🎪 Patience is a virtue... also a waiting room magazine!",
        "🎨 Michelangelo took 4 years for the Sistine Chapel, we'll be quicker!",
        "🐢 Slow and steady wins the race... and learns new words!",
        "🎵 This is the song that never ends... oh wait, it will!",
        "🍿 Grab some popcorn, the AI show is in progress!",
        "🎲 Rolling the dice of knowledge extraction...",
        "🔍 Searching for words you didn't know you needed to know!",
        "📚 Building your personal dictionary, one term at a time!",
        "🎪 Step right up to the greatest vocabulary show on earth!",
        "🧩 Putting together the puzzle of sophisticated terminology!",
        "🎭 The drama of waiting... coming to a sidebar near you!",
        "🎨 Painting a masterpiece of educational content!",
        "🚂 All aboard the knowledge train! Next stop: Vocabulary Station!",
        "🎪 Ladies and gentlemen, the amazing AI word extractor!",
        "🍯 Sweet knowledge is being harvested by our AI bees!",
        "🎯 Aiming for the bullseye of perfect definitions!",
        "🎪 The greatest show on earth: Your Personal Glossary!",
        "🧠 Neural networks are networking... please stand by!",
        "🎨 Creating a Mona Lisa of terminology... with less mysterious smiles!",
        "📖 Writing the next chapter of your learning journey!",
        "🎵 Humming the tune of educational excellence!",
        "🚀 Houston, we have... sophisticated vocabulary incoming!",
        "🎭 Plot twist: You're about to learn something amazing!"
      ];
      
      this.init();
    }
    
    async init() {
      this.video = await this.waitForVideo();
      console.log("[Content] Video element found", this.video);
      this.injectModernFAB();
      this.setupUrlChangeDetection();
    }
    
    waitForVideo() {
      return new Promise((resolve) => {
        const check = () => {
          const v = document.querySelector("video");
          if (v) resolve(v);
          else setTimeout(check, 300);
        };
        check();
      });
    }
    
    injectModernFAB() {
      if (document.getElementById("glossify-fab-container")) return;

      const container = document.createElement("div");
      container.id = "glossify-fab-container";
      container.className = "glossify-fab-container";
      container.style.cssText = `
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 9999;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      `;

      const fab = document.createElement("button");
      fab.id = "glossify-fab";
      fab.className = "glossify-fab";
      fab.style.cssText = `
        background: linear-gradient(135deg, #65a30d 0%, #4d7c0f 100%);
        border: none;
        border-radius: 16px;
        padding: 12px 20px;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 14px;
        font-family: inherit;
        box-shadow: 0 8px 16px rgba(132, 204, 22, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        overflow: hidden;
      `;

      fab.innerHTML = `
        <div class="fab-content" style="display: flex; align-items: center; gap: 8px; z-index: 1; position: relative;">
          <span style="font-size: 16px;">🧠</span>
          <span>Glossify</span>
        </div>
        <div class="fab-ripple" style="position: absolute; top: 50%; left: 50%; width: 0; height: 0; border-radius: 50%; background: rgba(255, 255, 255, 0.3); transform: translate(-50%, -50%); transition: width 0.6s, height 0.6s;"></div>
      `;

      // Add hover effects
      fab.addEventListener('mouseenter', () => {
        fab.style.transform = 'translateY(-4px) scale(1.05)';
        fab.style.boxShadow = '0 12px 24px rgba(132, 204, 22, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15)';
      });

      fab.addEventListener('mouseleave', () => {
        fab.style.transform = 'translateY(0) scale(1)';
        fab.style.boxShadow = '0 8px 16px rgba(132, 204, 22, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)';
      });

      // Add ripple effect
      fab.addEventListener('click', (e) => {
        const ripple = fab.querySelector('.fab-ripple');
        ripple.style.width = '100px';
        ripple.style.height = '100px';
        setTimeout(() => {
          ripple.style.width = '0';
          ripple.style.height = '0';
        }, 600);
        
        this.injectModernSidebar();
      });

      container.appendChild(fab);
      
      const player = document.querySelector(".html5-video-player") || document.body;
      player.style.position = player.style.position || "relative";
      player.appendChild(container);

      console.log("[Content] Modern Glossify FAB injected");
    }
    
    injectModernSidebar() {
      if (this.sidebarRootEl) {
        this.sidebarRootEl.classList.add('open');
        return;
      }
      
      const host = document.createElement("div");
      host.id = "yt-glossary-sidebar-host";
      host.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        height: 100%;
        z-index: 99998;
      `;

      this.sidebarRootEl = host;
      document.body.appendChild(host);

      fetch(chrome.runtime.getURL("src/sidebar.html"))
        .then(r => r.text())
        .then(html => {
          host.innerHTML = html;
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = chrome.runtime.getURL("src/sidebar.css");
          host.appendChild(link);
          
          // Add the open class to trigger animation
          setTimeout(() => {
            host.querySelector('.glossary-sidebar').classList.add('open');
          }, 100);
          
          this.setupSidebarBehavior();
          this.showEmptyState();
          console.log("[Content] Modern sidebar injected");
        })
        .catch(err => {
          host.innerHTML = `<div style="padding:16px; color: red;">Failed to load sidebar: ${err}</div>`;
          console.error("[Content] Sidebar failed to load:", err);
        });
    }
    
    setupSidebarBehavior() {
      const toggle = document.getElementById("glossary-toggle-btn");
      if (toggle) {
        toggle.addEventListener("click", () => {
          const sidebar = document.querySelector('.glossary-sidebar');
          if (sidebar) {
            sidebar.classList.toggle('open');
          }
        });
      }
      
      const clearBtn = document.getElementById("glossary-clear-btn");
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          this.clearGlossary();
        });
      }
      
      const runBtn = document.getElementById("glossary-run-btn");
      if (runBtn) {
        runBtn.addEventListener("click", () => {
          this.onAnalyzeClicked();
        });
        // Initialize button state
        this.updateButtonState();
      }
      
      const searchInput = document.getElementById("glossary-search");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.filterTerms(e.target.value);
        });
      }
      
      // Setup onboarding functionality
      this.setupOnboarding();
      
      // Setup resize functionality
      this.setupResizeHandle();
      
      console.log("[Content] Modern sidebar behavior wired");
    }
    
    setupOnboarding() {
      const overlay = document.getElementById('onboardingOverlay');
      const skipBtn = document.getElementById('skipOnboarding');
      const prevBtn = document.getElementById('prevSlide');
      const nextBtn = document.getElementById('nextSlide');
      const dots = document.querySelectorAll('.dot');
      const slides = document.querySelectorAll('.slide');
      
      let currentSlide = 0;
      const totalSlides = slides.length;
      
      const updateSlide = (index) => {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update navigation
        prevBtn.disabled = index === 0;
        if (index === totalSlides - 1) {
          nextBtn.textContent = 'Get Started!';
        } else {
          nextBtn.textContent = 'Next';
        }
        
        currentSlide = index;
      };
      
      const closeOnboarding = () => {
        if (overlay) {
          overlay.classList.add('hidden');
        }
        // Store that user has seen onboarding
        chrome.storage.local.set({ hasSeenOnboarding: true });
      };
      
      // Event listeners
      if (skipBtn) {
        skipBtn.addEventListener('click', closeOnboarding);
      }
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentSlide > 0) {
            updateSlide(currentSlide - 1);
          }
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentSlide < totalSlides - 1) {
            updateSlide(currentSlide + 1);
          } else {
            closeOnboarding();
          }
        });
      }
      
      // Dot navigation
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          updateSlide(index);
        });
      });
      
      // Initialize first slide
      updateSlide(0);
    }
    
    showOnboarding() {
      console.log("[Content] showOnboarding called");
      const overlay = document.getElementById('onboardingOverlay');
      if (overlay) {
        console.log("[Content] Onboarding overlay found, showing...");
        overlay.classList.remove('hidden');
      } else {
        console.log("[Content] Onboarding overlay not found!");
      }
    }
    
    setupResizeHandle() {
      const resizeHandle = document.getElementById('resizeHandle');
      const sidebar = document.querySelector('.glossary-sidebar');
      
      if (!resizeHandle || !sidebar) return;
      
      let isResizing = false;
      let startX = 0;
      let startWidth = 0;
      
      const startResize = (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
        
        sidebar.classList.add('resizing');
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        
        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);
        
        e.preventDefault();
      };
      
      const doResize = (e) => {
        if (!isResizing) return;
        
        const deltaX = startX - e.clientX;
        const newWidth = startWidth + deltaX;
        
        // Apply constraints
        const minWidth = 300;
        const maxWidth = Math.min(window.innerWidth * 0.8, 800);
        const constrainedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
        
        sidebar.style.width = `${constrainedWidth}px`;
      };
      
      const stopResize = () => {
        isResizing = false;
        
        sidebar.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('mouseup', stopResize);
        
        // Save the new width to localStorage
        const currentWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
        chrome.storage.local.set({ sidebarWidth: currentWidth });
      };
      
      // Load saved width
      chrome.storage.local.get(['sidebarWidth'], (result) => {
        if (result.sidebarWidth) {
          const minWidth = 300;
          const maxWidth = Math.min(window.innerWidth * 0.8, 800);
          const savedWidth = Math.max(minWidth, Math.min(result.sidebarWidth, maxWidth));
          sidebar.style.width = `${savedWidth}px`;
        }
      });
      
      resizeHandle.addEventListener('mousedown', startResize);
      
      // Handle window resize
      window.addEventListener('resize', () => {
        const currentWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
        const maxWidth = Math.min(window.innerWidth * 0.8, 800);
        if (currentWidth > maxWidth) {
          sidebar.style.width = `${maxWidth}px`;
        }
      });
    }
    
    showEmptyState() {
      const content = document.getElementById("glossaryContent");
      if (!content) return;
      
      const emptyState = document.getElementById("emptyState");
      const loadingState = document.getElementById("loadingState");
      const glossaryList = document.getElementById("glossary-list");
      
      if (emptyState) emptyState.classList.remove("hidden");
      if (loadingState) loadingState.classList.add("hidden");
      if (glossaryList) glossaryList.classList.add("hidden");
      
      // Stop quotes cycling when leaving loading state
      this.stopQuotesCycling();
    }
    
    showLoadingState() {
      const content = document.getElementById("glossaryContent");
      if (!content) return;
      
      const emptyState = document.getElementById("emptyState");
      const loadingState = document.getElementById("loadingState");
      const glossaryList = document.getElementById("glossary-list");
      
      if (emptyState) emptyState.classList.add("hidden");
      if (loadingState) loadingState.classList.remove("hidden");
      if (glossaryList) glossaryList.classList.add("hidden");
      
      this.startLoadingProgress();
      this.startQuotesCycling();
    }
    
    startQuotesCycling() {
      // Show initial quote
      this.showRandomQuote();
      
      // Cycle quotes every 4 seconds
      this.quotesTimer = setInterval(() => {
        this.showRandomQuote();
      }, 4000);
    }
    
    showRandomQuote() {
      const quoteElement = document.getElementById("quoteText");
      if (!quoteElement) return;
      
      const randomQuote = this.waitingQuotes[Math.floor(Math.random() * this.waitingQuotes.length)];
      
      // Fade out
      quoteElement.style.opacity = '0';
      quoteElement.style.transform = 'translateY(10px)';
      
      // Change text and fade in
      setTimeout(() => {
        quoteElement.textContent = randomQuote;
        quoteElement.style.opacity = '1';
        quoteElement.style.transform = 'translateY(0)';
      }, 200);
    }
    
    stopQuotesCycling() {
      if (this.quotesTimer) {
        clearInterval(this.quotesTimer);
        this.quotesTimer = null;
      }
    }
    
    startLoadingProgress() {
      const progressSteps = [
        'Fetching transcript from YouTube...',
        'Processing with Smart Brain AI...',
        'Extracting sophisticated vocabulary...',
        'Building comprehensive glossary...'
      ];
      
      let currentStep = 0;
      const progressText = document.getElementById("progressText");
      const loadingText = document.getElementById("loadingText");
      
      if (progressText) progressText.textContent = progressSteps[0];
      if (loadingText) loadingText.textContent = progressSteps[0];
      
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < progressSteps.length) {
          if (progressText) progressText.textContent = progressSteps[currentStep];
          if (loadingText) loadingText.textContent = progressSteps[currentStep];
        } else {
          clearInterval(interval);
        }
      }, 3000);
    }
    
    showGlossaryList() {
      const emptyState = document.getElementById("emptyState");
      const loadingState = document.getElementById("loadingState");
      const glossaryList = document.getElementById("glossary-list");
      const sidebarFooter = document.getElementById("sidebarFooter");
      
      if (emptyState) emptyState.classList.add("hidden");
      if (loadingState) loadingState.classList.add("hidden");
      if (glossaryList) glossaryList.classList.remove("hidden");
      if (sidebarFooter) sidebarFooter.classList.remove("hidden");
    }
    
    clearGlossary() {
      const glossaryList = document.getElementById("glossary-list");
      if (glossaryList) glossaryList.innerHTML = "";
      
      this.setSidebarStatus("Ready to analyze", false);
      this.showEmptyState();
      
      // Reset analyzed state and update button
      this.isAnalyzed = false;
      this.updateButtonState();
      
      if (this.syncTimer) {
        clearInterval(this.syncTimer);
        this.syncTimer = null;
      }
    }
    
    updateButtonState() {
      const runBtn = document.getElementById("glossary-run-btn");
      if (!runBtn) return;
      
      const buttonSpan = runBtn.querySelector('span:last-child');
      if (this.isAnalyzed) {
        if (buttonSpan) buttonSpan.textContent = 'Start Over';
        runBtn.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
        runBtn.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.3)';
      } else {
        if (buttonSpan) buttonSpan.textContent = 'Glossify It!';
        runBtn.style.background = 'linear-gradient(135deg, #84cc16, #65a30d)';
        runBtn.style.boxShadow = '0 4px 15px rgba(132, 204, 22, 0.3)';
      }
    }
    
    async onAnalyzeClicked() {
      if (this.isAnalyzing) return;
      
      // If already analyzed, clear and reset
      if (this.isAnalyzed) {
        this.clearGlossary();
        this.isAnalyzed = false;
        this.updateButtonState();
        this.showEmptyState();
        return;
      }
      
      this.injectModernSidebar();
      const url = location.href;
      console.log("[Content] Glossify analysis started for URL:", url);

      this.isAnalyzing = true;
      this.showLoadingState();
      this.setSidebarStatus("Glossifying video transcript...", true);

      const runBtn = document.getElementById("glossary-run-btn");
      if (runBtn) {
        runBtn.disabled = true;
        const buttonSpan = runBtn.querySelector('span:last-child');
        if (buttonSpan) buttonSpan.textContent = 'Glossifying...';
      }

      chrome.runtime.sendMessage({ type: "RUN_TRANSCRIPT_WORKFLOW", videoUrl: url }, (resp) => {
        this.isAnalyzing = false;
        console.log("[Content] Background response:", resp);

        if (!resp) {
          this.setSidebarStatus("No response from background service.", false);
          this.showEmptyState();
          if (runBtn) {
            runBtn.disabled = false;
            this.updateButtonState();
          }
          return;
        }
        
        if (!resp.success) {
          this.setSidebarStatus("Error: " + (resp.error || "Unknown error occurred"), false);
          this.showEmptyState();
          if (runBtn) {
            runBtn.disabled = false;
            this.updateButtonState();
          }
          return;
        }
        
        const glossary = resp.glossary || [];
        console.log("[Content] Rendering modern glossary with", glossary.length, "items");
        this.renderModernGlossary(glossary);
        this.setSidebarStatus(`Glossary ready! Found ${glossary.length} terms.`, false);
        
        // Mark as analyzed and update button state
        this.isAnalyzed = true;
        this.updateButtonState();
        
        if (runBtn) runBtn.disabled = false;
      });
    }
    
    setSidebarStatus(msg, loading = false) {
      const statusEl = document.getElementById("glossary-status");
      if (statusEl) statusEl.textContent = msg;

      // Handle new progress container
      const newSpinner = document.getElementById("progressContainer");
      
      if (newSpinner) {
        if (loading) {
          newSpinner.classList.remove("hidden");
        } else {
          newSpinner.classList.add("hidden");
        }
      }

      console.log("[Content] Sidebar status:", msg);
    }
    
    renderModernGlossary(array) {
      const list = document.getElementById("glossary-list");
      if (!list) return;
      
      list.innerHTML = "";
      this.showGlossaryList();
      
      // Stop quotes cycling when showing results
      this.stopQuotesCycling();
      
      // Update stats
      const termCount = document.getElementById("termCount");
      if (termCount) termCount.textContent = array.length;
      
      const videoLength = document.getElementById("videoLength");
      if (videoLength && this.video) {
        const duration = this.video.duration || 0;
        videoLength.textContent = this.secondsToTimestamp(duration);
      }
      
      for (const [index, item] of array.entries()) {
        const card = document.createElement("div");
        card.className = "glossary-item";
        card.style.animationDelay = `${index * 0.1}s`;
        
        const ts = item.timestamp || this.secondsToTimestamp(item.seconds || 0);
        card.dataset.seconds = item.seconds || 0;
        
        card.innerHTML = `
          <div class="glossary-ts" onclick="event.stopPropagation();" style="cursor: pointer;">
            <span>▶</span> ${ts}
          </div>
          <div class="glossary-term">
            <strong>${this.escapeHtml(item.term || "—")}</strong>
            <span class="glossary-tally">×${item.tally || 1}</span>
          </div>
          <div class="glossary-meaning">${this.escapeHtml(item.meaning || "")}</div>
          <div class="glossary-context">${this.escapeHtml(item.context_excerpt || "")}</div>
        `;
        
        // Add click handlers
        const timestamp = card.querySelector('.glossary-ts');
        timestamp.addEventListener("click", (e) => {
          e.stopPropagation();
          this.seekToTime(Number(card.dataset.seconds || 0));
        });
        
        card.addEventListener("click", () => {
          this.seekToTime(Number(card.dataset.seconds || 0));
        });
        
        list.appendChild(card);
      }
      
      console.log("[Content] Modern glossary rendered:", array.length, "items");
      this.startTimeSync();
    }
    
    seekToTime(seconds) {
      if (!this.video || isNaN(seconds)) return;
      
      this.video.currentTime = Math.max(0, seconds - 0.2);
      this.video.play();
      
      // Visual feedback - highlight the clicked term
      const items = document.querySelectorAll(".glossary-item");
      items.forEach(item => {
        item.classList.remove("highlight");
      });
      
      const targetItem = document.querySelector(`[data-seconds="${seconds}"]`);
      if (targetItem) {
        targetItem.classList.add("highlight");
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove highlight after 3 seconds to show it was clicked
        setTimeout(() => {
          // Only remove if this is still the manually clicked item
          if (targetItem.classList.contains("highlight")) {
            // Check if we should keep it highlighted due to video time sync
            const currentTime = Math.floor(this.video.currentTime || 0);
            const itemTime = Number(targetItem.dataset.seconds || 0);
            if (Math.abs(currentTime - itemTime) > 5) {
              targetItem.classList.remove("highlight");
            }
          }
        }, 3000);
      }
    }
    
    startTimeSync() {
      if (this.syncTimer) clearInterval(this.syncTimer);
      
      this.syncTimer = setInterval(() => {
        if (!this.video) return;
        
        const currentTime = Math.floor(this.video.currentTime || 0);
        this.highlightForSeconds(currentTime);
      }, 250);
    }
    
    highlightForSeconds(seconds) {
      const items = document.querySelectorAll(".glossary-item");
      if (!items || items.length === 0) return;
      
      let nearest = null;
      let nearestDiff = Infinity;
      
      items.forEach(item => {
        const itemSeconds = Number(item.dataset.seconds || 0);
        const diff = Math.abs(itemSeconds - seconds);
        
        if (diff < nearestDiff) {
          nearestDiff = diff;
          nearest = item;
        }
      });
      
      // Remove existing highlights
      items.forEach(item => {
        // Only remove highlight if it's not manually clicked (within last 3 seconds)
        if (!item.dataset.manuallyClicked) {
          item.classList.remove("highlight");
        }
      });
      
      // Add highlight to nearest term (within 5 second tolerance)
      if (nearest && nearestDiff <= 5) {
        nearest.classList.add("highlight");
      }
    }
    
    filterTerms(query) {
      const cards = document.querySelectorAll('.glossary-item');
      const searchClear = document.getElementById('searchClear');
      
      if (query.length > 0) {
        if (searchClear) searchClear.classList.remove('hidden');
      } else {
        if (searchClear) searchClear.classList.add('hidden');
      }
      
      cards.forEach(card => {
        const term = card.querySelector('.glossary-term').textContent.toLowerCase();
        const meaning = card.querySelector('.glossary-meaning').textContent.toLowerCase();
        const matches = term.includes(query.toLowerCase()) || meaning.includes(query.toLowerCase());
        
        if (matches) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    }
    
    setupUrlChangeDetection() {
      setInterval(() => {
        if (location.href !== this.lastUrl) {
          this.lastUrl = location.href;
          this.clearGlossary();
          
          // Re-inject FAB if needed
          if (!document.getElementById("glossify-fab-container")) {
            setTimeout(() => this.injectModernFAB(), 1000);
          }
        }
      }, 1000);
    }
    
    secondsToTimestamp(sec) {
      sec = Number(sec || 0);
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60);
      if (h > 0) return `${this.pad(h)}:${this.pad(m)}:${this.pad(s)}`;
      return `${this.pad(m)}:${this.pad(s)}`;
    }
    
    pad(n) {
      return n.toString().padStart(2, '0');
    }
    
    escapeHtml(s) {
      if (!s) return "";
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  }

  // Initialize the enhanced UI
  const glossifyUI = new GlossifyUI();

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "OPEN_SIDEBAR_WITH_ONBOARDING") {
      console.log("[Content] Received OPEN_SIDEBAR_WITH_ONBOARDING message");
      glossifyUI.injectModernSidebar();
      
      // Check if user has seen onboarding
      chrome.storage.local.get(['hasSeenOnboarding'], (result) => {
        console.log("[Content] Onboarding storage check:", result);
        if (!result.hasSeenOnboarding) {
          console.log("[Content] User hasn't seen onboarding, will show after delay");
          // Show onboarding after sidebar is loaded
          setTimeout(() => {
            glossifyUI.showOnboarding();
          }, 500);
        } else {
          console.log("[Content] User has already seen onboarding, skipping");
        }
      });
      
      sendResponse({ success: true });
    }
    return true;
  });

  // Legacy compatibility functions for existing functionality
  window.injectProcessButton = () => glossifyUI.injectModernFAB();
  window.injectSidebar = () => glossifyUI.injectModernSidebar();
  window.onProcessClicked = () => glossifyUI.onAnalyzeClicked();
  
  // Debug function to reset onboarding for testing
  window.resetOnboarding = () => {
    chrome.storage.local.remove(['hasSeenOnboarding'], () => {
      console.log("[Content] Onboarding flag reset! Next sidebar open will show onboarding.");
    });
  };
  
  // Debug function to show onboarding manually
  window.showOnboarding = () => {
    glossifyUI.showOnboarding();
  };
  
})();
