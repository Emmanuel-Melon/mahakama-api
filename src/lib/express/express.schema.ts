import { z } from "zod";
import { Request } from "express";
import { StatusConfig } from "../../http-status";

export const ErrorResponseConfigSchema = z.object({
  status: z.custom<StatusConfig>(),
  message: z.string().optional(),
  title: z.string().optional(),
  source: z.object({
    pointer: z.string().optional(),
    method: z.string().optional(),
  }).optional(),
});

export type ErrorResponseConfig = z.infer<typeof ErrorResponseConfigSchema>;

export const ResourceTypeSchema = z.enum(["single", "collection"]);

export type ResourceType = z.infer<typeof ResourceTypeSchema>;

export const ResponseLinksSchema = z.object({
  self: z.string().optional(),
  first: z.string().optional(),
  last: z.string().optional(),
  prev: z.string().optional(),
  next: z.string().optional(),
});

export type ResponseLinks = z.infer<typeof ResponseLinksSchema>;

export const ResourceLinkObjectSchema = z.object({
  self: z.string().optional(),
  related: z.string().optional(),
}).passthrough();

export type ResourceLinkObject = z.infer<typeof ResourceLinkObjectSchema>;

export const ResourceIdentifierObjectSchema = z.object({
  type: z.string(),
  id: z.string(),
});

export type ResourceIdentifierObject = z.infer<typeof ResourceIdentifierObjectSchema>;

export const ResourceLinkageSchema = 
  z.union([
    ResourceIdentifierObjectSchema,
    z.array(ResourceIdentifierObjectSchema),
    z.null(),
  ]);

export type ResourceLinkage = z.infer<typeof ResourceLinkageSchema>;

export const RelationshipObjectSchema = <T>() => z.object({
  links: z.custom<(resource: T, req: Request) => ResourceLinkObject>().optional(),
  data: z.custom<(resource: T) => ResourceLinkage>().optional(),
});

export interface RelationshipObject<T> {
  links?: (resource: T, req: Request) => ResourceLinkObject;
  data?: (resource: T) => ResourceLinkage;
}

export const ResourceObjectSchema = <T>() => z.object({
  type: z.string(),
  id: z.string(),
  attributes: z.object(z.any()),
  relationships: z.object(z.object({
    links: ResourceLinkObjectSchema.optional(),
    data: ResourceLinkageSchema.optional(),
  })).optional(),
  meta: z.object(z.any()),
  links: z.object(z.string()),
});

export interface ResourceObject<T> {
  type: string;
  id: string;
  attributes: Record<string, any>;
  relationships?: Record<string, {
    links?: ResourceLinkObject;
    data?: ResourceLinkage;
  }>;
  meta?: Record<string, any>;
  links?: Record<string, string>;
}

export const JsonApiResourceConfigSchema = <T>() => z.object({
  type: z.string(),
  attributes: z.custom<(resource: T) => Record<string, any>>(),
  relationships: z.object(z.any()).optional(),
  resourceMeta: z.custom<(resource: T) => Record<string, any>>().optional(),
  links: z.custom<(resource: T, req: Request) => ResourceLinkObject>().optional(),
});

export interface JsonApiResourceConfig<T> {
  type: string;
  attributes: (resource: T) => Record<string, any>;
  relationships?: Record<string, RelationshipObject<T>>;
  resourceMeta?: (resource: T) => Record<string, any>;
  links?: (resource: T, req: Request) => ResourceLinkObject;
}

export const JsonApiResponseConfigSchema = <T>() => z.object({
  type: ResourceTypeSchema,
  data: z.union([
    z.custom<T & { id: string }>(),
    z.array(z.custom<T & { id: string }>()),
  ]),
  serializerConfig: JsonApiResourceConfigSchema<T>(),
});

export type JsonApiResponseConfig<T> = {
  type: ResourceType;
  data: (T & { id: string }) | (T & { id: string })[];
  serializerConfig: JsonApiResourceConfig<T>;
};

export const ResponseMetadataSchema = z.object({
  timestamp: z.string().optional(),
  requestId: z.string().optional(),
  resourceId: z.union([z.string(), z.number()]).optional(),
}).passthrough();

export type ResponseMetadata = z.infer<typeof ResponseMetadataSchema>;

export const JsonApiResponseSchema = <T>() => z.object({
  data: z.any(),
  metadata: ResponseMetadataSchema,
});

export interface JsonApiResponse<T> {
  data: T;
  metadata: ResponseMetadata;
}

export const JsonApiErrorSchema = z.object({
  id: z.string(),
  status: z.string(),
  code: z.string(),
  title: z.string(),
  detail: z.string(),
  metadata: ResponseMetadataSchema,
  source: z.object({
    pointer: z.string().optional(),
    method: z.string().optional(),
  }).optional(),
});

export type JsonApiError = z.infer<typeof JsonApiErrorSchema>;

export const JsonApiErrorResponseSchema = z.object({
  errors: z.array(JsonApiErrorSchema),
});

export type JsonApiErrorResponse = z.infer<typeof JsonApiErrorResponseSchema>;

export const SuccessResponseOptionsSchema = z.object({
  status: z.custom<StatusConfig>().optional(),
  additionalMeta: z.object(z.unknown()).optional(),
  links: ResponseLinksSchema.optional(),
});

export type SuccessResponseOptions = z.infer<typeof SuccessResponseOptionsSchema>;