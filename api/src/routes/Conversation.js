const express = require('express');
const router = express.Router();
const conversationCtrl = require('../controllers/Conversation');
const auth = require('../middleware/auth');

router.post('/add', auth, conversationCtrl.loadMessages);
router.delete('/delete/:id', auth, conversationCtrl.deleteConversation);

module.exports = router;
