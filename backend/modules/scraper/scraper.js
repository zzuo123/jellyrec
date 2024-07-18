// ============================================================
// For recommendations based on the most recent shows/movies
// ============================================================

async function getMostRecentShows(baseurl, uid, token){
    // get the most recently watched shows
    const url = baseurl+"/api/Users/"+uid+"/Items?Recursive=true&IncludeItemTypes=Episode&SortBy=DatePlayed&SortOrder=Descending&Fields=DatePlayed";
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
    console.log(result);
    return result;
}

async function getMostRecentMovies(baseurl, uid, token){
    // get the most recently watched movies
    const url = baseurl+"/api/Users/"+uid+"/Items?Recursive=true&IncludeItemTypes=Movie&SortBy=DatePlayed&SortOrder=Descending&Fields=DatePlayed";
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
    console.log(result);
    return result;
}

// ============================================================
// For recommendations based on the favorited shows/movies`
// ============================================================

async function getFavShows(baseurl, uid, token){
    const url = baseurl+"/Users/"+uid+"/Items?Recursive=true&SortBy=DatePlayed&SortOrder=Descending&Fields=DatePlayed&IncludeItemTypes=Series&isFavorite=true";
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
    console.log(result);
    return result;
}

async function getFavMovies(baseurl, uid, token){
    const url = baseurl+"/Users/"+uid+"/Items?Recursive=true&SortBy=DatePlayed&SortOrder=Descending&Fields=DatePlayed&IncludeItemTypes=Movie&isFavorite=true";
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
    console.log(result);
    return result;
}


// ========================= EXPORT =========================
export default {
    getMostRecentShows,
    getMostRecentMovies,
    getFavShows,
    getFavMovies
}