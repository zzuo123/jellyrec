// frontend/src/lib/store/store.js
import { writable } from "svelte/store";

const favFetched = writable(false);

const numRec = writable(10);

const favoriteMovies = writable(null);

export {
    favFetched,
    numRec,
    favoriteMovies,
}

