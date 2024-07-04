import { Request, Response, NextFunction } from "express";
import { ValidationError } from "express-validation";

function ValidationErrorHandler(err:any, req:Request, res:Response, next:NextFunction){
    if(err instanceof ValidationError){
        let errorDetails:any = [];
        if(err.details && Array.isArray(err.details.query || err.details.body)) {
            errorDetails = err.details.query ? err.details.query : err.details.body?.map((details:any) => ({
                message: details.message,
                path: details.path,
                type: details.type,
                context: details.context,
            }));
        }
        return res.status(400).json({
            code:400,
            message: 'Validation error',
            errors: 'Bad Request',
            stack: {
                body: errorDetails
            }
        });
    }
    else{
        next(err);
    }
}

export default ValidationErrorHandler;