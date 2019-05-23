const usersService = require('../services/users');
const logger = require('../logger');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
  try {
    const { body } = req;
    bcrypt.hash(body.password, 10, (err, hash) => {
      body.password = hash;
    });
    const newUserPost = await usersService.register(body);
    logger.info(`${req.firstName} ${req.lastName}`);
    res.json(newUserPost);
  } catch (error) {
    next(error);
  }
};
