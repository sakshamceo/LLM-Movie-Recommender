const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        requiredd: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    favoriteMovie: {
        type: [Number],
        default: []
    },
    favoriteGenre: {
        type: [String],
        default: []
    },
     watchedMovies: {
      type: [Number],
      default: []
    }
})
module.exports = mongoose.model('user',UserSchema) // users naame se collection create hogi