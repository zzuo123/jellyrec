// https://www.omdbapi.com/?i={IMDB_ID}&apikey={OMDB_API_KEY}

import * as fs from 'fs';
import logger from '../log/logger.js';

// when module is imported, read file or create empty array if file does not exist
let info = [];
if (fs.existsSync('omdb_cache.json')) {
    info = JSON.parse(fs.readFileSync('omdb_cache.json'));
}

async function get_info(imdb_id, omdb_api_key){
    let result = info.find((element) => element.imdbID === imdb_id);
    if (result !== undefined) { return result; }
    const url = `https://www.omdbapi.com/?i=${imdb_id}&apikey=${omdb_api_key}`;
    logger.info(`GET ${url}: requesting movie info`);
    const response = await fetch(url);
    if (!response.ok) { return result; }
    result = await response.json();
    info.push(result);
    return result;
}

async function add_info_omdb(movies, omdb_api_key){
    for (let i = 0; i < movies.length; i++) {
        const info = await get_info(movies[i].imdb_id, omdb_api_key);
        if (info === null) { continue; }
        movies[i].title = info.Title || "N/A";
        movies[i].released = info.Released || "N/A";
        movies[i].rating = info.imdbRating || "N/A";
        movies[i].plot = info.Plot || "N/A";
        movies[i].genre = info.Genre || "N/A";
        movies[i].poster_url = info.Poster || "N/A";
        movies[i].director = info.Director || "N/A";
        movies[i].actors = info.Actors || "N/A";
        movies[i].awards = info.Awards || "N/A";
        movies[i].runtime = info.Runtime || "N/A";
        movies[i].language = info.Language || "N/A";
    }
    fs.writeFileSync('omdb_cache.json', JSON.stringify(info));
    return movies;
}

export default {
    add_info_omdb
};