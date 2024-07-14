async function getMostRecentShows(baseurl, uid, token){
    const url = baseurl+"/api/Users/"+uid+"/Items?Recursive=true&IncludeItemTypes=Episode&SortBy=DatePlayed&SortOrder=Descending&Fields=DatePlayed";
    // to be changed using new api in POSTMAN
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

export default {
    getMostRecentShows
}