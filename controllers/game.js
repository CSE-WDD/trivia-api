const _ = require('lodash');
const Question = require('../models/question');
const Game = require('../models/game');
const User = require('../models/user');

exports.startGame = (req, res, next) => {
  const difficulty = req.query.difficulty;
  const category = req.query.category;

  // Parameters match parameters for "find"
  var filter = { difficulty: difficulty, category: category };

  Question.find(filter)
    .then((questions) => {
      shuffled_questions = _.shuffle(questions);
      return shuffled_questions.slice(0, 10);
    })
    .then((questions) => {
      const questionsId = questions.map((question) => {
        return question._id;
      });

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
      });

      game
        .populate('questions')
        .execPopulate()
        .then((game) => {
          return game.questions.map((questionId) => {
            return questionId;
          });
        })
        .then((questionId) => {
          return Question.find({
            _id: questionId,
          });
        })
        .then((questions) => {
          game.questions = questions;
          res.status(200).json(game);
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

exports.postGame = (req, res, next) => {
  const gameID = req.body.gameID;
  const score = req.body.score;

  Game.findById(gameID)
    .then((game) => {
      game
        .populate('questions')
        .execPopulate()
        .then((game) => {
          // Get the game difficulty
          const difficulty = game.questions[0].difficulty;
          let multiplier = 1;

          switch (difficulty) {
            case 'easy':
              multiplier = 1;
              break;
            case 'medium':
              multiplier = 10;
              break;
            case 'hard':
              multiplier = 100;
              break;
            default:
              multiplier = 1;
          }

          // Set the game score
          game.score = score * multiplier;

          User.findById(game.userId).then((user) => {
            // Set the user's most recent game score.
            user.highScores.recent = game._id;

            // Check if user has a game stored at that difficulty
            if (user.highScores[difficulty] === null) {
              user.highScores[difficulty] = game._id;
              user.save();
            } else {
              const populateString = 'highScores.' + difficulty;
              let currentScore = 0;
              user
                .populate(populateString)
                .execPopulate()
                .then((user) => {
                  currentScore = user.highScores[difficulty].score;

                  // Compare scores
                  if (
                    currentScore < game.score ||
                    currentScore === game.score
                  ) {
                    // Replace old game if this game is a higher score.
                    user.highScores[difficulty] = game._id;
                  }

                  // Save the games to the user
                  user.save();
                })
                .catch((err) => {
                  return res.status(400).json({
                    error: err,
                  });
                });
            }
          });

          // Save the game
          game.save();
        })
        .catch((err) => {
          return res.status(400).json({
            error: err,
          });
        });

      return res.status(200).json({
        message: 'Game saved!',
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: 'Game failed to save.',
      });
    });
};

exports.getHighScores = async (req, res, next) => {
  const games = await Game.find(
    {},
    {},
    {
      sort: {
        score: -1,
      },
      limit: 10,
    }
  ).populate('userId');

  const names = games.map((game) => {
    return {
      name: game.userId.firstname + ' ' + game.userId.lastname,
      score: game.score,
    };
  });

  return res.status(200).json({
    leaderBoard: names,
  });
};
