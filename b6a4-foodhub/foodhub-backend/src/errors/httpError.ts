import { AppError } from "./AppError"

export const httpError = {
    badRequest: (msg = 'Bad Request', details?: unknown) =>
        new AppError(msg, 400, { details }),
    unauthorized: (msg = 'Unauthorized') =>
        new AppError(msg, 401, { errorCode: 'UNAUTHORIZED' }),
    forbidden: (msg = 'Forbidden') =>
        new AppError(msg, 403, { errorCode: 'FORBIDDEN' }),
    notFound: (msg = 'Not Found') =>
        new AppError(msg, 404, { errorCode: 'NOT_FOUND' }),
    conflict: (msg = 'Conflict', details?: unknown) =>
        new AppError(msg, 409, { details }),
    internal: (msg = 'Internal Server Error') =>
        new AppError(msg, 500, { isOperational: false }),
};