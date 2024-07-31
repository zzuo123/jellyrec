# recommendation engine server

import json
# import sys
import os
from download import dl_ml_small, dl_ml_latest
from knn import recommend_movies, Mapping
import flask
from flask import request, jsonify
import flask_cors

# download the two datasets
# dl_ml_latest()
# dl_ml_small()

# fav_movies_imdb = ['tt0111161', 'tt0110912', 'tt0133093', 'tt1375666', 'tt0109830']
# shawshank redemption, pulp fiction, matrix, inception, forrest gump

# _, recommended_movies = recommend_movies(fav_movies_imdb, n=10, full_dataset=True, full_dataset_options={'user_min': 300, 'movie_min': 50, 'user_max': 500})
# _, recommended_movies = recommend_movies(fav_movies_imdb, n=10, full_dataset=False)
# print(recommended_movies)

# def extract_args(argv):
#     print(argv)
#     if len(argv) < 5:
#         print('Usage: python server.py path_to_data n full_dataset full_dataset_options')
#         sys.exit(1)
#     path_to_data = argv[1]
#     if not os.path.exists(path_to_data):
#         print('Data file does not exist')
#         sys.exit(1)
#     # check if n is a positive integer less than or equal to 100
#     try:
#         n = int(argv[2])
#         if n <= 0 or n > 100:
#             raise ValueError
#     except ValueError:
#         print('n must be a positive integer')
#         sys.exit(1)
#     # check if full_dataset is a boolean
#     if argv[3].lower() == 'true':
#         full_dataset = True
#     elif argv[3].lower() == 'false':
#         full_dataset = False
#     else:
#         print('full_dataset must be a boolean')
#         sys.exit(1)
#     if full_dataset and len(argv) > 4:
#         # check if full_dataset_options is a dictionary with the right keys
#         try:
#             full_dataset_options = json.loads(argv[4])
#             if 'user_min' not in full_dataset_options or 'movie_min' not in full_dataset_options or 'user_max' not in full_dataset_options:
#                 raise ValueError
#         except ValueError:
#             print('full_dataset_options must be a dictionary with keys user_min, movie_min, user_max')
#             sys.exit(1)
#     else:
#         full_dataset_options = None
#     return path_to_data, n, full_dataset, full_dataset_options


# def extract_fav_imdb(path_to_data):
#     # read from the data json file and extract the imdb ids of the favorite movies
#     with open(path_to_data, 'r') as f:
#         data = json.load(f)
#     fav_movies_imdb = data['fav_movies_imdb']
#     return fav_movies_imdb


# def write_to_file(imdb, recommended_movies, path_to_data):
#     # write the recommended movies to the data json file
#     with open(path_to_data, 'r') as f:
#         data = json.load(f)
#     recommend_movies = zip(imdb, recommended_movies)
#     data['recommended_movies'] = recommend_movies
#     with open(path_to_data, 'w') as f:
#         json.dump(data, f)


# def main(argv):
#     path_to_data, n, full_dataset, full_dataset_options = extract_args(argv)
#     print('path_to_data:', path_to_data)
#     print('n:', n)
#     print('full_dataset:', full_dataset)
#     print('full_dataset_options:', full_dataset_options)

#     fav_movies_imdb = extract_fav_imdb(path_to_data)

#     imdb, recommended_movies = recommend_movies(fav_movies_imdb, n=n, full_dataset=full_dataset, full_dataset_options=full_dataset_options)
#     write_to_file(imdb, recommended_movies, path_to_data)

if __name__ == '__main__':
    # main(sys.argv)
    app = flask.Flask(__name__)
    flask_cors.CORS(app)

    @app.route('/recommend', methods=['POST'])
    def recommend():
        data = request.json
        fav_movies_imdb = data['fav_movies_imdb']
        n = data['n']
        full_dataset = data['full_dataset']
        full_dataset_options = None
        if full_dataset and 'full_dataset_options' in data:
            full_dataset_options = data['full_dataset_options']
        if full_dataset and full_dataset_options:
            print('full_dataset_options:', full_dataset_options)
        print('fav_movies_imdb:', fav_movies_imdb)
        print('n:', n)
        print('full_dataset:', full_dataset)
        if full_dataset_options:
            imdb, recommended_movies = recommend_movies(fav_movies_imdb, n=n, full_dataset=full_dataset, full_dataset_options=full_dataset_options)
        else:
            imdb, recommended_movies = recommend_movies(fav_movies_imdb, n=n, full_dataset=full_dataset)
        print('imdb:', imdb)
        return jsonify({'recommendations': [{'imdbid': imdb, 'title': recommended_movies} for imdb, recommended_movies in zip(imdb, recommended_movies)]})

    # run app on localhost port 8888
    from waitress import serve
    serve(app, host="0.0.0.0", port=8888)