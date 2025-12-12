const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-prod";

const parseToken = (authHeader) => {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
};

const requireAuth = (req, res, next) => {
  try {
    const raw = parseToken(req.headers.authorization);
    if (!raw) return res.status(401).json({ message: "Authentication required" });
    const decoded = jwt.verify(raw, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireRole = (allowedRoles = []) => (req, res, next) => {
  requireAuth(req, res, () => {
    if (!allowedRoles.length) return next();
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    return next();
  });
};

module.exports = { requireAuth, requireRole };
