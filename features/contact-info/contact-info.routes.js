const express = require('express');
const router = express.Router();
const contactInfoService = require('./contact-info.service');
const { updateContactInfoValidation } = require('./contact-info.validation');
const { validate } = require('./contact-info.middleware');
const STATUS_CODES = require('../../utils/status-codes');

/**
 * @route   GET /api/contact-info
 * @desc    Get contact information
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const contactInfo = await contactInfoService.getContactInfo();
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: contactInfo
        });
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   PUT /api/contact-info
 * @desc    Update contact information
 * @access  Private (Admin)
 */
router.put('/', updateContactInfoValidation, validate, async (req, res) => {
    try {
        const contactInfo = await contactInfoService.updateContactInfo(req.body);
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Contact information updated successfully',
            data: contactInfo
        });
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
