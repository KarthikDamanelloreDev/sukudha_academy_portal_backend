const express = require('express');
const router = express.Router();
const courseService = require('./course.service');
const {
    createCourseValidation,
    updateCourseValidation,
    getCourseByIdValidation,
    deleteCourseValidation,
    queryCoursesValidation
} = require('./course.validation');
const { validate } = require('./course.middleware');
const STATUS_CODES = require('../../utils/status-codes');

/**
 * @route   GET /api/courses
 * @desc    Get all courses with pagination and filters
 * @access  Public
 */
router.get('/', queryCoursesValidation, validate, async (req, res) => {
    try {
        const result = await courseService.getAllCourses(req.query);
        res.status(STATUS_CODES.OK).json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   GET /api/courses/stats
 * @desc    Get course statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = await courseService.getCourseStats();
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   GET /api/courses/:id
 * @desc    Get course by ID
 * @access  Public
 */
router.get('/:id', getCourseByIdValidation, validate, async (req, res) => {
    try {
        const course = await courseService.getCourseById(req.params.id);
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: course
        });
    } catch (error) {
        const statusCode = error.message.includes('not found')
            ? STATUS_CODES.NOT_FOUND
            : STATUS_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   POST /api/courses
 * @desc    Create new course
 * @access  Private (Admin)
 */
router.post('/', createCourseValidation, validate, async (req, res) => {
    try {
        const course = await courseService.createCourse(req.body);
        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: 'Course created successfully',
            data: course
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
 * @route   PUT /api/courses/:id
 * @desc    Update course
 * @access  Private (Admin)
 */
router.put('/:id', updateCourseValidation, validate, async (req, res) => {
    try {
        const course = await courseService.updateCourse(req.params.id, req.body);
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Course updated successfully',
            data: course
        });
    } catch (error) {
        const statusCode = error.message.includes('not found')
            ? STATUS_CODES.NOT_FOUND
            : STATUS_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete course
 * @access  Private (Admin)
 */
router.delete('/:id', deleteCourseValidation, validate, async (req, res) => {
    try {
        await courseService.deleteCourse(req.params.id);
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        const statusCode = error.message.includes('not found')
            ? STATUS_CODES.NOT_FOUND
            : STATUS_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
