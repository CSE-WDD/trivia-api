const Question = require('../models/question');

exports.postQuestion = async (req, res, next) => {
    let errors = [];
    const newQuestion = req.body.question;

   await Question.find()
       .then(questions => {
            questions.map(question => {
                if (question.question.toString() === newQuestion.toString()) {
                    const error = new Error('Question already exists');
                    errors.push(error);
                    return next(errors);
                }
            })
       });
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            msg: errors.toString()
        });
    }

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

exports.getAllQuestions = (req, res, next) => {
    Question.find()
        .then(questions => {
            res.json({
                isAuth: true,
                questions: questions
            });
        });
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
}

exports.deleteQuestion = (req, res, next) => {
    const questionId = req.body.questionId;
    Question.findByIdAndRemove(questionId)
        .then((result) => {
            res.status(200).json({
                result: result,
                success: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
            });
        });
}
