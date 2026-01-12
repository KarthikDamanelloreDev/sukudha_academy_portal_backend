const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        default: 'SukudhaEdu'
    },
    companyLegalName: {
        type: String,
        required: true,
        default: 'SUKUDHA SOFTWARE SOLUTIONS PRIVATE LIMITED'
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    phoneLabel: {
        type: String,
        default: 'Helpline'
    },
    phone2: {
        type: String,
        default: ''
    },
    phone2Label: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        required: true
    },
    floor: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    supportEmail: {
        type: String,
        required: true
    },
    salesEmail: {
        type: String,
        default: ''
    },
    officeHours: {
        weekdays: {
            type: String,
            default: 'Mon - Sat: 9:00 AM - 7:00 PM'
        },
        weekend: {
            type: String,
            default: 'Sunday: Closed'
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
