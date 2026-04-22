import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

import { AppError } from './AppError';
import {
    handleZodError,
    handlePrismaError,
    handleGenericError,
} from './errorHelpers';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let result: {
        statusCode: number;
        message: string;
        errorMessages: Array<{ path: string; message: string }>;
    };

    // ZOD ERROR
    if (err instanceof ZodError) {
        result = handleZodError(err);
    }

    // PRISMA ERROR
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        result = handlePrismaError(err);
    }

    // CUSTOM APP ERROR (YOUR MAIN CONTROLLED ERROR)
    else if (err instanceof AppError) {
        result = {
            statusCode: err.statusCode,
            message: err.message,
            errorMessages: [
                {
                    path: '',
                    message: err.message,
                },
            ],
        };
    }

    // DEFAULT ERROR
    else {
        result = handleGenericError(err);
    }

    res.status(result.statusCode).json({
        success: false,
        message: result.message,
        errorMessages: result.errorMessages,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        source: {
            method: req.method,
            path: req.originalUrl,
        },
    });
};

export default globalErrorHandler;