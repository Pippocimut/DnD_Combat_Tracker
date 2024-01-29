const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator')

const router = express.Router();

router.get('/products',isAuth, adminController.getTokens);

router.delete('/token/:tokenId', adminController.saveToken)

module.exports = router;
