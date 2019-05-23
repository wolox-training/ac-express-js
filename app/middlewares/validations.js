const { validationResult } = require('express-validator/check');

exports.validate = {
  validations: (req, res, next) => {
    try {
      const result = validationResult(req);
      console.log(`errors is empty: ${result.isEmpty()}`);
      if (result.isEmpty()) {
        next();
      } else {
        result.throw();
      }
      res.status(200);
    } catch (err) {
      const map = err.array();
      console.log(map);
      res.status(400).send({ message: map[0].msg });
    }
  }
};
