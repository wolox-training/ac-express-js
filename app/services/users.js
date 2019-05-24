const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const errors = require('../errors');
const User = require('../models').users;

exports.register = user => User.create(user).catch(errors.databaseError);

exports.find = user =>
  User.findOne({ where: { email: user.email } })
    .then(response => {
      if (response !== null) {
        const match = bcrypt.compareSync(user.password, response.dataValues.password);
        if (match) {
          const token = jwt.sign(
            {
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
