# JellyRec: A Jellyfin Movie/Show Recommender

For more details, checkout this blog post: [https://zzuo123.github.io/blog/jellyrec/](https://zzuo123.github.io/blog/jellyrec/)

## QUICKSTART GUIDE

### Clone this repository

First you would need to clone this repository and change into the repo's directory using the following commands:

```bash
git clone https://github.com/zzuo123/jellyrec.git
cd jellyrec
```

### Set up OMDB API to retrieve poster and movie informaion

First go to the `backend\.env` file in the backend/ directory with the following content:

```
OMDB_API_KEY=<OMDB API Key (required: for retrieving information on recommended movies)>
```

Some notes on obtaining the required environment variables:

To get the OMDB API key, you would need to register for an account at [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx).

The Jellyfin URL is the url to your Jellyfin server. For example, if you are
running Jellyfin on your local machine, the url would be `http://localhost:<port>`.
If you are running Jellyfin on a server, the url would be `http://your-server-ip:<port?>`.
If you used a reverse proxy, you can just input the url `http://your-ip-or-domain`.


### Install Docker

First, you would need to install Docker using the official docker guide
for your specific system: [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/). To make sure docker is installed, start docker and run the following command on your terminal:

```bash
docker --version
```

And it should give you an output that looks something like `Docker version x.x.x, build <hex>`.

### Build Containers and Run Containers

After you installed docker, everything is just as simple as running the following command:

```bash
docker compose up -d
```


## API Endpoints

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
