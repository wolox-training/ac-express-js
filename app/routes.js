const { healthCheck } = require('./controllers/healthCheck');
const users = require('./controllers/users');
const validationUser = require('./middlewares/signUpValidations');
const validationSignIn = require('./middlewares/signInValidations');
const validationToken = require('./middlewares/tokenValidations');
const validationNotAdmin = require('./middlewares/adminValidation');
const validation = require('./middlewares/validations');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post(
    '/users',
    [validationUser.signUpValidation, validationNotAdmin.isRegularUser, validation.validate.validations],
    users.register
  );
  app.post(
    '/users/sessions',
    [validationSignIn.signInValidation, validation.validate.validations],
    users.signIn
  );
  app.get(
    '/users',
    [validationToken.pagination, validation.validate.validations, validationToken.headers],
    users.list
  );
  app.post(
    '/admin/users',
    [validationUser.signUpValidation, validation.validate.validations, validationToken.headers],
    users.registerAdmin
  );
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
