import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/httpErrors";

export const checkUserParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.query.user) {
    throw new HTTP400Error("Missing user name parameter");
  } else {
    next();
  }
};