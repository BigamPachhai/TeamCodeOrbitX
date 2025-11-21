export const adminOnly = (req, res, next) => {
  // Check if user exists (should be set by protect middleware)
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Check if user has admin role
  if (req.user.role !== "admin") {
    console.log(`Admin access denied for user: ${req.user.email}, role: ${req.user.role}`);
    return res.status(403).json({ 
      message: "Access denied: Admins only",
      userRole: req.user.role 
    });
  }

  next();
};
