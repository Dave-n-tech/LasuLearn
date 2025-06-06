import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../../generated/prisma";
import { JwtRequest } from "../types";

export const verifyToken = (allowedRoles: Role[]) => {
  return (req: JwtRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "login required" });
      return;
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as { userId: number; role: Role };

      if (!allowedRoles.includes(decoded.role)) {
        res
          .status(403)
          .json({ message: "You do not have the required permission" });
        return;
      }

      req.user = { userId: decoded.userId, role: decoded.role };
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(403).json({ message: "Invalid or expired token" });
      return
    }
  };
};
