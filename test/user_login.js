const request = require('supertest');
const dictum = require('dictum.js');
const { factory } = require('factory-girl');

const app = require('../app');

describe('/users/sessions POST', () => {
  it('test 01: should be fail sign in an user because email is empty', () =>
    request(app)
      .post('/users/sessions')
      .send({
        email: '',
        password: '1234asdf'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/email/)));

  it("test 02 : should be fail sign in an user because there isn't email field", () =>
    request(app)
      .post('/users/sessions')
      .send({
        password: '1234asdf'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/email/)));

  it('test 03 : should be fail sign in an user because email is not a Wolox domain', () =>
    request(app)
      .post('/users/sessions')
      .send({
        email: 'juan@hotmail.com',
        password: '1234asdf'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/email/)));

  it('test 04 : should be fail sign in an user because password is empty', () =>
    request(app)
      .post('/users/sessions')
      .send({
        email: 'juan@wolox.com.ar',
        password: ''
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/)));

  it("test 05 : should be fail sign in an user because there isn't password field", () =>
    request(app)
      .post('/users/sessions')
      .send({
        email: 'juan3@wolox.com.ar'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/)));

  it('test 06 : should be fail sign in because email is not registered on database', async () => {
    const userNew = await factory.build('User').then(user => user);
    const userAnother = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: userAnother.dataValues.email,
            password: userAnother.dataValues.password
          })
          .expect(400)
          .then(response => expect(response.text).toMatch(/User or password incorrect/))
      );
  });

  it('test 07 : should be fail sign in an user because password is not ok', async () => {
    const userNew = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: userNew.dataValues.email,
            password: 'asdfafdsa5323453'
          })
          .expect(400)
          .then(response => expect(response.text).toMatch(/User or password incorrect/))
      );
  });

  it('test 08 : should be success sign in because user is registered and email and password are ok', async () => {
    const userNew = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: userNew.dataValues.email,
            password: userNew.dataValues.password
          })
          .expect(200)
          .then(response => {
            expect(response.body.token.length).toBeGreaterThanOrEqual(22);
            dictum.chai(response);
          })
      );
  });
});
