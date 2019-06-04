const { query } = require('express-validator/check');

exports.pagination = [
  query('limit')
    .exists()
    .withMessage('Limit of pagination is empty.')
    .not()
    .equals('0')
    .withMessage('Limit can not be 0.')
    .isLength({ min: 1 })
    .withMessage('Limit must have a number of pages.')
];
