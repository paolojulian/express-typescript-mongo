import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError, Result } from "express-validator";
import { HTTP400Error } from "./httpErrors";

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors: Array<ValidationError> = [];
    errors
        .array()
        .map(err => extractedErrors.push(err))

    return res.status(400).json({
        errors: extractedErrors,
    })
}

export default validate;