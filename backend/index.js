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

let baseurl = null;
let token = null;
let uid = null;

app.post('/login', async (req, res) => {
    const { url, username, password } = req.body;
    baseurl = url;
    logger.info(`POST /login: received login request for ${username}`);
    const result = await auth.authenticate(baseurl, username, password);
    if (result === null || result === undefined) {
        res.status(401).json({ message: 'Invalid url or username or password... Please retry.' });
        return;
    }
    res.json({ message: 'ok', token: result.token, uid: result.uid });     // this is for testing
    // res.json({ message: 'ok' });  // this is for prod
    token = result.token;
    uid = result.uid;
});

app.post('/logout', async (req, res) => {
    logger.info(`POST /logout: received logout request`);
    const result = await auth.deauthenticate(baseurl, token);
    if (result === false) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
    res.json({ message: 'ok' });
});

app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
});