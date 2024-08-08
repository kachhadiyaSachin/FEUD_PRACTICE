import { Request, Response, NextFunction } from "express";
import { ValidationError } from "express-validation";

export const validationErrorHandler = (err: any, req: Request, res: Response, next: NextFunction ) => {
  if (err instanceof ValidationError) {
    let errorDetails: any = [];
    if ( err.details && Array.isArray(err.details.query ?? err.details.body ?? []) ) {
        errorDetails = err.details.query ? err.details.query : err.details.body?.map((detail: any) => ({
            message: detail.message,
            path: detail.path,
            type: detail.type,
            context: detail.context,
        })) ?? [];
    }

    const customErrorMessages = errorDetails.map((detail: any) => {
      return {
        message: detail.message,
        path: detail.path,
        type: detail.type,
        context: detail.context,
      };
    });

    return res.status(400).json({
        code: 400,
        message: "Validation Error",
        errors: "Bad Request",
        detail: customErrorMessages[0].message,
        body: customErrorMessages,
    });
  }
  next(err);
};
