const { param } = require('express-validator/check');

exports.albumIdValidation = [
  param('id')
    .isInt({ min: 1, max: 100 })
    .withMessage('Album Id must be between 1 and 100.')
];
