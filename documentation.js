const dictum = require('dictum.js');

dictum.document({
  description: 'Sign up an user adding it to the database',
  endpoint: '/users',
  method: 'POST',
  requestHeaders: {},
  requestBodyParams: {
    firstname: 'not null parameter',
    lastname: 'not null parameter',
    password: 'alphanumeric parameter',
    email: 'unique parameter'
  },
  responseStatus: 200,
  responseHeaders: {},
  responseBody: {
    firstname: 'not null parameter',
    lastname: 'not null parameter',
    password: 'alphanumeric parameter',
    email: 'unique parameter'
  },
  resource: 'User Sign Up'
});
