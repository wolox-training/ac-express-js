const request = require('supertest');

const app = require('../app');
const Purchase = require('../app/models').purchases;
const albums = require('../app/services/albums');

describe('POST /users/sessions/invalidate_all', () => {
  it('test 01 : should be fail log out because token is incorrect', () =>
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
              .post('/users/sessions/invalidate_all')
              .set('Authorization', '654654654654')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Bad Token/))
          )
      ));

  it('test 02 : should be fail log out because token field is empty', () =>
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
              .post('/users/sessions/invalidate_all')
              .set('Authorization', ' ')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Authorized/))
          )
      ));

  it('test 03 : should be fail log out because token field has less than 22 characters', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'caso3@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'caso3@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(() =>
            request(app)
              .post('/users/sessions/invalidate_all')
              .set('Authorization', '565')
              .send({})
              .expect(400)
              .then(response => expect(response.text).toMatch(/Bad Token/))
          )
      ));

  it('test 04 : should be fail because user logged out before trying to buy another album', () =>
    request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'caso4@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'caso4@wolox.com.ar',
            password: '1234asdf65asd'
          })
          .then(response =>
            request(app)
              .post('/albums/1')
              .set('Authorization', response.body.token)
              .send({})
              .then(() =>
                request(app)
                  .post('/users/sessions/invalidate_all')
                  .set('Authorization', response.body.token)
                  .send({})
                  .then(() =>
                    request(app)
                      .post('/albums/2')
                      .set('Authorization', response.body.token)
                      .send({})
                      .expect(400)
                      .then(rep => expect(rep.text).toMatch(/Token is old/))
                  )
              )
          )
      ));

  it('test 05 : should be success because user 1 logged out but another user can operate normally', () => {
    albums.getAlbums = jest
      .fn(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '2', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '2', title: 'abcd' }]);
    return request(app)
      .post('/users')
      .send({
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan1asdasd@wolox.com.ar',
        password: '1234asdf65asd'
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: 'juan1asdasd@wolox.com.ar',
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
                    firstName: 'Teresa',
                    lastName: 'Sanchez',
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
                      .then(res =>
                        request(app)
                          .post('/albums/2')
                          .set('Authorization', res.body.token)
                          .send({})
                          .then(() =>
                            request(app)
                              .post('/users/sessions/invalidate_all')
                              .set('Authorization', res.body.token)
                              .send({})
                              .then(() =>
                                request(app)
                                  .post('/albums/2')
                                  .set('Authorization', response.body.token)
                                  .send({})
                                  .expect(200)
                                  .then(() =>
                                    Purchase.findOne({ where: { albumId: '2' } }).then(
                                      resp => expect(resp).not.toBeNull()
                                      // expect(albums.getAlbums).toHaveBeenCalled();
                                    )
                                  )
                              )
                          )
                      )
                  )
              )
          )
      );
  });
});
