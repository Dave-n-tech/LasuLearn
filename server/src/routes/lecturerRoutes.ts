import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { Role } from "../../generated/prisma";

const router = express.Router();




export default router;