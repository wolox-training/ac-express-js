const fetch = require('node-fetch');

const errors = require('../errors');

exports.getAlbums = req => {
  let endpoint = 'albums';
  if (req.id) {
    endpoint = `albums/?id=${req.id}`;
  }
  return fetch(`${process.env.API}${endpoint}`)
    .then(response => response.json())
    .catch(errors.defaultError);
};

exports.getPictures = req => {
  if (req.query.albumId) {
    const url = `${process.env.API}albums/${req.query.albumId}`;
    return fetch(url)
      .then(response => response.json())
      .catch(errors.defaultError);
  }
  throw errors.defaultError('Please, introduce a not empty album ID');
};
