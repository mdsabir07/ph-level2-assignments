import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';

/**
 * Global Error Handler Middleware
 * Standardizes error responses for Zod validation, Prisma issues, and custom AppErrors.
 */
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong!';
  let errorMessages: Array<{ path: string | number; message: string }> = [];

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Validation Error';
    errorMessages = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    }));
  } 
  // Handle Prisma Known Request Errors (e.g., Unique constraint violations)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Database Request Error';
    
    // P2002 is a common error for unique constraint failure
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[])?.join(', ') || 'field';
      errorMessages = [
        {
          path: field,
          message: `Duplicate value for ${field}`,
        },
      ];
    } else {
      errorMessages = [
        {
          path: '',
          message: err.message,
        },
      ];
    }
  } 
  // Handle Prisma Validation Errors (Input logic issues)
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Database Validation Error';
    errorMessages = [
      {
        path: '',
        message: 'Invalid data provided to the database.',
      },
    ];
  } 
  // Handle Prisma Initialization Errors (Connection issues)
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Database Connection Error';
    errorMessages = [
      {
        path: '',
        message: 'Unable to connect to the database server.',
      },
    ];
  }
  // Handle Custom AppError or Generic Error
  else if (err instanceof Error) {
    // If we passed a custom status code on the error object
    statusCode = (err as any).statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    message = err.message;
    errorMessages = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  // Ultimate standardized response
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    // Including stack trace only in development mode for security
    stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
    source: {
      method: req.method,
      path: req.originalUrl,
    }
  });
};

export default globalErrorHandler;