// src/content.js
// Injects UI into YouTube watch pages: Open Glossify button and sidebar. Communicates with background.

(async function(){
  function waitForVideo() {
    return new Promise((res) => {
      const check = () => {
        const v = document.querySelector("video");
        if (v) res(v);
        else setTimeout(check, 300);
      };
      check();
    });
  }

  const video = await waitForVideo();
  console.log("[Content] Video element found", video);

  function injectProcessButton() {
    if (document.getElementById("yt-glossary-button-container")) return;

    const container = document.createElement("div");
    container.id = "yt-glossary-button-container";
    container.style.position = "absolute";
    container.style.zIndex = "99999";
    container.style.top = "12px";
    container.style.right = "12px";
    container.style.fontFamily = "Arial, sans-serif";

    const btn = document.createElement("button");
    btn.id = "yt-glossary-process-btn";
    btn.innerText = "Open Glossify";
    btn.style.padding = "10px 14px";
    btn.style.borderRadius = "8px";
    btn.style.border = "none";
    btn.style.background = "#0078d4";
    btn.style.color = "#fff";
    btn.style.fontWeight = "600";
    btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
    btn.style.cursor = "pointer";

    container.appendChild(btn);
    const player = document.querySelector(".html5-video-player") || document.body;
    player.style.position = player.style.position || "relative";
    player.appendChild(container);

    btn.addEventListener("click", injectSidebar);
    console.log("[Content] Open Glossify button injected");
  }

  let sidebarRootEl = null;
  function injectSidebar() {
    if (sidebarRootEl) {
      sidebarRootEl.style.transform = "translateX(0%)"; 
      return;
    }
    const host = document.createElement("div");
    host.id = "yt-glossary-sidebar-host";
    host.style.position = "fixed";
    host.style.top = "0";
    host.style.right = "0";
    host.style.height = "100%";
    host.style.zIndex = "99998";
    host.style.width = "400px";
    host.style.maxWidth = "42%";
    host.style.boxShadow = "rgba(0,0,0,0.3) -4px 0 12px";
    host.style.background = "white";
    host.style.overflow = "auto";
    host.style.transition = "transform 0.25s ease";
    host.style.transform = "translateX(0%)";
    host.style.borderLeft = "1px solid #ddd";

    sidebarRootEl = host;
    document.body.appendChild(host);

    fetch(chrome.runtime.getURL("src/sidebar.html"))
      .then(r => r.text())
      .then(html => {
        host.innerHTML = html;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = chrome.runtime.getURL("src/sidebar.css");
        host.appendChild(link);
        setupSidebarBehavior();
        console.log("[Content] Sidebar injected");
      })
      .catch(err => {
        host.innerHTML = `<div style="padding:16px">Failed to load sidebar: ${err}</div>`;
        console.error("[Content] Sidebar failed to load:", err);
      });
  }

  function setupSidebarBehavior() {
    const toggle = document.getElementById("glossary-toggle-btn");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const host = document.getElementById("yt-glossary-sidebar-host");
        if (!host) return;
        const isHidden = host.style.transform === "translateX(100%)";
        host.style.transform = isHidden ? "translateX(0%)" : "translateX(100%)";
      });
    }
    const clearBtn = document.getElementById("glossary-clear-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        const list = document.getElementById("glossary-list");
        if (list) list.innerHTML = "";
        setSidebarStatus("Idle", false);
      });
    }
    const runBtn = document.getElementById("glossary-run-btn");
    if (runBtn) {
      runBtn.addEventListener("click", () => {
        const list = document.getElementById("glossary-list");
        if (list) list.innerHTML = ""; 
        onProcessClicked();            
      });
    }
    console.log("[Content] Sidebar behavior wired");
  }

  async function onProcessClicked() {
    injectSidebar();
    const url = location.href;
    console.log("[Content] Glossify run for URL:", url);

    setSidebarStatus("Fetching transcript from YouTube…", true);

    const runBtn = document.getElementById("glossary-run-btn");
    if (runBtn) runBtn.disabled = true;

    chrome.runtime.sendMessage({ type: "RUN_TRANSCRIPT_WORKFLOW", videoUrl: url }, (resp) => {
      console.log("[Content] Background response:", resp);

      if (!resp) {
        setSidebarStatus("No response from background.", false);
        if (runBtn) runBtn.disabled = false;
        return;
      }
      if (!resp.success) {
        setSidebarStatus("Error: " + (resp.error || "unknown"), false);
        if (runBtn) runBtn.disabled = false;
        return;
      }
      const glossary = resp.glossary || [];
      console.log("[Content] Rendering glossary with", glossary.length, "items");
      renderGlossary(glossary);
      setSidebarStatus("Glossary ready! Click a timestamp to jump.", false);
      if (runBtn) runBtn.disabled = false;
    });
  }

  function setSidebarStatus(msg, loading=false) {
    const el = document.getElementById("glossary-status");
    if (el) el.textContent = msg;

    const spinner = document.getElementById("glossary-spinner");
    if (spinner) spinner.style.display = loading ? "block" : "none";

    console.log("[Content] Sidebar status:", msg);
  }

  function renderGlossary(array) {
    const list = document.getElementById("glossary-list");
    if (!list) return;
    list.innerHTML = "";
    for (const item of array) {
      const li = document.createElement("div");
      li.className = "glossary-item";
      const ts = item.timestamp || secondsToTimestamp(item.seconds || 0);
      li.dataset.seconds = item.seconds || 0;
      li.innerHTML = `
        <div class="glossary-ts">[${ts}]</div>
        <div class="glossary-term"><strong>${escapeHtml(item.term || "—")}</strong> <span class="glossary-tally">(${item.tally||1})</span></div>
        <div class="glossary-meaning">${escapeHtml(item.meaning || "")}</div>
        <div class="glossary-context">${escapeHtml(item.context_excerpt || "")}</div>
      `;
      li.addEventListener("click", () => {
        const s = Number(li.dataset.seconds || 0);
        if (!isNaN(s) && video) {
          video.currentTime = Math.max(0, s - 0.2);
          video.play();
        }
      });
      list.appendChild(li);
    }
    console.log("[Content] Glossary rendered:", array.length, "items");
    startTimeSync();
  }

  let syncTimer = null;
  function startTimeSync() {
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(() => {
      const t = Math.floor(video.currentTime || 0);
      highlightForSeconds(t);
    }, 250);
  }

  function highlightForSeconds(seconds) {
    const items = document.querySelectorAll(".glossary-item");
    if (!items || items.length === 0) return;
    let nearest = null;
    let nearestDiff = Infinity;
    items.forEach(it => {
      const s = Number(it.dataset.seconds || 0);
      const diff = Math.abs(s - seconds);
      if (diff < nearestDiff) {
        nearestDiff = diff; nearest = it;
      }
      it.classList.remove("highlight");
    });
    if (nearest) {
      nearest.classList.add("highlight");
    }
  }

  function secondsToTimestamp(sec) {
    sec = Number(sec || 0);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
  }
  function pad(n){ return n.toString().padStart(2,'0'); }
  function escapeHtml(s) {
    if (!s) return "";
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      const list = document.getElementById("glossary-list");
      if (list) list.innerHTML = "";
      setSidebarStatus("Idle", false);
    }
  }, 1000);

  injectProcessButton();
})();
