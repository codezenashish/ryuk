const DEFAULT_SERVER_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
  // DOM Element References
  const openSettingsBtn = document.getElementById("openSettingsBtn");
  const goToSettingsBtn = document.getElementById("goToSettingsBtn");
  const noKeyView = document.getElementById("noKeyView");
  const mainView = document.getElementById("mainView");
  const titleInput = document.getElementById("titleInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const iconInput = document.getElementById("iconInput");
  const faviconImg = document.getElementById("faviconImg");
  const urlDisplay = document.getElementById("urlDisplay");
  const saveBtn = document.getElementById("saveBtn");
  const statusMsg = document.getElementById("statusMsg");

  // Settings Link Listener
  const openOptionsPage = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  };

  openSettingsBtn.addEventListener("click", openOptionsPage);
  goToSettingsBtn.addEventListener("click", openOptionsPage);

  // 1. Retrieve Settings from chrome.storage.sync
  let settings;
  try {
    settings = await chrome.storage.sync.get(["apiKey", "serverUrl"]);
  } catch (err) {
    showStatus("Error accessing Chrome storage: " + err.message, "error");
    return;
  }

  const apiKey = settings.apiKey ? settings.apiKey.trim() : "";
  let serverUrl = settings.serverUrl ? settings.serverUrl.trim() : DEFAULT_SERVER_URL;
  serverUrl = serverUrl.replace(/\/+$/, "");

  // 2. Check if API Key exists
  if (!apiKey) {
    noKeyView.classList.add("active");
    mainView.classList.remove("active");
    return;
  }

  noKeyView.classList.remove("active");
  mainView.classList.add("active");

  // 3. Query Active Tab
  let activeTab;
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    activeTab = tabs[0];
  } catch {
    showStatus("Unable to access current tab info.", "error");
    return;
  }

  if (!activeTab || !activeTab.url) {
    showStatus("No active webpage tab found.", "error");
    saveBtn.disabled = true;
    return;
  }

  // Handle Chrome Internal Pages (e.g., chrome://extensions)
  if (activeTab.url.startsWith("chrome://") || activeTab.url.startsWith("chrome-extension://") || activeTab.url.startsWith("edge://")) {
    showStatus("Cannot bookmark internal browser system pages.", "error");
    urlDisplay.textContent = activeTab.url;
    titleInput.value = activeTab.title || activeTab.url;
    saveBtn.disabled = true;
    return;
  }

  // Initial tab population
  const tabUrl = activeTab.url;
  urlDisplay.textContent = tabUrl;
  titleInput.value = activeTab.title || tabUrl;
  
  // Favicon setup with Google Favicon API fallback
  const initialFavicon = activeTab.favIconUrl || getDomainFavicon(tabUrl);
  faviconImg.src = initialFavicon;
  iconInput.value = initialFavicon;

  faviconImg.onerror = () => {
    faviconImg.src = getDomainFavicon(tabUrl);
  };

  // 4. Fetch metadata from ${serverUrl}/api/bookmark/metadata?url=... or ${serverUrl}/api/fetch-meta
  showStatus("Fetching page metadata...", "info");

  try {
    let metaResponse = await fetch(`${serverUrl}/api/bookmark/metadata?url=${encodeURIComponent(tabUrl)}`);
    
    if (!metaResponse.ok) {
      metaResponse = await fetch(`${serverUrl}/api/fetch-meta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: tabUrl }),
      });
    }

    if (metaResponse.ok) {
      const metaData = await metaResponse.json();
      if (metaData) {
        if (metaData.title) {
          titleInput.value = metaData.title;
        }
        if (metaData.description) {
          descriptionInput.value = metaData.description;
        }
        const fav = metaData.favicon || metaData.icon;
        if (fav) {
          faviconImg.src = fav;
          iconInput.value = fav;
        }
      }
      hideStatus();
    } else {
      hideStatus();
    }
  } catch {
    hideStatus();
  }

  // 5. Handle Save Bookmark
  saveBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim() || activeTab.title || tabUrl;
    const description = descriptionInput.value.trim();
    const icon = iconInput.value || activeTab.favIconUrl || getDomainFavicon(tabUrl);

    saveBtn.disabled = true;
    saveBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
      </svg>
      <span>Saving...</span>
    `;
    hideStatus();

    const payload = {
      url: tabUrl,
      title,
      description,
      favicon: icon,
      icon: icon,
    };

    try {
      // Try /api/bookmark/external first (dev-nest route)
      let saveResponse = await fetch(`${serverUrl}/api/bookmark/external`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      // Fallback to /api/bookmarks/external if 404
      if (saveResponse.status === 404) {
        saveResponse = await fetch(`${serverUrl}/api/bookmarks/external`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const responseData = await saveResponse.json().catch(() => ({}));

      if (saveResponse.ok || saveResponse.status === 200 || saveResponse.status === 201) {
        showStatus("✔ Bookmark saved successfully!", "success");
        saveBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Saved!</span>
        `;
        
        setTimeout(() => {
          window.close();
        }, 1200);
      } else {
        if (saveResponse.status === 401 || saveResponse.status === 403) {
          showStatus("Unauthorized: Invalid API Key. Please check settings.", "error");
        } else {
          showStatus(responseData.error || `Save failed (${saveResponse.status}).`, "error");
        }
        resetSaveBtn();
      }
    } catch (err) {
      showStatus(`Network Error: Unable to connect to ${serverUrl}. Is server running? (${err.message})`, "error");
      resetSaveBtn();
    }
  });

  function resetSaveBtn() {
    saveBtn.disabled = false;
    saveBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>Save Bookmark</span>
    `;
  }

  function getDomainFavicon(urlStr) {
    try {
      const domain = new URL(urlStr).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return "";
    }
  }

  function showStatus(msg, type) {
    statusMsg.textContent = msg;
    statusMsg.className = `status-banner show ${type}`;
  }

  function hideStatus() {
    statusMsg.className = "status-banner";
    statusMsg.textContent = "";
  }
});
