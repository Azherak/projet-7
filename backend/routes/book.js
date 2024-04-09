const express = require('express');
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const router = express.Router();

router.get('/', bookCtrl.allBook); /* array of book  */
router.get('/:id', bookCtrl.findBook); /* single book */
router.get('/bestrating', bookCtrl.bestRating); /* array of book */
router.post('/', auth, multer, bookCtrl.createBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook); /* met ajour le livre */
router.delete('/:id', auth, bookCtrl.deleteBook); /* supprime le livre */
router.post('/:id/rating', auth, bookCtrl.setRating);

module.exports = router;