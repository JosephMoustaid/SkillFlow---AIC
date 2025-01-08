const express = require('express');
const router = express.Router();
const messageCtrl = require('../controllers/Message');
const auth = require('../middleware/auth');

router.post('/add', auth, messageCtrl.addMessage);

module.exports = router;
