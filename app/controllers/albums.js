const albumsService = require('../services/albums');

exports.getAlbums = async (req, res, next) => {
  try {
    const albums = await albumsService.getAlbums(req.query);
    res.send(albums);
  } catch (error) {
    next(error);
  }
};

exports.getPictures = async (req, res, next) => {
  try {
    const pictures = await albumsService.getPictures(req);
    res.send(pictures);
  } catch (error) {
    next(error);
  }
};
