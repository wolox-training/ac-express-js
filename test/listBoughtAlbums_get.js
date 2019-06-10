const request = require('supertest');
const dictum = require('dictum.js');
const { factory } = require('factory-girl');

const app = require('../app');
const albums = require('../app/services/albums');

const Purchase = require('../app/models').purchases;

describe('GET (controller and services) /users/:user_id/albums/', () => {
  it('test 07 : should be success because regular user buy one album and it lists this album', async () => {
    albums.getAlbums = jest.fn(() => [{ userId: '1', id: '1', title: 'abcd' }]);
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

  it('test 08 : should be fail because the requested user does not have any purchases', async () => {
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
              .then(() =>
                request(app)
                  .get('/users/1/albums/')
                  .set('Authorization', response.body.token)
                  .send({})
                  .expect(200)
                  .then(res => expect(res.text).toMatch(/any purchase/))
              )
          )
      );
  });

  it("test 09 : should be success because reg and adm user buy and admin can list the regular's albums", async () => {
    albums.getAlbums = jest
      .fn(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '1', title: 'abcd' }])
      .mockImplementationOnce(() => [{ userId: '1', id: '2', title: 'abcd' }]);
    const userNew = await factory.build('User').then(user => user);
    const userAdmin = await factory.build('User').then(user => user);
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
              .post('/albums/1')
              .set('Authorization', response.body.token)
              .send({})
              .then(() =>
                request(app)
                  .post('/users')
                  .send(userAdmin.dataValues)
                  .then(() =>
                    request(app)
                      .post('/users/sessions')
                      .send({
                        email: userAdmin.dataValues.email,
                        password: userAdmin.dataValues.password
                      })
                      .then(respo =>
                        request(app)
                          .post('/admin/users')
                          .set('Authorization', respo.body.token)
                          .send(userAdmin.dataValues)
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
                                    Purchase.findAll({ where: { albumId: '1' } }).then(resp => {
                                      dictum.chai(respo);
                                      return expect(resp).toHaveLength(1);
                                    })
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
