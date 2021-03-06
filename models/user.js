var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config').get(process.env.NODE_ENV);
// 12 characters
const salt = 12;

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    maxlength: 100,
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    minlength: 8,
  },
  token: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  gameCount: {
    type: Number,
    required: true,
    default: 0,
  },
  highScores: {
    recent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Game', default: null },
    easy: { type: mongoose.SchemaTypes.ObjectId, ref: 'Game', default: null },
    medium: { type: mongoose.SchemaTypes.ObjectId, ref: 'Game', default: null },
    hard: { type: mongoose.SchemaTypes.ObjectId, ref: 'Game', default: null },
  },
});

userSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    // generate a random 12 character string
    bcrypt.genSalt(salt, function (err, salt) {
      if (err) return next(err);

      // salt is a random set of characters used by encryption method to encrypt your data
      // random characters, taking password, scrambles your password within random characters
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        user.confirmPassword = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparepassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(next);
    cb(null, isMatch);
  });
};

// generate token
userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), config.SECRET);

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

// find by token
userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token, config.SECRET, function (err, decode) {
    user.findOne(
      {
        _id: decode,
        token: token,
      },
      function (err, user) {
        if (err) return cb(err);
        cb(null, user);
      }
    );
  });
};

//delete token
userSchema.methods.deleteToken = function (token, cb) {
  var user = this;

  user.update(
    {
      $unset: {
        token: 1,
      },
    },
    function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    }
  );
};

module.exports = mongoose.model('User', userSchema);
