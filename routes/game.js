const express = require('express');
const router = express.Router();
const { postGame, startGame, getHighScores } = require('../controllers/game');
const { auth } = require('../middlewares/auth');

router.get('/api/getGame', auth, startGame);
router.post('/api/saveGame', auth, postGame);
router.get('/api/getHighScores', getHighScores);

module.exports = router;
