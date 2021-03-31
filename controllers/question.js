const Question = require('../models/question');

// Question should only have one right answer
const verifyAnswers = (arr) => {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].isTrue) {
            count++;
        };
    };

    if (count == 1) {
        return true;
    } else {
        return false;
    };
};

exports.postQuestion = (req, res, next) => {
    const question = new Question(req.body);

    if (!verifyAnswers(question.answers)) {
        return res.status(400).json({
            success: false,
            message: "Only one answer should be true"
        });
    }

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

    if (!verifyAnswers(answers)) {
        return res.status(400).json({
            success: false,
            message: "Only one answer should be true"
        });
    }

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