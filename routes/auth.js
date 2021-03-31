const express = require('express');
const router = express.Router();
const {
  postSignup,
  postLogin,
  getProfile,
  getLogout,
  getUserScores,
  deleteUser,
} = require('../controllers/auth');

const {
  postQuestion,
  editQuestion,
  deleteQuestion,
  getAllQuestions,
} = require('../controllers/question');

const { auth, authAdmin } = require('../middlewares/auth');

router.post('/api/register', postSignup);
router.post('/api/login', postLogin);
router.get('/api/profile', auth, getProfile);
router.get('/api/logout', auth, getLogout);
router.post('/api/deleteUser', auth, deleteUser);
router.get('/api/get-user-scores', auth, getUserScores);
router.get('/api/get-all-questions', authAdmin, getAllQuestions);
router.post('/api/submit-question', authAdmin, postQuestion);
router.post('/api/edit-question', authAdmin, editQuestion);
router.post('/api/delete-question', authAdmin, deleteQuestion);

module.exports = router;
