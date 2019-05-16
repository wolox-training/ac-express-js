const fetch = require('node-fetch');

const errors = require('../errors');

exports.getAlbums = () =>
  fetch('https://jsonplaceholder.typicode.com/albums')
    .then(response => response.json())
    .catch(errors.defaultError);

exports.getPictures = req => {
  if (req.query.albumId) {
    const url = `https://jsonplaceholder.typicode.com/albums/:id/photos?albumId=${req.query.albumId}`;
    return fetch(url)
      .then(response => response.json())
      .catch(errors.defaultError);
  }
  throw errors.defaultError('Please, introduce a valid parameter');
};
