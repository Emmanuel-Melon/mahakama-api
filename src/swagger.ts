import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./config";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mahakama API",
      version: "1.0.0",
      description: "API documentation for Mahakama Legal Assistant",
      contact: {
        name: "API Support",
        url: "https://mahakama.tech/support",
      },
    },
    // The servers array defines the base URLs where your API is hosted.
    // These URLs are used as the base for all API endpoints in the documentation.
    servers: [
      {
        url: `http://localhost:${config.port}/api`,
        description: "Local development server",
      },
      {
        url: "https://mahakama-api-production.up.railway.app/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to files containing OpenAPI definitions (JSDoc comments)
  apis: [
    "./src/routes/*.ts", // Main API routes
    "./src/auth/*.ts", // Authentication routes
    "./src/chats/*.ts", // Chat-related routes
    // Add other route files as needed
  ],
};

const specs = swaggerJsdoc(options);

export { specs };
