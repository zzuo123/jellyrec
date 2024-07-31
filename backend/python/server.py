# recommendation engine server

from download import dl_ml_small, dl_ml_latest
from knn import recommend_movies, Mapping
import flask
from flask import request, jsonify
import flask_cors


if __name__ == '__main__':
    app = flask.Flask(__name__)
    flask_cors.CORS(app)

    @app.route('/recommend', methods=['POST'])
    def recommend():
        data = request.json
        fav_movies_imdb = data['fav_movies_imdb']
        n = int(data['n'])
        full_dataset = data['full_dataset']
        if full_dataset:    # download full dataset
            dl_ml_latest()
        else:               # download small dataset
            dl_ml_small()
        full_dataset_options = None
        if full_dataset and 'full_dataset_options' in data:
            full_dataset_options = data['full_dataset_options']
        if full_dataset and full_dataset_options:
            print('full_dataset_options:', full_dataset_options)
        print('fav_movies_imdb:', fav_movies_imdb)
        print('n:', n)
        print('full_dataset:', full_dataset)
        if full_dataset_options:
            imdb = recommend_movies(fav_movies_imdb, n=n, full_dataset=full_dataset, full_dataset_options=full_dataset_options)
        else:
            imdb = recommend_movies(fav_movies_imdb, n=n, full_dataset=full_dataset)
        print('recommended imdb:', imdb)
        return jsonify({'recommendations': [{'imdb_id': imdbid, 'imdb_url': 'https://www.imdb.com/title/'+imdbid} for imdbid in imdb]})

    # run app on localhost port 8888
    from waitress import serve
    serve(app, host="0.0.0.0", port=8888)