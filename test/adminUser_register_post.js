const request = require('supertest');
const dictum = require('dictum.js');
const { factory } = require('factory-girl');

const app = require('../app');
const User = require('../app/models').users;

describe('/admin/users POST', () => {
  it('test 01: should be fail sign up an admin user because email is empty', async () => {
    const userNew = await factory.build('User').then(user => user);
    userNew.dataValues.email = '';
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/email/))
      .then(() =>
        User.findOne({ where: { email: userNew.dataValues.email } }).then(res => expect(res).toBe(null))
      );
  });

  it("test 02 : should be fail sign up an admin user because there isn't email field", () =>
    request(app)
      .post('/admin/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        password: '1234asdf'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/email/))
      .then(() => User.findOne({ where: { firstName: 'Juan' } }).then(res => expect(res).toBe(null))));

  it('test 03 : should be fail sign up an user because email is not a Wolox domain', async () => {
    const userNew = await factory.build('User').then(user => user);
    userNew.dataValues.email = 'juan@hotmail.com';
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/email/))
      .then(() =>
        User.findOne({ where: { email: userNew.dataValues.email } }).then(res => expect(res).toBe(null))
      );
  });

  it('test 04 : should be fail sign up an user because password is empty', async () => {
    const userNew = await factory.build('User').then(user => user);
    userNew.dataValues.password = '';
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/))
      .then(() =>
        User.findOne({ where: { email: userNew.dataValues.email } }).then(res => expect(res).toBe(null))
      );
  });

  it('test 05 : should be fail sign up an user because password is not alphanumeric', async () => {
    const userNew = await factory.build('User').then(user => user);
    userNew.dataValues.password = '123456$$as';
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/))
      .then(() =>
        User.findOne({ where: { email: userNew.dataValues.email } }).then(res => expect(res).toBe(null))
      );
  });

  it('test 06 : should be fail sign up an user because password has less than 8 characters', async () => {
    const userNew = await factory.build('User').then(user => user);
    userNew.dataValues.password = '123asd';
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/))
      .then(() =>
        User.findOne({ where: { email: userNew.dataValues.email } }).then(res => expect(res).toBe(null))
      );
  });

  it("test 07 : should be fail sign up an admin user because there isn't password field", () =>
    request(app)
      .post('/admin/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan3@wolox.com.ar'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/))
      .then(() =>
        User.findOne({ where: { email: 'juan3@wolox.com.ar' } }).then(res => expect(res).toBe(null))
      ));

  it("test 08 : should be fail sign up an admin user because there isn't firstName field", () =>
    request(app)
      .post('/admin/users')
      .send({
        lastName: 'Perez',
        email: 'juan4@wolox.com.ar',
        password: '12312asasasd'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/name/))
      .then(() =>
        User.findOne({ where: { email: 'juan4@wolox.com.ar' } }).then(res => expect(res).toBe(null))
      ));

  it("test 09 : should be fail sign up an admin user because there isn't lastName field", () =>
    request(app)
      .post('/admin/users')
      .send({
        firstName: 'Juan',
        email: 'juan5@wolox.com.ar',
        password: '123654654asd'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/name/))
      .then(() =>
        User.findOne({ where: { email: 'juan5@wolox.com.ar' } }).then(res => expect(res).toBe(null))
      ));

  it('test 10 : should be fail sign up an user because there firstName is empty', async () => {
    const userNew = await factory.build('User').then(user => user);
    userNew.dataValues.firstName = '';
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/name/))
      .then(() =>
        User.findOne({ where: { email: userNew.dataValues.email } }).then(res => expect(res).toBe(null))
      );
  });

  it('test 11 : should be fail sign up an user because there lastName is empty', async () => {
    const userNew = await factory.build('User').then(user => user);
    userNew.dataValues.lastName = '';
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/name/))
      .then(() =>
        User.findOne({ where: { email: userNew.dataValues.email } }).then(res => expect(res).toBe(null))
      );
  });

  it('test 12 : should be success because user is authenticated and register himself as admin', async () => {
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
          .then(response =>
            request(app)
              .post('/admin/users')
              .set('Authorization', response.body.token)
              .send(userNew.dataValues)
              .expect(201)
              .then(resp =>
                User.findOne({ where: { email: userNew.dataValues.email } }).then(res => {
                  dictum.chai(resp);
                  return expect(res.isAdmin).toBe(true);
                })
              )
          )
      );
  });

  it('test 13 : should be fail register as admin because token is incorrect and user isnt authenticated', async () => {
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
          .then(() =>
            request(app)
              .post('/admin/users')
              .set('Authorization', 'afsdfd')
              .send(userNew.dataValues)
              .expect(400)
              .then(response => expect(response.text).toMatch(/Bad Token/))
              .then(() =>
                User.findOne({ where: { email: userNew.dataValues.email } }).then(res =>
                  expect(res.isAdmin).toBe(false)
                )
              )
          )
      );
  });

  it('test 14 : should be success because user is authenticated and register someone else as an admin', async () => {
    const userNew = await factory.build('User').then(user => user);
    const userTwo = await factory.build('User').then(user => user);
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
          .then(response =>
            request(app)
              .post('/admin/users')
              .set('Authorization', response.body.token)
              .send(userTwo.dataValues)
              .expect(201)
              .then(() =>
                User.findOne({ where: { email: userTwo.dataValues.email } }).then(res =>
                  expect(res.isAdmin).toBe(true)
                )
              )
          )
      );
  });
});
