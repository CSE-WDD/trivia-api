<<<<<<< HEAD
exports.postQuestion = (req, res, next) => {
    const question = new Question(req.body);

    question.save((err, doc) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false
            })
        }
        res.status(200).json({
            success: true,
            question: doc
        });
    })
};
=======
exports.getQuestion = (req, res, next) => {
    res.json({
        isAuth: true,
        id: req.user._id,
    })
}
>>>>>>> 680d8b415d90552d9f4b23a7283381b22120eb6e
