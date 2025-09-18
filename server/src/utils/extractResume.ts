import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import mammoth from "mammoth";

/**
 * Extract raw text from a resume file (PDF or DOCX)
 */
export const extractResumeText = async (filePath: string): Promise<string> => {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".pdf") {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } else if (ext === ".docx") {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    } else {
        throw new Error("Unsupported file type");
    }
};
