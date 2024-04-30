const express = require('express');
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const router = express.Router();

router.get('/', bookCtrl.allBook);
router.get('/bestrating', bookCtrl.bestRating);
router.get('/:id', bookCtrl.findBook);
router.post('/', auth, multer, bookCtrl.createBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, multer, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.setRating);

module.exports = router;