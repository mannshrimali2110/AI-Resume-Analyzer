import request from "supertest";
import express, { Application } from "express";

import upload_routes from "../../src/routes/upload";
import { ResumeService } from "../../src/services/resume/resume_service";

/**
 * Mock ResumeService to isolate upload API behavior.
 */
jest.mock("../../src/services/resume/resume_service");

/**
 * Integration tests for Upload API.
 * These tests validate file upload handling, service integration,
 * and error responses without touching real disk or AI services.
 */
describe("Upload API Integration Tests", () => {
    let app: Application;

    /**
     * Create a fresh Express app before each test.
     */
    beforeEach(() => {
        app = express();
        app.use("/api/upload", upload_routes);
        jest.clearAllMocks();
    });

    /**
     * Should successfully upload and process a PDF resume.
     */
    it("should upload and process a resume successfully", async () => {
        const mock_cleaned_text = "Processed resume text";

        jest
            .spyOn(ResumeService.prototype, "process_resume")
            .mockResolvedValue(mock_cleaned_text);

        const response = await request(app)
            .post("/api/upload/resume")
            .attach("resume", Buffer.from("dummy pdf content"), {
                filename: "test_resume.pdf",
                contentType: "application/pdf"
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.text).toBe(mock_cleaned_text);

        expect(ResumeService.prototype.process_resume).toHaveBeenCalledTimes(1);
    });

    /**
     * Should reject upload when no file is provided.
     */
    it("should return 400 when no file is uploaded", async () => {
        const response = await request(app)
            .post("/api/upload/resume");

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("No resume file uploaded.");
    });

    /**
     * Should reject upload for invalid file extension.
     */
    it("should reject invalid file type", async () => {
        const response = await request(app)
            .post("/api/upload/resume")
            .attach("resume", Buffer.from("invalid file"), {
                filename: "invalid.txt",
                contentType: "text/plain"
            });

        expect(response.status).toBe(500);
    });

    /**
     * Should return 500 when resume processing fails.
     */
    it("should return 500 when resume processing fails", async () => {
        jest
            .spyOn(ResumeService.prototype, "process_resume")
            .mockRejectedValue(new Error("Processing failed"));

        const response = await request(app)
            .post("/api/upload/resume")
            .attach("resume", Buffer.from("dummy pdf content"), {
                filename: "test_resume.pdf",
                contentType: "application/pdf"
            });

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
    });
});