const express= require('express');
const router = express.Router(); // creating router instance
const {check} = require('express-validator');
const auth = require('../middleware/JWTAuth')
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const movieController = require('../controller/movieController');
const aiController = require('../controller/aiController');

// register Router
router.post('/register',[
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password Must be minimum 5 characters').isLength({ min: 5 }),
    check('name', 'Please Mention your name').not().isEmpty()], 
authController.register); //localhost:3000/api/user

// Login Router
router.post('/login',[
    check('email', 'please include a valid email').isEmail(),
    check('password', 'Password Must be minimum 5 characters').isLength({ min: 5 })],
    authController.login); //localhost:3000/api/login

// Profiles
router.get('/user/profile',auth ,userController.profiles)

// Preferences
router.put('/user/preferences',auth,userController.preferences)

//watched movies
router.post('/user/watched',auth, userController.watchedHistory)

//Get Trending Movies
router.get('/movies/trending',movieController.trending)

// Search Movies
router.get('/movies/search',movieController.searchMovies)   

// AI Recommendation
router.post('/ai/recommendations',auth, aiController.recommendations)

module.exports = router;
