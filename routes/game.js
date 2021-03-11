const express = require('express');
const router = express.Router();
const {
    getGame
} = require('../controllers/game');
const {
    auth
} = require('../middlewares/auth');

router.get('/api/getGame', auth, getGame);

module.exports = router;