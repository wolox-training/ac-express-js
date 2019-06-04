const bcrypt = require('bcrypt');

const usersService = require('../services/users');
const albumsService = require('../services/albums');
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

exports.buyAlbum = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const albumId = req.params;
    const album = await albumsService.getAlbums(albumId);
    const purchasedAlbum = {
      albumId: album[0].id,
      title: album[0].title,
      id: userId
    };
    const newPurchase = await usersService.buyAlbum(purchasedAlbum);
    if (newPurchase) {
      res.status(200).send(newPurchase);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};

exports.listBoughtAlbums = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    console.log(userId);
    const albumsList = await usersService.listBoughtAlbums(userId);
    // console.log(albumsList);
    if (albumsList.length >= 1) {
      res.status(200).send(albumsList);
    } else {
      res.status(200).send({ message: 'User does not have any purchase.' });
    }
  } catch (err) {
    next(err);
  }
};
