const request = require('supertest');

const app = require('../app');
const albums = require('../app/services/albums');

const Purchase = require('../app/models').purchases;

describe('GET (middlewares) /users/:user_id/albums/', () => {
  it('test 01 : should be fail list albums because token is incorrect', () =>
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
          .then(() =>
            request(app)
              .get('/users/1/albums/')
              .set('Authorization', '654654654654')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Bad Token/))
          )
      ));

  it('test 02 : should be fail list albums because token field is empty', () =>
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
          .then(() =>
            request(app)
              .get('/users/1/albums/')
              .set('Authorization', ' ')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Authorized/))
          )
      ));

  it('test 03 : should be fail list albums because token field has less than 22 characters', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan1asdasd23@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan1asdasd23@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(() =>
            request(app)
              .get('/users/1/albums/')
              .set('Authorization', '565')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Bad Token/))
          )
      ));

  it('test 04 : should be fail list albums because user Id is less than 1', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan1asdasd23@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan1asdasd23@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(response =>
            request(app)
              .get('/users/0/albums/')
              .set('Authorization', response.body.token)
              .send({})
              .expect(400)
              .then(res => expect(res.text).toMatch(/less than one/))
          )
      ));

  it('test 05 : should be fail list albums because user is not registered', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan1asdasd23@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan1asdasd23@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(response =>
            request(app)
              .get('/users/1503/albums/')
              .set('Authorization', response.body.token)
              .send({})
              .expect(400)
              .then(res => expect(res.text).toMatch(/does not exist/))
          )
      ));

  it("test 06 : should be fail because regular user can not list another user's albums", () => {
    albums.getAlbums = jest
      .fn(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '2', title: 'abcd' }]);
    return request(app)
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
              .post('/albums/1')
              .set('Authorization', response.body.token)
              .send({})
              .then(() =>
                request(app)
                  .post('/users')
                  .send({
                    firstName: 'teresa',
                    lastName: 'teresa',
                    email: 'teresa@wolox.com.ar',
                    password: '1234asdf65asd'
                  })
                  .then(() =>
                    request(app)
                      .post('/users/sessions')
                      .send({
                        email: 'teresa@wolox.com.ar',
                        password: '1234asdf65asd'
                      })
                      .then(respo =>
                        request(app)
                          .post('/albums/2')
                          .set('Authorization', respo.body.token)
                          .send({})
                          .then(() =>
                            request(app)
                              .get('/users/1/albums/')
                              .set('Authorization', respo.body.token)
                              .send({})
                              .expect(400)
                              .then(res => {
                                expect(res.text).toMatch(/permissions to see/);
                                expect(albums.getAlbums).toHaveBeenCalled();
                              })
                              .then(() => Purchase.findAll().then(resp => expect(resp).toHaveLength(2)))
                          )
                      )
                  )
              )
          )
      );
  });
});
