const request = require('supertest');
const dictum = require('dictum.js');

const app = require('../app');
const User = require('../app/models').users;
const users = require('../app/services/users');

describe('/users POST (emails)', () => {
  it('test 01 : should be success sending a Welcome email because all params are ok', () => {
    users.sendEmail = jest.fn();
    return request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: '10okjuan10@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .expect(201)
      .then(response =>
        User.findOne({ where: { email: '10okjuan10@wolox.com.ar' } })
          .then(res => {
            expect(res.firstName).toBe('Juan');
            dictum.chai(response);
          })
          .then(() => {
            expect(users.sendEmail).toHaveBeenCalled();
            dictum.chai(response);
          })
      );
  });
});
