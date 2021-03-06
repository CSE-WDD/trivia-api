const User = require('./../models/user');

let auth = (req, res, next) => {
  let token;
  if (req.method === 'GET') {
    token = req.cookies.auth !== undefined ? req.cookies.auth : req.query.token;
  } else {
    token = req.cookies.auth !== undefined ? req.cookies.auth : req.body.token;
  }

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        error: true,
      });

    req.token = token;
    req.user = user;
    next();
  });
};

let authAdmin = (req, res, next) => {
  let token;
  if (req.method === 'GET') {
    token = req.cookies.auth !== undefined ? req.cookies.auth : req.query.token;
  } else {
    token = req.cookies.auth !== undefined ? req.cookies.auth : req.body.token;
  }

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        error: true,
      });

    if (!user.isAdmin) {
      return res.status(403).json({
        message: 'User is not an admin.',
        error: true,
      });
    }

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = {
  auth,
  authAdmin,
};
