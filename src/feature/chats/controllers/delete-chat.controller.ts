import { Request, Response } from "express";
import { deleteChat } from "../operations/chats.update";
import { User } from "@/feature/users/users.schema";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { HttpStatus } from "@/http-status";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const deleteChatController = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const user = req.user as User;

  const deleted = await deleteChat(chatId, user.id);

  if (deleted) {
    return sendSuccessResponse(
      req,
      res,
      {
        data: { id: chatId, deleted: true } as {
          id: string;
          deleted: boolean;
        },
        type: "single",
        serializerConfig: {
          type: "chat",
          attributes: (resource) => ({
            deleted: resource.deleted,
          }),
        },
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          message: "Resource successfully deleted",
          deletedAt: new Date().toISOString(),
        },
      },
    );
  }

  sendErrorResponse(req, res, {
    status: HttpStatus.NOT_FOUND,
  });
});
