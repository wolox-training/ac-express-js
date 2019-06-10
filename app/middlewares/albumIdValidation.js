const { param } = require('express-validator/check');

const Purchase = require('../models').purchases;

exports.albumIdValidation = [
  param('id')
    .isInt({ min: 1, max: 100 })
    .withMessage('Album Id must be between 1 and 100.')
];

exports.buyAnAlbumTwiceValidation = async (req, res, next) => {
  const userId = parseInt(req.user.id);
  const albumIdReq = parseInt(req.params.id);
  const alreadyBought = await Purchase.findOne({ where: { albumId: albumIdReq, id: userId } });
  if (alreadyBought) {
    res.status(400).send('You can not buy twice the same album.');
  } else {
    next();
  }
};
