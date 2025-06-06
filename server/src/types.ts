import { Request } from "express";
import { Role } from "../generated/prisma";

export interface JwtRequest extends Request {
  user?: {
    userId: number,
    role: Role
  }
}