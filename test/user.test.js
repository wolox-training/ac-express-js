const request = require('supertest');
const dictum = require('dictum.js');

const app = require('../app');

describe('/users POST', () => {
  it('test 01: should be fail sign up an user because email is empty', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: '',
        password: '1234asdf'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/email/)));

  it("test 02 : should be fail sign up a user because there isn't email field", () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        password: '1234asdf'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/email/)));

  it('test 03 : should be fail sign up a user because email is not a Wolox domain', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@hotmail.com',
        password: '1234asdf'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/email/)));

  it('test 04 : should be fail sign up a user because password is empty', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@wolox.com.ar',
        password: ''
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/)));

  it('test 05 : should be fail sign up a user because password is not alphanumeric', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan1@wolox.com.ar',
        password: '123456$$as'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/)));

  it('test 06 : should be fail sign up a user because password has less than 8 characters', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan2@wolox.com.ar',
        password: '123asd'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/)));

  it("test 07 : should be fail sign up a user because there isn't password field", () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan3@wolox.com.ar'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/)));

  it("test 08 : should be fail sign up a user because there isn't firstName field", () =>
    request(app)
      .post('/users')
      .send({
        lastName: 'Perez',
        email: 'juan4@wolox.com.ar',
        password: '12312asasasd'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/name/)));

  it("test 09 : should be fail sign up a user because there isn't lastName field", () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        email: 'juan5@wolox.com.ar',
        password: '123654654asd'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/name/)));

  it('test 10 : should be success sign up a user because all params are ok', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: '10okjuan10@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .expect(200)
      .then(response => {
        expect(response.ok).toBe(true);
        dictum.chai(response);
      }));

  it('test 11 : should be fail sign up a user because email must be unique', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juanrepeated@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users')
          .send({
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juanrepeated@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .expect(200)
          .then(response => expect(response.body.message.errors[0].message).toMatch(/email must be unique/))
      ));
});
