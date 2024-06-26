const Book = require('../models/Book');
const fs = require('fs');

exports.allBook = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));

};

exports.bestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.findBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));

};

exports.createBook = (req, res, next) =>{
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    rating: bookObject.rating,
    averageRating: bookObject.averageRating 
  }); 
  book.save()
  .then(() => res.status(201).json({message: 'livre enregistré'}))
  .catch( error => { res.status(400).json({ error })});
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(400).json({ message: 'Non autorisé' });
      }
      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié !' }))
        .catch(error => res.status(401).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.setRating = (req, res, next) => {
  const newRating = req.body.rating; 
  const userId = req.body.userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const userRating = book.ratings.find(rating => rating.userId === userId);
      if (userRating) {
        userRating.grade = newRating;
      } else {
        book.ratings.push({ userId, grade: newRating });
      }
      const sum = book.ratings.reduce((a, b) => a + b.grade, 0);
      book.averageRating = Math.round((sum / book.ratings.length) * 10) / 10; // Arrondi à une décimale
      book.save()
        .then(() => {
          book.id = book._id.toString();
          res.status(200).json(book);
        })
        .catch(error => res.status(401).json({ error }));
    });
};