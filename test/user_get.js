const request = require('supertest');

const app = require('../app');

describe('GET /users', () => {
  it('test 01 : should be fail because token is incorrect', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan11@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan11@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(() => {
            request(app)
              .get('/users?limit=23')
              .send({
                token: '5456454'
              })
              .expect(400)
              .then(response => expect(response.body.message).toMatch(/Bad Token/));
          })
      ));

  it('test 02 : should be fail because token field is empty', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan123@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan123@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(() => {
            request(app)
              .get('/users?limit=23')
              .send({})
              .expect(400)
              .then(response => expect(response.body.message).toMatch(/Authorized/));
          })
      ));

  it('test 03 : should be success because token is correct', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan124@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan124@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(response =>
            request(app)
              .get('/users?limit=23')
              .send({
                token: response.body.token
              })
              .expect(200)
              .then(res => expect(res.body).toHaveLength(1))
          )
      ));

  it('test 04 : should be success because limit is 2 and there is 2 users showed', () =>
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
          .post('/users')
          .send({
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juan125asdad@wolox.com.ar',
            password: '1235asdf65asd'
          })
          .then(() =>
            request(app)
              .post('/users/sessions')
              .send({
                email: 'juan125@wolox.com.ar',
                password: '1235asdf65asd'
              })
              .then(response =>
                request(app)
                  .get('/users?limit=2')
                  .send({
                    token: response.body.token
                  })
                  .expect(200)
                  .then(res => expect(res.body).toHaveLength(2))
              )
          )
      ));

  it('test 05 : should be success because limit is 1 and there is 1 users showed but 2 users registered', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan1288@wolox.com.ar',
        password: '1235asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users')
          .send({
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juan1299asdad@wolox.com.ar',
            password: '1235asdf65asd'
          })
          .then(() =>
            request(app)
              .post('/users/sessions')
              .send({
                email: 'juan1299asdad@wolox.com.ar',
                password: '1235asdf65asd'
              })
              .then(response =>
                request(app)
                  .get('/users?limit=1')
                  .send({
                    token: response.body.token
                  })
                  .expect(200)
                  .then(res => expect(res.body).toHaveLength(1))
              )
          )
      ));

  it('test 06 : should be fail because limit of pages field is empty', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan126@wolox.com.ar',
        password: '1264asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan126@wolox.com.ar',
            password: '1264asdf65asd'
          })
          .then(response =>
            request(app)
              .get('/users')
              .send({
                token: response.body.token
              })
              .expect(400)
              .then(res => expect(res.body.message).toMatch(/pagination is empty/))
          )
      ));

  it('test 07 : should be fail because limit of pages field is 0', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan127@wolox.com.ar',
        password: '1274asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan127@wolox.com.ar',
            password: '1274asdf65asd'
          })
          .then(response =>
            request(app)
              .get('/users?limit=0')
              .send({
                token: response.body.token
              })
              .expect(400)
              .then(res => expect(res.body.message).toMatch(/can not be 0/))
          )
      ));

  it('test 08 : should be fail because limit of pages field has no value', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan127@wolox.com.ar',
        password: '1274asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan127@wolox.com.ar',
            password: '1274asdf65asd'
          })
          .then(response =>
            request(app)
              .get('/users?limit=')
              .send({
                token: response.body.token
              })
              .expect(400)
              .then(res => expect(res.body.message).toMatch(/number of pages/))
          )
      ));
});
