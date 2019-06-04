const { check } = require('express-validator/check');

exports.isRegularUser = [
  check('isAdmin')
    .not()
    .exists()
    .withMessage('Regular user can not be admin.')
];
