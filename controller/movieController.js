const axios = require('axios');

const { response } = require('express');

exports.trending = async function (req, res) {
    //1. use TMDBI GET api by axios
    try {
        const response = await axios.get("https://api.themoviedb.org/3/trending/movie/week", {
            params: {
                api_key: process.env.TMDB_API_KEY
            }
        });
        if (!response) {
            return res.status(404).json({ error: "No Trending Movies Found" })
        }
        //2. send response to frontend
        res.status(200).json(response.data);
    }

    catch (error) {
        console.error(`Error in Movie Controller: ${error}`);
        res.status(500).send(`Server Error in Movie Controller:  ${error}`);
    }
}

exports.searchMovies = async function (req, res) {
    //1. use TMDBI GET api by axios
    try {
      const {q} = req.query;
      if(!q || q.trim() === ""){
        return res.status(400).json({error: "Query Param is missing"})
      }
        const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
            params: {
                api_key: process.env.TMDB_API_KEY,
                query: q
            },
            timeout: 15000 // 5 seconds timeout
        });
        if (!response) {
            return res.status(404).json({ error: "No Movies Found" })
        }
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error(`Error in Movie Controller: ${error}`);
        res.status(500).send(`Server Error in Movie Controller:  ${error}`);
    }
}