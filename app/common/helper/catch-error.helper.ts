import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

/**
 * Middleware to catch validation errors and pass them to the error handler
 */
export const catchError = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const data = { errors: errors.array() };
      throw createHttpError(400, {
        message: "Validation error!",
        data,
      });
    }
    
    next();
  }
);
