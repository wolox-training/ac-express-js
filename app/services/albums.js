const fetch = require('node-fetch');

const errors = require('../errors');

exports.getAlbums = () =>
  fetch(`${process.env.API}albums/`)
    .then(response => response.json())
    .catch(errors.defaultError);

exports.getPictures = req => {
  if (req.query.albumId) {
    const url = `${process.env.API}albums/${req.query.albumId}`;
    return fetch(url)
      .then(response => response.json())
      .catch(errors.defaultError);
  }
  throw errors.defaultError('Please, introduce a not empty album ID');
};
