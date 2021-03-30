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
    });
};

exports.deleteQuestion = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(results => { console.log(results) })
        .then(() => {
            res.status(200).json({
                success: true,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
            });
        });
};