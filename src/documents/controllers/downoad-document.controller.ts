import { Request, Response, NextFunction } from "express";
import { downloadDocument } from "../operations/document.update";

const HANDLER_NAME = "downloadDocumentHandler";
const RESOURCE_TYPE = "documentDownload";

export const downloadDocumentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const metadata = {
    route: req.path,
    handler: HANDLER_NAME,
    operation: "download",
    resourceType: RESOURCE_TYPE,
  };

  try {
    const documentId = Number(req.params.id);
    const userId = req.user?.id;

    const result = await downloadDocument({
      documentId,
      userId: userId!,
    });

    return res.status(200).json({
      success: true,
      data: {
        documentId: result.documentId,
        downloadUrl: result.downloadUrl,
        downloadCount: result.downloadCount,
      },
      metadata: {
        ...metadata,
        resourceId: result.documentId,
        timestamp: result.timestamp,
      },
    });
  } catch (error) {
    next(error);
  }
};
