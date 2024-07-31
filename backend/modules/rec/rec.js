// ============================================================
// Query python flask server for recommendations
// ============================================================

const server_path = "http://localhost:8888/recommend";

async function get_rec(favMovies) {
    const imdb_ids = favMovies.map(movie => movie.imdbid);
    const response = await fetch(server_path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "fav_movies_imdb": imdb_ids,
            "n": 10,
            "full_dataset": true
        })
    });
    const data = await response.json();
    return data;
}

export default {
   get_rec 
};