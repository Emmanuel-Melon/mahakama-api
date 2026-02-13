import { Request, Response } from "express";
import { listDocuments } from "../operations/documents.list";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const getDocumentsController = asyncHandler(async (req: Request, res: Response) => {
  const { type, limit, offset } = req.query;
  const documents = await listDocuments({
    type: type as string | undefined,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  });
  sendSuccessResponse(
    req,
    res,
    {
      data: documents.data.map((document) => ({
        ...document,
        id: document.id.toString(),
      })) as ((typeof documents.data)[number] & { id: string })[],
      type: "collection",
      serializerConfig: DocumentsSerializer,
    },
    {
      status: HttpStatus.SUCCESS,
    },
  );
});
