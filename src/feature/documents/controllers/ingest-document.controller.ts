import { Request, Response, NextFunction } from "express";
import { createDocument } from "../operations/documents.create";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";
import { uploadFileToBucket } from "@/lib/supabase/storage";

export const ingestDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const file = req.file;
    const {
      bucketName = "legal_documents",
      title,
      description,
      type,
      sections,
    } = req.body;

    if (!file) {
      throw new Error("No file provided");
    }

    // Upload file to bucket (defaults to legal_documents for backward compatibility)
    const uploadResult = await uploadFileToBucket({
      bucketName,
      fileBuffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype,
    });

    // Create document record
    const document = await createDocument({
      title: title || file.originalname,
      description: description || "No description",
      type: type || "contract",
      sections: Number(sections) || 1,
      lastUpdated: new Date().getFullYear().toString(),
      storageUrl: uploadResult.publicUrl,
    });

    sendSuccessResponse(
      req,
      res,
      {
        data: { ...document, id: document.id.toString() } as typeof document & {
          id: string;
        },
        type: "single",
        serializerConfig: DocumentsSerializer,
      },
      {
        status: HttpStatus.CREATED,
      },
    );
  } catch (error) {
    next(error);
  }
};
