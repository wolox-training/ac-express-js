const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const errors = require('../errors');
const User = require('../models').users;
const Purchase = require('../models').purchases;

exports.register = user => User.create(user).catch(errors.databaseError);

exports.findAndReturnToken = user =>
  User.findOne({ where: { email: user.email } })
    .then(response => {
      if (response !== null) {
        const match = bcrypt.compareSync(user.password, response.dataValues.password);
        if (match) {
          const token = jwt.sign(
            {
              id: response.dataValues.id,
              email: response.dataValues.email,
              password: response.dataValues.password,
              firstName: response.dataValues.firstName,
              lastName: response.dataValues.lastName
            },
            'somethingSecretForTokens'
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
    .then(register => {
      if (!register[1]) {
        User.update({ isAdmin: true }, { where: { email: register[0].email } });
      }
    })
    .catch(errors.databaseError);

exports.buyAlbum = album => Purchase.create(album).catch(errors.databaseError);
