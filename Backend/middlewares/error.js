class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if(err.code === 11000) {
        err.message = `Duplicate Key ${Object.keys(err.keyValue)} Error`;
        err = new ErrorHandler(err.message, 400);
    }

    if(err.name === "jsonWebTokenError") {
        err.message = "JSON Web Token is invalid, try again";
        err = new ErrorHandler(err.message, 400);
    }
    if(err.name === "TokenExpiredError") {
        err.message = "JSON Web Token is expired, try again";
        err = new ErrorHandler(err.message, 400);
    }
    if(err.name === "CastError") {
        err.message = "Resource not found. Invalid: " + err.path;
        err = new ErrorHandler(err.message, 400);
    }

    const errorMessage = err.errors 
    ? Object.values(err.errors)
        .map(err => err.message)
        .join(", ") 
    : err.message;

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
}

export default ErrorHandler;