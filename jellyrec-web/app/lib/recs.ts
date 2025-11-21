'use server';
// https://www.omdbapi.com/?i={IMDB_ID}&apikey={OMDB_API_KEY}

import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

dotenv.config();
const REC_BACKEND_URL = process.env.REC_BACKEND_URL || 'http://localhost:8888'
const OMDB_API_KEY = process.env.OMDB_API_KEY || '';

// Use /tmp directory for cache file (writable in Docker and most systems)
const CACHE_FILE = path.join(os.tmpdir(), 'jellyrec_omdb_cache.json');

// when module is imported, read file or create empty array if file does not exist
let info: any[] = [];
try {
    if (fs.existsSync(CACHE_FILE)) {
        info = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
} catch (error) {
    console.warn('Failed to read OMDB cache, starting fresh:', error);
    info = [];
}

async function get_info(imdb_id: string) {
    let result = info.find((element: any) => element.imdbID === imdb_id);
    if (result !== undefined) { return result; }
    const url = `https://www.omdbapi.com/?i=${imdb_id}&apikey=${OMDB_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) { return result; }
    result = await response.json();
    info.push(result);

    // Try to write cache, but don't fail if we can't
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(info));
    } catch (error) {
        console.warn('Failed to write OMDB cache:', error);
    }

    return result;
}

async function add_info_omdb(movies: any[]) {
    for (let i = 0; i < movies.length; i++) {
        const info = await get_info(movies[i].imdb_id);
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
    return movies;
}

export async function get_rec(favMovies: any[], n: number) {  //, full_dataset: boolean, full_dataset_options: any) {
    const imdb_ids = favMovies.map(movie => movie.imdb_id);
    const response = await fetch(`${REC_BACKEND_URL}/recommend`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "fav_movies_imdb": imdb_ids,
            "n": n,
            "full_dataset": false
            // "full_dataset_options": full_dataset_options
        })
    });
    if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
    const data = await response.json();
    const recMovies = await add_info_omdb(data.recommendations);
    return recMovies;
}