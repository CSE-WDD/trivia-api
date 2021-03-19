const express = require('express');
const router = express.Router();
const { getGame, postGame } = require('../controllers/game');
const { auth } = require('../middlewares/auth');

router.get('/api/getGame', auth, getGame);
router.get('api/saveGame', auth, postGame);

module.exports = router;
