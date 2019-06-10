const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

const User = require('../models').users;

exports.tokenValidation = async (req, res, next) => {
  let tokenIsValid = false;
  if (req.headers.authorization) {
    let token = req.headers.authorization;
    if (token.startsWith('Bearer')) {
      token = token.slice(7);
    }
    if (token.length < 22) {
      return res.status(400).send('Bad Token');
    }
    try {
      tokenIsValid = jwt.verify(token, 'somethingSecretForTokens');
    } catch (err) {
      if (err.message === 'jwt expired') {
        return res.status(400).send('Token expired. Please, log in.');
      }
      return res.status(400).send('Bad Token');
    }
    if (tokenIsValid) {
      const userDecoded = jwt_decode(token);
      const tokenHashDataBase = await User.findOne({ where: { email: userDecoded.email } }).then(
        resp => resp && resp.dataValues.hash
      );
      if (!tokenHashDataBase) {
        return res.status(400).send('User is not registered.');
      }
      const tokenReqHash = userDecoded.hash;
      if (tokenHashDataBase === tokenReqHash) {
        req.user = userDecoded;
        return next();
      }
      return res.status(400).send('Token is old.');
    }
    return res.status(400).send('Bad Token');
  }
  return res.status(400).send('User Not Authorized');
};
