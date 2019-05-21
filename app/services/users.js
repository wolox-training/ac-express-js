const errors = require('../errors');
const User = require('../models').users;

exports.register = user => User.create(user).catch(errors.databaseError);
