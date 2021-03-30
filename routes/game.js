const express = require('express');
const router = express.Router();
const { postGame, startGame } = require('../controllers/game');
const { auth } = require('../middlewares/auth');

router.get('/api/getGame', auth, startGame);
router.get('api/saveGame', auth, postGame);

module.exports = router;
