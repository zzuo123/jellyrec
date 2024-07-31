# JellyRec: A Jellyfin Movie/Show Recommender

For more details, checkout this blog post: [https://zzuo123.github.io/blog/jellyrec/](https://zzuo123.github.io/blog/jellyrec/)

## To login via environment variable:

First create a `.env` file in the backend/ directory with the following content:

```
OMDB_API_KEY=<OMDB API Key (optional: for retrieving information on recommended movies)>
JELLYFIN_API_KEY=<Your Jellyfin API Key>
JELLYFIN_USERNAME=<Your Jellyfin USERNAME>
JELLYFIN_PASSWORD=<Your Jellyfin PASSWORD>
JELLYFIN_URL=<The url to your jellyfin server (possible with port if not 80 or 443)>
```

Some notes on obtaining the required environment variables:

To get the OMDB API key, you would need to register for an account at [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx).

To get the Jellyfin API key, you would need to be an admin on your Jellyfin server. From the hamburger menu, go to `Administration` -> `Dashboard` -> `API Keys` and press the `+` button to create a new API key.

The Jellyfin URL is the url to your Jellyfin server. For example, if you are running Jellyfin on your local machine, the url would be `http://localhost:<port>`. If you are running Jellyfin on a server, the url would be `http://your-server-ip:<port?>`.

## To install all dependencies (Python and NodeJS):

```bash
cd backend/
npm install
cd python/
pip install -r requirements.txt
```

## To run the backend (Express JS API):

```bash
npm start
```

## API Endpoints:

<!-- API endpoints with request body and result -->

### POST /Auth/login

Authenticate with Jellyfin server. Optional if provided in environment variables.

Request Body:

```json
{
    "username": "username",
    "password": "password",
    "baseurl": "http://localhost:8096"
}
```

Result:

```json
{
  "message": "ok",
}
```

### GET /Movies/GetFavorite

Get favorite movies from Jellyfin server.

Request Body:

```json
{}
```

Result:

```json
[
  {
    "id": "movie id in jf server",
    "name": "movie title/name",
    "imdb_id": "movie imdb id if available (begins with tt and 7 digits padded with 0)",
    "jf_image_url": "link to movie poster in jf server",
  },
]
```

### GET /Movies/GetRecommendaion/<number of recommendation (default: 10)>

Get movie recommendations based on favorite movies.

Request Body:

```json
{}
```

Result:

```json
[
  {
    "imdb_id": "movie imdb id if available",
    "imdb_url": "https://www.imdb.com/title/<imdb_id>",
    "title": "movie name/title",
    "released": "01 Jan 2001",
    "rating": "8.0",
    "plot": "description of the plot",
    "genre": "CSV of genres",
    "poster_url": "link to movie poster",
    "director": "CSV of directors",
    "actors": "CSV of actors",
    "awards": "description of awards",
    "runtime": "<n> min",
    "language": "CSV of languages",
  },
]
```