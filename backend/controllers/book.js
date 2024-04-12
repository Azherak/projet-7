const Book = require('../models/Book');
const fs = require('fs');

exports.allBook = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));

};

exports.findBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));

};

exports.bestRating = (req, res, next) => {
  Book.find()
    .sort({ rating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
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
  const bookObject = req.file ?{
    ...JSON.parse(req.body.book),
    imageUrl:`${req.protocol}://${req.get('host')}/images/  ${req.file.filename}`
  } : {...req.body};

  delete bookObject._userId;
  Book.findOne({_id: req.params.id })
  .then((book) => {
        if (book.userId != req.auth.userId) { res.status(400).json({message: 'non authorisé'});
      } else {
        Book.updateOne({_id: req.body.params.id}, {...bookObject, _id:req.params.id})
          .then(() => res.status(200).json({ message: 'Livre modifié !'}))
          .catch(error => res.status(401).json({ error }));
      }    
  });
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
  console.log(newRating);
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(400).json({message: 'non autorisé'});
      } else {
        book.rating = newRating;
        book.ratings.push(newRating);
        const sum = book.ratings.reduce((a, b) => a + b, 0);
        book.averageRating = sum / book.ratings.length;

        book.save()
          .then(() => res.status(200).json({ message: 'Note du livre mise à jour !', book: book }))
          .catch(error => res.status(401).json({ error }));
      }    
    });
};