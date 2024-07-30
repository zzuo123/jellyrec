# recommendation engine server

from download import dl_ml_small, dl_ml_latest
from knn import recommend_movies, Mapping

# download the two datasets
dl_ml_latest()
dl_ml_small()

fav_movies_imdb = ['tt0111161', 'tt0110912', 'tt0133093', 'tt1375666', 'tt0109830']
# shawshank redemption, pulp fiction, matrix, inception, forrest gump

_, recommended_movies = recommend_movies(fav_movies_imdb, n=10, full_dataset=True, full_dataset_options={'user_min': 300, 'movie_min': 50, 'user_max': 500})
# _, recommended_movies = recommend_movies(fav_movies_imdb, n=10, full_dataset=False)
print(recommended_movies)