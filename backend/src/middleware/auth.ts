import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { config } from "../config.js";
import { readDb } from "../store/db.js";
import type { JwtPayload, PublicUser, User } from "../types.js";

export type AuthedRequest = Request & { user: User };

export function signToken(user: User): string {
  const options: SignOptions = {
    expiresIn: config.tokenExpiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign({ sub: user.id, role: user.role }, config.secret, options);
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ detail: "Not authenticated" });
    return;
  }

  try {
    const payload = jwt.verify(token, config.secret) as JwtPayload;
    const db = readDb();
    const user = db.users.find((u) => u.id === payload.sub);
    if (!user || user.status === "suspended") {
      res.status(401).json({ detail: "User unavailable" });
      return;
    }
    (req as AuthedRequest).user = user;
    next();
  } catch {
    res.status(401).json({ detail: "Invalid token" });
  }
}

export function requireRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthedRequest).user;
    if (!user) {
      res.status(401).json({ detail: "Not authenticated" });
      return;
    }
    if (user.role !== "Admin" && !roles.includes(user.role)) {
      res.status(403).json({ detail: "Insufficient permissions" });
      return;
    }
    next();
  };
}

export function publicUser(user: User): PublicUser {
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

export function getUser(req: Request): User {
  return (req as AuthedRequest).user;
}
