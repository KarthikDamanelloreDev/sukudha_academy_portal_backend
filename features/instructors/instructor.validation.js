const { body, param, query } = require('express-validator');
const { AVATAR_COLORS } = require('../../utils/constants');

const createInstructorValidation = [
    body('id').notEmpty().withMessage('Instructor ID is required').trim(),
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('role').notEmpty().withMessage('Role is required').trim(),
    body('bio').notEmpty().withMessage('Bio is required').trim(),
    body('color').optional().isIn(AVATAR_COLORS).withMessage('Invalid color'),
    body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
    body('courses').optional().isInt({ min: 0 }).withMessage('Courses must be a positive integer'),
    body('students').optional().isInt({ min: 0 }).withMessage('Students must be a positive integer'),
    body('specializations').optional().isArray().withMessage('Specializations must be an array'),
    body('social.linkedin').optional().isString(),
    body('social.twitter').optional().isString(),
    body('social.website').optional().isString()
];

const updateInstructorValidation = [
    param('id').notEmpty().withMessage('Instructor ID is required'),
    body('name').optional().trim(),
    body('role').optional().trim(),
    body('bio').optional().trim(),
    body('color').optional().isIn(AVATAR_COLORS),
    body('rating').optional().isFloat({ min: 0, max: 5 }),
    body('courses').optional().isInt({ min: 0 }),
    body('students').optional().isInt({ min: 0 }),
    body('specializations').optional().isArray()
];

const getInstructorByIdValidation = [
    param('id').notEmpty().withMessage('Instructor ID is required')
];

const deleteInstructorValidation = [
    param('id').notEmpty().withMessage('Instructor ID is required')
];

const queryInstructorsValidation = [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('role').optional().trim()
];

module.exports = {
    createInstructorValidation,
    updateInstructorValidation,
    getInstructorByIdValidation,
    deleteInstructorValidation,
    queryInstructorsValidation
};
