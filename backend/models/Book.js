const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    userId: {type: String, required: true},
    grade: {type: Number, required: true},
});

const bookSchema = mongoose.Schema({
    userId: {type: String, required: true},
    title: {type: String, required: true},
    imageUrl: {type: String, required: true},
    author: {type: String, required: true},
    year: {type:Number , required: true},
    genre: {type: String , required: true},
    ratings: {type: [ratingSchema], default: []},
    averageRating: {type: Number, default: 0},
});

module.exports = mongoose.model('Book', bookSchema);


/*
book: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    year: PropTypes.number,
    imageUrl: PropTypes.string,
    genre: PropTypes.string,

    ratings: PropTypes.arrayOf(PropTypes.shape({
      userId: PropTypes.string,
      grade: PropTypes.number,
    })),
    averageRating: PropTypes.number,

  }).isRequired,
  */