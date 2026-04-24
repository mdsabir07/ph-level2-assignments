import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const handleZodError = (err: ZodError) => {
    return {
        statusCode: 400,
        message: 'Validation Error',
        errorMessages: err.issues.map(issue => ({
            path: issue.path.length ? issue.path.join('.') : '',
            message: issue.message,
        })),
    };
};

export const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
    if (err.code === 'P2002') {
        const field = (err.meta?.target as string[])?.join(', ') || 'field';

        return {
            statusCode: 409,
            message: 'Duplicate Value',
            errorMessages: [
                {
                    path: field,
                    message: `Duplicate value for ${field}`,
                },
            ],
        };
    }

    return {
        statusCode: 400,
        message: 'Database Error',
        errorMessages: [
            {
                path: '',
                message: err.message,
            },
        ],
    };
};

export const handleGenericError = (err: Error) => {
    return {
        statusCode: 500,
        message: err.message || 'Something went wrong',
        errorMessages: [
            {
                path: '',
                message: err.message,
            },
        ],
    };
};