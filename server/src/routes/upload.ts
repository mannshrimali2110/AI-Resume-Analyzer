// src/routes/upload.ts
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import { v4 as uuidv4 } from "uuid";
import { extractResumeText } from "../utils/extractResume";

const router = Router();

// ensure uploads dir exists
const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
if (!fsSync.existsSync(UPLOAD_DIR)) {
  fsSync.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer storage - store in uploads with uuid name
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const fname = `${uuidv4()}${ext}`;
    cb(null, fname);
  },
});

const allowedExtensions = [".pdf", ".docx"];

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) cb(null, true);
  else cb(new Error("Only .pdf and .docx files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

router.post("/resume", upload.single("resume"), async (req, res) => {
  console.log("Upload request received");
  
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;

    // extract text
    let text = "";
    try {
      text = await extractResumeText(filePath);
    } catch (err: any) {
      console.error("Extraction error:", err);
      // try cleanup and propagate a friendlier message
      try { await fs.unlink(filePath); } catch (_) { }
      return res.status(500).json({ success: false, message: "Failed to extract text from the uploaded file." });
    }

    // cleanup uploaded file
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn("Failed to delete uploaded file:", filePath, err);
    }
    console.log(text);
    

    return res.json({ success: true, text });
  } catch (err: any) {
    console.error("Upload route error:", err);
    return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
  }
});

export default router;
