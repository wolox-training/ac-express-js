const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

exports.tokenValidation = (req, res, next) => {
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
      req.user = jwt_decode(token);
      next();
    } else {
      res.status(400).send('Bad Token');
    }
  } else {
    res.status(400).send('User Not Authorized');
  }
};
