var mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    } 
    // {
    //   questionId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Question',
    //     required: true,
    //   },
    // },
  ],
  score: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Game', gameSchema);
