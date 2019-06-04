const request = require('supertest');

const app = require('../app');
const albums = require('../app/services/albums');

const Purchase = require('../app/models').purchases;

describe('GET (controller and services) /users/:user_id/albums/', () => {
  it('test 07 : should be success because regular user buy one album and it lists this album', () => {
    albums.getAlbums = jest.fn(() => [{ userId: '1', id: '1', title: 'abcd' }]);
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
                  .get('/users/1/albums/')
                  .set('Authorization', response.body.token)
                  .send({})
                  .expect(200)
                  .then(res => {
                    expect(albums.getAlbums).toHaveBeenCalled();
                    expect(res.body).toHaveLength(1);
                  })
                  .then(() =>
                    Purchase.findAll({ where: { albumId: '1' } }).then(resp => expect(resp).toHaveLength(1))
                  )
              )
          )
      );
  });

  it('test 08 : should be fail because the requested user does not have any purchases', () =>
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
              .post('/admin/users')
              .set('Authorization', response.body.token)
              .send({
                firstName: 'Juan',
                lastName: 'Perez',
                email: 'juan124@wolox.com.ar',
                password: '1234asdf65asd'
              })
              .then(() =>
                request(app)
                  .get('/users/1/albums/')
                  .set('Authorization', response.body.token)
                  .send({})
                  .expect(200)
                  .then(res => expect(res.text).toMatch(/any purchase/))
              )
          )
      ));

  it("test 09 : should be success because reg and adm user buy and admin can list the regular's albums", () => {
    albums.getAlbums = jest
      .fn(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '1', title: 'abcd' }]);
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
                    firstName: 'admin',
                    lastName: 'admin',
                    email: 'admin@wolox.com.ar',
                    password: '1234asdf65asd'
                  })
                  .then(() =>
                    request(app)
                      .post('/users/sessions')
                      .send({
                        email: 'admin@wolox.com.ar',
                        password: '1234asdf65asd'
                      })
                      .then(respo =>
                        request(app)
                          .post('/admin/users')
                          .set('Authorization', respo.body.token)
                          .send({
                            firstName: 'admin',
                            lastName: 'admin',
                            email: 'admin@wolox.com.ar',
                            password: '1234asdf65asd'
                          })
                          .then(() =>
                            request(app)
                              .post('/albums/2')
                              .set('Authorization', respo.body.token)
                              .send({})
                              .then(() =>
                                request(app)
                                  .get('/users/1/albums/')
                                  .set('Authorization', respo.body.token)
                                  .send({})
                                  .expect(200)
                                  .then(res => {
                                    expect(albums.getAlbums).toHaveBeenCalled();
                                    expect(res.body).toHaveLength(1);
                                  })
                                  .then(() =>
                                    Purchase.findAll({ where: { albumId: '1' } }).then(resp =>
                                      expect(resp).toHaveLength(1)
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
