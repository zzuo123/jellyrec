import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './modules/log/logger.js';
import auth from './modules/auth/auth.js';
import scraper from './modules/scraper/scraper.js';
import rec from './modules/rec/rec.js';
import info from './modules/info/info.js';

const port = process.env.PORT || 4001;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

dotenv.config();

let userinfo = {
    baseurl: null,
    token: null,
    uid: null,
    favMovies: null,
    favShows: null
};

function clearUserInfo() {
    userinfo.baseurl = null;
    userinfo.token = null;
    userinfo.uid = null;
    userinfo.favMovies = null;
    userinfo.favShows = null;
}


app.post('/Auth/login', async (req, res) => {
    const { url, username, password } = req.body;
    clearUserInfo();
    userinfo.baseurl = url;
    logger.info(`POST /login: received login request for ${username}`);
    let result = null;
    if (process.env.JELLYFIN_API_KEY !== undefined && process.env.JELLYFIN_API_KEY !== null && process.env.JELLYFIN_API_KEY !== '') {
        if (process.env.JELLYFIN_USER_ID === undefined || process.env.JELLYFIN_USER_ID === null || process.env.JELLYFIN_USER_ID === '') {
            logger.info(`POST /login: using provided api key for authentication`);
            result = await auth.auth_using_api_key(url, process.env.JELLYFIN_API_KEY, username);
        } else {
            logger.info(`POST /login: using provided api key and user id for authentication`);
            result = { token: process.env.JELLYFIN_API_KEY, uid: process.env.JELLYFIN_USER_ID };
        }
    } else {
        logger.info(`POST /login: using provided username and password for authentication`);
        result = await auth.authenticate(url, username, password);
    }
    if (result === null || result === undefined) {
        logger.error(`POST /login: user ${username} not authenticated`);
        res.status(401).json({ message: 'Invalid url or username or password... Please retry.' });
        return;
    }
    logger.info(`POST /login: user ${username} authenticated`);
    userinfo.token = result.token;
    userinfo.uid = result.uid;
    res.json({ message: 'ok', token: result.token, uid: result.uid });     // this is for testing
    // res.json({ message: 'ok' });  // this is for prod
});

app.post('/Auth/logout', async (req, res) => {
    logger.info(`POST /logout: received logout request`);
    const result = await auth.logout(userinfo.baseurl, userinfo.token);
    if (result === false) {
        logger.error(`POST /logout: error logging out of session`);
        res.status(401).json({ message: 'Error logging out of session' });
        return;
    }
    clearUserInfo();
    logger.info(`POST /logout: user logged out`);
    res.json({ message: 'ok' });
});

function checkLogin(res) {
    if (userinfo.token === null || userinfo.uid === null || userinfo.baseurl === null) {
        logger.error(`GET /Movie/GetFavorite: user not logged in`);
        res.status(401).json({ message: 'User not logged in' });
        return false; 
    }
    return true;
}

app.get('/Movie/GetFavorite', async (req, res) => {
    logger.info(`GET /Movie/GetFavorite: received request for favorite movies`);
    if (!checkLogin(res)) {
        return;
    }
    if (userinfo.favMovies !== null && userinfo.token !== null) {
        logger.info(`GET /Movie/GetFavorite: favorite movies already retrieved`);
        res.json(userinfo.favMovies);
        return;
    }
    logger.info(`GET /Movie/GetFavorite: favorite movies not yet retrieved`);
    const result = await scraper.getFavMovies(userinfo.baseurl, userinfo.uid, userinfo.token);
    if (result === null || result === undefined) {
        logger.error(`GET /Movie/GetFavorite: error getting favorite movies`);
        res.status(401).json({ message: 'Error getting favorite movies' });
        return;
    }
    logger.info(`GET /Movie/GetFavorite: favorite movies retrieved`);
    userinfo.favMovies = result;
    res.json(result);
});

app.get('/Show/GetFavorite', async (req, res) => {
    logger.info(`GET /Show/GetFavorite: received request for favorite shows`);
    if (!checkLogin(res)) {
        return;
    }
    if (userinfo.favShows !== null) {
        logger.info(`GET /Show/GetFavorite: favorite shows already retrieved`);
        res.json(userinfo.favShows);
        return;
    }
    logger.info(`GET /Show/GetFavorite: favorite shows not yet retrieved`);
    const result = await scraper.getFavShows(userinfo.baseurl, userinfo.uid, userinfo.token);
    if (result === null || result === undefined) {
        logger.error(`GET /Show/GetFavorite: error getting favorite shows`);
        res.status(401).json({ message: 'Error getting favorite shows' });
        return;
    }
    logger.info(`GET /Show/GetFavorite: favorite shows retrieved`);
    userinfo.favShows = result;
    res.json(result);
});

