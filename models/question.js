var mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        text: {
            type: String,
            required: true
        },
        isTrue: {
            type: Boolean,
            required: false
        }
    },
    category: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);