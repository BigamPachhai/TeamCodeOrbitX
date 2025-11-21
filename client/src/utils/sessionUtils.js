/**
 * Get or create a session ID for anonymous users
 * Stored in localStorage to track anonymous upvotes across sessions
 */
export const getSessionId = () => {
  let sessionId = localStorage.getItem("anonymousSessionId");

  if (!sessionId) {
    // Generate a unique session ID
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("anonymousSessionId", sessionId);
  }

  return sessionId;
};

/**
 * Clear session ID (useful for testing or logout)
 */
export const clearSessionId = () => {
  localStorage.removeItem("anonymousSessionId");
};
