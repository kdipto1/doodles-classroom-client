# Standardize Error Response Format

## Issue
Server error responses are inconsistent. The client expects all responses to follow the standardized format.

## Fix
In your server file `src/errors/error.ts`, update the error handler to return consistent format:

```typescript
// BEFORE (incorrect)
export const errorHandler = (err: ApiError, _req: Request, res: Response) =\u003e {
  let { statusCode, message } = err;
  if (config.nodeEnv === "production" \u0026\u0026 !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Internal Server Error";
  }

  res.locals["errorMessage"] = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.nodeEnv === "development" \u0026\u0026 { stack: err.stack }),
  };

  if (config.nodeEnv === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

// AFTER (correct)
export const errorHandler = (err: ApiError, _req: Request, res: Response) =\u003e {
  let { statusCode, message } = err;
  if (config.nodeEnv === "production" \u0026\u0026 !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Internal Server Error";
  }

  res.locals["errorMessage"] = err.message;

  const response = {
    success: false,
    statusCode: statusCode,
    message,
    ...(config.nodeEnv === "development" \u0026\u0026 { stack: err.stack }),
  };

  if (config.nodeEnv === "development") {
    logger.error(err);
  }

  res.status(statusCode).json(response); // Use .json() instead of .send()
};
```

## Also Update All Manual Error Responses
Make sure all manual error responses in controllers follow this format:

```typescript
// Correct format for all error responses
res.status(statusCode).json({
  success: false,
  statusCode: statusCode,
  message: "Error message here"
});
```
