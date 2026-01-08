// Request Response Handlers for Auth routes
const { check, validationResult } = require('express-validator');
const User = require('../models/UserSchema');

exports.profiles = async function (req, res) {
    try {
        // userId comes from auth middleware
        const userId = req.userId;
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({ error: "User not Found" })
        }
        res.status(200).json(user);
    }
    catch (err) {
        console.error(`Error in User Controller: ${err}`);
        res.status(500).send(`Server Error in User Controller:  ${err}`);
    }
}
// when user updates preferences for better AI recommendations
exports.preferences = async function (req, res) {
    try {
        //1. find if the movie / genere is empty
        const { favoriteMovie, favoriteGenre } = req.body;
        if (!favoriteMovie && !favoriteGenre) {
            return res.status(400).json({ error: "Nothing to Update" });
        }
        //2 if no then findbyIdandUpdate
        const updatedPreference = await User.findByIdAndUpdate(req.userId, {
            ...(favoriteGenre && { favoriteGenre }),
            ...(favoriteMovie && { favoriteMovie })
        }, { new: true }
        ).select("-password")
        res.status(200).json({
            message: "Preferences updated successfully",
            user: updatedPreference
        });
    }
    catch (err) {
        console.error(`Error in User Controller: ${err}`);
        res.status(500).send(`Server Error in User Controller:  ${err}`);
    }
}
// watched history so it dont recommend again
exports.watchedHistory = async function (req, res) {
    try {
        //1. get movie from req.body
        const { movieId } = req.body;
        if (!movieId) {
            return res.status(400).json({ error: "Movie Id is not there" })
        }
        //2. find the non duplicate $addToSet : {} --> to avoid duplate \\ $push: {} also add duplicates
        const watchedMovies = await User.findByIdAndUpdate(req.userId, {
            $addToSet: { watchedMovies: movieId }
        }, { new: true }).select("-password")
        
        if (!watchedMovies) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Movie added to watched list",
            watchedMovies: watchedMovies.watchedMovies
        });
    }
    catch (err) {
        console.error(`Error in User Controller: ${err}`);
        res.status(500).send(`Server Error in User Controller:  ${err}`);
    }
}