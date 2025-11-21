/**
 * Offline Storage Utility
 * Stores issues locally when offline and syncs when online
 */

const STORAGE_KEY = "offline_issues";
const SYNC_INTERVAL = 30000; // 30 seconds

export const saveOfflineIssue = (issueData) => {
  try {
    const offlineIssues = getOfflineIssues();
    const newIssue = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data: issueData,
      createdAt: new Date().toISOString(),
      synced: false,
    };
    
    offlineIssues.push(newIssue);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offlineIssues));
    return newIssue.id;
  } catch (error) {
    console.error("Error saving offline issue:", error);
    throw error;
  }
};

export const getOfflineIssues = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error getting offline issues:", error);
    return [];
  }
};

export const getUnsyncedIssues = () => {
  return getOfflineIssues().filter((issue) => !issue.synced);
};

export const markAsSynced = (issueId) => {
  try {
    const offlineIssues = getOfflineIssues();
    const updated = offlineIssues.map((issue) =>
      issue.id === issueId ? { ...issue, synced: true } : issue
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error marking issue as synced:", error);
  }
};

export const removeOfflineIssue = (issueId) => {
  try {
    const offlineIssues = getOfflineIssues();
    const filtered = offlineIssues.filter((issue) => issue.id !== issueId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing offline issue:", error);
  }
};

export const isOnline = () => {
  return navigator.onLine;
};

export const setupOnlineListener = (callback) => {
  window.addEventListener("online", callback);
  return () => window.removeEventListener("online", callback);
};

export const setupOfflineListener = (callback) => {
  window.addEventListener("offline", callback);
  return () => window.removeEventListener("offline", callback);
};

/**
 * Auto-sync offline issues when coming back online
 */
export const setupAutoSync = async (syncFunction) => {
  setupOnlineListener(async () => {
    const unsynced = getUnsyncedIssues();
    if (unsynced.length > 0) {
      console.log(`Syncing ${unsynced.length} offline issues...`);
      for (const issue of unsynced) {
        try {
          await syncFunction(issue.data);
          markAsSynced(issue.id);
          removeOfflineIssue(issue.id);
        } catch (error) {
          console.error(`Error syncing issue ${issue.id}:`, error);
        }
      }
    }
  });

  // Periodic sync check
  setInterval(async () => {
    if (isOnline()) {
      const unsynced = getUnsyncedIssues();
      if (unsynced.length > 0) {
        for (const issue of unsynced.slice(0, 1)) {
          // Sync one at a time
          try {
            await syncFunction(issue.data);
            markAsSynced(issue.id);
            removeOfflineIssue(issue.id);
          } catch (error) {
            console.error(`Error syncing issue ${issue.id}:`, error);
          }
        }
      }
    }
  }, SYNC_INTERVAL);
};

