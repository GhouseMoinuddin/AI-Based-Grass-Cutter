const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Shape', 'Text'],
        required: true
    },
    value: {
        type: String, // e.g., 'Square' or 'HELLO'
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    status: {
        type: String,
        enum: ['Completed', 'Aborted', 'Failed'],
        default: 'Completed'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Record', recordSchema);
