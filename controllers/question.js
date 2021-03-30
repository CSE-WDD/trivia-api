const Question = require('../models/question');

exports.postQuestion = (req, res, next) => {
    const question = new Question(req.body);

    question.save((err, doc) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
            });
        }
        res.status(200).json({
            success: true,
            question: doc,
        });
    });
};

exports.getQuestion = (req, res, next) => {
    res.json({
        isAuth: true,
        id: req.user._id,
    })
};

exports.editQuestion = (req, res, next) => {
    const questionId = req.body.questionId
    const question = req.body.question;
    const answers = req.body.answers;
    const category = req.body.category;
    const difficulty = req.body.difficulty;

    Question.findById(questionId).then(q => {
        q.question = question;
        q.answers = answers;
        q.category = category;
        q.difficulty = difficulty;
        q.save();
        return q;
    }).then(result => {
        console.log(result);
        res.status(200).json({
            updatedQuestion: result,
            success: true
        })
    }).catch(err => {
        console.log(err);
        res.status(400).json({
            success: false,
        })
    })

};