import express from "express";
import { initializeMiddlewares } from "./middleware/initializer";

const app = express();

// Initialize all middlewares and routes
initializeMiddlewares(app);

// Export the Express app for both serverless and server usage
export { app };

export default app;