app.get('/Movie/GetRecommendation/:n?', async (req, res) => {
    // if (!checkLogin(res)) {
    //     return;
    // } else if (userinfo.favMovies === null) {
    //     logger.error(`GET /Movie/GetRecommendation: favorite movies not yet retrieved`);
    //     res.status(401).json({ message: 'Unable to get recommendation: Favorite movies not yet retrieved' });
    //     return;
    // }
    // let n = req.params.n;
    // if (n === undefined) {
    //     n = 10;
    // }
    // let result = await rec.get_rec(userinfo.favMovies, n, true);
    // if (result === null || result === undefined) {
    //     logger.error(`POST /Movie/GetRecommendation: error getting recommendation`);
    //     res.status(401).json({ message: 'Error getting recommendation' });
    //     return;
    // }
    // logger.info(`POST /Movie/GetRecommendation: recommendation retrieved`);
    // result = await info.add_info_omdb(result['recommendations'], process.env.OMDB_API_KEY);
    const result = [
  {
    "imdb_id": "tt0848228",
    "imdb_url": "https://www.imdb.com/title/tt0848228",
    "title": "The Avengers",
    "released": "04 May 2012",
    "rating": "8.0",
    "plot": "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    "genre": "Action, Sci-Fi",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    "director": "Joss Whedon",
    "actors": "Robert Downey Jr., Chris Evans, Scarlett Johansson",
    "awards": "Nominated for 1 Oscar. 39 wins & 81 nominations total",
    "runtime": "143 min",
    "language": "English, Russian"
  },
  {
    "imdb_id": "tt2015381",
    "imdb_url": "https://www.imdb.com/title/tt2015381",
    "title": "Guardians of the Galaxy",
    "released": "01 Aug 2014",
    "rating": "8.0",
    "plot": "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.",
    "genre": "Action, Adventure, Comedy",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BNDIzMTk4NDYtMjg5OS00ZGI0LWJhZDYtMzdmZGY1YWU5ZGNkXkEyXkFqcGdeQXVyMTI5NzUyMTIz._V1_SX300.jpg",
    "director": "James Gunn",
    "actors": "Chris Pratt, Vin Diesel, Bradley Cooper",
    "awards": "Nominated for 2 Oscars. 52 wins & 103 nominations total",
    "runtime": "121 min",
    "language": "English"
  },
  {
    "imdb_id": "tt0371746",
    "imdb_url": "https://www.imdb.com/title/tt0371746",
    "title": "Iron Man",
    "released": "02 May 2008",
    "rating": "7.9",
    "plot": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
    "genre": "Action, Adventure, Sci-Fi",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg",
    "director": "Jon Favreau",
    "actors": "Robert Downey Jr., Gwyneth Paltrow, Terrence Howard",
    "awards": "Nominated for 2 Oscars. 24 wins & 73 nominations total",
    "runtime": "126 min",
    "language": "English, Persian, Urdu, Arabic, Kurdish, Hindi, Hungarian"
  },
  {
    "imdb_id": "tt1375666",
    "imdb_url": "https://www.imdb.com/title/tt1375666",
    "title": "Inception",
    "released": "16 Jul 2010",
    "rating": "8.8",
    "plot": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    "genre": "Action, Adventure, Sci-Fi",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    "director": "Christopher Nolan",
    "actors": "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
    "awards": "Won 4 Oscars. 159 wins & 220 nominations total",
    "runtime": "148 min",
    "language": "English, Japanese, French"
  },
  {
    "imdb_id": "tt1431045",
    "imdb_url": "https://www.imdb.com/title/tt1431045",
    "title": "Deadpool",
    "released": "12 Feb 2016",
    "rating": "8.0",
    "plot": "A wisecracking mercenary gets experimented on and becomes immortal yet hideously scarred, and sets out to track down the man who ruined his looks.",
    "genre": "Action, Comedy",
    "poster_url": "https://m.media-amazon.com/images/M/MV5BYzE5MjY1ZDgtMTkyNC00MTMyLThhMjAtZGI5OTE1NzFlZGJjXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    "director": "Tim Miller",
    "actors": "Ryan Reynolds, Morena Baccarin, T.J. Miller",
    "awards": "29 wins & 78 nominations",
    "runtime": "108 min",
    "language": "English"
  }
];
    res.json(result);
});

app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
});