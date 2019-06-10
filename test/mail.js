const request = require('supertest');
const dictum = require('dictum.js');
const { factory } = require('factory-girl');

const app = require('../app');
const User = require('../app/models').users;
const users = require('../app/services/users');

describe('/users POST (emails)', () => {
  it('test 01 : should be success sending a Welcome email because all params are ok', async () => {
    users.sendEmail = jest.fn();
    const userNew = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .expect(201)
      .then(response =>
        User.findOne({ where: { email: userNew.dataValues.email } })
          .then(res => {
            expect(res.firstName).toBe(userNew.dataValues.firstName);
            dictum.chai(response);
          })
          .then(() => {
            expect(users.sendEmail).toHaveBeenCalled();
            dictum.chai(response);
          })
      );
  });
});
