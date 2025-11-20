# recommendation engine server

from download import dl_ml_small, dl_ml_latest
from knn import recommend_movies, Mapping
from flask import Flask, request, jsonify, make_response
import flask_cors
from waitress import serve

app = Flask(__name__)
flask_cors.CORS(app)

# check if all required keys are in data and if they are of the correct type
def checkRequiredKeys(data, required_keys):
    for key in required_keys:
        if key not in data:
            return False
        if not isinstance(data[key], required_keys[key]):
            return False
    return True


def makeJsonResponse(data, status_code):
    print(f"Sending response (code {status_code}): {data}")
    return make_response(jsonify(data), status_code)


@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
    except Exception as e:
        return makeJsonResponse({
            'error': 'Request must be a json'
        }, 400)
    required_keys  = {'fav_movies_imdb': list, 'n': int, 'full_dataset': bool}
    if not checkRequiredKeys(data, required_keys):
        return makeJsonResponse({
            'error': 'Request missing required keys',
            'keys/types': {k: str(v) for k, v in required_keys.items()}}, 400)
    fav_movies_imdb = data['fav_movies_imdb']
    n = int(data['n'])
    full_dataset = data['full_dataset']
    print(f"Request received: {data}")
    if full_dataset:    # download full dataset
        dl_ml_latest()
    else:               # download small dataset
        dl_ml_small()
    full_dataset_options = None
    if full_dataset and 'full_dataset_options' in data:
        full_dataset_options = data['full_dataset_options']
        required_keys = {'user_min': int, 'movie_min': int, 'user_max': int}
        if not checkRequiredKeys(full_dataset_options, required_keys):
            return makeJsonResponse({
                'error': 'full_dataset_options missing required keys',
                'keys/types': {k: str(v) for k, v in required_keys.items()}
            }, 400)
        imdb = recommend_movies(fav_movies_imdb, n=n, full_dataset=full_dataset, full_dataset_options=full_dataset_options)
    else:
        imdb = recommend_movies(fav_movies_imdb, n=n, full_dataset=full_dataset)
    return makeJsonResponse({
        'recommendations':
        [
            {
                'imdb_id': imdbid,
                'imdb_url': 'https://www.imdb.com/title/'+imdbid
            }
            for imdbid in imdb
        ]
    }, 200)


if __name__ == '__main__':
    # run app on localhost port 8888
    serve(app, host="0.0.0.0", port=8888)