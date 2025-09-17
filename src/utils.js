// src/utils.js
// Enhanced utilities for modern UI interactions and animations

export function timestampToSeconds(ts) {
  if (!ts) return 0;
  const parts = ts.split(":").map(p => Number(p));
  if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
  if (parts.length === 2) return parts[0]*60 + parts[1];
  return Number(ts) || 0;
}

export function secondsToTimestamp(sec) {
  sec = Math.floor(sec||0);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// Modern UI Animation Utilities
export class AnimationUtils {
  static createRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
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
    
    if (!document.querySelector('#ripple-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ripple-keyframes';
      style.textContent = `
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }
  
  static fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }
  
  static slideInFromRight(element, duration = 400) {
    element.style.transform = 'translateX(100%)';
    element.style.transition = `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateX(0)';
    });
  }
  
  static shake(element, intensity = 10) {
    const originalTransform = element.style.transform;
    let shakeCount = 0;
    const maxShakes = 6;
    
    const shakeAnimation = () => {
      if (shakeCount >= maxShakes) {
        element.style.transform = originalTransform;
        return;
      }
      
      const offset = shakeCount % 2 === 0 ? intensity : -intensity;
      element.style.transform = `${originalTransform} translateX(${offset}px)`;
      shakeCount++;
      
      setTimeout(shakeAnimation, 50);
    };
    
    shakeAnimation();
  }
  
  static pulse(element, scale = 1.1, duration = 200) {
    const originalTransform = element.style.transform;
    element.style.transition = `transform ${duration}ms ease`;
    element.style.transform = `${originalTransform} scale(${scale})`;
    
    setTimeout(() => {
      element.style.transform = originalTransform;
    }, duration);
  }
  
  static staggeredFadeIn(elements, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.fadeIn(element);
      }, index * delay);
    });
  }
}

// Toast Notification System
export class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }
  
  init() {
    if (document.getElementById('toast-container')) return;
    
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10001;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    
    document.body.appendChild(this.container);
  }
  
  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    
    toast.style.cssText = `
      background: white;
      border-left: 4px solid ${colors[type]};
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      max-width: 400px;
      pointer-events: auto;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    toast.innerHTML = `
      <span style="font-size: 18px;">${icons[type]}</span>
      <span style="flex: 1;">${message}</span>
      <button onclick="this.parentElement.remove()" style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 18px;">×</button>
    `;
    
    this.container.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
    
    return toast;
  }
}

// Enhanced Loading States
export class LoadingManager {
  static createSkeletonCard() {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.style.cssText = `
      background: #f0f0f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      animation: skeleton-pulse 1.5s ease-in-out infinite alternate;
    `;
    
    skeleton.innerHTML = `
      <div style="height: 12px; background: #e0e0e0; border-radius: 6px; margin-bottom: 12px; width: 60%;"></div>
      <div style="height: 16px; background: #e0e0e0; border-radius: 8px; margin-bottom: 8px;"></div>
      <div style="height: 14px; background: #e0e0e0; border-radius: 7px; width: 80%;"></div>
    `;
    
    if (!document.querySelector('#skeleton-styles')) {
      const style = document.createElement('style');
      style.id = 'skeleton-styles';
      style.textContent = `
        @keyframes skeleton-pulse {
          0% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `;
      document.head.appendChild(style);
    }
    
    return skeleton;
  }
  
  static showSkeletonList(container, count = 3) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      container.appendChild(this.createSkeletonCard());
    }
  }
}

// Performance Monitoring
export class PerformanceMonitor {
  static measureTime(name) {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
        return duration;
      }
    };
  }
  
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Accessibility Utilities
export class A11yUtils {
  static announceToScreenReader(message) {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    document.body.appendChild(announcer);
    announcer.textContent = message;
    
    setTimeout(() => announcer.remove(), 1000);
  }
  
  static trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    firstElement.focus();
    
    return () => container.removeEventListener('keydown', handleKeyDown);
  }
}

// Global error handler for enhanced debugging
window.addEventListener('error', (event) => {
  console.error('[Glossify Error]', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

// Export all utilities as a single object for easy importing
export const GlossifyUtils = {
  AnimationUtils,
  ToastManager,
  LoadingManager,
  PerformanceMonitor,
  A11yUtils,
  timestampToSeconds,
  secondsToTimestamp
};
