// src/popup.js
document.addEventListener("DOMContentLoaded", () => {
  const openaiInput = document.getElementById("openaiKey");
  const apifyInput = document.getElementById("apifyToken");
  const status = document.getElementById("status");

  // Load saved keys
  chrome.storage.local.get(["openaiKey", "apifyToken"], (items) => {
    if (items.openaiKey) openaiInput.value = items.openaiKey;
    if (items.apifyToken) apifyInput.value = items.apifyToken;
  });

  document.getElementById("saveBtn").addEventListener("click", () => {
    const openaiKey = openaiInput.value.trim();
    const apifyToken = apifyInput.value.trim();
    chrome.storage.local.set({ openaiKey, apifyToken }, () => {
      status.textContent = "Saved.";
      setTimeout(()=>status.textContent="", 2000);
    });
  });

  document.getElementById("clearBtn").addEventListener("click", () => {
    chrome.storage.local.remove(["openaiKey", "apifyToken"], () => {
      openaiInput.value = "";
      apifyInput.value = "";
      status.textContent = "Cleared.";
      setTimeout(()=>status.textContent="", 2000);
    });
  });
});
