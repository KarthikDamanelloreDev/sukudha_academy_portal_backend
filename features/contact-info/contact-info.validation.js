const { body } = require('express-validator');

const updateContactInfoValidation = [
    body('companyName').optional().trim(),
    body('companyLegalName').optional().trim(),
    body('description').optional().trim(),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('phone').optional().trim(),
    body('phoneLabel').optional().trim(),
    body('phone2').optional().trim(),
    body('phone2Label').optional().trim(),
    body('address').optional().trim(),
    body('floor').optional().trim(),
    body('city').optional().trim(),
    body('state').optional().trim(),
    body('zip').optional().trim(),
    body('supportEmail').optional().isEmail().withMessage('Invalid support email format'),
    body('salesEmail').optional().isEmail().withMessage('Invalid sales email format'),
    body('officeHours.weekdays').optional().trim(),
    body('officeHours.weekend').optional().trim()
];

module.exports = {
    updateContactInfoValidation
};
