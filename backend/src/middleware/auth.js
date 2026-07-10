import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { readDb } from "../store/db.js";

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, config.secret, {
    expiresIn: config.tokenExpiresIn,
  });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ detail: "Not authenticated" });

  try {
    const payload = jwt.verify(token, config.secret);
    const db = readDb();
    const user = db.users.find((u) => u.id === payload.sub);
    if (!user || user.status === "suspended") {
      return res.status(401).json({ detail: "User unavailable" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ detail: "Invalid token" });
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ detail: "Not authenticated" });
    if (req.user.role !== "Admin" && !roles.includes(req.user.role)) {
      return res.status(403).json({ detail: "Insufficient permissions" });
    }
    next();
  };
}

export function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    full_name: user.fullName,
    role: user.role,
    department: user.department,
    team: user.team,
    status: user.status,
    email_verified: user.emailVerified,
    mfa_enabled: user.mfaEnabled,
  };
}
