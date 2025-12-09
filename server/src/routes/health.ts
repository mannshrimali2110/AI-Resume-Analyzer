import { Router, Request, Response } from "express";

/**
 * Configure system health check routes.
 *
 * @returns Express router instance for health routes.
 */
function create_health_routes(): Router {
  const router = Router();

  /**
   * Health check endpoint.
   * Endpoint: GET /api/health
   */
  router.get("/", (request: Request, response: Response) => {
    return response.json({
      status: "ok"
    });
  });

  return router;
}

export default create_health_routes();
