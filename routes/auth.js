const express = require('express');
const router = express.Router();
const {
  postSignup,
  postLogin,
  getProfile,
  getLogout,
} = require('../controllers/auth');
const { auth } = require('../middlewares/auth');

router.post('/api/register', postSignup);
router.post('/api/login', postLogin);
router.get('/api/profile', auth, getProfile);
router.get('/api/logout', auth, getLogout);

module.exports = router;
