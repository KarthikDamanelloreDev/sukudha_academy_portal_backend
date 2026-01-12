const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Instructor name is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true
    },
    bio: {
        type: String,
        required: [true, 'Bio is required']
    },
    color: {
        type: String,
        default: 'bg-blue-600'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    courses: {
        type: Number,
        default: 0,
        min: 0
    },
    students: {
        type: Number,
        default: 0,
        min: 0
    },
    specializations: {
        type: [String],
        default: []
    },
    social: {
        linkedin: { type: String, default: '#' },
        twitter: { type: String, default: '#' },
        website: { type: String, default: '#' }
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Indexes
instructorSchema.index({ role: 1 });
instructorSchema.index({ rating: -1 });

module.exports = mongoose.model('Instructor', instructorSchema);
