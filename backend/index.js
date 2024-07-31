import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './modules/log/logger.js';
import auth from './modules/auth/auth.js';
import scraper from './modules/scraper/scraper.js';
import rec from './modules/rec/rec.js';

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
    console.log("API: "+process.env.JELLYFIN_API_KEY);
    if (process.env.JELLYFIN_API_KEY !== undefined && process.env.JELLYFIN_API_KEY !== null && process.env.JELLYFIN_API_KEY !== '') {
        result = await auth.auth_using_api_key(url, process.env.JELLYFIN_API_KEY, username);
    } else {
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
    if (!checkLogin(res)) {
        return;
    } else if (userinfo.favMovies === null) {
        logger.error(`GET /Movie/GetRecommendation: favorite movies not yet retrieved`);
        res.status(401).json({ message: 'Unable to get recommendation: Favorite movies not yet retrieved' });
        return;
    }
    let n = req.params.n;
    if (n === undefined) {
        n = 10;
    }
    const result = await rec.get_rec(userinfo.favMovies, n, true);
    if (result === null || result === undefined) {
        logger.error(`POST /Movie/GetRecommendation: error getting recommendation`);
        res.status(401).json({ message: 'Error getting recommendation' });
        return;
    }
    logger.info(`POST /Movie/GetRecommendation: recommendation retrieved`);
    res.json(result);
});

app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
});