const path = require('path');

const express = require('express');

const combatController = require('../controllers/combat');

const isAuth = require('../middleware/is-auth');
const router = express.Router();

const pagination = require('../middleware/pagination');

router.get('/', combatController.getIndex);

module.exports = router;
