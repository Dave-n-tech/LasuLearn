import { Request } from "express";
import { Role } from "@prisma/client";

export interface JwtRequest extends Request {
  user?: {
    userId: number,
    role: Role
  },
  file?: Express.Multer.File;
}