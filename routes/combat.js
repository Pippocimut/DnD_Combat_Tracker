const path = require('path');

const express = require('express');

const combatController = require('../controllers/combat');

const isAuth = require('../middleware/is-auth');
const router = express.Router();

const pagination = require('../middleware/pagination');

router.get('/', combatController.getIndex);

router.get('/add-token', combatController.getAddToken);

router.post('/add-token', combatController.postAddToken);

module.exports = router;
