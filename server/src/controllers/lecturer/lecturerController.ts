import { Response } from "express";
import prisma from "../../utils/prismaClient";
import { Role } from "../../../generated/prisma";
import { JwtRequest } from "../../types";

export const getLecturerById = async (req: JwtRequest, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const lecturer = await prisma.user.findUnique({
      where: {
        id,
        role: Role.LECTURER,
      },
    });

    if (!lecturer) {
      res.status(404).json({ message: "Lecturer not found" });
      return;
    }

    res.json({
      firstname: lecturer.firstName,
      lastName: lecturer.lastName,
      email: lecturer.email,
      role: lecturer.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLecturerById = async (req: JwtRequest, res: Response) => {
  const id = parseInt(req.params.id);
  const { firstName, lastName, email } = req.body;

  try {
    const lecturer = await prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        email,
      },
    });

    res.json({
      message: "lecturer updated successfully",
      lecturerId: lecturer.id,
    });
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
