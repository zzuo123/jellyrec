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

function checkLogin() {
    if (userinfo.token === null || userinfo.uid === null || userinfo.baseurl === null) {
        return false; 
    }
    return true;
}

function ensure_login(res, route) {
    if (!checkLogin()) {
        logger.error(`${route}: user not logged in`);
        res.status(401).json({ message: 'User not logged in' });
        return false;
    }
    return true;
}


app.post('/Auth/login', async (req, res) => {
    logger.info(`POST /login: received login request.`);
    if (checkLogin()) {
        logger.error(`POST /login: user already logged in`);
        res.status(401).json({ message: 'User already logged in' });
        return;
    }
    clearUserInfo();
    const username = req.body.username || process.env.JELLYFIN_USERNAME || null;
    const password = req.body.password || process.env.JELLYFIN_PASSWORD || null;
    userinfo.token = req.body.token || process.env.JELLYFIN_API_KEY || null;
    userinfo.baseurl = req.body.url || process.env.JELLYFIN_URL || null;
    userinfo.uid = req.body.uid || process.env.JELLYFIN_UID || null;
    // these big three are required to connect to the jellyfin server
    if (userinfo.token === null || userinfo.baseurl === null || userinfo.uid === null) {  
        const result = await auth.authenticate(userinfo.baseurl, username, password);
        if (result === null || result === undefined) {
            clearUserInfo();
            logger.error(`POST /login: error authenticating user ${username}, invalid url or username or password or token`);
            res.status(401).json({ message: 'Invalid url or username or password... Please retry.' });
            return;
        }
        logger.info(`POST /login: user ${username} authenticated`);
        userinfo.token = result.token;
        userinfo.uid = result.uid;
    }
    // res.json({ message: 'ok', token: userinfo.token, uid: userinfo.uid });     // this is for testing
    res.json({ message: 'ok' });  // this is for prod
});

app.post('/Auth/logout', async (req, res) => {
    logger.info(`POST /Auth/logout: received logout request`);
    if (!ensure_login(res, '/Auth/logout')) { return; }
    const result = await auth.logout(userinfo.baseurl, userinfo.token);
    if (result === false) {
        logger.error(`POST /Auth/logout: error logging out of session`);
        res.status(401).json({ message: 'Error logging out of session' });
        return;
    }
    clearUserInfo();
    logger.info(`POST /Auth/logout: user logged out`);
    res.json({ message: 'ok' });
});

app.get('/Movie/GetFavorite', async (req, res) => {
    logger.info(`GET /Movie/GetFavorite: received request for favorite movies`);
    if (!ensure_login(res, '/Movie/GetFavorite')) { return; }
    const result = await scraper.getFavMovies(userinfo.baseurl, userinfo.uid, userinfo.token);
    if (result === null || result === undefined) {
        logger.error(`GET /Movie/GetFavorite: error getting favorite movies`);
        res.status(401).json({ message: 'Error getting favorite movies' });
        return;
    }
    logger.info(`GET /Movie/GetFavorite: favorite movies retrieved`);
    userinfo.favMovies = result;
    const user_result = await info.add_info_omdb(result, process.env.OMDB_API_KEY);
    logger.info(`GET /Movie/GetFavorite: info retrieved from OMDB`);
    res.json(user_result);
});

app.get('/Show/GetFavorite', async (req, res) => {
    logger.info(`GET /Show/GetFavorite: received request for favorite shows`);
    if (!ensure_login(res, '/Show/GetFavorite')) { return; }
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
    if (!ensure_login(res, '/Movie/GetRecommendation')) { return; }
    if (userinfo.favMovies === null || userinfo.favMovies === undefined || userinfo.favMovies.length === 0) {
        logger.error(`GET /Movie/GetRecommendation: user has no favorite movies or favorite movies not retrieved`);
        res.status(401).json({ message: 'User has no favorite movies or favorite movies not retrieved' });
        return;
    }
    const n = req.params.n || 10;   // default to 10 recommendations
    const full_dataset = req.body.full_dataset || false;
    const full_dataset_options = req.body.full_dataset_options || {'user_min': 300, 'movie_min': 50, 'user_max': 500};
    let result = await rec.get_rec(userinfo.favMovies, n, full_dataset, full_dataset_options);
    if (result === null || result === undefined) {
        logger.error(`POST /Movie/GetRecommendation: error getting recommendation`);
        res.status(401).json({ message: 'Error getting recommendation' });
        return;
    }
    logger.info(`POST /Movie/GetRecommendation: recommendation retrieved`);
    result = await info.add_info_omdb(result['recommendations'], process.env.OMDB_API_KEY);
    res.json(result);
});

app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
});