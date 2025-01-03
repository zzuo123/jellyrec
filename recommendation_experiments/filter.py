# 1. Choose 100k ratings randomly from users who have rated less than 100 movies
def one(train_ratings):
    train_ratings_cpy = train_ratings.copy()
    # find the users who have rated less than 100 movies
    user_rating_counts = train_ratings_cpy.groupby('userId').size()
    user_rating_counts = user_rating_counts[user_rating_counts < 100]
    print(user_rating_counts.shape)
    # randomly sample 100k ratings from these users
    sample_ratings = train_ratings_cpy[train_ratings_cpy['userId'].isin(user_rating_counts.index)].sample(100000)
    print(sample_ratings.shape)
    return sample_ratings


# 2. Choose 100k ratings randomly from users who have rated more than 1000 movies
def two(train_ratings):
    train_ratings_cpy = train_ratings.copy()
    # find the users who have rated more than 1000 movies
    user_rating_counts = train_ratings_cpy.groupby('userId').size()
    user_rating_counts = user_rating_counts[user_rating_counts > 1000]
    print(user_rating_counts.shape)
    # randomly sample 100k ratings from these users
    sample_ratings = train_ratings_cpy[train_ratings_cpy['userId'].isin(user_rating_counts.index)].sample(100000)
    print(sample_ratings.shape)
    return sample_ratings


# 3. Choose 50k ratings randomly from users who have rated more than 1000 movies and 50k from users who have rated less than 100 movies
def three(train_ratings):
    train_ratings_cpy = train_ratings.copy()
    # find the users who have rated more than 1000 movies
    user_rating_counts = train_ratings_cpy.groupby('userId').size()
    user_rating_counts = user_rating_counts[user_rating_counts > 1000]
    print(user_rating_counts.shape)
    # randomly sample 50k ratings from these users
    sample_ratings = train_ratings_cpy[train_ratings_cpy['userId'].isin(user_rating_counts.index)].sample(50000)
    # find the users who have rated less than 100 movies
    user_rating_counts = train_ratings_cpy.groupby('userId').size()
    user_rating_counts = user_rating_counts[user_rating_counts < 100]
    print(user_rating_counts.shape)
    # randomly sample 50k ratings from these users and append to the previous sample (dataframe)
    sample_ratings = pd.concat([sample_ratings, train_ratings_cpy[train_ratings_cpy['userId'].isin(user_rating_counts.index)].sample(50000)])
    print(sample_ratings.shape)
    return sample_ratings


# 4. Choose 100k ratings randomly from users who have rated between 200 and 500 movies (middle of the road)
def four(train_ratings):
    train_ratings_cpy = train_ratings.copy()
    # find the users who have rated between 200 and 500 movies
    user_rating_counts = train_ratings_cpy.groupby('userId').size()
    user_rating_counts = user_rating_counts[(user_rating_counts > 200) & (user_rating_counts < 500)]
    print(user_rating_counts.shape)
    # randomly sample 100k ratings from these users
    sample_ratings = train_ratings_cpy[train_ratings_cpy['userId'].isin(user_rating_counts.index)].sample(100000)
    print(sample_ratings.shape)
    return sample_ratings


# 5. Choose 100k ratings randomly by splitting the data into 50 buckets of users and choosing 2k ratings from each bucket
def five(train_ratings):
    train_ratings_cpy = train_ratings.copy()
    # split the data into 50 buckets of users based on the number of ratings
    user_rating_counts = train_ratings_cpy.groupby('userId').size()
    user_rating_counts = user_rating_counts.sort_values()
    buckets = np.array_split(user_rating_counts.index, 50)
    print([len(bucket) for bucket in buckets])
    # randomly sample 2k ratings from each bucket
    sample_ratings = pd.concat([train_ratings_cpy[train_ratings_cpy['userId'].isin(bucket)].sample(2000) for bucket in buckets])
    print(sample_ratings.shape)
    return sample_ratings