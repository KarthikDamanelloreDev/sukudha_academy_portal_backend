const express = require('express');
const router = express.Router();
const instructorService = require('./instructor.service');
const {
    createInstructorValidation,
    updateInstructorValidation,
    getInstructorByIdValidation,
    deleteInstructorValidation,
    queryInstructorsValidation
} = require('./instructor.validation');
const { validate } = require('./instructor.middleware');
const STATUS_CODES = require('../../utils/status-codes');

router.get('/', queryInstructorsValidation, validate, async (req, res) => {
    try {
        const result = await instructorService.getAllInstructors(req.query);
        res.status(STATUS_CODES.OK).json({ success: true, ...result });
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const stats = await instructorService.getInstructorStats();
        res.status(STATUS_CODES.OK).json({ success: true, data: stats });
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
});

router.get('/:id', getInstructorByIdValidation, validate, async (req, res) => {
    try {
        const instructor = await instructorService.getInstructorById(req.params.id);
        res.status(STATUS_CODES.OK).json({ success: true, data: instructor });
    } catch (error) {
        const statusCode = error.message.includes('not found') ? STATUS_CODES.NOT_FOUND : STATUS_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ success: false, message: error.message });
    }
});

router.post('/', createInstructorValidation, validate, async (req, res) => {
    try {
        const instructor = await instructorService.createInstructor(req.body);
        res.status(STATUS_CODES.CREATED).json({ success: true, message: 'Instructor created successfully', data: instructor });
    } catch (error) {
        const statusCode = error.message.includes('already exists') ? STATUS_CODES.CONFLICT : STATUS_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ success: false, message: error.message });
    }
});

router.put('/:id', updateInstructorValidation, validate, async (req, res) => {
    try {
        const instructor = await instructorService.updateInstructor(req.params.id, req.body);
        res.status(STATUS_CODES.OK).json({ success: true, message: 'Instructor updated successfully', data: instructor });
    } catch (error) {
        const statusCode = error.message.includes('not found') ? STATUS_CODES.NOT_FOUND : STATUS_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ success: false, message: error.message });
    }
});

router.delete('/:id', deleteInstructorValidation, validate, async (req, res) => {
    try {
        await instructorService.deleteInstructor(req.params.id);
        res.status(STATUS_CODES.OK).json({ success: true, message: 'Instructor deleted successfully' });
    } catch (error) {
        const statusCode = error.message.includes('not found') ? STATUS_CODES.NOT_FOUND : STATUS_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ success: false, message: error.message });
    }
});

module.exports = router;
