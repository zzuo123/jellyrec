// ============================================================
// For recommendations based on the favorited shows/movies`
// ============================================================

async function getFavShows(baseurl, uid, token){
    const url = baseurl+"/Users/"+uid+"/Items?Recursive=true&Fields=ProviderIds&IncludeItemTypes=Series&isFavorite=true";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'MediaBrowser Client="JellyRec", Device="JellyRecBackend", DeviceId="JellyRecBackend", Version="1.0.0", Token="'+token+'"'
        }
    });
    if (response.status != 200) {
        return null;
    }
    const result = await response.json();
    return result;
}

async function getFavMovies(baseurl, uid, token){
    const url = baseurl+"/Users/"+uid+"/Items?Recursive=true&Fields=ProviderIds&IncludeItemTypes=Movie&isFavorite=true";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'MediaBrowser Client="JellyRec", Device="JellyRecBackend", DeviceId="JellyRecBackend", Version="1.0.0", Token="'+token+'"'
        }
    });
    if (response.status != 200) {
        return null;
    }
    const result = await response.json();
    return result;
}


// ========================= EXPORT =========================
export default {
    getFavShows,
    getFavMovies
}