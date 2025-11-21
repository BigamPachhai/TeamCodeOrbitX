/**
 * Utility functions for handling image URLs
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

/**
 * Get the full image URL
 * Handles both Cloudinary URLs and local upload paths
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL (http/https), return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a local upload path, prepend backend URL
  if (imagePath.startsWith("uploads/") || imagePath.startsWith("/uploads/")) {
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${BACKEND_URL}${cleanPath}`;
  }

  // Default: assume it's a relative path
  return `${BACKEND_URL}/${imagePath}`;
};

/**
 * Get a placeholder image data URI
 */
export const getPlaceholderImage = () => {
  // Return a simple SVG data URI as placeholder
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
};

