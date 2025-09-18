// src/controllers/upload.controller.ts
import { Request, Response } from "express";
import fs from "fs/promises";
import { extractResumeText } from "../utils/extractResume";

export const handleResumeUpload = async (req: Request, res: Response) => {
    console.log("Upload request received");

    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "No file uploaded" });
        }

        const filePath = req.file.path;

        let text = "";
        try {
            text = await extractResumeText(filePath);
        } catch (err: any) {
            console.error("Extraction error:", err);
            try {
                await fs.unlink(filePath); // cleanup temp file
            } catch (_) { }
            return res.status(500).json({
                success: false,
                message: "Failed to extract text from the uploaded file.",
            });
        }

        // Always cleanup uploaded file after extraction
        try {
            await fs.unlink(filePath);
        } catch (err) {
            console.warn("Failed to delete uploaded file:", filePath, err);
        }

        return res.json({ success: true, text });
    } catch (err: any) {
        console.error("Upload controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error",
        });
    }
};
