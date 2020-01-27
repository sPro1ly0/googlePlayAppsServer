const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const playApps = require('./google-play-apps');

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.get('/apps', (req, res) => {
    const { search = "", sort, genres } = req.query;
    
    if (sort) {
        if (!['App', 'Rating'].includes(sort)) {
            return res.status(400).send('Sort must be App or Rating');
        }
    }

    if (genres) {
        if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
            console.log(genres);
            return res.status(400).send('Genres must be one of the following: Action, Puzzle, Strategy, Casual, Arcade, or Card.');
        };
    }

    let results = playApps.filter( game => 
        game.App.toLowerCase().includes(search.toLowerCase())
    );

    if (genres) {
        results = playApps.filter( game => 
            game.Genres.includes(genres)
        );
    }
    //make sure lowercase app titles are not listed last in alphabetical order
    if (sort == 'App') {
        results.sort((a, b) => {
            return a[sort].toLowerCase() > b[sort].toLowerCase() ? 1 : a[sort].toLowerCase() < b[sort].toLowerCase() ? -1 : 0;
        });
    };
    //show highest rating to lowest rating
    if (sort == 'Rating') {
        results.sort((a, b) => {
            return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
        });
    };

    
    
    //console.log(results);

    res.json(results);
});

module.exports = app;
