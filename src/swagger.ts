import swaggerJsdoc from "swagger-jsdoc";
import { mahakamaServers } from "./config";
import { swaggerApiRoutes } from "./routes";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mahakama API",
      version: "1.0.0",
      description: "API documentation for Mahakama Legal Assistant",
      contact: {
        name: "API Support",
        url: "mailto:emmanuelgatwech@gmail.com",
      },
    },
    // These URLs are used as the base for all API endpoints in the documentation.
    servers: mahakamaServers,
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
  apis: swaggerApiRoutes,
};

const apiSpecs = swaggerJsdoc(options);

export { apiSpecs };
