const express = require('express');
const router = express.Router();
const progressCtrl = require('../controllers/Progress');
const auth = require('../middleware/auth');

router.post('/add', auth, progressCtrl.createProgress);
router.delete('/delete/:id', auth, progressCtrl.deleteProgress);
router.get('/view/:id', auth, progressCtrl.viewProgress);

module.exports = router;
