import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import logger from './modules/log/logger.js';
import auth from './modules/auth/auth.js';

const port = process.env.PORT || 4001;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

let userinfo = {
    baseurl: null,
    token: null,
    uid: null
};


app.post('/Auth/login', async (req, res) => {
    const { url, username, password } = req.body;
    userinfo.baseurl = url;
    logger.info(`POST /login: received login request for ${username}`);
    const result = await auth.authenticate(baseurl, username, password);
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
    token = result.token;
    uid = result.uid;
});

app.post('/Auth/logout', async (req, res) => {
    logger.info(`POST /logout: received logout request`);
    const result = await auth.logout(baseurl, token);
    userinfo.baseurl = null;
    userinfo.token = null;
    userinfo.uid = null;
    if (result === false) {
        logger.error(`POST /logout: error logging out of session`);
        res.status(401).json({ message: 'Error logging out of session' });
        return;
    }
    logger.info(`POST /logout: user logged out`);
    res.json({ message: 'ok' });
});

app.get('/Movie/GetFavorite');

app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
});