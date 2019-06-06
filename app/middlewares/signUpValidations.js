const { check } = require('express-validator/check');

exports.signUpValidation = [
  check('password')
    .exists()
    .withMessage('password field is empty')
    .isAlphanumeric()
    .withMessage('password must be alphanumeric')
    .isLength({ min: 8 })
    .withMessage('password must have 8 characters or more'),

  check('email')
    .exists()
    .withMessage('email field is empty')
    .custom(value => value.includes('@wolox.com.ar'))
    .withMessage('Body must contain email and have Wolox domain.'),

  check('firstName')
    .exists()
    .withMessage("Body must contain the user's full name.")
    .isLength({ min: 1 })
    .withMessage("Body must contain the user's full name."),

  check('lastName')
    .exists()
    .withMessage("Body must contain the user's full name.")
    .isLength({ min: 1 })
    .withMessage("Body must contain the user's full name.")
];
