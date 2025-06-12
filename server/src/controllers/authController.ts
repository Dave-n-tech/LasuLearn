import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient";
import { Role } from "../../generated/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";
import { handleUserRegistration } from "../utils/registerUser";

// login for all roles
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(401).json({ message: "invalid email or password" });
      return;
    }

    const passwordFound = await bcrypt.compare(password, user.password);
    if (!passwordFound) {
      res.status(401).json({ message: "invalid email or password" });
      return
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      })
      .status(200)
      .json({
        message: "login successful",
        user: user,
        accessToken,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};



// register students
export const registerStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { firstname, lastname, email, password, matricNo } = req.body;

  if (!firstname || !lastname || !email || !password || !matricNo) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const result = await handleUserRegistration({
      firstname,
      lastname,
      email,
      password,
      role: Role.STUDENT,
      matricNo,
    });

    if (!result.success) {
      res.status(result.statusCode).json({ message: result.message });
      return;
    }

    res
      .cookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      })
      .status(result.statusCode)
      .json({
        message: result.message,
        user: result.user,
        access_token: result.accessToken,
      });
  } catch (error) {
    console.error("Error registering lecturer:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
};



// register lecturers
export const registerLecturer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const result = await handleUserRegistration({
      firstname,
      lastname,
      email,
      password,
      role: Role.LECTURER,
    });

    if (!result.success) {
      res.status(result.statusCode).json({ message: result.message });
      return;
    }

    res
      .cookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      })
      .status(result.statusCode)
      .json({
        message: result.message,
        user: result.user,
        access_token: result.accessToken,
      });
  } catch (error) {
    console.error("Error registering lecturer:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
};



// register admins
export const registerAdmin = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const result = await handleUserRegistration({
      firstname,
      lastname,
      email,
      password,
      role: Role.ADMIN,
    });

    if (!result.success) {
      res.status(result.statusCode).json({ message: result.message });
      return;
    }

    res
      .cookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      })
      .status(result.statusCode)
      .json({
        message: result.message,
        user: result.user,
        access_token: result.accessToken
      });
  } catch (error) {
    console.error("Error registering lecturer:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
};



// refresh access token
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refresh_token || req.body.refresh_token;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is required" });
    return;
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { userId: number; role: Role };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      res
        .status(401)
        .json({ message: "Invalid token or user no longer exists" });
      return;
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user.id, user.role);

    res.status(200).json({
      message: "New access token generated",
      access_token: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Invalid or expired refresh token" });
    return;
  }
};

// logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  res
    .clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};
