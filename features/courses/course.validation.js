const { body, param, query } = require('express-validator');
const { COURSE_LEVELS } = require('../../utils/constants');

const createCourseValidation = [
    body('id').notEmpty().withMessage('Course ID is required').trim(),
    body('title').notEmpty().withMessage('Title is required').trim(),
    body('category').notEmpty().withMessage('Category is required').trim(),
    body('level').isIn(COURSE_LEVELS).withMessage(`Level must be one of: ${COURSE_LEVELS.join(', ')}`),
    body('price').isNumeric().withMessage('Price must be a number').isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('originalPrice').isNumeric().withMessage('Original price must be a number').isFloat({ min: 0 }).withMessage('Original price must be positive'),
    body('instructor').notEmpty().withMessage('Instructor name is required').trim(),
    body('instructorId').notEmpty().withMessage('Instructor ID is required').trim(),
    body('duration').notEmpty().withMessage('Duration is required').trim(),
    body('lectures').isInt({ min: 0 }).withMessage('Lectures must be a positive integer'),
    body('description').notEmpty().withMessage('Description is required').trim(),
    body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
    body('reviews').optional().isInt({ min: 0 }).withMessage('Reviews must be a positive integer'),
    body('students').optional().isInt({ min: 0 }).withMessage('Students must be a positive integer'),
    body('highlights').optional().isArray().withMessage('Highlights must be an array'),
    body('bestseller').optional().isBoolean().withMessage('Bestseller must be a boolean'),
    body('free').optional().isBoolean().withMessage('Free must be a boolean')
];

const updateCourseValidation = [
    param('id').notEmpty().withMessage('Course ID is required'),
    body('title').optional().trim(),
    body('category').optional().trim(),
    body('level').optional().isIn(COURSE_LEVELS).withMessage(`Level must be one of: ${COURSE_LEVELS.join(', ')}`),
    body('price').optional().isNumeric().isFloat({ min: 0 }),
    body('originalPrice').optional().isNumeric().isFloat({ min: 0 }),
    body('rating').optional().isFloat({ min: 0, max: 5 }),
    body('reviews').optional().isInt({ min: 0 }),
    body('students').optional().isInt({ min: 0 }),
    body('lectures').optional().isInt({ min: 0 }),
    body('highlights').optional().isArray(),
    body('bestseller').optional().isBoolean(),
    body('free').optional().isBoolean()
];

const getCourseByIdValidation = [
    param('id').notEmpty().withMessage('Course ID is required')
];

const deleteCourseValidation = [
    param('id').notEmpty().withMessage('Course ID is required')
];

const queryCoursesValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('category').optional().trim(),
    query('level').optional().isIn(COURSE_LEVELS),
    query('instructorId').optional().trim(),
    query('bestseller').optional().isBoolean(),
    query('free').optional().isBoolean()
];

module.exports = {
    createCourseValidation,
    updateCourseValidation,
    getCourseByIdValidation,
    deleteCourseValidation,
    queryCoursesValidation
};
