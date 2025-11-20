# module to download rating files from MovieLens

import os
import requests
import zipfile

def download_and_extract(url, dir_name):
    '''
    Download a zip file from a given url and extract it to a target directory
    '''

    # check if the file already exists
    download_path = os.path.abspath(os.path.dirname(__file__)) + '/downloads/'
    if not os.path.exists(download_path):
        os.mkdir(download_path)
    target_dir = download_path + dir_name
    print(f'Target directory: {target_dir}')
    if os.path.exists(target_dir):
        print(f'{target_dir} already exists')
        return
    else:
        print(f'Creating {target_dir}')
        os.mkdir(target_dir)
    
    # download the file with progress
    print(f'Downloading {url}')
    r = requests.get(url)
    with open('temp.zip', 'wb') as f:
        f.write(r.content)
    print('Download complete')

    # extract the file
    print(f'Unzipping {url}')
    with zipfile.ZipFile('temp.zip', 'r') as zip_ref:
        zip_ref.extractall(target_dir)
    print('Unzip complete')

    # remove the zip file
    os.remove('temp.zip')


def dl_ml_small():
    '''
    Download the ml-latest-small.zip file from MovieLens and extract it
    '''

    url = 'http://files.grouplens.org/datasets/movielens/ml-latest-small.zip'
    dir_name = 'ml-latest-small'
    download_and_extract(url, dir_name)


def dl_ml_latest():
    '''
    Download the ml-latest.zip file from MovieLens and extract it
    '''

    url = 'http://files.grouplens.org/datasets/movielens/ml-latest.zip'
    dir_name = 'ml-latest'
    download_and_extract(url, dir_name)


if __name__ == '__main__':
    # for testing only, this is intended as a module
    dl_ml_small()
    dl_ml_latest()