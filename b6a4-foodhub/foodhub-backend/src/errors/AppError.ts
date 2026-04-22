export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly errorCode?: string;
    public readonly details?: unknown;

    constructor(
        message: string,
        statusCode: number = 500,
        options?: {
            errorCode?: string;
            isOperational?: boolean;
            details?: unknown;
        }
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = options?.isOperational ?? true;
        this.errorCode = options?.errorCode;
        this.details = options?.details;

        Error.captureStackTrace(this, this.constructor);
    }
}