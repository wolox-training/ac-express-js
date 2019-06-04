const { param } = require('express-validator/check');

const User = require('../models').users;

exports.userIdValidation = [
  param('user_id')
    .isInt({ min: 1 })
    .withMessage('UserId can not be less than one.')
    .custom(userId => User.findOne({ where: { id: userId } }).then(res => res.dataValues))
    .withMessage('User does not exist')
];

exports.adminUserPurchasesValidation = async (req, res, next) => {
  const userLogged = await User.findOne({ where: { id: req.user.id } }).then(resp => resp.dataValues);
  if (!userLogged.isAdmin && parseInt(req.params.user_id) !== parseInt(userLogged.id)) {
    res.status(400).send("You do not have permissions to see other user's albums");
  }
  next();
};
