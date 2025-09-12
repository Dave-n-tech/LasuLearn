import bcrypt from "bcrypt"
import { Role, User } from "@prisma/client";
import { generateAccessToken, generateRefreshToken } from "./generateTokens";
import prisma from "../utils/prismaClient"

interface RegistrationPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Role;
  matricNo?: string;
  level?: string;
  faculty?: string;
  department?: string
}

export const handleUserRegistration = async ({
  firstname,
  lastname,
  email,
  password,
  role,
  matricNo,
  level,
  faculty,
  department
}: RegistrationPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      success: false,
      statusCode: 409,
      message: "This account already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user: User = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: firstname,
      lastName: lastname,
      role,
      matricNo,
      level,
      faculty,
      department
    },
  });

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  return {
    success: true,
    statusCode: 201,
    message: `${role} account created successfully`,
    user,
    accessToken,
    refreshToken,
  };
};