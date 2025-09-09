import multer from "multer";
import path from "path";
import fs from "fs";

// temporary folder for uploads before sending to Cloudinary
const uploadPath = path.join(__dirname, "../uploads");

// make sure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// filter video uploads only
function fileFilter(req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video and image files are allowed!"));
  }
}

export const upload = multer({ storage, fileFilter });
