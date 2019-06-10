const { check } = require('express-validator/check');

exports.signInValidation = [
  check('password')
    .exists()
    .withMessage('password field is empty')
    .isLength({ min: 8 })
    .withMessage('password field is empty'),

  check('email')
    .exists()
    .withMessage('email field is empty')
    .custom(value => value.includes('@wolox.com.ar'))
    .withMessage('Body must contain email and have Wolox domain.')
];
