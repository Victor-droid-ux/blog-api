const notFound = (req, res, next) => {
    console.warn(`Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        code: 404,
        status: false,
        message: `API route '${req.originalUrl}' is not available`
    });
};

module.exports = notFound