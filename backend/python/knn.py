# module for training a recommendation model

import os
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

base_path = os.path.abspath(os.path.dirname(__file__)) + '/downloads/'
full_dataset_path = base_path + 'ml-latest/ml-latest/'
small_dataset_path = base_path + 'ml-latest-small/ml-latest-small/'

def get_user_item_matrix(full_dataset=False):
    '''
    Read the ratings.csv file and return a user-item matrix
    '''
    
    # read the ratings file
    if full_dataset:
        ratings_path = full_dataset_path + 'ratings.csv'
    else:
        ratings_path = small_dataset_path + 'ratings.csv'
    ratings = pd.read_csv(ratings_path)
    
    # create the user-item matrix
    user_item_matrix = ratings.pivot(index='userId', columns='movieId', values='rating')
    
    # fill missing values with 0
    user_item_matrix = user_item_matrix.fillna(0)
    
    return user_item_matrix


class Mapping:
    # convert the user-item matrix to a numpy array for user and movie ids
    def __init__(self, ids):
        self.ids = ids
        self.id_to_index = {id: index for index, id in enumerate(ids)}
        self.index_to_id = {index: id for index, id in enumerate(ids)}

    def to_index(self, id):
        return self.id_to_index[id]
    
    def to_id(self, index):
        return self.index_to_id[index]
    
    def get_indices(self, ids):
        return [self.id_to_index[id] for id in ids]
    
    def get_ids(self, indices):
        return [self.index_to_id[index] for index in indices]


def cosine_knn_model(full_dataset=False):
    '''
    Generate a cosine similarity model for k-nearest neighbors
    Returns:
    - cosine similarity model
    - mapping from movie ids to indices in the matrix
    '''

    # get the user-item matrix
    user_item_matrix = get_user_item_matrix(full_dataset)

    # mapping from user and movie ids to indices in the matrix (before converting to np array)
    # mapping_user = Mapping(user_item_matrix.index)
    mapping_movie = Mapping(user_item_matrix.columns)
    user_item_matrix = user_item_matrix.values

    cosine_sim_model = cosine_similarity(user_item_matrix.T)
    return cosine_sim_model, mapping_movie


def imdb_to_movieid(imdb_id_lst, full_dataset=False):
    '''
    Convert a list of imdb ids to movie ids
    Args:
    - imdb_id_lst: list of imdb ids
    - full_dataset: whether to use the full dataset
    Returns:
    - list of movie ids
    '''
    if full_dataset:
        links_path = full_dataset_path + 'links.csv'
    else:
        links_path = small_dataset_path + 'links.csv'
    movies = pd.read_csv(links_path)
    movie_ids = []
    for imdb_id in imdb_id_lst:
        if imdb_id.startswith('tt'):    # remove the 'tt' prefix
            imdb_id = int(imdb_id[2:])
        movie_id = movies[movies['imdbId'] == imdb_id]['movieId'].values[0]
        movie_ids.append(movie_id)
    return movie_ids   


def movieid_to_imdb(movie_id_lst, full_dataset=False):
    '''
    Convert a list of movie ids to imdb ids
    Args:
    - movie_id_lst: list of movie ids
    - full_dataset: whether to use the full dataset
    Returns:
    - list of imdb ids
    '''
    if full_dataset:
        links_path = full_dataset_path + 'links.csv'
    else:
        links_path = small_dataset_path + 'links.csv'
    movies = pd.read_csv(links_path)
    imdb_ids = []
    for movie_id in movie_id_lst:
        imdb_id = movies[movies['movieId'] == movie_id]['imdbId'].values[0]
        imdb_ids.append(f'tt{imdb_id}')
    return imdb_ids


def movieid_to_title(movie_id_lst, full_dataset=False):
    '''
    Convert a list of movie ids to movie titles
    Args:
    - movie_id_lst: list of movie ids
    - full_dataset: whether to use the full dataset
    Returns:
    - list of movie titles
    '''
    if full_dataset:
        movies_path = full_dataset_path + 'movies.csv'
    else:
        movies_path = small_dataset_path + 'movies.csv'
    movies = pd.read_csv(movies_path)
    titles = []
    for movie_id in movie_id_lst:
        title = movies[movies['movieId'] == movie_id]['title'].values[0]
        titles.append(title)
    return titles
    

def recommend_movies(fav_movies_imdb, n=10, full_dataset=False):
    '''
    Recommend n movies based on the cosine similarity model
    '''
    # get the cosine similarity model and mapping
    cosine_sim_model, mapping_movie = cosine_knn_model(full_dataset)

    # convert the favorite movies imdb ids to movie ids
    fav_movies = imdb_to_movieid(fav_movies_imdb, full_dataset)
    fav_indices = mapping_movie.get_indices(fav_movies)

    # construct the user-interaction vector using fav_indices
    user_interaction = np.zeros(len(mapping_movie.ids))
    user_interaction[fav_indices] = 5

    # calculate the scores for each movie based on the cosine similarity model and set favorite movies score to 0 (don't recommend the same movies)
    scores = cosine_sim_model.dot(user_interaction)
    scores[fav_indices] = 0

    # get the indices of the top n movies
    top_indices = np.argsort(scores)[::-1][:n]
    top_movie_ids = mapping_movie.get_ids(top_indices)

    # convert the top movie ids to imdb ids and titles
    top_imdb_ids = movieid_to_imdb(top_movie_ids, full_dataset)
    top_titles = movieid_to_title(top_movie_ids, full_dataset)
    return top_imdb_ids, top_titles



