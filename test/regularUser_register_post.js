const request = require('supertest');
const dictum = require('dictum.js');
const { factory } = require('factory-girl');

const app = require('../app');
const User = require('../app/models').users;

factory.define('User', User, {
  firstName: factory.chance('word'),
  lastName: factory.chance('word'),
  email: factory.sequence('User.email', n => `dummy-user-${n}@wolox.com.ar`),
  password: 'some65password'
});

describe('/users POST', () => {
  it('test 01: should be fail sign up an user because email is empty', async () => {
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

  it("test 02 : should be fail sign up an user because there isn't email field", () =>
    request(app)
      .post('/users')
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

  it("test 07 : should be fail sign up an user because there isn't password field", () =>
    request(app)
      .post('/users')
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

  it("test 08 : should be fail sign up an user because there isn't firstName field", () =>
    request(app)
      .post('/users')
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

  it("test 09 : should be fail sign up an user because there isn't lastName field", () =>
    request(app)
      .post('/users')
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

  it('test 12 : should be success sign up an user because all params are ok', async () => {
    const userNew = await factory.build('User').then(user => user);
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .expect(201)
      .then(response =>
        User.findOne({ where: { email: userNew.dataValues.email } }).then(res => {
          console.log(res.firstName);
          expect(res.firstName).toBe(userNew.dataValues.firstName);
          dictum.chai(response);
        })
      );
  });

  it('test 11 : should be fail sign up an user because email must be unique', async () => {
    const userNew = await factory.build('User').then(user => user);
    const userTwo = await factory.build('User').then(user => user);
    userTwo.dataValues.email = userNew.email;
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .then(() =>
        request(app)
          .post('/users')
          .send(userTwo.dataValues)
          .expect(400)
          .then(response => expect(response.body.message).toMatch(/email must be unique/))
          .then(() =>
            User.findOne({ where: { email: 'juanrepeated@wolox.com.ar', firstName: 'JuanCarlos' } }).then(
              res => expect(res).toBe(null)
            )
          )
      );
  });

  it('test 12 : should be fail sign up an user because isAdmin is sent and user is regular', async () => {
    const userNew = await factory.build('User').then(user => user);
    userNew.dataValues.isAdmin = true;
    return request(app)
      .post('/users')
      .send(userNew.dataValues)
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/can not be admin/))
      .then(() =>
        User.findOne({ where: { email: userNew.dataValues.email } }).then(res => expect(res).toBe(null))
      );
  });
});
