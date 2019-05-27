const usersService = require('../services/users');
const logger = require('../logger');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
  try {
    const { body } = req;
    const hash = bcrypt.hashSync(body.password, 10);
    body.password = hash;
    const newUserPost = await usersService.register(body);
    logger.info(`${body.firstName} ${body.lastName} ${body.password}`);
    res.json(newUserPost);
  } catch (error) {
    next(error);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const findUserToken = await usersService.find(req.body);
    if (findUserToken) {
      res.send({ token: findUserToken });
    } else {
      res.status(400).send({ message: 'User or password incorrect' });
    }
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const pages = req.query.limit;
    const listUsers = await usersService.list(pages);
    res.json(listUsers);
  } catch (error) {
    next(error);
  }
};
