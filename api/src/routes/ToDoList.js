const express = require('express');
const router = express.Router();
const todoListCtrl = require('../controllers/ToDoList');
const auth = require('../middleware/auth');

router.post('/add', auth, todoListCtrl.createToDoList);
router.put('/update/:id', auth, todoListCtrl.updateToDoList);
router.delete('/remove/:id', auth, todoListCtrl.removeToDoList);
router.get('/view/:id', auth, todoListCtrl.viewToDoList);

module.exports = router;
