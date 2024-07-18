// ============================================================
// For recommendations based on the favorited shows/movies`
// ============================================================

// <base-url>/Items/<item-id>/Images/Primary?fillHeight=720&fillWidth=480&quality=96&tag=<primary-image-tag>
function generateImageUrl(baseurl, itemid, tag) {
    if (tag == null || tag == undefined) {
        return undefined;
    }
    return baseurl+"/Items/"+itemid+"/Images/Primary?fillHeight=720&fillWidth=480&quality=96&tag="+tag;
}

// Fields we want: Name, Id, ProviderIds, imageurl
function extractFields(result, baseurl) {
    return result["Items"].map(item => {
        return {
            id: item.Id,
            name: item.Name,
            imdbid: item.ProviderIds.Imdb,
            imageurl: generateImageUrl(baseurl, item.Id, item.ImageTags.Primary)
        }
    });
}

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
    return extractFields(result, baseurl);
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
    return extractFields(result, baseurl);
}


// ========================= EXPORT =========================
export default {
    getFavShows,
    getFavMovies
}