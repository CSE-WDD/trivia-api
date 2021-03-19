const Question = require('../models/question');
const Game = require('../models/game');

exports.getGame = (req, res, next) => {
  const difficulty = req.query.difficulty;
  const category = req.query.category;

  const questionsArray = Question.random(
    difficulty,
    category,
    (err, questions) => {
      if (err) {
        throw new Error("Couldn't get qeustions!");
      }

      const game = new Game({
        questions: questions,
        score: 0,
        userId: req.user._id,
      });

      game
        .populate('questions.questionId')
        .execPopulate()
        .then((game) => {
          return game.questions.map((question) => {
            return question;
          });
        })
        .then((questionId) => {
          return Question.find({
            _id: questionId,
          });
        })
        .then((questions) => {
          return res.json(questions);
        })
        .catch((err) => {
          console.log(err);
        });

      // game.populate('questions.questionId').execPopulate()
      //     .then(game => {
      //         let questionId = game.questions.map(question => {
      //             return question
      //         });
      //         Question.find({
      //             _id: questionId
      //         }).then(questions => {
      //             return res.json(questions)
      //         })
      //         .catch(err => {
      //             console.log(err);
      //         })
      //     })
      //     .catch(err => {
      //         console.log(err);
      // })
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
