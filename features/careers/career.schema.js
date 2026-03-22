const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    experience: { type: String, required: true },
    linkedin: { type: String },
    coverLetter: { type: String },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
