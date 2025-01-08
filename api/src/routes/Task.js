const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/Task');
const auth = require('../middleware/auth');

router.post('/add', auth, taskCtrl.addTask);
router.put('/update/:id', auth, taskCtrl.updateTask);
router.delete('/remove/:id', auth, taskCtrl.removeTask);
router.get('/view/:id', auth, taskCtrl.viewTask);

module.exports = router;
