exports.getQuestion = (req, user, next) => {
    res.json({
        isAuth: true,
        id: req.user._id,
    })
}