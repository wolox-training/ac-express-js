const bcrypt = require('bcrypt');

const usersService = require('../services/users');
const errors = require('../errors');
const logger = require('../logger');

exports.register = async (req, res, next) => {
  try {
    const regexIsAlphanumeric = /^[a-zA-Z0-9]*$/;
    const { body } = req;
    if (!body.email || !body.email.includes('@wolox.com.ar')) {
      throw errors.badRequest('Body must contain email and have Wolox domain');
    }
    if (!body.password || !(body.password.length >= 8) || !regexIsAlphanumeric.test(body.password)) {
      throw errors.badRequest('Body must contain password with 8 characters or more and be alphanumeric');
    }
    if (!body.firstName || !body.lastName) {
      throw errors.badRequest("Body must contain the user's full name");
    }
    bcrypt.hash(body.password, 10, (err, hash) => {
      body.password = hash;
    });
    const newUserPost = await usersService.register(body);
    logger.info(`${body.firstName} ${body.lastName}`);
    res.json(newUserPost);
  } catch (error) {
    next(error);
  }
};
