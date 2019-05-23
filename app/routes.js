const { healthCheck } = require('./controllers/healthCheck');
const users = require('./controllers/users');
const validationUser = require('./middlewares/signUpValidations');
const validation = require('./middlewares/validations');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [validationUser.signUpValidation, validation.validate.validations], users.register);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
