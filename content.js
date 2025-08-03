function getVideoId(url) {
    const urlObj = new URL(url, "https://www.youtube.com");
    return urlObj.searchParams.get("v");
  }
  
  function isWatched(item) {
    return item.querySelector("ytd-thumbnail-overlay-resume-playback-renderer") !== null;
  }
  
  function extractWatchedVideos() {
    const watched = [];
    const videoItems = document.querySelectorAll("ytd-grid-video-renderer, ytd-rich-grid-media");
  
    videoItems.forEach(item => {
      const anchor = item.querySelector("a#thumbnail");
      if (isWatched(item) && anchor) {
        const videoId = getVideoId(anchor.href);
        if (videoId) watched.push(videoId);
      }
    });
  
    return watched;
  }
  
  function storeWatchedVideos(videos) {
    const key = location.hostname + location.pathname;
  
    chrome.storage.local.get([key], (data) => {
      const existing = new Set(data[key] || []);
      videos.forEach(id => existing.add(id));
      chrome.storage.local.set({ [key]: Array.from(existing) });
    });
  }
  
  async function scrollToBottomAndCollect() {
    let lastHeight = 0;
    let maxRetries = 5;
    let retries = 0;
  
    while (retries < maxRetries) {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(res => setTimeout(res, 1500));
  
      const newHeight = document.body.scrollHeight;
      if (newHeight === lastHeight) {
        retries++;
      } else {
        lastHeight = newHeight;
        retries = 0;
      }
    }
  
    const allWatched = extractWatchedVideos();
    storeWatchedVideos(allWatched);
  }
  
  if (location.pathname.includes("/videos")) {
    scrollToBottomAndCollect();
  }
  