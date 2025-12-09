import express, { Application } from "express";

import analyze_routes from "../../src/routes/analyze";
import upload_routes from "../../src/routes/upload";
import health_routes from "../../src/routes/health";
import { errorHandler } from "../../src/middleware/errors.middleware";

/**
 * Create a fully wired Express app instance for testing.
 *
 * @returns Express application instance.
 */
export function create_test_app(): Application {
    const app: Application = express();

    app.use(express.json());

    app.use("/api/analyze", analyze_routes);
    app.use("/api/upload", upload_routes);
    app.use("/api/health", health_routes);

    app.use(errorHandler);

    return app;
}
