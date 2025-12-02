import { Request, Response, NextFunction } from "express";
import { initSSE } from "@/lib/express/express.response";
import { DocumentIngestionEvent } from "../documents.types";

export const ingestDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { sendEvent, sendError, close } = initSSE(res, {
    headers: {
      'Content-Disposition': 'inline',
    },
    metadata: {
      name: 'document-ingestion',
      route: '/api/documents/ingest',
      requestId: req.requestId || 'unknown',
    },
  });

  try {
    sendEvent({
      type: 'started',
      data: {
        timestamp: new Date().toISOString(),
        filename: req.file?.originalname || 'unknown',
        size: req.file?.size || 0,
      },
    });

    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const fileBuffer = req.file.buffer;
    const chunkSize = 1024 * 10; // 10KB chunks
    const totalChunks = Math.ceil(fileBuffer.length / chunkSize);
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, fileBuffer.length);
      const chunk = fileBuffer.slice(start, end);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      sendEvent({
        type: 'progress',
        data: {
          processed: end,
          total: fileBuffer.length,
          percentage: Math.round((end / fileBuffer.length) * 100),
          chunk: i + 1,
          totalChunks,
        },
      });

      const text = chunk.toString('utf8').replace(/[^\x20-\x7E\n\r\t]/g, '').trim();
      if (text) {
        sendEvent({
          type: 'content',
          data: {
            chunk: i + 1,
            preview: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
          },
        });
      }
    }

    sendEvent({
      type: 'completed',
      data: {
        filename: req.file.originalname,
        size: req.file.size,
        processedAt: new Date().toISOString(),
        totalChunks,
      },
    });
    close();
  } catch (error) {
    console.error('Document ingestion error:', error);
    sendError({
      message: error instanceof Error ? error.message : 'Failed to process document',
      code: 'DOCUMENT_PROCESSING_ERROR',
      details: error instanceof Error ? error.stack : undefined,
    });
    close();
  }
};