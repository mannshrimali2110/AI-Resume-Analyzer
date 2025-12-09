import dotenv from "dotenv";

/**
 * Global Jest setup file.
 * Loads environment variables and configures global mocks.
 */
export function global_test_setup(): void {
    dotenv.config({ path: ".env.test" });

    process.env.NODE_ENV = "test";
    process.env.GEMINI_API_KEY = "test_api_key";
}

global_test_setup();
