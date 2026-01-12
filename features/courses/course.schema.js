const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true
    },
    slug: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    level: {
        type: String,
        required: [true, 'Level is required'],
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0,
        min: 0
    },
    students: {
        type: Number,
        default: 0,
        min: 0
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    originalPrice: {
        type: Number,
        required: [true, 'Original price is required'],
        min: 0
    },
    image: {
        type: String,
        default: ''
    },
    instructor: {
        type: String,
        required: [true, 'Instructor name is required']
    },
    instructorId: {
        type: String,
        required: [true, 'Instructor ID is required']
    },
    duration: {
        type: String,
        required: [true, 'Duration is required']
    },
    lectures: {
        type: Number,
        required: [true, 'Number of lectures is required'],
        min: 0
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    highlights: {
        type: [String],
        default: []
    },
    curriculum: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    bestseller: {
        type: Boolean,
        default: false
    },
    free: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Create slug from title before saving
courseSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Indexes for better query performance
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ instructorId: 1 });
courseSchema.index({ bestseller: 1 });
courseSchema.index({ free: 1 });

module.exports = mongoose.model('Course', courseSchema);
