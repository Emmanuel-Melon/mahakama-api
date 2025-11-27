import { Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import { mahakamaServers } from "@/config";
import { resolveAbsolutePaths } from "@/utils/fs";
import swaggerUi from "swagger-ui-express";
const apiDocPaths = [
  "src/feature/auth/auth.docs.ts",
  "src/feature/chats/chats.docs.ts",
  "src/feature/documents/documents.docs.ts",
  "src/feature/lawyers/lawyers.docs.ts",
  "src/feature/messages/messages.docs.ts",
  "src/feature/questions/questions.docs.ts",
  "src/feature/search/search.docs.ts",
  "src/feature/users/users.docs.ts",
] as const;

export const swaggerApiRoutes = resolveAbsolutePaths(apiDocPaths);

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


export const rawJSONDocs = (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json(apiSpecs);
};

export const swaggerSetup = () => {
  return swaggerUi.setup(apiSpecs, {
    explorer: true,
    customCss: ".swagger-ui \n.swagger-ui .info { margin: 20px 0 }\n",  
  });
};
