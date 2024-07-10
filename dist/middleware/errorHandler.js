"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validation_1 = require("express-validation");
function ValidationErrorHandler(err, req, res, next) {
    var _a;
    if (err instanceof express_validation_1.ValidationError) {
        let errorDetails = [];
        if (err.details && Array.isArray(err.details.query || err.details.body)) {
            errorDetails = err.details.query ? err.details.query : (_a = err.details.body) === null || _a === void 0 ? void 0 : _a.map((details) => ({
                message: details.message,
                path: details.path,
                type: details.type,
                context: details.context,
            }));
        }
        return res.status(400).json({
            code: 400,
            message: 'Validation error',
            errors: 'Bad Request',
            stack: {
                body: errorDetails
            }
        });
    }
    else {
        next(err);
    }
}
exports.default = ValidationErrorHandler;
