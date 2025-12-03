import { Request, Response } from "express";
import { StatusConfig } from "./http-status";
import { serializeJsonApi } from "./express.serializer";
import { v4 as uuidv4 } from "uuid";
import {
  JsonApiResponseConfig,
  ErrorResponseConfig,
  JsonApiResponse,
  JsonApiError,
  JsonApiErrorResponse,
  SSEEvent, SSEOptions
} from "./express.types";

export const sendErrorResponse = (
  req: Request,
  res: Response,
  errorConfig: ErrorResponseConfig,
): Response<JsonApiErrorResponse> => {
  const { status, message, title, source, config } = errorConfig;
  const errorObject: JsonApiError = {
    id: uuidv4(),
    status: status.statusCode.toString(),
    code: status.code,
    title: title ?? status.title,
    detail: message ?? status.description,
    meta: {
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
      ...config,
    },
    source: {
      pointer: source?.pointer ?? req.originalUrl,
      method: source?.method ?? req.method,
    },
  };
  return res.status(status.statusCode).json({ errors: [errorObject] });
};

export const sendSuccessResponse = <T>(
  req: Request,
  res: Response,
  responseConfig: JsonApiResponseConfig<T>,
  opts?: {
    status?: StatusConfig;
    additionalMeta?: Record<string, any>;
  },
): Response<JsonApiResponse<any>> => {
  const serializedData = serializeJsonApi(responseConfig);

  const metadata = {
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
    ...opts?.additionalMeta,
  };

  const response: JsonApiResponse<typeof serializedData> = {
    data: serializedData,
    meta: metadata,
  };

  return res.status(opts?.status?.statusCode || 200).json(response);
};

export const initSSE = (res: Response, options?: SSEOptions) => {
  const defaultHeaders = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no", // Disable nginx buffering
    ...options?.headers,
  };

  res.writeHead(200, defaultHeaders);
  res.write(": connected\n\n");

  const sendEvent = <T, Type extends string = string>(
    event: SSEEvent<T, Type> | { type: Type; data: T; id?: string; retry?: number }
  ) => {
    const { type, data = {} as T, id, retry } = event;
    
    if (id) {
      res.write(`id: ${id}\n`);
    }
    if (retry) {
      res.write(`retry: ${retry}\n`);
    }
    
    res.write(`event: ${type}\n`);
    res.write(`data: ${JSON.stringify(data || {})}\n\n`);

    if (options?.metadata) {
      console.debug(`[${options.metadata.name}] SSE sent:`, {
        ...options.metadata,
        eventType: type,
        eventData: data,
      });
    }
  };

  const sendError = (error: { message: string; code?: string; details?: unknown }) => {
    sendEvent({
      type: "error",
      data: { success: false, error },
    });
  };

  const close = () => {
    sendEvent({ type: "done" });
    res.end();
  };

  return { 
    sendEvent, 
    sendError, 
    close,
    // Helper method for type-safe events
    createEvent: <T, Type extends string = string>(
      type: Type, 
      data: T, 
      options?: { id?: string; retry?: number }
    ) => sendEvent({ type, data, ...options })
  };
};