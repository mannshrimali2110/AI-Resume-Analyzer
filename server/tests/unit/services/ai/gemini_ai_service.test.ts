import axios from "axios";
import { GeminiAIService } from "../../../../src/services/ai/gemini_ai_service";
import dotenv from "dotenv";

jest.mock("axios");

dotenv.config({ path: ".env.test" });

/**
 * Unit tests for GeminiAIService.
 * These tests validate AI request handling, successful responses,
 * invalid responses, network failures, and missing configuration.
 */
describe("GeminiAIService", () => {
    let gemini_ai_service: GeminiAIService;

    /**
     * Create a fresh service instance before each test.
     */
    beforeEach(() => {
        gemini_ai_service = new GeminiAIService();
        jest.clearAllMocks();
        process.env.GEMINI_API_KEY = "test_api_key";
    });

    /**
     * Should return structured AI analysis on success.
     */
    it("should return analysis data when AI responds correctly", async () => {
        const mock_ai_response = {
            data: {
                candidates: [
                    {
                        content: {
                            parts: [
                                {
                                    text: JSON.stringify({
                                        matchScore: 82,
                                        missingKeywords: ["docker"],
                                        sectionFeedback: {
                                            experience: "Strong",
                                            skills: "Needs Docker",
                                            education: "Good",
                                            certifications: "Missing cloud certs"
                                        },
                                        improvementSuggestions: ["Add cloud certifications"],
                                        atsHints: ["Use more action verbs"]
                                    })
                                }
                            ]
                        }
                    }
                ]
            }
        };

        (axios.post as jest.Mock).mockResolvedValue(mock_ai_response);

        const result = await gemini_ai_service.analyze_resume(
            "resume text",
            "jd text"
        ) as {
            matchScore: number;
            missingKeywords: string[];
            improvementSuggestions: string[];
            [key: string]: unknown;
        };

        expect(result.matchScore).toBe(82);
        expect(result.missingKeywords).toContain("docker");
        expect(result.improvementSuggestions.length).toBe(1);
    });

    /**
     * Should throw wrapped error when API key is missing.
     */
    it("should throw wrapped error when GEMINI_API_KEY is missing", async () => {
        delete process.env.GEMINI_API_KEY;

        await expect(
            gemini_ai_service.analyze_resume("resume", "jd")
        ).rejects.toThrow("Gemini AI analysis failed");
    });

    /**
     * Should throw wrapped error when AI returns invalid JSON.
     */
    it("should throw wrapped error on invalid JSON", async () => {
        const mock_ai_response = {
            data: {
                candidates: [
                    {
                        content: {
                            parts: [
                                {
                                    text: "INVALID_JSON_RESPONSE"
                                }
                            ]
                        }
                    }
                ]
            }
        };

        (axios.post as jest.Mock).mockResolvedValue(mock_ai_response);

        await expect(
            gemini_ai_service.analyze_resume("resume", "jd")
        ).rejects.toThrow("Gemini AI analysis failed");
    });

    /**
     * Should throw wrapped error on network failure.
     */
    it("should throw wrapped error on network failure", async () => {
        (axios.post as jest.Mock).mockRejectedValue(
            new Error("Network down")
        );

        await expect(
            gemini_ai_service.analyze_resume("resume", "jd")
        ).rejects.toThrow("Gemini AI analysis failed");
    });

    /**
     * Should throw wrapped error when AI returns empty content.
     */
    it("should throw wrapped error when AI response is empty", async () => {
        const mock_ai_response = {
            data: {
                candidates: []
            }
        };

        (axios.post as jest.Mock).mockResolvedValue(mock_ai_response);

        await expect(
            gemini_ai_service.analyze_resume("resume", "jd")
        ).rejects.toThrow("Gemini AI analysis failed");
    });
});
