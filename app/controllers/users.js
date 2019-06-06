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
      return res.status(400).send({ message: newUser.message.errors[0].message });
    }
    return res.status(201).send();
  } catch (error) {
    return next(error);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const findUserToken = await usersService.findAndReturnToken(req.body);
    if (findUserToken) {
      return res.send({ token: findUserToken });
    }
    return res.status(400).send({ message: 'User or password incorrect' });
  } catch (err) {
    return next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const pages = req.query.limit;
    const listUsers = await usersService.list(pages);
    return res.send(listUsers);
  } catch (error) {
    return next(error);
  }
};

exports.registerAdmin = async (req, res, next) => {
  try {
    const { body } = req;
    const hash = bcrypt.hashSync(body.password, 10);
    body.password = hash;
    await usersService.registerAdmin(body);
    return res.status(201).send();
  } catch (err) {
    return next(err);
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
      return res.status(200).send(newPurchase);
    }
    return res.status(404).send();
  } catch (err) {
    return next(err);
  }
};

exports.listBoughtAlbums = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const albumsList = await usersService.listBoughtAlbums(userId);
    if (albumsList.length >= 1) {
      return res.status(200).send(albumsList);
    }
    return res.status(200).send({ message: 'User does not have any purchase.' });
  } catch (err) {
    return next(err);
  }
};

exports.listPhotosBoughtAlbums = async (req, res, next) => {
  try {
    const albumPhotos = await albumsService.getPictures(req);
    if (albumPhotos.length >= 1) {
      return res.status(200).send(albumPhotos);
    }
    return res.status(200).send({ message: 'This album does not have any photos.' });
  } catch (err) {
    return next(err);
  }
};

exports.invalidateSessions = async (req, res, next) => {
  try {
    const success = await usersService.invalidateSessions(req.user.id);
    if (success) {
      return res.status(200).send();
    }
    return res.status(400).send({ message: 'Session could not be invalidated.' });
  } catch (err) {
    return next(err);
  }
};
