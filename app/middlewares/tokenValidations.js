const jwt = require('jsonwebtoken');

const { check } = require('express-validator/check');
const { query } = require('express-validator/check');

exports.tokenIsValid = [
  check('token')
    .exists()
    .withMessage('User Not Authorized')
    .custom(value => jwt.verify(value, 'somethingSecretForTokens'))
    .withMessage('Bad Token'),

  query('limit')
    .exists()
    .withMessage('Limit of pagination is empty.')
    .not()
    .equals('0')
    .withMessage('Limit can not be 0.')
    .isLength({ min: 1 })
    .withMessage('Limit must have a number of pages.')
];
