// src/popup.js
// Enhanced popup with modern UI interactions and better UX

class PopupUI {
  constructor() {
    this.openaiInput = document.getElementById("openaiKey");
    this.apifyInput = document.getElementById("apifyToken");
    this.saveBtn = document.getElementById("saveBtn");
    this.clearBtn = document.getElementById("clearBtn");
    this.toast = document.getElementById("toast");
    this.toastIcon = document.getElementById("toastIcon");
    this.toastMessage = document.getElementById("toastMessage");
    
    this.init();
  }
  
  init() {
    this.loadSavedKeys();
    this.setupEventListeners();
    this.setupFormValidation();
  }
  
  loadSavedKeys() {
    chrome.storage.local.get(["openaiKey", "apifyToken"], (items) => {
      if (items.openaiKey) {
        this.openaiInput.value = items.openaiKey;
      }
      if (items.apifyToken) {
        this.apifyInput.value = items.apifyToken;
      }
    });
  }
  
  setupEventListeners() {
    this.saveBtn.addEventListener("click", () => this.handleSave());
    this.clearBtn.addEventListener("click", () => this.handleClear());
    
    // Add ripple effect to buttons
    [this.saveBtn, this.clearBtn].forEach(btn => {
      btn.addEventListener("click", this.createRipple);
    });
    
    // Form validation on input
    this.openaiInput.addEventListener("input", () => this.validateForm());
    this.apifyInput.addEventListener("input", () => this.validateForm());
  }
  
  setupFormValidation() {
    this.validateForm();
  }
  
  validateForm() {
    const openaiKey = this.openaiInput.value.trim();
    const isValid = openaiKey.length > 0;
    
    if (isValid) {
      this.saveBtn.disabled = false;
      this.saveBtn.style.opacity = "1";
    } else {
      this.saveBtn.disabled = true;
      this.saveBtn.style.opacity = "0.6";
    }
  }
  
  async handleSave() {
    const openaiKey = this.openaiInput.value.trim();
    const apifyToken = this.apifyInput.value.trim() || "SAMPLE_KEY";
    
    if (!openaiKey) {
      this.showToast("OpenAI API key is required", "error");
      return;
    }
    
    // Show loading state
    this.setButtonLoading(this.saveBtn, true);
    
    try {
      await new Promise((resolve) => {
        chrome.storage.local.set({ openaiKey, apifyToken }, resolve);
      });
      
      // Simulate brief loading for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.showToast("Configuration saved successfully! ✨", "success");
      
      // Auto-close popup and open sidebar after successful save
      setTimeout(() => {
        this.autoOpenSidebar();
        window.close();
      }, 1000);
      
    } catch (error) {
      console.error("Save error:", error);
      this.showToast("Failed to save configuration", "error");
    } finally {
      this.setButtonLoading(this.saveBtn, false);
    }
  }
  
  autoOpenSidebar() {
    // Get the current active tab and inject sidebar
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('youtube.com/watch')) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: "OPEN_SIDEBAR_WITH_ONBOARDING" 
        }, (response) => {
          console.log("Sidebar opened with onboarding:", response);
        });
      }
    });
  }
  
  async handleClear() {
    // Show loading state
    this.setButtonLoading(this.clearBtn, true);
    
    try {
      await new Promise((resolve) => {
        chrome.storage.local.remove(["openaiKey", "apifyToken"], resolve);
      });
      
      // Clear form fields
      this.openaiInput.value = "";
      this.apifyInput.value = "";
      
      // Simulate brief loading for UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      this.showToast("All keys cleared", "success");
      this.validateForm();
    } catch (error) {
      console.error("Clear error:", error);
      this.showToast("Failed to clear keys", "error");
    } finally {
      this.setButtonLoading(this.clearBtn, false);
    }
  }
  
  setButtonLoading(button, loading) {
    if (loading) {
      button.classList.add("btn-loading");
      button.disabled = true;
    } else {
      button.classList.remove("btn-loading");
      button.disabled = false;
      this.validateForm(); // Re-validate after loading
    }
  }
  
  showToast(message, type = "success") {
    // Set toast content
    this.toastMessage.textContent = message;
    
    // Set icon and class based on type
    if (type === "success") {
      this.toastIcon.textContent = "✅";
      this.toast.className = "toast toast-success";
    } else if (type === "error") {
      this.toastIcon.textContent = "❌";
      this.toast.className = "toast toast-error";
    }
    
    // Show toast
    this.toast.classList.add("show");
    
    // Hide after 3 seconds
    setTimeout(() => {
      this.toast.classList.remove("show");
    }, 3000);
  }
  
  createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    // Add ripple animation keyframes if not already present
    if (!document.querySelector("#ripple-styles")) {
      const style = document.createElement("style");
      style.id = "ripple-styles";
      style.textContent = `
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PopupUI();
});
