const User = require('../models/UserSchema')
const axios = require('axios');
const { OpenAI } = require('openai');
require("dotenv").config();
exports.recommendations = async function (req, res) {
    try {
        let recommendations = [];
        const { prompt } = req.body;
        if (!prompt || prompt.trim() === "") {
            return res.status(400).send("Need Prompt")
        }
        const Limit = 5; // Limit is set to reduce cost of AI

        // Get user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).send("User Not Found")
        }

        // Fetch movies from TMDB
        const tmdbResponse = await axios.get(
            "https://api.themoviedb.org/3/discover/movie",
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    sort_by: "popularity.desc"
                },
                timeout: 15000
            }
        );

        // Get only unwatched movies
        const candidateMovies = tmdbResponse.data.results.filter(movie => {
            const isWatched = user.watchedMovies.includes(movie.id);
            return !isWatched;
        });


        // Prompt
        const finalPrompt = `
        You are a movie recommendation assistant.
        IMPORTANT RULES:
        - You MUST recommend movies ONLY from the list below.
        - Do NOT invent new movies.
        - Do NOT recommend anything not in the list.
        User request:
        "${prompt}"

        User preferred genres:
        ${user.favoriteGenre?.join(", ") || "Any"}

        Choose EXACTLY ${Limit} movies from the list below.

        Movies:
        ${candidateMovies.map(m => `- ${m.title}`).join("\n")}

        Return ONLY valid JSON in this format:
        [
        { "title": "...", "reason": "..." }
        ]`;

        // LLM using Hugging Face with OpenAI SDK
        const client = new OpenAI({
            baseURL: "https://router.huggingface.co/v1",
            apiKey: process.env.HF_TOKEN
        });

        const chatCompletion = await client.chat.completions.create({
            model: "meta-llama/Llama-3.1-8B-Instruct:novita",
            messages: [
                {
                    role: "user",
                    content: finalPrompt
                }
            ],
            temperature: 0.7,
            max_tokens: 300
        });

        const textOutput = chatCompletion.choices[0]?.message?.content || "";

        if (!textOutput) {
            return res.status(502).json({
                message: "AI failed to generate recommendations"
            });
        }

        // Extract JSON from AI response
        try {
            // Try to find JSON array in the response
            const jsonMatch = textOutput.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                recommendations = JSON.parse(jsonMatch[0]);
            } else {
                recommendations = JSON.parse(textOutput);
            }
        } catch (parseError) {
            console.error("Failed to parse AI response:", textOutput);
            return res.status(502).json({
                message: "AI returned invalid response format",
                rawResponse: textOutput
            });
        }
        
        // Saftey so AI dont recomned out of database movies
        const AllowedTitles = new Set(
            candidateMovies.map(m => m.title.toLowerCase())
        );

        recommendations = recommendations.filter(rec =>
            AllowedTitles.has(rec.title.toLowerCase())
        ); 

        res.status(200).json({
            recommendations: recommendations
        });

    }
    catch (error) {
        console.error(`Error in AI Controller: ${error}`);
        res.status(500).send(`Server Error in AI Controller: ${error.message}`);
    }
}