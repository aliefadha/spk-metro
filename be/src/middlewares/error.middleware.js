const { ResponseError,NotFoundError,ValidationError,UnauthorizedError } = require("../utils/responseError.js");

const formatErrorResponse = (error = true, message, errors = null) => {
    const response = { error, message };
    if (errors) response.errors = errors;
    return response;
};

const logError = (err, req) => {
    console.error({
        name: err.name,
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        requestBody: req.body,
        requestParams: req.params,
        requestQuery: req.query,
        userId: req.user?.id
    });
};

const errorMiddleware = (err, req, res, next) => {
    if (!err) return next();

    logError(err, req);

    switch (true) {

        case err instanceof ValidationError:
            return res.status(err.status).json(
                formatErrorResponse(true, err.message, err.errors)
            );

        case err instanceof NotFoundError:
            return res.status(err.status).json(
                formatErrorResponse(true, err.message)
            );

        case err instanceof UnauthorizedError:
            return res.status(err.status).json(
                formatErrorResponse(true, err.message)
            );

        case err instanceof ResponseError:
            return res.status(err.status).json(
                formatErrorResponse(true, err.message, err.errors)
            );

        case err.name === 'JsonWebTokenError':
            return res.status(401).json(
                formatErrorResponse(true, 'Invalid token')
            );

        case err.name === 'TokenExpiredError':
            return res.status(401).json(
                formatErrorResponse(true, 'Token expired')
            );
    }

    const isDevelopment = process.env.NODE_ENV === 'development';
    const message = isDevelopment ? err.message : 'Internal Server Error';
    const errorDetails = isDevelopment ? err.stack : undefined;

    // Handle unknown errors
    return res.status(500).json(
        formatErrorResponse(true, message, errorDetails)
    );
};


module.exports = { errorMiddleware };