const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    studentName: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    studentEmail: {
        type: String,
        required: [true, 'Student email is required'],
        trim: true,
        lowercase: true
    },
    courses: {
        type: [String],
        required: [true, 'At least one course is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

transactionSchema.index({ status: 1 });
transactionSchema.index({ studentEmail: 1 });
transactionSchema.index({ date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
