// ============================================================
// Query python flask server for recommendations
// ============================================================

const server_path = "http://localhost:8888/recommend";

async function get_rec(favMovies, n=10, full_dataset=false, full_dataset_options={'user_min': 300, 'movie_min': 50, 'user_max': 500}) {
    const imdb_ids = favMovies.map(movie => movie.imdb_id);
    const response = await fetch(server_path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "fav_movies_imdb": imdb_ids,
            "n": n,
            "full_dataset": full_dataset,
            "full_dataset_options": full_dataset_options
        })
    });
    const data = await response.json();
    return data;
}

export default {
   get_rec 
};