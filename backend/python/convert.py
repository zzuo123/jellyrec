# convert data between different formats
import os
import pandas as pd

base_path = os.path.abspath(os.path.dirname(__file__)) + '/downloads/'
full_dataset_path = base_path + 'ml-latest/ml-latest/'
small_dataset_path = base_path + 'ml-latest-small/ml-latest-small/'

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
            imdb_id = int(imdb_id[2:].lstrip("0"))  # remove 0 padding and convert to int
        if not movies[movies['imdbId'] == imdb_id].empty:
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
        padded_imdb_id = str(imdb_id).zfill(7)
        imdb_ids.append('tt' + padded_imdb_id)
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