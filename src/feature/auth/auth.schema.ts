import { z } from "zod";

export const authHeadersSchema = z.object({
  authorization: z
    .string()
    .min(1, { message: "Authorization header is required" }),
});

export const RegisterRequestSchema = z
  .object({
    email: z.string().email().describe("User email address"),
    password: z.string().min(1).describe("User password"),
    name: z.string().min(2, "Name is required").optional(),
  })
  .openapi({
    description: "Register request with email and password",
    example: {
      email: "emmanuelgatwech@gmail.com",
      password: "SecurePass123",
    },
  });

export const AuthResponseSchema = z
  .object({
    email: z.string().email().openapi({ example: "user@example.com" }),
    token: z.string().describe("JWT token for authenticated requests"),
    refreshToken: z
      .string()
      .describe("Refresh token for getting new access tokens"),
  })
  .openapi({
    description: "Authentication response data containing user tokens",
    example: {
      email: "user@example.com",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      refreshToken: "def50200...",
    },
  });

export const LoginRequestSchema = z
  .object({
    email: z.string().email().describe("User email address"),
    password: z.string().min(1).describe("User password"),
  })
  .openapi({
    description: "Login request with email and password",
    example: {
      email: "emmanuelgatwech@gmail.com",
      password: "SecurePass123",
    },
  });

export type LoginAttrs = z.infer<typeof LoginRequestSchema>;
export type AuthResponseData = z.infer<typeof AuthResponseSchema>;

export type RegisterUserAttrs = z.infer<typeof RegisterRequestSchema>;
export type LoginUserAttrs = z.infer<typeof LoginRequestSchema>;
