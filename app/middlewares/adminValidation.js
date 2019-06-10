const { check } = require('express-validator/check');

exports.isRegularUser = [
  check('isAdmin')
    .custom(value => value === false || !value)
    .withMessage('Regular user can not be admin.')
];
