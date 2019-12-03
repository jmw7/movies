//Need this to hide API token in the .env file.
require('dotenv').config()

//Get express, morgan, cors, helmet and have access to the movies database
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const moviesDB = require('./moviesDB.json')


//initiate express into the const app
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {

  const authToken = req.get('Authorization')
  const apiToken = process.env.API_TOKEN
  debugger
  if(!authToken || authToken.split(' ')[1] !== apiToken){
    return res.status(401).json({error: 'Unauthorized request'})
  }

  next()
})


function handleGetMovie(req, res) {

  let response = moviesDB;

  //const genre = req.query.genre;
  //const country = req.query.country;
  //const avg_vote = req.query.avg_vote;

  if (req.query.genre) {
    response = response.filter(movie =>
      movie.genre
        .toLowerCase()
        .includes(req.query.genre.toLowerCase())
    )
  }

  if (req.query.country) {
    response = response.filter(movie =>
      movie.country
        .toLowerCase()
        .includes(req.query.country.toLowerCase())
    )
  }

  if (req.query.avg_vote) {
    response = response.filter(movie =>
      Number(movie.avg_vote) >= req.query.avg_vote
    )
  }

  res.json(response)
}

//accepts pathway and then callback function, handleGetMovie
app.get('/movie', handleGetMovie)

const port = 8000;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})