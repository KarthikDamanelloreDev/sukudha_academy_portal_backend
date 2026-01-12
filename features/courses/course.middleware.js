const { validationResult } = require('express-validator');
const STATUS_CODES = require('../../utils/status-codes');

/**
 * Middleware to validate request data
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }

    next();
};

module.exports = { validate };
