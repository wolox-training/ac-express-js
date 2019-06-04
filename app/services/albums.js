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
  if (req.query.albumId) {
    const url = `${config.common.apiAlbums}albums/${req.query.albumId}`;
    return fetch(url)
      .then(response => response.json())
      .catch(errors.defaultError);
  }
  throw errors.defaultError('Please, introduce a not empty album ID');
};
