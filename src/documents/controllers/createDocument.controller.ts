import { Request, Response, NextFunction } from "express";
import { createDocument } from "../operations/create";
import { CreateDocumentInput } from "../document.types";
import { ValidationError, ApiError } from "../../middleware/errors";

const HANDLER_NAME = 'createDocumentHandler';
const RESOURCE_TYPE = 'document';

export const createDocumentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const metadata = {
    route: req.path,
    handler: HANDLER_NAME,
    operation: 'create',
    resourceType: RESOURCE_TYPE,
  };

  try {
    const documentData: CreateDocumentInput = req.body;
    
    // Input validation
    if (!documentData.storageUrl) {
      throw new ValidationError('Storage URL is required', undefined, {
        ...metadata,
        validation: { field: 'storageUrl', issue: 'missing' }
      });
    }

    // Format and validate URL
    let storageUrl = documentData.storageUrl;
    if (!storageUrl.startsWith('http')) {
      storageUrl = `https://${storageUrl}`;
    }

    try {
      const newDocument = await createDocument({
        ...documentData,
        storageUrl,
      });

      return res.status(201).json({
        success: true,
        data: newDocument,
        metadata: {
          ...metadata,
          resourceId: newDocument.id,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error.withMetadata(metadata);
      }
      throw new ApiError(
        'Failed to create document',
        500,
        'DOCUMENT_CREATION_FAILED',
        undefined,
        metadata
      );
    }
  } catch (error) {
    // If it's already an ApiError, it will have metadata
    if (error instanceof ApiError) {
      return next(error);
    }
    
    // For any other errors, wrap them in an ApiError with metadata
    const apiError = new ApiError(
      error instanceof Error ? error.message : 'An unknown error occurred',
      500,
      'INTERNAL_SERVER_ERROR',
      undefined,
      {
        ...metadata,
        originalError: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        } : error,
      }
    );
    
    next(apiError);
  }
};
