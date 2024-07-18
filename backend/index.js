import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import spawn from 'child_process';
import logger from './modules/log/logger.js';
import auth from './modules/auth/auth.js';
import scraper from './modules/scraper/scraper.js';
import output from './modules/output/output.js';

const port = process.env.PORT || 4001;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

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
    const result = await auth.authenticate(url, username, password);
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

app.post('/Movie/GetRecommendation', async (req, res) => {
    if (!checkLogin(res)) {
        return;
    }
    if(output.cacheUserInfo(userinfo)) {
        logger.info(`POST /Movie/GetRecommendation: user ${userinfo.uid} info cached`);
        res.json({ message: 'ok' });
    } else {
        logger.error(`POST /Movie/GetRecommendation: error caching user ${userinfo.uid} info`);
        res.status(401).json({ message: 'Error caching user info' });
    }
});

app.post('/Run/Python', (req, res) => {
    // if (!checkLogin(res)) {
    //     return;
    // }
    const pythonProcess = spawn.spawn('python', ['./modules/generate/generate.py', '93f7ef9c38c946829b359d4f5c523eee', 'arg2']);
    
    pythonProcess.stdout.on('data', (data) => {
        let result = JSON.parse(data.toString());
        res.json(result);
        // console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

});


app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
});