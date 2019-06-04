const request = require('supertest');
const dictum = require('dictum.js');

const app = require('../app');
const User = require('../app/models').users;

describe('/admin/users POST', () => {
  it('test 01: should be fail sign up an admin user because email is empty', () =>
    request(app)
      .post('/admin/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: '',
        password: '1234asdf'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/email/))
      .then(() => User.findOne({ where: { email: '' } }).then(res => expect(res).toBe(null))));

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

  it('test 03 : should be fail sign up an admin user because email is not a Wolox domain', () =>
    request(app)
      .post('/admin/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@hotmail.com',
        password: '1234asdf'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/email/))
      .then(() =>
        User.findOne({ where: { email: 'juan@wolox.com.ar' } }).then(res => expect(res).toBe(null))
      ));

  it('test 04 : should be fail sign up an admin user because password is empty', () =>
    request(app)
      .post('/admin/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@wolox.com.ar',
        password: ''
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/))
      .then(() =>
        User.findOne({ where: { email: 'juan@wolox.com.ar' } }).then(res => expect(res).toBe(null))
      ));

  it('test 05 : should be fail sign up an admin user because password is not alphanumeric', () =>
    request(app)
      .post('/admin/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan1@wolox.com.ar',
        password: '123456$$as'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/))
      .then(() =>
        User.findOne({ where: { email: 'juan1@wolox.com.ar' } }).then(res => expect(res).toBe(null))
      ));

  it('test 06 : should be fail sign up an admin user because password has less than 8 characters', () =>
    request(app)
      .post('/admin/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan2@wolox.com.ar',
        password: '123asd'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/password/))
      .then(() =>
        User.findOne({ where: { email: 'juan2@wolox.com.ar' } }).then(res => expect(res).toBe(null))
      ));

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

  it('test 10 : should be fail sign up an admin user because there firstName is empty', () =>
    request(app)
      .post('/admin/users')
      .send({
        firstName: '',
        lastName: 'Perez',
        email: 'juan4@wolox.com.ar',
        password: '12312asasasd'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/name/))
      .then(() =>
        User.findOne({ where: { email: 'juan4@wolox.com.ar' } }).then(res => expect(res).toBe(null))
      ));

  it('test 11 : should be fail sign up an admin user because there lastName is empty', () =>
    request(app)
      .post('/admin/users')
      .send({
        firstName: 'Juan',
        lastName: '',
        email: 'juan5@wolox.com.ar',
        password: '123654654asd'
      })
      .expect(400)
      .then(response => expect(response.body.message).toMatch(/name/))
      .then(() =>
        User.findOne({ where: { email: 'juan5@wolox.com.ar' } }).then(res => expect(res).toBe(null))
      ));

  it('test 12 : should be success because user is authenticated and register himself as admin', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan456adf54s6f5s465@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan456adf54s6f5s465@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(response =>
            request(app)
              .post('/admin/users')
              .set('Authorization', response.body.token)
              .send({
                firstName: 'Juan',
                lastName: 'Perez',
                email: 'juan456adf54s6f5s465@wolox.com.ar',
                password: '1234asdf65asd'
              })
              .expect(201)
              .then(resp =>
                User.findOne({ where: { email: 'juan456adf54s6f5s465@wolox.com.ar' } }).then(res => {
                  expect(res.isAdmin).toBe(true);
                  dictum.chai(resp);
                })
              )
          )
      ));

  it('test 13 : should be fail register as admin because token is incorrect and user is not authenticated', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan125@wolox.com.ar',
        password: '1235asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan125@wolox.com.ar',
            password: '1235asdf65asd'
          })
          .then(() =>
            request(app)
              .post('/admin/users')
              .set('Authorization', 'afsdfd')
              .send({
                firstName: 'Juan',
                lastName: 'Perez',
                email: 'juan125@wolox.com.ar',
                password: '1235asdf65asd'
              })
              .expect(400)
              .then(response => expect(response.text).toMatch(/Bad Token/))
              .then(() =>
                User.findOne({ where: { email: 'juan125@wolox.com.ar' } }).then(res =>
                  expect(res.isAdmin).toBe(false)
                )
              )
          )
      ));

  it('test 14 : should be success because user is authenticated and register someone else as an admin', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan126@wolox.com.ar',
        password: '1236asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan126@wolox.com.ar',
            password: '1236asdf65asd'
          })
          .then(response =>
            request(app)
              .post('/admin/users')
              .set('Authorization', response.body.token)
              .send({
                firstName: 'Teresa',
                lastName: 'Lopez',
                email: 'teresa@wolox.com.ar',
                password: '1236asdf65asd'
              })
              .expect(201)
              .then(() =>
                User.findOne({ where: { email: 'teresa@wolox.com.ar' } }).then(res =>
                  expect(res.isAdmin).toBe(true)
                )
              )
          )
      ));
});
