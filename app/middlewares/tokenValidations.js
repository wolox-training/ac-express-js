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
      res.status(400).send('Bad Token');
    } else {
      tokenIsValid = jwt.verify(token, 'somethingSecretForTokens');

      if (tokenIsValid) {
        const userDecoded = jwt_decode(token);
        const tokenHashDataBase = await User.findOne({ where: { email: userDecoded.email } }).then(
          resp => resp.dataValues.hash
        );
        const tokenReqHash = userDecoded.hash;
        if (tokenHashDataBase === tokenReqHash) {
          req.user = userDecoded;
          next();
        } else {
          res.status(400).send('Token is old.');
        }
      } else {
        res.status(400).send('Bad Token');
      }
    }
  } else {
    res.status(400).send('User Not Authorized');
  }
};
