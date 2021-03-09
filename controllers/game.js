const Question = require('../models/question');
const Game = require('../models/game');
const question = require('../models/question');

// exports.getGame = (req, res, next) => {
//     const difficulty = req.query.difficulty;
//     const category = req.query.category;

//     const questionsArray = Question.random(difficulty, category, (err, questions) => {
//         if (err) {
//             throw new Error("Couldn't get qeustions!");
//         }
//         return questions;
//     });

//     const game = new Game({
//         questions: questionsArray,
//         score: 0,
//         userId: req.user._id
//     });

//     console.log(game);

//     res.json(game);

// };

// exports.getGame = (req, res, next) => {
//     const difficulty = req.query.difficulty;
//     const category = req.query.category;

//     const questionPromise = () => {
//         return new Promise((res, rej) => {
//             Question.random(difficulty, category, (err, questions) => {
//                 if (err) {
//                     throw new Error("Couldn't get qeustions!");
//                 }
//                 res(questions);
//             });
//         })
//     }

//     questionPromise().then(questions => {
//         const game = new Game({
//             questions: questions,
//             score: 0,
//             userId: req.user._id
//         });
//         // returns the id of each question
//         // returns the score for the user of that game
//         // returns the user's Id
//         return res.json(game);
//     })

// };

exports.getGame = (req, res, next) => {
    const difficulty = req.query.difficulty;
    const category = req.query.category;

    Question.countDocuments({
        difficulty: difficulty,
        category: category
    }).then(result => {
        return parseInt(result)
    }).then(result => {
        const randNum = Math.floor(Math.random() * result);

        return Question.find({
            difficulty: difficulty,
            category: category
        }).skip(randNum).limit(10).then(questions => {
            return res.json(questions);
        });
    });
};
