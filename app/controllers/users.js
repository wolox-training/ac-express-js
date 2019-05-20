const userService = require('../services/users');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
  try {
    const regex = /^[a-zA-Z0-9]*$/;
    if (
      req.body.email.includes('@wolox.com.ar') &&
      req.body.password.length >= 8 &&
      regex.test(req.body.password)
    ) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        req.body.password = hash;
      });
      const newUserPost = await userService.register(req.body);
      console.log(`${req.body.firstName} ${req.body.lastName}`);
      res.json(newUserPost);
    } else {
      res.end();
    }
  } catch (error) {
    next(error);
  }
};
