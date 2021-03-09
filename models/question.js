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

questionSchema.statics.random = function(difficulty, category, callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.find({
      difficulty: difficulty,
      category: category
    }).skip(rand).limit(10).exec(callback);
  }.bind(this));
};

module.exports = mongoose.model('Question', questionSchema);
