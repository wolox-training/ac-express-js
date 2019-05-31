const { healthCheck } = require('./controllers/healthCheck');
const album = require('./controllers/albums');
const users = require('./controllers/users');
const validationUser = require('./middlewares/signUpValidations');
const validationSignIn = require('./middlewares/signInValidations');
const validationToken = require('./middlewares/tokenValidations');
const validationNotAdmin = require('./middlewares/adminValidation');
const validationPagination = require('./middlewares/paginationValidation');
const validationAlbumId = require('./middlewares/albumIdValidation');
const validation = require('./middlewares/validations');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', album.getAlbums);
  app.get('/albums/:id/photos', album.getPictures);
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
    [validationPagination.pagination, validation.validate.validations, validationToken.tokenValidation],
    users.list
  );
  app.post(
    '/admin/users',
    [validationUser.signUpValidation, validation.validate.validations, validationToken.tokenValidation],
    users.registerAdmin
  );
  app.post(
    '/albums/:id',
    [validationAlbumId.albumIdValidation, validation.validate.validations, validationToken.tokenValidation],
    users.buyAlbum
  );
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
