const User = require('../models/user');
const Game = require('../models/game');

exports.postSignup = (req, res, next) => {
  // We need to validate the req.body (email, user, etc)
  // taking a user
  const newuser = new User(req.body);

  if (newuser.password != newuser.confirmPassword)
    return res.status(400).json({
      message: 'password not match',
    });

  // search the database and see if user exists
  User.findOne(
    {
      email: newuser.email,
    },
    function (err, user) {
      if (user)
        return res.status(400).json({
          auth: false,
          message: "This user's email already exists",
        });

      // if user doesn't exist, create a new User
      newuser.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            success: false,
          });
        }
        res.status(200).json({
          success: true,
          user: doc,
        });
      });
    }
  );
};

exports.postLogin = (req, res, next) => {
  let token = req.cookies.auth;

  // find user by it's stored token
  // if user is found, you are already logged in
  User.findByToken(token, (err, user) => {
    if (err) return res(err);
    if (user)
      return res.status(400).json({
        error: true,
        message: 'You are already logged in',
      });
    // no email found here, reutrn err
    else {
      User.findOne(
        {
          email: req.body.email,
        },
        function (err, user) {
          if (!user)
            return res.json({
              isAuth: false,
              message: ' Auth failed ,email not found',
            });
          // if there is a User, and not logged in
          // compare password
          user.comparepassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
              return res.json({
                isAuth: false,
                message: "password doesn't match",
              });
            // generate new taken for that user
            // return that token in the cookies
            // save token to db
            user.generateToken((err, user) => {
              if (err) return res.status(400).send(err);
              res.cookie('auth', user.token, {
                httpOnly: true
              }).json({
                isAuth: true,
                token: user.token,
                id: user._id,
                email: user.email
              });
            });
          });
        }
      );
    }
  });
};

exports.getProfile = (req, res, next) => {
  User.findById(req.user._id).then((user) => {});

  // getting profile, return JSON
  res.json({
    isAuth: true,
    id: req.user._id,
    email: req.user.email,
    name: req.user.firstname + ' ' + req.user.lastname,
  });
};

exports.getLogout = (req, res, next) => {
  req.user.deleteToken(req.token, (err, user) => {
    if (err) return res.status(400).send(err);
    res.sendStatus(200);
  });
};

exports.deleteUser = (req, res, next) => {
  const userId = req.user._id;

  Game.deleteMany({
    userId: userId
  })
    .then(() => {
      User.deleteOne({ _id: userId })
      .then((result) => {
        return res.status(204).json({
          msg: result
        });
      })
      .catch(err => {
        return res.status(400).json({
          error: err
        });
      })
  })
    .catch((err) => {
      console.log(err)
      return res.status(400).json({
        error: err,
      });
    });
};

exports.getUserScores = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId).then((user) => {
    return res.json({
      isAuth: true,
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      userScores: user.highScores,
    });
  });
};
