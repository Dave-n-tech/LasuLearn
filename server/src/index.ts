require("dotenv").config();
import { Request, Response } from "express";
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;


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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
