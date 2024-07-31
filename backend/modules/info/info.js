// https://www.omdbapi.com/?i=tt3896198&apikey={OMDB_API_KEY}

async function get_info(imdb_id, omdb_api_key){
    const url = `https://www.omdbapi.com/?i=${imdb_id}&apikey=${omdb_api_key}`;
    console.log(url);
    const response = await fetch(url);
    if (!response.ok) {
        return null;
    }
    const result = await response.json();
    return result;
}


async function add_info_omdb(movies, omdb_api_key){
    for (let i = 0; i < movies.length; i++) {
        const info = await get_info(movies[i].imdb_id, omdb_api_key);
        if (info === null) {
            continue;
        }
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
    // console.log(movies);
    return movies;
}

export default {
    add_info_omdb
};