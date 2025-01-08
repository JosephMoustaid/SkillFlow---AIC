const express = require('express');
const router = express.Router();
const pathCtrl = require('../controllers/Path');
const auth = require('../middleware/auth');

router.post('/add', auth, pathCtrl.createPath);
router.get('/myPaths', auth, pathCtrl.getUserPaths);
router.get('/get/:id', auth, pathCtrl.getPath);
router.delete('/delete/:id', auth, pathCtrl.deletePath);
router.get('/continue/:id', auth, pathCtrl.continuePath);

module.exports = router;
