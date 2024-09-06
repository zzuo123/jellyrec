// frontend/src/lib/store/store.js
import { writable } from "svelte/store";

const favFetched = writable(false);

export {
    favFetched,
}

