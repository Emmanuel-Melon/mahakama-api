import { Request, Response } from "express";
import { serializeJsonApi, serializeError } from "./express.serializer";
import {
  JsonApiResponseConfig,
  ErrorResponseConfig,
  JsonApiResponse,
  JsonApiErrorResponse,
  SSEEvent,
  SSEOptions,
  SuccessResponseOptions
} from "./express.types";

export const sendErrorResponse = (
  req: Request,
  res: Response,
  errorConfig: ErrorResponseConfig,
): Response<JsonApiErrorResponse> => {
  const { error } = serializeError(req, errorConfig);
  return res.status(errorConfig.status.statusCode).json({ errors: [error] });
};

export const sendSuccessResponse = <T>(
  req: Request,
  res: Response,
  responseConfig: JsonApiResponseConfig<T>,
  opts?: SuccessResponseOptions,
): Response<JsonApiResponse<any>> => {
  const { data, metadata } = serializeJsonApi(req, {
    responseConfig,
    metadata: opts?.additionalMeta,
  });

  const response = {
    data,
    links: {
      self: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      ...opts?.links
    },
    metadata: metadata,
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