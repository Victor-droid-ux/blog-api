const errorHandler = (error, req, res, next) => {
    const code = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(code).json({
        code,
        status: false,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? undefined : error.stack
    });
};

module.exports = errorHandler;