const express = require('express');
const router = express.Router();
const authService = require('./auth.service');
const {
    studentRegisterValidation,
    adminRegisterValidation,
    loginValidation
} = require('./auth.validation');
const { validate, protect } = require('./auth.middleware');
const STATUS_CODES = require('../../utils/status-codes');

/**
 * @route   POST /api/auth/student/register
 * @desc    Register a new student
 * @access  Public
 */
router.post('/student/register', studentRegisterValidation, validate, async (req, res) => {
    try {
        const { user, token } = await authService.registerStudent(req.body);

        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: 'Student registered successfully',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        const statusCode = error.message.includes('already exists')
            ? STATUS_CODES.CONFLICT
            : STATUS_CODES.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   POST /api/auth/student/login
 * @desc    Student login
 * @access  Public
 */
router.post('/student/login', loginValidation, validate, async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.loginStudent(email, password);

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        const statusCode = error.message.includes('Invalid')
            ? STATUS_CODES.UNAUTHORIZED
            : STATUS_CODES.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   POST /api/auth/admin/register
 * @desc    Register a new admin
 * @access  Public (should be protected in production)
 */
router.post('/admin/register', adminRegisterValidation, validate, async (req, res) => {
    try {
        const { user, token } = await authService.registerAdmin(req.body);

        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: 'Admin registered successfully',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        const statusCode = error.message.includes('already exists')
            ? STATUS_CODES.CONFLICT
            : STATUS_CODES.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/admin/login', loginValidation, validate, async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.loginAdmin(email, password);

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        const statusCode = error.message.includes('Invalid')
            ? STATUS_CODES.UNAUTHORIZED
            : STATUS_CODES.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
    try {
        const user = await authService.getUserProfile(req.user._id);

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                user
            }
        });
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset OTP
 * @access  Public
 */
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: 'Email is required' });
        }

        const result = await authService.forgotPassword(email);

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using OTP
 * @access  Public
 */
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;
        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: 'All fields are required' });
        }

        const result = await authService.resetPassword(email, otp, newPassword, confirmPassword);

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: result.message,
            data: {
                user: result.user,
                token: result.token
            }
        });
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
