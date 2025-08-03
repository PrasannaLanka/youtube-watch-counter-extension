chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = new URL(tabs[0].url);
    const key = url.hostname + url.pathname;
  
    chrome.storage.local.get([key], (data) => {
      const watched = data[key] || [];
      document.getElementById("info").textContent = `Watched videos: ${watched.length}`;
    });
  });
  