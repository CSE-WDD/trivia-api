const Question = require('../models/question');
const Game = require('../models/game');


exports.startGame = (req, res, next) => {
  const difficulty = req.query.difficulty;
  const category = req.query.category;

  Question.random(difficulty, category, (err, questions) => {

      if (err) {
        throw new Error("Couldn't get qeustions!");
      }
    
      const questionsId = questions.map(question => {
        return question._id
      })
    
      const game = new Game({
        questions: questionsId,
        score: 0,
        userId: req.user._id,
      });
    
      game.save((err, doc) => {
        if (err) {
            return res.status(400).json({
              success: false,
            });
        }
      })

      game.populate('questions')
        .execPopulate()
        .then(game => {
          return game.questions.map((questionId) => {
            return questionId
          });
        })
        .then(questionId => {
          return Question.find({
              _id: questionId,
          });
        })
        .then(questions => {
          game.questions = questions;
          res.status(200).json(game)
        })
        .catch((err) => {
          console.log(err);
        });

    }
  );
};

exports.postGame = (req, res, next) => {
  const gameID = req.body.gameID;
  const score = req.body.score;

  Game.findById(gameID)
    .then((game) => {
      game.score = score;

      game.save();
    })
    .catch((err) => {
      return res.status(400).json({
        message: 'Game failed to save.',
      });
    });
};
