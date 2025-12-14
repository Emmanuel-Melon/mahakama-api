import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  AuthResponseSchema,
} from "./auth.schema";
import { HttpStatus } from "@/http-status";

export const authRegistry = new OpenAPIRegistry();

authRegistry.register("RegisterRequest", RegisterRequestSchema);
authRegistry.register("LoginRequest", LoginRequestSchema);
authRegistry.register("AuthResponse", AuthResponseSchema);

authRegistry.registerPath({
  method: "post",
  path: "/auth/v1/register",
  tags: ["Authentication"],
  security: [],
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatus.CREATED.statusCode]: {
      description: HttpStatus.CREATED.description,
      content: {
        "application/json": {
          schema: AuthResponseSchema,
        },
      },
    },
    [HttpStatus.BAD_REQUEST.statusCode]: {
      description: HttpStatus.BAD_REQUEST.description,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/JsonApiErrorResponse",
          },
        },
      },
    },
    [HttpStatus.CONFLICT.statusCode]: {
      description: "User already exists",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/JsonApiErrorResponse",
          },
        },
      },
    },
  },
});

authRegistry.registerPath({
  method: "post",
  path: "/auth/v1/login",
  tags: ["Authentication"],
  security: [],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: AuthResponseSchema,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/JsonApiErrorResponse",
          },
        },
      },
    },
    [HttpStatus.BAD_REQUEST.statusCode]: {
      description: HttpStatus.BAD_REQUEST.description,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/JsonApiErrorResponse",
          },
        },
      },
    },
  },
});
