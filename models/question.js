var mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [
    {
      text: {
        type: String,
        required: true,
      },
      isTrue: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
});

module.exports = mongoose.model('Question', questionSchema);
