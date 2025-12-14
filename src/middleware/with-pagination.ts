import { RequestHandler } from "express";
import { getPaginationParams } from "@/lib/express/pagination";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const withPagination: RequestHandler = (req, res, next) => {
  const { page = DEFAULT_PAGE, limit } = req.query as {
    page?: string | number;
    limit?: string | number;
  };

  req.pagination = getPaginationParams({
    page,
    limit,
    defaultLimit: DEFAULT_LIMIT,
    maxLimit: MAX_LIMIT,
  });
  next();
};
