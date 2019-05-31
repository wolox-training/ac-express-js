const albumsService = require('../services/albums');

exports.getAlbums = (req, res, next) =>
  albumsService
    .getAlbums()
    .then(response => res.send(response))
    .catch(error => next(error));

exports.getPictures = (req, res, next) =>
  albumsService
    .getPictures(req)
    .then(response => res.send(response))
    .catch(error => next(error));
