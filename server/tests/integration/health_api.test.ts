import request from "supertest";
import express, { Application } from "express";

import health_routes from "../../src/routes/health";

/**
 * Integration tests for Health API.
 * These tests ensure the server health endpoint is responding correctly.
 */
describe("Health API Integration Tests", () => {
    let app: Application;

    /**
     * Setup a fresh Express app before each test.
     */
    beforeEach(() => {
        app = express();
        app.use("/api/health", health_routes);
    });

    /**
     * Should return 200 OK with health status.
     */
    it("should return server health status", async () => {
        const response = await request(app)
            .get("/api/health");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status");
        expect(response.body.status).toBe("ok");
    });

    /**
     * Should not allow unsupported HTTP methods.
     */
    it("should reject unsupported HTTP methods", async () => {
        const response = await request(app)
            .post("/api/health");

        expect(response.status).toBe(404);
    });
});
