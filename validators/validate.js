const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Optional: Map errors to field => message
        const mappedErrors = {};
        errors.array().forEach(error => {
            mappedErrors[error.path] = error.msg;
        });

        return res.status(400).json({ errors: mappedErrors });
    }

    next(); // No errors, continue to next middleware
};

module.exports = validate;




