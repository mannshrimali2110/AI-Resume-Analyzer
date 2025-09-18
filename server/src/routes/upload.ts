// src/routes/upload.ts
import { Router } from "express";
import { uploadResumeMiddleware } from "../middleware/upload.middleware";
import { handleResumeUpload } from "../controllers/upload.controller";

const router = Router();

router.post("/resume", uploadResumeMiddleware.single("resume"), handleResumeUpload);

export default router;
