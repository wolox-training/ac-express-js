const albumService = require('../services/albums');

exports.getAlbums = async (req, res, next) => {
  try {
    const albumsRequest = await albumService.getAlbums();
    res.send(albumsRequest);
  } catch (error) {
    next(error);
  }
};

exports.getPictures = async (req, res, next) => {
  try {
    const picturesRequest = await albumService.getPictures(req);
    res.send(picturesRequest);
  } catch (error) {
    next(error);
  }
};
