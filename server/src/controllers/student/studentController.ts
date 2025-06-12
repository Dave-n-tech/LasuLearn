import { Request, Response, Application } from "express";
import prisma from "../../utils/prismaClient";
import { Role } from "../../../generated/prisma";

export const getAllStudents = async (
  req: Request,
  res: Response
) => {
  // get all students
  try {
    const students = await prisma.user.findMany({
      where: {
        role: Role.STUDENT,
      },
    });

    if (!students) {
      res.status(404).json({ message: "No students found in database" });
      return
    }

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting students" });
  }
};

export const getStudentById = async (
  req: Request,
  res: Response
) => {
  // get a student by id
  const id = parseInt(req.params.id);

  try {
    const student = await prisma.user.findUnique({
      where: {
        id,
        role: Role.STUDENT,
      },
    });

    if (!student) {
      res.status(404).json({ message: "student not found" });
      return;
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting student" });
  }
};

export const updateStudent = async (
  req: Request,
  res: Response
) => {
  const id = parseInt(req.params.id);
  const {firstName, lastName, email} = req.body;

  try {
    const student = await prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        email,
      },
    });

    res.json({ message: "student updated successfully", student });
  } catch (error) {
    console.error("An error occurred", error)
    res.status(500).json({ message: "Error updating student" });
  }
};
