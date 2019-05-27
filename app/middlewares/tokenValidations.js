const jwt = require('jsonwebtoken');

const { query } = require('express-validator/check');

exports.tokenIsValid = [
  query('limit')
    .exists()
    .withMessage('Limit of pagination is empty.')
    .not()
    .equals('0')
    .withMessage('Limit can not be 0.')
    .isLength({ min: 1 })
    .withMessage('Limit must have a number of pages.')
];

exports.headers = (req, res, next) => {
  if (req.headers.authorization) {
    let token = req.headers.authorization;
    if (token.startsWith('Bearer')) {
      token = token.slice(7);
    }
    if (token.length < 22) {
      res.status(400).send('Bad Token');
    }
    const tokenIsValid = jwt.verify(token, 'somethingSecretForTokens');
    if (tokenIsValid) {
      next();
    } else {
      res.status(400).send('Bad Token');
    }
  } else {
    res.status(400).send('User Not Authorized');
  }
};
