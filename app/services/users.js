const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const hashing = require('random-hash');

const errors = require('../errors');
const User = require('../models').users;
const Purchase = require('../models').purchases;

exports.register = user => User.create(user).catch(errors.databaseError);

exports.findAndReturnToken = user =>
  User.findOne({ where: { email: user.email } })
    .then(async response => {
      if (response !== null) {
        const match = bcrypt.compareSync(user.password, response.dataValues.password);
        const hashToken = hashing.generateHash({ length: 20 });
        if (match) {
          const token = jwt.sign(
            {
              id: response.dataValues.id,
              email: response.dataValues.email,
              password: response.dataValues.password,
              firstName: response.dataValues.firstName,
              lastName: response.dataValues.lastName,
              hash: hashToken
            },
            'somethingSecretForTokens',
            { expiresIn: 320 }
          );
          await User.update({ hash: hashToken }, { where: { email: user.email } }).catch(
            errors.databaseError
          );
          return token;
        }
        return null;
      }
      return null;
    })
    .catch(errors.databaseError);

exports.list = pages =>
  User.findAll({
    attributes: ['firstName', 'lastName', 'email'],
    limit: pages
  })
    .then(response => response)
    .catch(errors.databaseError);

exports.registerAdmin = user =>
  User.findOrCreate({
    where: { email: user.email },
    defaults: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      isAdmin: true
    }
  })
    .then(async register => {
      if (!register[1]) {
        await User.update({ isAdmin: true }, { where: { email: register[0].email } }).catch(
          errors.databaseError
        );
      }
    })
    .catch(errors.databaseError);

exports.buyAlbum = album => Purchase.create(album).catch(errors.databaseError);

exports.listBoughtAlbums = async userId => {
  const user = await User.findOne({ where: { id: userId } }).then(res => res.dataValues);
  if (user.isAdmin) {
    return Purchase.findAll().catch(errors.databaseError);
  }
  return Purchase.findAll({
    where: { id: user.id }
  }).catch(errors.databaseError);
};

exports.invalidateSessions = userId => {
  const newHash = hashing.generateHash({ length: 20 });
  return User.update({ hash: newHash }, { where: { id: userId } }).catch(err => {
    throw errors.databaseError(err);
  });
};
