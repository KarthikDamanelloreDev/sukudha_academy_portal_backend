const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('./auth.schema');
const STATUS_CODES = require('../../utils/status-codes');

/**
 * Validate request data
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

/**
 * Protect routes - Verify JWT token
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only');

        // Get user from token
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!req.user.isActive) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: 'Your account has been deactivated'
            });
        }

        next();
    } catch (error) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

/**
 * Authorize specific roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = {
    validate,
    protect,
    authorize
};
