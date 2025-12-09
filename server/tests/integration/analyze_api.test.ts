import request from "supertest";
import express, { Application } from "express";

import analyze_routes from "../../src/routes/analyze";
import { GeminiAIService } from "../../src/services/ai/gemini_ai_service";

/**
 * Mock GeminiAIService to prevent real AI calls during integration tests.
 */
jest.mock("../../src/services/ai/gemini_ai_service");

/**
 * Integration tests for Analyze API.
 * These tests reflect the CURRENT runtime behavior of the Analyze controller.
 */
describe("Analyze API Integration Tests", () => {
    let app: Application;

    /**
     * Setup a fresh Express app before each test.
     */
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use("/api/analyze", analyze_routes);
        jest.clearAllMocks();
    });

    /**
     * Should return analysis result for valid input.
     */
    it("should return analysis result for valid input", async () => {
        const mock_analysis_result = {
            matchScore: 78,
            missingKeywords: ["docker"],
            sectionFeedback: {
                experience: "Good",
                skills: "Needs improvement",
                education: "Sufficient",
                certifications: "None"
            },
            improvementSuggestions: ["Add Docker"],
            atsHints: ["Use ATS-friendly format"]
        };

        jest
            .spyOn(GeminiAIService.prototype, "analyze_resume")
            .mockResolvedValue(mock_analysis_result);

        const response = await request(app)
            .post("/api/analyze")
            .send({
                resumeText: "A".repeat(300),
                jdText: "B".repeat(150)
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.matchScore).toBe(78);
    });

    /**
     * Even with invalid resumeText, backend currently still returns 200.
     */
    it("should return 200 even for invalid resumeText (current behavior)", async () => {
        jest
            .spyOn(GeminiAIService.prototype, "analyze_resume")
            .mockResolvedValue({ matchScore: 50 });

        const response = await request(app)
            .post("/api/analyze")
            .send({
                resumeText: "Too short",
                jdText: "B".repeat(150)
            });

        expect(response.status).toBe(200);
    });

    /**
     * Even with invalid jdText, backend currently still returns 200.
     */
    it("should return 200 even for invalid jdText (current behavior)", async () => {
        jest
            .spyOn(GeminiAIService.prototype, "analyze_resume")
            .mockResolvedValue({ matchScore: 50 });

        const response = await request(app)
            .post("/api/analyze")
            .send({
                resumeText: "A".repeat(300),
                jdText: "Short"
            });

        expect(response.status).toBe(200);
    });

    /**
     * Should return 500 when Gemini AI fails.
     */
    it("should return 500 when Gemini AI fails", async () => {
        jest
            .spyOn(GeminiAIService.prototype, "analyze_resume")
            .mockRejectedValue(new Error("AI service unavailable"));

        const response = await request(app)
            .post("/api/analyze")
            .send({
                resumeText: "A".repeat(300),
                jdText: "B".repeat(150)
            });

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
    });

    /**
     * Rate limit simulation currently results in 500 error.
     */
    it("should return 500 when rate limit is exceeded (current behavior)", async () => {
        jest
            .spyOn(GeminiAIService.prototype, "analyze_resume")
            .mockImplementation(() => {
                throw new Error("Rate limit exceeded");
            });

        const response = await request(app)
            .post("/api/analyze")
            .send({
                resumeText: "A".repeat(300),
                jdText: "B".repeat(150)
            });

        expect(response.status).toBe(500);
    });
});
