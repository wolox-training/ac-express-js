const bcrypt = require('bcrypt');

const usersService = require('../services/users');
const logger = require('../logger');

exports.register = async (req, res, next) => {
  try {
    const { body } = req;
    const hash = bcrypt.hashSync(body.password, 10);
    body.password = hash;
    const newUser = await usersService.register(body);
    logger.info(`${body.firstName} ${body.lastName} ${body.password}`);
    if (newUser.message && newUser.message.errors[0].message) {
      res.status(400).send({ message: newUser.message.errors[0].message });
    }
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const findUserToken = await usersService.findAndReturnToken(req.body);
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
    res.send(listUsers);
  } catch (error) {
    next(error);
  }
};

exports.registerAdmin = async (req, res, next) => {
  try {
    const { body } = req;
    const hash = bcrypt.hashSync(body.password, 10);
    body.password = hash;
    await usersService.registerAdmin(body);
    res.status(201).send();
  } catch (err) {
    next(err);
  }
};
