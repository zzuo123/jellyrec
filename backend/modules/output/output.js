import fs from 'fs';
import logger from '../log/logger.js';

// read json object from file, create file if not exist, file name is "data.json"
function readData() {
    let data = {};
    try {
        logger.info('Reading data from data.json');
        data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    } catch (err) {
        logger.error('Error reading data from data.json, creating empty file');
        fs.writeFileSync('data.json', '{}');
    }
    logger.info('Data read from data.json');
    return data;
}

// write json object to file, file name is "data.json", with error check
function writeData(data) {
    try {
        logger.info('Writing data to data.json');
        fs.writeFileSync('data.json', JSON.stringify(data));
    } catch (err) {
        logger.error('Error writing data to data.json');
        return false;
    }
    return true;
}

function cacheUserInfo(userinfo) {
    logger.info('Caching user ' + userinfo.uid + ' info');
    let obj = readData();
    obj[userinfo.uid] = userinfo;
    if (!writeData(obj)) {
        logger.error('Error caching user ' + userinfo.uid + ' info');
        return false;
    }
    logger.info('User ' + userinfo.uid + ' info cached');
    return true;
}

export default { cacheUserInfo };