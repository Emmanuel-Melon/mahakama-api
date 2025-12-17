// import { Request, Response, NextFunction } from "express";
// import { uploadPublicDocument } from "@/lib/supabase/storage";
// import { createDocument } from "../operations/documents.create";
// import { sendSuccessResponse } from "@/lib/express/express.response";
// import { HttpStatus } from "@/http-status";
// import { DocumentsSerializer } from "../document.config";
// import { ingestDocument } from "../operations/documents.ingest";

// export const ingestDocumentController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const file = req.file;
//     const { title, description, type, sections } = req.body;
//     const userId = req.user?.id || "default-user-id";

//     if (!file) {
//       throw new Error("No file provided");
//     }

//     const uploadResult = await ingestDocument(file);

//     const document = await createDocument({
//       title: title || file.originalname,
//       description: description || "No description",
//       type: type || "contract",
//       sections: Number(sections) || 1,
//       lastUpdated: new Date().getFullYear().toString(),
//       storageUrl: uploadResult.storagePath,
//     });

//     sendSuccessResponse(
//       req,
//       res,
//       {
//         data: { ...document, id: document.id.toString() } as typeof document & {
//           id: string;
//         },
//         type: "single",
//         serializerConfig: DocumentsSerializer,
//       },
//       {
//         status: HttpStatus.CREATED,
//       },
//     );

//   } catch (error) {
//     next(error);
//   }
// };