const DEFAULT_SERVER_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
  const serverUrlInput = document.getElementById("serverUrl");
  const apiKeyInput = document.getElementById("apiKey");
  const toggleApiKeyBtn = document.getElementById("toggleApiKey");
  const settingsForm = document.getElementById("settingsForm");
  const saveBtn = document.getElementById("saveBtn");
  const testBtn = document.getElementById("testBtn");
  const statusMessage = document.getElementById("statusMessage");

  // Load existing settings from chrome.storage.sync
  try {
    const settings = await chrome.storage.sync.get(["apiKey", "serverUrl"]);
    serverUrlInput.value = settings.serverUrl || DEFAULT_SERVER_URL;
    apiKeyInput.value = settings.apiKey || "";
  } catch (err) {
    showStatus("Error loading saved settings: " + err.message, "error");
  }

  // Toggle API Key visibility
  toggleApiKeyBtn.addEventListener("click", () => {
    if (apiKeyInput.type === "password") {
      apiKeyInput.type = "text";
      toggleApiKeyBtn.textContent = "Hide";
    } else {
      apiKeyInput.type = "password";
      toggleApiKeyBtn.textContent = "Show";
    }
  });

  // Handle Form Submission (Save)
  settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideStatus();

    let serverUrl = serverUrlInput.value.trim();
    const apiKey = apiKeyInput.value.trim();

    if (!serverUrl) {
      serverUrl = DEFAULT_SERVER_URL;
      serverUrlInput.value = serverUrl;
    }

    // Strip trailing slash if present
    serverUrl = serverUrl.replace(/\/+$/, "");

    if (!apiKey) {
      showStatus("API Key is required to save settings.", "error");
      apiKeyInput.focus();
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    try {
      await chrome.storage.sync.set({ apiKey, serverUrl });
      showStatus("Settings saved successfully! You can now use the extension popup.", "success");
    } catch (err) {
      showStatus("Failed to save settings: " + err.message, "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Settings";
    }
  });

  // Handle Test Connection
  testBtn.addEventListener("click", async () => {
    hideStatus();
    let serverUrl = serverUrlInput.value.trim() || DEFAULT_SERVER_URL;
    serverUrl = serverUrl.replace(/\/+$/, "");

    testBtn.disabled = true;
    testBtn.textContent = "Testing...";

    try {
      let response = await fetch(`${serverUrl}/api/bookmark/metadata?url=https://github.com`);
      
      if (!response.ok) {
        response = await fetch(`${serverUrl}/api/fetch-meta`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: "https://github.com" }),
        });
      }

      if (response.ok) {
        showStatus(`Server connection successful! (${response.status} OK)`, "success");
      } else {
        showStatus(`Server responded with status ${response.status}. Check your Server URL.`, "error");
      }
    } catch (err) {
      showStatus(`Cannot connect to server at ${serverUrl}. Is your Next.js app running on port 3000? (${err.message})`, "error");
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = "Test Server";
    }
  });

  function showStatus(msg, type) {
    statusMessage.textContent = msg;
    statusMessage.className = `status-box show ${type}`;
  }

  function hideStatus() {
    statusMessage.className = "status-box";
    statusMessage.textContent = "";
  }
});
