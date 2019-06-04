const fetch = require('node-fetch');

const errors = require('../errors');
const config = require('../../config');

exports.getAlbums = req => {
  let endpoint = 'albums';
  if (req.id) {
    endpoint = `albums/?id=${req.id}`;
  }
  return fetch(`${config.common.apiAlbums}${endpoint}`)
    .then(response => response.json())
    .catch(errors.defaultError);
};

exports.getPictures = req => {
  let url = `${config.common.apiAlbums}albums/1/photos`;
  if (req.query.albumId) {
    url = `${config.common.apiAlbums}albums/${req.query.albumId}`;
  } else if (req.params.id) {
    url = `${config.common.apiAlbums}albums/1/photos?albumId=${req.params.id}`;
  } else {
    throw errors.defaultError('Please, introduce a not empty album ID');
  }
  return fetch(url)
    .then(response => response.json())
    .catch(errors.defaultError);
};
