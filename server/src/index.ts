import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import studentRoutes from "./routes/studentRoutes";
import cookieParser from "cookie-parser";
dotenv.config()

const app = express();
const PORT = 8080;

app.use(cookieParser())
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.get("/", (req:Request, res:Response) => {
    res.send("server running")
})

// routes
app.use("/api/auth", authRoutes)
app.use("/api/students", studentRoutes);


app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT || process.env.PORT}`);
});
